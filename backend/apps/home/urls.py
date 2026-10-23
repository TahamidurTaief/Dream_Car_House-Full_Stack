from django.urls import path

from apps.home.views import (
    SliderAPIView, SocialMediaAPIView, SellCarCreateAPIView, PeopleTalkListAPIView, SubscriberAPIView,
    SalesRepresentativeListAPI, ContactMessageCreateAPIView, PublicSiteSettingsAPIView,
    PublicShowroomBranchListAPIView,
)

app_name = 'home'


urlpatterns = [
    path('slider/', SliderAPIView.as_view(), name='slider'),
    path('sm/', SocialMediaAPIView.as_view(), name='sm'),
    path('sell-car/', SellCarCreateAPIView.as_view(), name='sell_car'),
    path('contact/', ContactMessageCreateAPIView.as_view(), name='contact'),
    path('subscribers/', SubscriberAPIView.as_view(), name='subscribers'),
    path('people-talk/', PeopleTalkListAPIView.as_view(), name='people_talk'),
    path('sales-representative/', SalesRepresentativeListAPI.as_view(), name='sales_representative'),
    path('site-settings/', PublicSiteSettingsAPIView.as_view(), name='site_settings'),
    path('branches/', PublicShowroomBranchListAPIView.as_view(), name='branches'),
]

