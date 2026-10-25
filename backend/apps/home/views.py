from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from base.models import BaseModel
from core.mixins.image_validation import ImageValidationMixin

from core.settings.restconf.pagination import PeopleTalkPagination

from apps.home.models import (
    Slider, SocialMedia, SellCar, SellYourCarImages, PeopleTalkAboutUs, Subscriber, SalesRepresentative,
    ContactMessage, SiteSettings, ShowroomBranch, PreferenceSection, PreferenceCategory,
    ConsultationSection, ExperienceSection,
    VisualChroniclesSection, VipSanctuarySection,
)

from apps.home.serializers import (
    SliderSerializer, SocialMediaSerializer, SellYourCarImageSerializer, SellCarSerializer,
    PeopleTalkAboutUsSerializer, SubscriberSerializer, SalesRepresentativeListSearchSerializer,
    ContactMessageSerializer, PublicSiteSettingsSerializer, PublicShowroomBranchSerializer,
    PublicPreferenceSectionSerializer, PublicPreferenceCategorySerializer,
    PublicConsultationSectionSerializer, PublicExperienceSectionSerializer,
    PublicVisualChroniclesSectionSerializer, PublicVipSanctuarySectionSerializer,
)



class SliderAPIView(APIView):

    def get(self, request, format=None):
        slider_info = Slider.objects.filter(is_published=True).order_by("id").last()
        if slider_info is None:
            slider_info = Slider.objects.order_by("id").last()
        if slider_info is not None:
            serializer = SliderSerializer(slider_info, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'heading': '', 'image': ''}, status=status.HTTP_200_OK)




class SocialMediaAPIView(APIView):

    def get(self, request, format=None):
        sm_info = SocialMedia.objects.last()
        if sm_info is not None:
            serializer = SocialMediaSerializer(sm_info, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No information available."}, status=status.HTTP_404_NOT_FOUND)


class SubscriberAPIView(generics.CreateAPIView):
    serializer_class = SubscriberSerializer
    queryset = Subscriber.objects.all()


class SellCarCreateAPIView(ImageValidationMixin, generics.CreateAPIView):
    serializer_class = SellCarSerializer
    queryset = SellCar.objects.all()

    def create(self, request, *args, **kwargs):
        # Use the serializer to validate the base SellCar data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        sell_car = serializer.save()

        # Handle multiple images from the "images" field
        images = request.FILES.getlist('images')

        images = request.FILES.getlist('images')
        self.validate_and_save_images(images, sell_car, SellYourCarImages, 'sellcar')

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ContactMessageCreateAPIView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    queryset = ContactMessage.objects.all()


class PeopleTalkListAPIView(generics.ListAPIView):
    serializer_class = PeopleTalkAboutUsSerializer
    pagination_class = PeopleTalkPagination

    def get_queryset(self):
        return PeopleTalkAboutUs.objects.filter(
            status=BaseModel.StatusChoices.PUBLISHED
        ).order_by('-updated_at')


class SalesRepresentativeListAPI(generics.ListAPIView):
    serializer_class = SalesRepresentativeListSearchSerializer
    queryset = SalesRepresentative.objects.filter(status=BaseModel.StatusChoices.PUBLISHED)
    pagination_class = None


class PublicSiteSettingsAPIView(APIView):
    def get(self, request, format=None):
        settings_obj = SiteSettings.objects.first()
        if settings_obj is None:
            return Response(
                {
                    "success": False,
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Public site settings have not been configured.",
                    },
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PublicSiteSettingsSerializer(settings_obj, context={"request": request})
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


class PublicShowroomBranchListAPIView(APIView):
    def get(self, request, format=None):
        branches = ShowroomBranch.objects.filter(
            status=BaseModel.StatusChoices.PUBLISHED
        ).order_by("order", "id")
        serializer = PublicShowroomBranchSerializer(branches, many=True, context={"request": request})
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


class PublicPreferenceSectionAPIView(APIView):
    def get(self, request, format=None):
        section = PreferenceSection.objects.filter(is_active=True).first()
        if not section:
            section = PreferenceSection.objects.first()
        if not section:
            return Response(
                {
                    "success": False,
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Preference section has not been configured.",
                    },
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PublicPreferenceSectionSerializer(section, context={"request": request})
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


class PublicConsultationSectionAPIView(APIView):
    def get(self, request, format=None):
        section = ConsultationSection.objects.filter(is_active=True).first()
        if not section:
            section = ConsultationSection.objects.first()
        if not section:
            return Response(
                {
                    "success": False,
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Consultation section has not been configured.",
                    },
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PublicConsultationSectionSerializer(section, context={"request": request})
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


class PublicExperienceSectionAPIView(APIView):
    def get(self, request, format=None):
        section = ExperienceSection.objects.filter(is_active=True).first()
        if not section:
            section = ExperienceSection.objects.first()
        if not section:
            return Response(
                {
                    "success": False,
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Experience section has not been configured.",
                    },
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PublicExperienceSectionSerializer(section, context={"request": request})
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


class PublicVisualChroniclesSectionAPIView(APIView):
    def get(self, request, format=None):
        section = VisualChroniclesSection.objects.filter(is_active=True).first()
        if not section:
            section = VisualChroniclesSection.objects.first()
        if not section:
            return Response(
                {
                    "success": False,
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Visual Chronicles section has not been configured.",
                    },
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PublicVisualChroniclesSectionSerializer(section, context={"request": request})
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


class PublicVipSanctuarySectionAPIView(APIView):
    def get(self, request, format=None):
        section = VipSanctuarySection.objects.filter(is_active=True).first()
        if not section:
            section = VipSanctuarySection.objects.first()
        if not section:
            return Response(
                {
                    "success": False,
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "VIP Sanctuary section has not been configured.",
                    },
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PublicVipSanctuarySectionSerializer(section, context={"request": request})
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)




