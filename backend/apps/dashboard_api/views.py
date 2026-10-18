import logging
import time
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import Permission
from django.db.models import ProtectedError, Q
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied, Throttled, ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.inventory.models import Brand, ModelGeneration, BodyStyle, Inventory, InventoryImage, Stock
from .permissions import IsActiveStaff, DashboardModelPermission
from .serializers import (
    BrandManagementSerializer,
    ModelGenerationManagementSerializer,
    BodyStyleManagementSerializer,
    InventoryListManagementSerializer,
    InventoryDetailManagementSerializer,
    InventoryImageManagementSerializer,
    StockManagementSerializer,
)

logger = logging.getLogger(__name__)

_LOGIN_ATTEMPTS = {}
_MAX_ATTEMPTS_PER_WINDOW = 5
_WINDOW_SECONDS = 60


def _check_login_throttle(ip_address: str):
    now = time.time()
    cutoff = now - _WINDOW_SECONDS
    attempts = _LOGIN_ATTEMPTS.get(ip_address, [])
    attempts = [t for t in attempts if t > cutoff]
    if len(attempts) >= _MAX_ATTEMPTS_PER_WINDOW:
        wait = int(_WINDOW_SECONDS - (now - attempts[0]))
        raise Throttled(detail="Too many login attempts. Please try again later.", wait=max(1, wait))
    attempts.append(now)
    _LOGIN_ATTEMPTS[ip_address] = attempts


def _record_successful_login(ip_address: str):
    if ip_address in _LOGIN_ATTEMPTS:
        _LOGIN_ATTEMPTS.pop(ip_address, None)


class DashboardBaseAPIView(APIView):
    """
    Base view for all dashboard endpoints:
    - Enforces SessionAuthentication with CSRF enforcement on state-changing methods.
    - JSONRenderer only.
    - Private, no-store Cache-Control and X-Robots-Tag headers.
    - Standardized envelope format:
      Success: {"success": true, "data": ...}
      Error: {"success": false, "error": {"code": "...", "message": "...", "field_errors": {...}}}
    """
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsActiveStaff,)
    renderer_classes = (JSONRenderer,)
    schema = None

    def handle_exception(self, exc):
        response = super().handle_exception(exc)
        code = getattr(exc, "default_code", "REQUEST_FAILED")
        message = str(getattr(exc, "detail", "Dashboard request could not be completed."))
        field_errors = None

        if isinstance(exc, ValidationError):
            code = "VALIDATION_ERROR"
            message = "Validation error."
            field_errors = exc.detail
        elif response.status_code == 401:
            code = "UNAUTHENTICATED"
            message = "Authentication required."
        elif response.status_code == 403:
            code = "FORBIDDEN"
            message = "You do not have permission to perform this action."
        elif response.status_code == 404:
            code = "NOT_FOUND"
            message = "Record not found."
        elif response.status_code == 429:
            code = "THROTTLED"

        err_data = {
            "code": code,
            "message": message,
        }
        if field_errors:
            err_data["field_errors"] = field_errors

        response.data = {
            "success": False,
            "error": err_data,
        }
        return response

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response["Cache-Control"] = "private, no-store, must-revalidate"
        response["X-Robots-Tag"] = "noindex, nofollow, noarchive"
        return response


class LoginView(APIView):
    authentication_classes = ()
    permission_classes = ()
    renderer_classes = (JSONRenderer,)
    schema = None

    def handle_exception(self, exc):
        response = super().handle_exception(exc)
        code = getattr(exc, "default_code", "REQUEST_FAILED")
        message = str(getattr(exc, "detail", "Login failed."))
        if isinstance(exc, (AuthenticationFailed, PermissionDenied)):
            code = "INVALID_CREDENTIALS"
            message = "Invalid credentials."
        elif isinstance(exc, Throttled):
            code = "THROTTLED"

        response.data = {
            "success": False,
            "error": {
                "code": code,
                "message": message,
            },
        }
        return response

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response["Cache-Control"] = "private, no-store, must-revalidate"
        response["X-Robots-Tag"] = "noindex, nofollow, noarchive"
        return response

    def post(self, request):
        ip = request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip() or request.META.get("REMOTE_ADDR", "")
        _check_login_throttle(ip)

        data = request.data or {}
        username = data.get("username", "").strip()
        password = data.get("password", "")

        if not username or not password:
            raise AuthenticationFailed("Invalid credentials.")

        user = authenticate(request, username=username, password=password)
        if user is None:
            raise AuthenticationFailed("Invalid credentials.")

        if not user.is_active or not user.is_staff:
            logger.warning("Rejected non-active/non-staff login attempt for username: %s", username)
            raise AuthenticationFailed("Invalid credentials.")

        login(request, user)
        _record_successful_login(ip)

        csrf_token = get_token(request)
        permissions = list(user.get_all_permissions()) if not user.is_superuser else ["*"]

        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "permissions": permissions,
        }

        return Response({
            "success": True,
            "data": {
                "user": user_data,
                "csrf_token": csrf_token,
            }
        })


