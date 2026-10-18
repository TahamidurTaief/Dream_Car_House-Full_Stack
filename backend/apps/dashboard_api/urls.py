from django.urls import path
from .views import (
    AccessProbeView,
    LoginView,
    LogoutView,
    MeView,
    BrandListCreateView,
    BrandDetailView,
    BrandCascadeImpactView,
    ModelGenerationListCreateView,
    ModelGenerationDetailView,
    BodyStyleListCreateView,
    BodyStyleDetailView,
    InventoryListCreateView,
    InventoryDetailView,
    InventoryImageUploadView,
    InventoryImageDetailView,
    StockListCreateView,
    StockDetailView,
)

app_name = "dashboard_api"

urlpatterns = [
    path("access/", AccessProbeView.as_view(), name="access"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", MeView.as_view(), name="me"),

    # Brands
    path("brands/", BrandListCreateView.as_view(), name="brand_list_create"),
    path("brands/<int:pk>/", BrandDetailView.as_view(), name="brand_detail"),
    path("brands/<int:pk>/impact/", BrandCascadeImpactView.as_view(), name="brand_impact"),

    # Model Generations
    path("model-generations/", ModelGenerationListCreateView.as_view(), name="model_generation_list_create"),
    path("model-generations/<int:pk>/", ModelGenerationDetailView.as_view(), name="model_generation_detail"),

    # Body Styles
    path("body-styles/", BodyStyleListCreateView.as_view(), name="body_style_list_create"),
    path("body-styles/<int:pk>/", BodyStyleDetailView.as_view(), name="body_style_detail"),

    # Inventory
    path("inventory/", InventoryListCreateView.as_view(), name="inventory_list_create"),
    path("inventory/<int:pk>/", InventoryDetailView.as_view(), name="inventory_detail"),
    path("inventory/<int:inventory_pk>/images/", InventoryImageUploadView.as_view(), name="inventory_image_upload"),
    path("inventory/images/<int:pk>/", InventoryImageDetailView.as_view(), name="inventory_image_detail"),

    # Stocks
    path("stocks/", StockListCreateView.as_view(), name="stock_list_create"),
    path("stocks/<int:pk>/", StockDetailView.as_view(), name="stock_detail"),
]
