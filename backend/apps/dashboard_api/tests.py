import json
from django.contrib.auth.models import User, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient
from apps.inventory.models import Brand, ModelGeneration, BodyStyle, Inventory, InventoryImage, Stock


class DashboardAuthIntegrationTests(TestCase):
    def setUp(self):
        self.client = APIClient(enforce_csrf_checks=True)

        self.staff_user = User.objects.create_user(
            username="staff_user",
            email="staff@begautos.com",
            password="secure-password-123",
            is_staff=True,
            is_active=True,
        )

        self.inactive_staff = User.objects.create_user(
            username="inactive_staff",
            email="inactive@begautos.com",
            password="secure-password-123",
            is_staff=True,
            is_active=False,
        )

        self.regular_user = User.objects.create_user(
            username="regular_user",
            email="regular@begautos.com",
            password="secure-password-123",
            is_staff=False,
            is_active=True,
        )

        self.superuser = User.objects.create_superuser(
            username="super_user",
            email="super@begautos.com",
            password="secure-password-123",
        )

    def test_anonymous_requests_are_denied(self):
        response = self.client.get("/api/v1/dashboard/access/")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["success"], False)
        self.assertEqual(response["Cache-Control"], "private, no-store, must-revalidate")
        self.assertEqual(response["X-Robots-Tag"], "noindex, nofollow, noarchive")

    def test_login_success_for_active_staff(self):
        response = self.client.post("/api/v1/dashboard/auth/login/", {
            "username": "staff_user",
            "password": "secure-password-123",
        }, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["data"]["user"]["username"], "staff_user")
        self.assertTrue("csrf_token" in data["data"])
        self.assertIn("sessionid", response.cookies)

        access_res = self.client.get("/api/v1/dashboard/access/")
        self.assertEqual(access_res.status_code, 200)
        self.assertTrue(access_res.json()["success"])
        self.assertEqual(access_res.json()["data"]["username"], "staff_user")

    def test_login_rejected_for_inactive_staff(self):
        response = self.client.post("/api/v1/dashboard/auth/login/", {
            "username": "inactive_staff",
            "password": "secure-password-123",
        }, format="json")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["error"]["code"], "INVALID_CREDENTIALS")
        self.assertEqual(response.json()["error"]["message"], "Invalid credentials.")

    def test_login_rejected_for_non_staff_user(self):
        response = self.client.post("/api/v1/dashboard/auth/login/", {
            "username": "regular_user",
            "password": "secure-password-123",
        }, format="json")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["error"]["code"], "INVALID_CREDENTIALS")
        self.assertEqual(response.json()["error"]["message"], "Invalid credentials.")

    def test_login_rejected_for_bad_password(self):
        response = self.client.post("/api/v1/dashboard/auth/login/", {
            "username": "staff_user",
            "password": "wrong-password",
        }, format="json")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["error"]["code"], "INVALID_CREDENTIALS")

    def test_me_endpoint_returns_user_permissions(self):
        ct = ContentType.objects.get_for_model(Inventory)
        perm = Permission.objects.get(content_type=ct, codename="view_inventory")
        self.staff_user.user_permissions.add(perm)

        self.client.force_login(self.staff_user)
        response = self.client.get("/api/v1/dashboard/auth/me/")
        self.assertEqual(response.status_code, 200)
        res_data = response.json()["data"]["user"]
        self.assertEqual(res_data["username"], "staff_user")
        self.assertIn("inventory.view_inventory", res_data["permissions"])
        self.assertNotIn("inventory.add_inventory", res_data["permissions"])

    def test_logout_flushes_session(self):
        login_res = self.client.post("/api/v1/dashboard/auth/login/", {
            "username": "staff_user",
            "password": "secure-password-123",
        }, format="json")
        csrf_token = login_res.json()["data"]["csrf_token"]
        
        access_res = self.client.get("/api/v1/dashboard/access/")
        self.assertEqual(access_res.status_code, 200)

        logout_res = self.client.post(
            "/api/v1/dashboard/auth/logout/",
            HTTP_X_CSRFTOKEN=csrf_token,
        )
        self.assertEqual(logout_res.status_code, 200)
        self.assertTrue(logout_res.json()["success"])

        access_after = self.client.get("/api/v1/dashboard/access/")
        self.assertEqual(access_after.status_code, 403)

    def test_unimplemented_modules_return_404(self):
        self.client.force_login(self.staff_user)
        res = self.client.get("/api/v1/dashboard/unknown-module/")
        self.assertEqual(res.status_code, 404)

    def test_preserves_public_urls(self):
        from django.urls import resolve
        self.assertEqual(resolve("/api/v1/dashboard/auth/login/").view_name, "dashboard_api:login")
        self.assertEqual(resolve("/api/v1/dashboard/auth/me/").view_name, "dashboard_api:me")
        self.assertEqual(resolve("/api/v1/dashboard/auth/logout/").view_name, "dashboard_api:logout")
        self.assertEqual(resolve("/api/v1/inventory/").view_name, "inventory:inventory_list")