class LogoutView(DashboardBaseAPIView):
    def post(self, request):
        logout(request)
        return Response({"success": True, "data": {"message": "Logged out successfully."}})


class MeView(DashboardBaseAPIView):
    def get(self, request):
        user = request.user
        permissions = list(user.get_all_permissions()) if not user.is_superuser else ["*"]
        return Response({
            "success": True,
            "data": {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                    "permissions": permissions,
                }
            }
        })


class AccessProbeView(DashboardBaseAPIView):
    def get(self, request):
        return Response({
            "success": True,
            "data": {
                "authenticated": True,
                "user_id": request.user.id,
                "username": request.user.username,
            }
        })


# ==============================================================================
# Brand Management Endpoints
# ==============================================================================

class BrandListCreateView(DashboardBaseAPIView):
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = Brand

    def get(self, request):
        qs = Brand.objects.all().order_by("name", "id")

        q = request.query_params.get("q", "").strip()
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(segment__icontains=q))

        status_param = request.query_params.get("status", "").strip()
        if status_param:
            qs = qs.filter(status=status_param)

        segment_param = request.query_params.get("segment", "").strip()
        if segment_param:
            qs = qs.filter(segment=segment_param)

        ordering = request.query_params.get("ordering", "").strip()
        if ordering:
            allowed = {"name", "-name", "segment", "-segment", "status", "-status", "id", "-id"}
            if ordering in allowed:
                qs = qs.order_by(ordering, "id")

        page_str = request.query_params.get("page", "1")
        page_size_str = request.query_params.get("page_size", "12")
        try:
            page = max(1, int(page_str))
            page_size = min(100, max(1, int(page_size_str)))
        except ValueError:
            page, page_size = 1, 12

        total_rows = qs.count()
        total_pages = max(1, (total_rows + page_size - 1) // page_size)
        offset = (page - 1) * page_size
        results = qs[offset : offset + page_size]

        serializer = BrandManagementSerializer(results, many=True)
        return Response({
            "success": True,
            "data": {
                "results": serializer.data,
                "total_rows": total_rows,
                "total_pages": total_pages,
                "current_page": page,
                "page_size": page_size,
            }
        })

    def post(self, request):
        serializer = BrandManagementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        brand = serializer.save()
        return Response({"success": True, "data": BrandManagementSerializer(brand).data}, status=status.HTTP_201_CREATED)


class BrandDetailView(DashboardBaseAPIView):
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = Brand

    def get(self, request, pk):
        brand = get_object_or_404(Brand, pk=pk)
        return Response({"success": True, "data": BrandManagementSerializer(brand).data})

    def patch(self, request, pk):
        brand = get_object_or_404(Brand, pk=pk)
        serializer = BrandManagementSerializer(brand, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response({"success": True, "data": BrandManagementSerializer(updated).data})

    def delete(self, request, pk):
        brand = get_object_or_404(Brand, pk=pk)
        
        # Deletion Impact Check
        inventory_count = Inventory.objects.filter(brand=brand).count()
        model_count = ModelGeneration.objects.filter(brand=brand).count()

        # Require explicit confirmation query parameter or body if cascade impact exists
        force = request.query_params.get("confirm", "").lower() == "true" or (
            isinstance(request.data, dict) and request.data.get("confirm") is True
        )

        if (inventory_count > 0 or model_count > 0) and not force:
            return Response(
                {
                    "success": False,
                    "error": {
                        "code": "CASCADE_IMPACT",
                        "message": (
                            f"Deleting brand '{brand.name}' will cascade delete "
                            f"{inventory_count} inventory vehicle(s) and {model_count} model generation(s). "
                            "Explicit confirmation ('confirm=true') is required."
                        ),
                        "impact": {
                            "brand_id": brand.id,
                            "brand_name": brand.name,
                            "inventory_count": inventory_count,
                            "model_generation_count": model_count,
                        },
                    },
                },
                status=status.HTTP_409_CONFLICT,
            )

        brand.delete()
        return Response({
            "success": True,
            "data": {
                "message": f"Brand '{brand.name}' deleted successfully.",
                "deleted_id": int(pk),
            }
        })


class BrandCascadeImpactView(DashboardBaseAPIView):
    """
    GET /api/v1/dashboard/brands/<id>/impact/
    Returns affected inventory and model generation counts before delete.
    """
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = Brand

    def get(self, request, pk):
        brand = get_object_or_404(Brand, pk=pk)
        inventory_count = Inventory.objects.filter(brand=brand).count()
        model_count = ModelGeneration.objects.filter(brand=brand).count()
        return Response({
            "success": True,
            "data": {
                "brand_id": brand.id,
                "brand_name": brand.name,
                "inventory_count": inventory_count,
                "model_generation_count": model_count,
            }
        })


# ==============================================================================
# ModelGeneration Management Endpoints
# ==============================================================================

class ModelGenerationListCreateView(DashboardBaseAPIView):
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = ModelGeneration

    def get(self, request):
        qs = ModelGeneration.objects.select_related("brand").all().order_by("brand__name", "model", "id")

        q = request.query_params.get("q", "").strip()
        if q:
            qs = qs.filter(Q(model__icontains=q) | Q(brand__name__icontains=q))

        brand_id = request.query_params.get("brand", "").strip()
        if brand_id:
            qs = qs.filter(brand_id=brand_id)

        status_param = request.query_params.get("status", "").strip()
        if status_param:
            qs = qs.filter(status=status_param)

        ordering = request.query_params.get("ordering", "").strip()
        if ordering:
            allowed = {"model", "-model", "status", "-status", "id", "-id", "brand__name", "-brand__name"}
            if ordering in allowed:
                qs = qs.order_by(ordering, "id")

        page_str = request.query_params.get("page", "1")
        page_size_str = request.query_params.get("page_size", "20")
        try:
            page = max(1, int(page_str))
            page_size = min(100, max(1, int(page_size_str)))
        except ValueError:
            page, page_size = 1, 20

        total_rows = qs.count()
        total_pages = max(1, (total_rows + page_size - 1) // page_size)
        offset = (page - 1) * page_size
        results = qs[offset : offset + page_size]

        serializer = ModelGenerationManagementSerializer(results, many=True)
        return Response({
            "success": True,
            "data": {
                "results": serializer.data,
                "total_rows": total_rows,
                "total_pages": total_pages,
                "current_page": page,
                "page_size": page_size,
            }
        })

    def post(self, request):
        serializer = ModelGenerationManagementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        model_obj = serializer.save()
        return Response({"success": True, "data": ModelGenerationManagementSerializer(model_obj).data}, status=status.HTTP_201_CREATED)


class ModelGenerationDetailView(DashboardBaseAPIView):
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = ModelGeneration

    def get(self, request, pk):
        model_obj = get_object_or_404(ModelGeneration.objects.select_related("brand"), pk=pk)
        return Response({"success": True, "data": ModelGenerationManagementSerializer(model_obj).data})

    def patch(self, request, pk):
        model_obj = get_object_or_404(ModelGeneration, pk=pk)
        serializer = ModelGenerationManagementSerializer(model_obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response({"success": True, "data": ModelGenerationManagementSerializer(updated).data})

    def delete(self, request, pk):
        model_obj = get_object_or_404(ModelGeneration, pk=pk)
        inventory_count = Inventory.objects.filter(model=model_obj).count()

        # In inventory model: model = models.ForeignKey(on_delete=models.SET_NULL, null=True)
        # Deleting model sets FK to null on affected cars; provide impact notice
        model_obj.delete()
        return Response({
            "success": True,
            "data": {
                "message": f"Model '{model_obj.model}' deleted successfully. Set null on {inventory_count} vehicle(s).",
                "deleted_id": int(pk),
            }
        })


# ==============================================================================
# BodyStyle Management Endpoints
# ==============================================================================

class BodyStyleListCreateView(DashboardBaseAPIView):
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = BodyStyle

    def get(self, request):
        qs = BodyStyle.objects.all().order_by("body", "id")

        q = request.query_params.get("q", "").strip()
        if q:
            qs = qs.filter(body__icontains=q)

        status_param = request.query_params.get("status", "").strip()
        if status_param:
            qs = qs.filter(status=status_param)

        ordering = request.query_params.get("ordering", "").strip()
        if ordering:
            allowed = {"body", "-body", "status", "-status", "id", "-id"}
            if ordering in allowed:
                qs = qs.order_by(ordering, "id")

        page_str = request.query_params.get("page", "1")
        page_size_str = request.query_params.get("page_size", "20")
        try:
            page = max(1, int(page_str))
            page_size = min(100, max(1, int(page_size_str)))
        except ValueError:
            page, page_size = 1, 20

        total_rows = qs.count()
        total_pages = max(1, (total_rows + page_size - 1) // page_size)
        offset = (page - 1) * page_size
        results = qs[offset : offset + page_size]

        serializer = BodyStyleManagementSerializer(results, many=True)
        return Response({
            "success": True,
            "data": {
                "results": serializer.data,
                "total_rows": total_rows,
                "total_pages": total_pages,
                "current_page": page,
                "page_size": page_size,
            }
        })

    def post(self, request):
        serializer = BodyStyleManagementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        style = serializer.save()
        return Response({"success": True, "data": BodyStyleManagementSerializer(style).data}, status=status.HTTP_201_CREATED)


class BodyStyleDetailView(DashboardBaseAPIView):
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = BodyStyle

    def get(self, request, pk):
        style = get_object_or_404(BodyStyle, pk=pk)
        return Response({"success": True, "data": BodyStyleManagementSerializer(style).data})

    def patch(self, request, pk):
        style = get_object_or_404(BodyStyle, pk=pk)
        serializer = BodyStyleManagementSerializer(style, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response({"success": True, "data": BodyStyleManagementSerializer(updated).data})

    def delete(self, request, pk):
        style = get_object_or_404(BodyStyle, pk=pk)
        # body_style has on_delete=models.SET_NULL in Inventory
        inventory_count = Inventory.objects.filter(body_style=style).count()
        style.delete()
        return Response({
            "success": True,
            "data": {
                "message": f"Body style '{style.body}' deleted successfully. Set null on {inventory_count} vehicle(s).",
                "deleted_id": int(pk),
            }
        })


class InventoryListCreateView(DashboardBaseAPIView):
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = Inventory

    def get(self, request):
        qs = Inventory.objects.all().select_related("brand", "model", "body_style").order_by("-updated_at", "-id")

        q = request.query_params.get("q", "").strip()
        if q:
            qs = qs.filter(
                Q(name__icontains=q)
                | Q(slug__icontains=q)
                | Q(model_name__icontains=q)
                | Q(meta_title__icontains=q)
            )

        status_param = request.query_params.get("status", "").strip()
        if status_param:
            qs = qs.filter(status=status_param)

        registered_param = request.query_params.get("registered", "").strip()
        if registered_param:
            qs = qs.filter(registered=registered_param)

        brand_param = request.query_params.get("brand", "").strip()
        if brand_param:
            try:
                qs = qs.filter(brand_id=int(brand_param))
            except ValueError:
                pass

        car_type_param = request.query_params.get("car_type", "").strip()
        if car_type_param:
            qs = qs.filter(car_type=car_type_param)

        is_featured_param = request.query_params.get("is_featured", "").strip()
        if is_featured_param:
            if is_featured_param.lower() in ("true", "1"):
                qs = qs.filter(is_featured=True)
            elif is_featured_param.lower() in ("false", "0"):
                qs = qs.filter(is_featured=False)

        ordering = request.query_params.get("ordering", "").strip()
        if ordering:
            allowed = {
                "name", "-name", "price", "-price", "year", "-year",
                "created_at", "-created_at", "updated_at", "-updated_at",
                "status", "-status", "registered", "-registered",
            }
            if ordering in allowed:
                qs = qs.order_by(ordering, "-id")

        page_str = request.query_params.get("page", "1")
        page_size_str = request.query_params.get("page_size", "15")
        try:
            page = max(1, int(page_str))
            page_size = min(100, max(1, int(page_size_str)))
        except ValueError:
            page, page_size = 1, 15

        total_rows = qs.count()
        total_pages = max(1, (total_rows + page_size - 1) // page_size)
        offset = (page - 1) * page_size
        results = qs[offset : offset + page_size]

        serializer = InventoryListManagementSerializer(results, many=True)
        return Response({
            "success": True,
            "data": {
                "results": serializer.data,
                "total_rows": total_rows,
                "total_pages": total_pages,
                "current_page": page,
                "page_size": page_size,
            }
        })

    def post(self, request):
        serializer = InventoryDetailManagementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inventory = serializer.save()
        return Response(
            {"success": True, "data": InventoryDetailManagementSerializer(inventory).data},
            status=status.HTTP_201_CREATED,
        )


class InventoryDetailView(DashboardBaseAPIView):
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = Inventory

    def get(self, request, pk):
        inventory = get_object_or_404(
            Inventory.objects.select_related("brand", "model", "body_style").prefetch_related("inventory_images"),
            pk=pk,
        )
        return Response({"success": True, "data": InventoryDetailManagementSerializer(inventory).data})

    def patch(self, request, pk):
        inventory = get_object_or_404(Inventory, pk=pk)
        serializer = InventoryDetailManagementSerializer(inventory, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response({"success": True, "data": InventoryDetailManagementSerializer(updated).data})

    def delete(self, request, pk):
        inventory = get_object_or_404(Inventory, pk=pk)
        name = inventory.name
        inventory.delete()
        return Response({
            "success": True,
            "data": {
                "message": f"Inventory item '{name}' deleted successfully.",
                "deleted_id": int(pk),
            }
        })


class InventoryImageUploadView(DashboardBaseAPIView):
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = InventoryImage

    def post(self, request, inventory_pk):
        inventory = get_object_or_404(Inventory, pk=inventory_pk)
        data = request.data.copy() if hasattr(request.data, "copy") else dict(request.data)
        data["inventory"] = inventory.id

        serializer = InventoryImageManagementSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        img = serializer.save()
        return Response(
            {"success": True, "data": InventoryImageManagementSerializer(img).data},
            status=status.HTTP_201_CREATED,
        )


class InventoryImageDetailView(DashboardBaseAPIView):
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = InventoryImage

    def patch(self, request, pk):
        img = get_object_or_404(InventoryImage, pk=pk)
        serializer = InventoryImageManagementSerializer(img, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response({"success": True, "data": InventoryImageManagementSerializer(updated).data})

    def delete(self, request, pk):
        img = get_object_or_404(InventoryImage, pk=pk)
        img_id = img.id
        img.delete()
        return Response({
            "success": True,
            "data": {
                "message": "Inventory gallery image deleted successfully.",
                "deleted_id": img_id,
            }
        })


class StockListCreateView(DashboardBaseAPIView):
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = Stock

    def get(self, request):
        qs = Stock.objects.all().order_by("-updated_at", "-id")

        q = request.query_params.get("q", "").strip()
        if q:
            qs = qs.filter(title__icontains=q)

        status_param = request.query_params.get("status", "").strip()
        if status_param:
            qs = qs.filter(status=status_param)

        page_str = request.query_params.get("page", "1")
        page_size_str = request.query_params.get("page_size", "15")
        try:
            page = max(1, int(page_str))
            page_size = min(100, max(1, int(page_size_str)))
        except ValueError:
            page, page_size = 1, 15

        total_rows = qs.count()
        total_pages = max(1, (total_rows + page_size - 1) // page_size)
        offset = (page - 1) * page_size
        results = qs[offset : offset + page_size]

        serializer = StockManagementSerializer(results, many=True)
        return Response({
            "success": True,
            "data": {
                "results": serializer.data,
                "total_rows": total_rows,
                "total_pages": total_pages,
                "current_page": page,
                "page_size": page_size,
            }
        })

    def post(self, request):
        serializer = StockManagementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        stock = serializer.save()
        return Response(
            {"success": True, "data": StockManagementSerializer(stock).data},
            status=status.HTTP_201_CREATED,
        )


class StockDetailView(DashboardBaseAPIView):
    permission_classes = (IsActiveStaff, DashboardModelPermission)
    model = Stock

    def get(self, request, pk):
        stock = get_object_or_404(Stock, pk=pk)
        return Response({"success": True, "data": StockManagementSerializer(stock).data})

    def patch(self, request, pk):
        stock = get_object_or_404(Stock, pk=pk)
        serializer = StockManagementSerializer(stock, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response({"success": True, "data": StockManagementSerializer(updated).data})

    def delete(self, request, pk):
        stock = get_object_or_404(Stock, pk=pk)
        title = stock.title or f"Stock #{stock.id}"
        stock.delete()
        return Response({
            "success": True,
            "data": {
                "message": f"Stock item '{title}' deleted successfully.",
                "deleted_id": int(pk),
            }
        })
