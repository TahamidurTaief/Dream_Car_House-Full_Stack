import re

import bleach
from rest_framework import serializers

from core.mixins.image_optimization_mixins import OptimizedImageSerializerMixin

from apps.home.models import (
    Slider, SocialMedia, SellCar, PeopleTalkAboutUs, SellYourCarImages, Subscriber, SalesRepresentative,
    ContactMessage, SiteSettings, ShowroomBranch,
)



class SliderSerializer(serializers.ModelSerializer, OptimizedImageSerializerMixin):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Slider
        fields = ['heading', 'image']

    def get_image(self, obj):
        return self.get_optimized_image_url(obj, 'image')


class SocialMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMedia
        fields = ['facebook', 'instagram', 'twitter', 'youtube']


class SellYourCarImageSerializer(serializers.ModelSerializer, OptimizedImageSerializerMixin):
    image = serializers.SerializerMethodField()

    class Meta:
        model = SellYourCarImages
        fields = ['id', 'image']

    def get_image(self, obj):
        return self.get_optimized_image_url(obj, 'image')


class SellCarSerializer(serializers.ModelSerializer):

    class Meta:
        model = SellCar
        fields = '__all__'

    def validate_name(self, value):
        # Sanitize to prevent XSS
        return bleach.clean(value, tags=[], strip=True)


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = '__all__'

    def validate_name(self, value):
        # Sanitize to prevent XSS
        return bleach.clean(value, tags=[], strip=True)


class PeopleTalkAboutUsSerializer(serializers.ModelSerializer, OptimizedImageSerializerMixin):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PeopleTalkAboutUs
        fields = [
            'title', 'image', 'url', 'is_featured'
        ]

    def get_image(self, obj):
        return self.get_optimized_image_url(obj, 'image')


class ContactMessageSerializer(serializers.ModelSerializer):
    PHONE_RE = re.compile(r'^[+0-9\s-]{8,20}$')

    # Exposed as `enquiry`, not `message`: apis.renderers.DefaultRenderer treats a
    # top-level `message` key as the response message, which would swallow the
    # other field errors and flatten the success payload.
    enquiry = serializers.CharField(source='message', max_length=3000, allow_blank=True)

    class Meta:
        model = ContactMessage
        fields = ['topic', 'name', 'phone', 'email', 'vehicle', 'enquiry', 'preferred_contact']
        # Blank values are rejected by the validate_* methods below with the
        # same wording the frontend form uses, rather than DRF's generic text.
        extra_kwargs = {'name': {'allow_blank': True}, 'phone': {'allow_blank': True}}

    def _clean(self, value):
        return bleach.clean(value, tags=[], strip=True).strip()

    def validate_name(self, value):
        value = self._clean(value)
        if not value:
            raise serializers.ValidationError('Please enter your name.')
        return value

    def validate_email(self, value):
        return value.strip()

    def validate_phone(self, value):
        value = value.strip()
        if not self.PHONE_RE.match(value):
            raise serializers.ValidationError('Please enter a valid phone number.')
        return value

    def validate_vehicle(self, value):
        return self._clean(value)

    def validate_enquiry(self, value):
        value = self._clean(value)
        if not value:
            raise serializers.ValidationError('Tell us a little about your enquiry.')
        return value

    def validate(self, attrs):
        if attrs.get('preferred_contact') == ContactMessage.PreferredContactChoices.EMAIL and not attrs.get('email'):
            raise serializers.ValidationError({'email': 'Add an email so we can reply.'})
        return attrs


class SalesRepresentativeListSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = SalesRepresentative
        fields = [
            'name',
            'phone_number'
        ]


class PublicSiteSettingsSerializer(serializers.ModelSerializer):
    social_media = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            'name',
            'tagline',
            'logo_text',
            'logo_asset',
            'hotline',
            'phone',
            'email',
            'whatsapp',
            'website',
            'primary_address',
            'footer_tagline',
            'footer_copy_text',
            'opening_hours_text',
            'social_media',
        ]

    def get_social_media(self, obj):
        sm = obj.social_media or SocialMedia.objects.order_by('id').last()
        if sm:
            return SocialMediaSerializer(sm, context=self.context).data
        return None


class PublicShowroomBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowroomBranch
        fields = [
            'id',
            'branch_id',
            'name',
            'short_name',
            'tag',
            'address',
            'phone',
            'hotline',
            'email',
            'hours',
            'map_link',
            'embed_map',
            'order',
        ]