class DashboardReferenceDataTests(TestCase):
    def setUp(self):
        self.client = APIClient(enforce_csrf_checks=True)

        self.superuser = User.objects.create_superuser(
            username="admin_user",
            email="admin@begautos.com",
            password="admin-password-123",
        )

        self.staff_read_only = User.objects.create_user(
            username="readonly_staff",
            email="readonly@begautos.com",
            password="readonly-password-123",
            is_staff=True,
            is_active=True,
        )
        # Give view permissions only
        for model in (Brand, ModelGeneration, BodyStyle):
            ct = ContentType.objects.get_for_model(model)
            perm = Permission.objects.get(content_type=ct, codename=f"view_{model._meta.model_name}")
            self.staff_read_only.user_permissions.add(perm)

        # Create dummy brand image
        self.dummy_image = SimpleUploadedFile(
            "test_logo.png", b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR", content_type="image/png"
        )

        self.brand_toyota = Brand.objects.create(
            name="Toyota",
            segment=Brand.SegmentChoices.REFINED_VERSATILE,
            image=self.dummy_image,
            meta_title="Toyota Cars",
        )

        self.model_lc = ModelGeneration.objects.create(
            brand=self.brand_toyota,
            model="Land Cruiser",
        )

        self.body_suv = BodyStyle.objects.create(
            body="SUV",
        )

    def _login_superuser(self):
        login_res = self.client.post("/api/v1/dashboard/auth/login/", {
            "username": "admin_user",
            "password": "admin-password-123",
        }, format="json")
        return login_res.json()["data"]["csrf_token"]

    def _login_readonly(self):
        login_res = self.client.post("/api/v1/dashboard/auth/login/", {
            "username": "readonly_staff",
            "password": "readonly-password-123",
        }, format="json")
        return login_res.json()["data"]["csrf_token"]

    def test_read_only_staff_can_view_but_not_mutate(self):
        csrf = self._login_readonly()

        # GET Brand list succeeds
        res = self.client.get("/api/v1/dashboard/brands/")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()["success"])
        self.assertEqual(len(res.json()["data"]["results"]), 1)

        # POST Brand without add permission fails
        post_res = self.client.post(
            "/api/v1/dashboard/brands/",
            {"name": "Honda"},
            HTTP_X_CSRFTOKEN=csrf,
            format="json",
        )
        self.assertEqual(post_res.status_code, 403)
        self.assertEqual(post_res.json()["error"]["code"], "FORBIDDEN")

    def test_brand_crud_and_json_validation(self):
        csrf = self._login_superuser()

        brand_logo = SimpleUploadedFile(
            "mercedes_logo.png",
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82",
            content_type="image/png",
        )

        # Create new brand with JSON-LD schema (multipart form upload with serialized JSON)
        post_data = {
            "name": "Mercedes-Benz",
            "segment": "LUXURY_PERFORMANCE",
            "image": brand_logo,
            "meta_title": "Mercedes Luxury Cars",
            "schema_json": json.dumps({"@context": "https://schema.org", "@type": "Brand", "name": "Mercedes-Benz"}),
        }
        res = self.client.post("/api/v1/dashboard/brands/", post_data, HTTP_X_CSRFTOKEN=csrf)
        self.assertEqual(res.status_code, 201, msg=f"Error response: {res.content.decode()}")
        brand_id = res.json()["data"]["id"]

        # Detail fetch
        detail_res = self.client.get(f"/api/v1/dashboard/brands/{brand_id}/")
        self.assertEqual(detail_res.status_code, 200)
        self.assertEqual(detail_res.json()["data"]["name"], "Mercedes-Benz")
        self.assertEqual(detail_res.json()["data"]["schema_json"]["@type"], "Brand")

        # Invalid JSON validation check
        bad_json_res = self.client.patch(
            f"/api/v1/dashboard/brands/{brand_id}/",
            {"schema_json": "{invalid-json}"},
            HTTP_X_CSRFTOKEN=csrf,
            format="json",
        )
        self.assertEqual(bad_json_res.status_code, 400)
        self.assertEqual(bad_json_res.json()["error"]["code"], "VALIDATION_ERROR")

    def test_model_generation_brand_relationship(self):
        csrf = self._login_superuser()

        # Filter model generations by brand
        res = self.client.get(f"/api/v1/dashboard/model-generations/?brand={self.brand_toyota.id}")
        self.assertEqual(res.status_code, 200)
        results = res.json()["data"]["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["model"], "Land Cruiser")

        # Create model generation linked to brand
        create_res = self.client.post("/api/v1/dashboard/model-generations/", {
            "brand": self.brand_toyota.id,
            "model": "Prado",
        }, HTTP_X_CSRFTOKEN=csrf, format="json")
        self.assertEqual(create_res.status_code, 201)
        self.assertEqual(create_res.json()["data"]["brand_name"], "Toyota")

    def test_deletion_cascade_impact_check_and_confirmation(self):
        csrf = self._login_superuser()

        # Create an inventory car linked to brand_toyota
        inventory = Inventory.objects.create(
            brand=self.brand_toyota,
            model=self.model_lc,
            model_name="Land Cruiser LC300",
            body_style=self.body_suv,
            year=2023,
            price=28000000,
        )

        # 1. Check impact endpoint
        impact_res = self.client.get(f"/api/v1/dashboard/brands/{self.brand_toyota.id}/impact/")
        self.assertEqual(impact_res.status_code, 200)
        impact_data = impact_res.json()["data"]
        self.assertEqual(impact_data["inventory_count"], 1)
        self.assertEqual(impact_data["model_generation_count"], 1)

        # 2. Delete without confirm should return 409 Conflict
        delete_attempt = self.client.delete(
            f"/api/v1/dashboard/brands/{self.brand_toyota.id}/",
            HTTP_X_CSRFTOKEN=csrf,
        )
        self.assertEqual(delete_attempt.status_code, 409)
        self.assertEqual(delete_attempt.json()["error"]["code"], "CASCADE_IMPACT")
        # Brand still exists
        self.assertTrue(Brand.objects.filter(id=self.brand_toyota.id).exists())

        # 3. Delete with confirm=true proceeds
        delete_confirm = self.client.delete(
            f"/api/v1/dashboard/brands/{self.brand_toyota.id}/?confirm=true",
            HTTP_X_CSRFTOKEN=csrf,
        )
        self.assertEqual(delete_confirm.status_code, 200)
        self.assertFalse(Brand.objects.filter(id=self.brand_toyota.id).exists())
        # Inventory record cascaded
        self.assertFalse(Inventory.objects.filter(id=inventory.id).exists())

    def test_body_style_crud(self):
        csrf = self._login_superuser()

        res = self.client.get("/api/v1/dashboard/body-styles/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()["data"]["results"]), 1)

        # Create Sedan
        post_res = self.client.post(
            "/api/v1/dashboard/body-styles/",
            {"body": "Sedan"},
            HTTP_X_CSRFTOKEN=csrf,
            format="json",
        )
        self.assertEqual(post_res.status_code, 201)
        self.assertEqual(post_res.json()["data"]["body"], "Sedan")

    def test_inventory_crud_lifecycle_and_media(self):
        csrf = self._login_superuser()

        # 1. Create car
        car_data = {
            "name": "Toyota Land Cruiser ZX",
            "car_type": "RECONDITIONED",
            "brand": self.brand_toyota.id,
            "model": self.model_lc.id,
            "year": 2024,
            "fuel_type": "PETROL",
            "transmission": "AUTOMATIC",
            "condition": "USED",
            "registered": "Available",
            "price": "29500000.00",
            "status": "PUBLISHED",
            "is_featured": True,
        }
        res = self.client.post("/api/v1/dashboard/inventory/", car_data, HTTP_X_CSRFTOKEN=csrf, format="json")
        self.assertEqual(res.status_code, 201, msg=f"Error: {res.content.decode()}")
        car = res.json()["data"]
        car_id = car["id"]
        # Slug auto-generated
        self.assertTrue(len(car["slug"]) > 0)
        self.assertEqual(car["brand_name"], "Toyota")
        self.assertEqual(car["registered"], "Available")

        # 2. Upload gallery image for inventory
        gallery_file = SimpleUploadedFile(
            "gallery_1.png",
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82",
            content_type="image/png",
        )
        img_res = self.client.post(
            f"/api/v1/dashboard/inventory/{car_id}/images/",
            {"image": gallery_file, "caption": "Front view"},
            HTTP_X_CSRFTOKEN=csrf,
        )
        self.assertEqual(img_res.status_code, 201)
        img_id = img_res.json()["data"]["id"]

        # 3. Verify detail returns images
        detail_res = self.client.get(f"/api/v1/dashboard/inventory/{car_id}/")
        self.assertEqual(detail_res.status_code, 200)
        self.assertEqual(len(detail_res.json()["data"]["inventory_images"]), 1)

        # 4. Patch registered to Sold
        patch_res = self.client.patch(
            f"/api/v1/dashboard/inventory/{car_id}/",
            {"registered": "Sold"},
            HTTP_X_CSRFTOKEN=csrf,
            format="json",
        )
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["data"]["registered"], "Sold")

        # 5. Delete gallery image
        del_img = self.client.delete(f"/api/v1/dashboard/inventory/images/{img_id}/", HTTP_X_CSRFTOKEN=csrf)
        self.assertEqual(del_img.status_code, 200)

        # 6. Delete car
        del_car = self.client.delete(f"/api/v1/dashboard/inventory/{car_id}/", HTTP_X_CSRFTOKEN=csrf)
        self.assertEqual(del_car.status_code, 200)
        self.assertFalse(Inventory.objects.filter(id=car_id).exists())

    def test_inventory_brand_model_relationship_validation(self):
        csrf = self._login_superuser()

        # Create another brand and model
        bmw = Brand.objects.create(name="BMW", segment=Brand.SegmentChoices.LUXURY_PERFORMANCE)
        bmw_x5 = ModelGeneration.objects.create(brand=bmw, model="X5")

        # Try creating car with brand=Toyota and model=BMW X5
        bad_data = {
            "name": "Mismatched car",
            "car_type": "RECONDITIONED",
            "brand": self.brand_toyota.id,
            "model": bmw_x5.id,
            "fuel_type": "PETROL",
            "transmission": "AUTOMATIC",
            "condition": "USED",
            "registered": "Available",
        }
        res = self.client.post("/api/v1/dashboard/inventory/", bad_data, HTTP_X_CSRFTOKEN=csrf, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json()["error"]["code"], "VALIDATION_ERROR")
        self.assertIn("model", res.json()["error"]["field_errors"])

    def test_stock_crud(self):
        csrf = self._login_superuser()

        stock_file = SimpleUploadedFile(
            "stock_item.png",
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82",
            content_type="image/png",
        )

        # Create Stock
        create_res = self.client.post(
            "/api/v1/dashboard/stocks/",
            {"title": "Fresh Shipment Japan", "image": stock_file, "status": "PUBLISHED"},
            HTTP_X_CSRFTOKEN=csrf,
        )
        self.assertEqual(create_res.status_code, 201)
        stock_id = create_res.json()["data"]["id"]

        # List Stock
        list_res = self.client.get("/api/v1/dashboard/stocks/")
        self.assertEqual(list_res.status_code, 200)
        self.assertEqual(len(list_res.json()["data"]["results"]), 1)

        # Detail Stock
        detail_res = self.client.get(f"/api/v1/dashboard/stocks/{stock_id}/")
        self.assertEqual(detail_res.status_code, 200)
        self.assertEqual(detail_res.json()["data"]["title"], "Fresh Shipment Japan")

        # Update Stock status
        patch_res = self.client.patch(
            f"/api/v1/dashboard/stocks/{stock_id}/",
            {"status": "ARCHIVED"},
            HTTP_X_CSRFTOKEN=csrf,
            format="json",
        )
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["data"]["status"], "ARCHIVED")

        # Public API contract check: public StockListView filters by status=PUBLISHED
        public_res = self.client.get("/api/v1/inventory/stocks/")
        self.assertEqual(public_res.status_code, 200)
        # Archived stock should not appear in public list
        if public_res.content:
            data = json.loads(public_res.content.decode())
            stocks = data.get("data", data) if isinstance(data, dict) else data
            self.assertEqual(len(stocks), 0)

        # Delete Stock
        del_res = self.client.delete(f"/api/v1/dashboard/stocks/{stock_id}/", HTTP_X_CSRFTOKEN=csrf)
        self.assertEqual(del_res.status_code, 200)
        self.assertFalse(Stock.objects.filter(id=stock_id).exists())
