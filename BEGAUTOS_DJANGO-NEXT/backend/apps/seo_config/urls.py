from django.urls import path
from apps.seo_config.views import SEOConfigDetailView, CategoryPageSEODetailView

app_name = 'seo_config'

urlpatterns = [
    path('seo/<str:page>/', SEOConfigDetailView.as_view(), name='seo_config_detail'),
    path('category-seo/<str:page>/', CategoryPageSEODetailView.as_view(), name='category_seo_detail'),
]
