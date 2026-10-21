import json
from django.contrib.auth import password_validation
from django.contrib.auth.models import User, Group, Permission
from rest_framework import serializers
from apps.inventory.models import Brand, ModelGeneration, BodyStyle, Inventory, InventoryImage, Stock, InventoryQuote
from apps.home.models import (
    SellCar,
    SellYourCarImages,
    ContactMessage,
    Subscriber,
    Slider,
    SocialMedia,
    PeopleTalkAboutUs,
    SalesRepresentative,
)
from apps.seo_config.models import SEOConfig, CategoryPageSEO


class BrandManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = [
            "id",
            "name",
            "segment",
            "image",
            "listing_footer_text",
            "status",
            "target_keyword",
            "meta_title",
            "meta_description",
            "canonical_url",
            "robots",
            "schema_json",
            "h1_title",
            "short_description",
            "long_description",
            "feature_image",
            "feature_image_alt",
            "seo_updated_at",
        ]
        read_only_fields = ["id", "seo_updated_at"]

    def validate_name(self, value):
        name_str = value.strip()
        qs = Brand.objects.filter(name__iexact=name_str)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(f"A brand with the name '{name_str}' already exists.")
        return name_str

    def validate_schema_json(self, value):
        if value is None or value == "":
            return None
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError as err:
                raise serializers.ValidationError(f"Invalid JSON-LD schema: {err.msg}")
        if not isinstance(value, (dict, list)):
            raise serializers.ValidationError("JSON-LD schema must be a valid JSON object or list.")
        return value


class ModelGenerationManagementSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source="brand.name", read_only=True)

    class Meta:
        model = ModelGeneration
        fields = [
            "id",
            "brand",
            "brand_name",
            "model",
            "status",
        ]
        read_only_fields = ["id", "brand_name"]

    def validate(self, attrs):
        brand = attrs.get("brand") or (self.instance.brand if self.instance else None)
        model = attrs.get("model") or (self.instance.model if self.instance else None)

        if brand and model:
            model_str = model.strip()
            qs = ModelGeneration.objects.filter(brand=brand, model__iexact=model_str)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError({
                    "model": f"A model named '{model_str}' already exists for {brand.name}."
                })
        return attrs


class BodyStyleManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyStyle
        fields = [
            "id",
            "body",
            "status",
        ]
        read_only_fields = ["id"]


class InventoryImageManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryImage
        fields = [
            "id",
            "inventory",
            "image",
            "caption",
            "alt_text",
            "order",
        ]
        read_only_fields = ["id"]


class InventoryListManagementSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source="brand.name", read_only=True)
    model_generation_name = serializers.CharField(source="model.model", read_only=True)
    body_style_name = serializers.CharField(source="body_style.body", read_only=True)

    class Meta:
        model = Inventory
        fields = [
            "id",
            "name",
            "car_type",
            "brand",
            "brand_name",
            "model",
            "model_generation_name",
            "model_name",
            "body_style",
            "body_style_name",
            "year",
            "price",
            "fuel_type",
            "transmission",
            "registered",
            "status",
            "is_featured",
            "feature_image",
            "slug",
            "indexing",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "brand_name",
            "model_generation_name",
            "body_style_name",
            "slug",
            "created_at",
            "updated_at",
        ]


class InventoryDetailManagementSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source="brand.name", read_only=True)
    model_generation_name = serializers.CharField(source="model.model", read_only=True)
    body_style_name = serializers.CharField(source="body_style.body", read_only=True)
    inventory_images = InventoryImageManagementSerializer(many=True, read_only=True)
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Inventory
        fields = [
            "id",
            # General
            "name",
            "car_type",
            "brand",
            "brand_name",
            "model",
            "model_generation_name",
            "model_name",
            "year",
            "condition",
            "body_style",
            "body_style_name",
            "inventory_type",
            "is_featured",
            "status",
            # Specifications
            "engine_capacity",
            "fuel_type",
            "transmission",
            "drive_type",
            "wheel_base",
            "mileage",
            "color",
            # Pricing & Availability
            "price",
            "slightly_negotiable",
            "registered",
            # Media
            "feature_image",
            "youtube",
            "inventory_images",
            # Description
            "description",
            # SEO
            "h1_title",
            "target_keyword",
            "meta_title",
            "meta_description",
            "slug",
            "canonical_url",
            "featured_image_alt",
            "indexing",
            "redirect_url",
            "previous_slug",
            "schema_override",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "brand_name",
            "model_generation_name",
            "body_style_name",
            "created_at",
            "updated_at",
        ]

    def validate_schema_override(self, value):
        if value is None or value == "":
            return None
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError as err:
                raise serializers.ValidationError(f"Invalid JSON-LD schema: {err.msg}")
        if not isinstance(value, (dict, list)):
            raise serializers.ValidationError("Schema override must be a valid JSON object or list.")
        return value

    def validate(self, attrs):
        # Validate that model belongs to brand if both are provided or being updated
        brand = attrs.get("brand") or (self.instance.brand if self.instance else None)
        model = attrs.get("model") or (self.instance.model if self.instance else None)
        if model and brand and model.brand_id != brand.id:
            raise serializers.ValidationError({
                "model": f"Model generation '{model.model}' does not belong to brand '{brand.name}'."
            })
        return attrs


class StockManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = [
            "id",
            "title",
            "image",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def to_internal_value(self, data):
        # On partial updates (PATCH), if image is empty string or None, retain existing image
        if self.partial and isinstance(data, dict) and "image" in data:
            val = data.get("image")
            if val == "" or val is None or (hasattr(val, "size") and val.size == 0):
                data = data.copy() if hasattr(data, "copy") else dict(data)
                data.pop("image", None)
        return super().to_internal_value(data)


class InventoryQuoteManagementSerializer(serializers.ModelSerializer):
    car_name = serializers.CharField(source="car.name", read_only=True, default=None, allow_null=True)
    car_slug = serializers.CharField(source="car.slug", read_only=True, default=None, allow_null=True)
    car_price = serializers.DecimalField(source="car.price", max_digits=12, decimal_places=2, read_only=True, default=None, allow_null=True)

    class Meta:
        model = InventoryQuote
        fields = [
            "id",
            "car",
            "car_name",
            "car_slug",
            "car_price",
            "name",
            "email",
            "phone",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class SellYourCarImageManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellYourCarImages
        fields = ["id", "sellcar", "image"]
        read_only_fields = ["id", "sellcar"]


class SellCarManagementSerializer(serializers.ModelSerializer):
    inventory_images = SellYourCarImageManagementSerializer(many=True, read_only=True)

    class Meta:
        model = SellCar
        fields = [
            "id",
            "name",
            "phone",
            "car_name",
            "car_model",
            "car_year",
            "mileage",
            "offered_price",
            "inventory_images",
        ]
        read_only_fields = ["id"]


class ContactMessageManagementSerializer(serializers.ModelSerializer):
    topic_display = serializers.CharField(source="get_topic_display", read_only=True)
    preferred_contact_display = serializers.CharField(source="get_preferred_contact_display", read_only=True)

    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "topic",
            "topic_display",
            "name",
            "phone",
            "email",
            "vehicle",
            "message",
            "preferred_contact",
            "preferred_contact_display",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class SubscriberManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ["id", "email"]
        read_only_fields = ["id"]


class SliderManagementSerializer(serializers.ModelSerializer):
    is_public_active = serializers.SerializerMethodField()

    class Meta:
        model = Slider
        fields = ["id", "heading", "image", "is_public_active"]
        read_only_fields = ["id", "is_public_active"]

    def get_is_public_active(self, obj):
        last = Slider.objects.order_by("id").last()
        return bool(last and last.id == obj.id)

    def validate_image(self, value):
        if not value:
            return value
        allowed_exts = ["jpg", "jpeg", "png", "webp", "mp4", "webm"]
        ext = value.name.split(".")[-1].lower() if "." in value.name else ""
        if ext not in allowed_exts:
            raise serializers.ValidationError(
                f"Unsupported file format '.{ext}'. Allowed formats: {', '.join(allowed_exts)}."
            )
        return value

    def to_internal_value(self, data):
        # On partial updates (PATCH), if image is empty string or None, retain existing file
        if self.partial and isinstance(data, dict) and "image" in data:
            val = data.get("image")
            if val == "" or val is None or (hasattr(val, "size") and val.size == 0):
                data = data.copy() if hasattr(data, "copy") else dict(data)
                data.pop("image", None)
        return super().to_internal_value(data)


class SocialMediaManagementSerializer(serializers.ModelSerializer):
    is_public_active = serializers.SerializerMethodField()

    class Meta:
        model = SocialMedia
        fields = ["id", "facebook", "instagram", "twitter", "youtube", "is_public_active"]
        read_only_fields = ["id", "is_public_active"]

    def get_is_public_active(self, obj):
        last = SocialMedia.objects.order_by("id").last()
        return bool(last and last.id == obj.id)

    def validate_facebook(self, value):
        val = value.strip()
        if not (val.startswith("http://") or val.startswith("https://")):
            raise serializers.ValidationError("Please provide a valid URL starting with http:// or https://")
        return val

    def validate_instagram(self, value):
        if not value:
            return value
        val = value.strip()
        if not (val.startswith("http://") or val.startswith("https://")):
            raise serializers.ValidationError("Please provide a valid URL starting with http:// or https://")
        return val

    def validate_twitter(self, value):
        if not value:
            return value
        val = value.strip()
        if not (val.startswith("http://") or val.startswith("https://")):
            raise serializers.ValidationError("Please provide a valid URL starting with http:// or https://")
        return val

    def validate_youtube(self, value):
        if not value:
            return value
        val = value.strip()
        if not (val.startswith("http://") or val.startswith("https://")):
            raise serializers.ValidationError("Please provide a valid URL starting with http:// or https://")
        return val


class PeopleTalkAboutUsManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeopleTalkAboutUs
        fields = [
            "id",
            "title",
            "image",
            "url",
            "is_featured",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_title(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Title cannot be blank.")
        return val

    def validate_image(self, value):
        if not value:
            return value
        allowed_exts = ["jpg", "jpeg", "png", "webp"]
        ext = value.name.split(".")[-1].lower() if "." in value.name else ""
        if ext not in allowed_exts:
            raise serializers.ValidationError(
                f"Unsupported image format '.{ext}'. Allowed formats: {', '.join(allowed_exts)}."
            )
        return value

    def validate_url(self, value):
        if not value:
            return value
        val = value.strip()
        if not (val.startswith("http://") or val.startswith("https://")):
            raise serializers.ValidationError("Please provide a valid URL starting with http:// or https://")
        return val

    def to_internal_value(self, data):
        # On partial updates (PATCH), if image is empty string or None, retain existing file
        if self.partial and isinstance(data, dict) and "image" in data:
            val = data.get("image")
            if val == "" or val is None or (hasattr(val, "size") and val.size == 0):
                data = data.copy() if hasattr(data, "copy") else dict(data)
                data.pop("image", None)
        return super().to_internal_value(data)


class SalesRepresentativeManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRepresentative
        fields = [
            "id",
            "name",
            "phone_number",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_name(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Representative name cannot be blank.")
        return val

    def validate_phone_number(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Phone number cannot be blank.")
        return val


class SEOConfigManagementSerializer(serializers.ModelSerializer):
    page_display = serializers.CharField(source="get_page_display", read_only=True)

    class Meta:
        model = SEOConfig
        fields = [
            "id",
            "page",
            "page_display",
            "visibility",
            "target_keyword",
            "feature_image",
            "feature_image_alt",
            "meta_title",
            "meta_description",
            "meta_keywords",
            "robots",
            "canonical_url",
            "og_title",
            "og_description",
            "og_image",
            "og_type",
            "og_site_name",
            "twitter_card",
            "twitter_title",
            "twitter_description",
            "twitter_image",
            "schema_json",
            "updated_at",
        ]
        read_only_fields = ["id", "page_display", "updated_at"]

    def validate_page(self, value):
        val = value.strip()
        qs = SEOConfig.objects.filter(page=val)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(f"An SEO configuration for page '{val}' already exists.")
        return val

    def validate_canonical_url(self, value):
        if not value:
            return value
        val = value.strip()
        if not (val.startswith("http://") or val.startswith("https://")):
            raise serializers.ValidationError("Canonical URL must start with http:// or https://")
        return val

    def validate_schema_json(self, value):
        if value is None or value == "":
            return None
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError as err:
                raise serializers.ValidationError(f"Invalid JSON-LD schema: {err.msg}")
        if not isinstance(value, (dict, list)):
            raise serializers.ValidationError("JSON-LD schema must be a valid JSON object or list.")
        return value

    def _validate_image_file(self, field_name, value):
        if not value or not hasattr(value, "name"):
            return value
        allowed_exts = ["jpg", "jpeg", "png", "webp"]
        ext = value.name.split(".")[-1].lower() if "." in value.name else ""
        if ext not in allowed_exts:
            raise serializers.ValidationError(
                f"Unsupported image format '.{ext}' for {field_name}. Allowed formats: {', '.join(allowed_exts)}."
            )
        return value

    def validate_feature_image(self, value):
        return self._validate_image_file("feature_image", value)

    def validate_og_image(self, value):
        return self._validate_image_file("og_image", value)

    def validate_twitter_image(self, value):
        return self._validate_image_file("twitter_image", value)

    def to_internal_value(self, data):
        # On partial updates (PATCH), if file fields are empty string or None, retain existing files
        if self.partial and isinstance(data, dict):
            for field in ["feature_image", "og_image", "twitter_image"]:
                if field in data:
                    val = data.get(field)
                    if val == "" or val is None or (hasattr(val, "size") and val.size == 0):
                        data = data.copy() if hasattr(data, "copy") else dict(data)
                        data.pop(field, None)
        return super().to_internal_value(data)


class CategoryPageSEOManagementSerializer(serializers.ModelSerializer):
    page_display = serializers.CharField(source="get_page_display", read_only=True)

    class Meta:
        model = CategoryPageSEO
        fields = [
            "id",
            "page",
            "page_display",
            "category_name",
            "visibility",
            "target_keyword",
            "meta_title",
            "meta_description",
            "canonical_url",
            "robots",
            "feature_image",
            "feature_image_alt",
            "schema_json",
            "h1_title",
            "short_description",
            "long_description",
            "updated_at",
        ]
        read_only_fields = ["id", "page_display", "updated_at"]

    def validate_page(self, value):
        val = value.strip()
        qs = CategoryPageSEO.objects.filter(page=val)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(f"A category SEO configuration for page '{val}' already exists.")
        return val

    def validate_canonical_url(self, value):
        if not value:
            return value
        val = value.strip()
        if not (val.startswith("http://") or val.startswith("https://")):
            raise serializers.ValidationError("Canonical URL must start with http:// or https://")
        return val

    def validate_schema_json(self, value):
        if value is None or value == "":
            return None
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError as err:
                raise serializers.ValidationError(f"Invalid JSON-LD schema: {err.msg}")
        if not isinstance(value, (dict, list)):
            raise serializers.ValidationError("JSON-LD schema must be a valid JSON object or list.")
        return value

    def validate_feature_image(self, value):
        if not value or not hasattr(value, "name"):
            return value
        allowed_exts = ["jpg", "jpeg", "png", "webp"]
        ext = value.name.split(".")[-1].lower() if "." in value.name else ""
        if ext not in allowed_exts:
            raise serializers.ValidationError(
                f"Unsupported image format '.{ext}' for feature_image. Allowed formats: {', '.join(allowed_exts)}."
            )
        return value

    def to_internal_value(self, data):
        # On partial updates (PATCH), if feature_image is empty string or None, retain existing file
        if self.partial and isinstance(data, dict) and "feature_image" in data:
            val = data.get("feature_image")
            if val == "" or val is None or (hasattr(val, "size") and val.size == 0):
                data = data.copy() if hasattr(data, "copy") else dict(data)
                data.pop("feature_image", None)
        return super().to_internal_value(data)


# ==============================================================================
# Authentication & Authorization Management Serializers
# ==============================================================================

class PermissionSerializer(serializers.ModelSerializer):
    app_label = serializers.CharField(source="content_type.app_label", read_only=True)

    class Meta:
        model = Permission
        fields = ["id", "name", "codename", "app_label"]
        read_only_fields = ["id", "name", "codename", "app_label"]


class GroupManagementSerializer(serializers.ModelSerializer):
    permissions_details = PermissionSerializer(source="permissions", many=True, read_only=True)
    permission_ids = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(),
        many=True,
        write_only=True,
        required=False,
        source="permissions",
    )
    user_count = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = [
            "id",
            "name",
            "user_count",
            "permissions_details",
            "permission_ids",
        ]
        read_only_fields = ["id", "user_count", "permissions_details"]

    def get_user_count(self, obj):
        return obj.user_set.count()

    def validate_name(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Group name cannot be blank.")
        qs = Group.objects.filter(name__iexact=val)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(f"A group with the name '{val}' already exists.")
        return val


class UserListManagementSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "is_superuser",
            "is_active",
            "groups",
            "last_login",
            "date_joined",
        ]
        read_only_fields = fields


class UserDetailManagementSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    groups_details = serializers.SerializerMethodField()
    group_ids = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        many=True,
        write_only=True,
        required=False,
        source="groups",
    )
    user_permissions_details = PermissionSerializer(source="user_permissions", many=True, read_only=True)
    permission_ids = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(),
        many=True,
        write_only=True,
        required=False,
        source="user_permissions",
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "is_superuser",
            "is_active",
            "password",
            "groups_details",
            "group_ids",
            "user_permissions_details",
            "permission_ids",
            "last_login",
            "date_joined",
        ]
        read_only_fields = ["id", "last_login", "date_joined", "groups_details", "user_permissions_details"]

    def get_groups_details(self, obj):
        return [{"id": g.id, "name": g.name} for g in obj.groups.all()]

    def validate_username(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Username cannot be blank.")
        qs = User.objects.filter(username__iexact=val)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(f"A user with the username '{val}' already exists.")
        return val

    def validate(self, attrs):
        request = self.context.get("request")
        current_user = getattr(request, "user", None)
        target_user = self.instance

        # Privilege assignment & escalation guards:
        # 1. Non-superuser cannot touch is_superuser or grant is_superuser
        if "is_superuser" in attrs:
            new_superuser = attrs["is_superuser"]
            if not current_user or not current_user.is_superuser:
                if target_user and target_user.is_superuser != new_superuser:
                    raise serializers.ValidationError({"is_superuser": "Only superusers can grant or revoke superuser status."})
                elif not target_user and new_superuser:
                    raise serializers.ValidationError({"is_superuser": "Only superusers can create superuser accounts."})

        # 2. Prevent self-demotion / deactivation of the last superuser
        if target_user and target_user.is_superuser:
            is_active_target = attrs.get("is_active", target_user.is_active)
            is_staff_target = attrs.get("is_staff", target_user.is_staff)
            is_superuser_target = attrs.get("is_superuser", target_user.is_superuser)

            if not is_active_target or not is_staff_target or not is_superuser_target:
                active_superusers = User.objects.filter(is_superuser=True, is_active=True, is_staff=True).exclude(pk=target_user.pk)
                if not active_superusers.exists():
                    raise serializers.ValidationError("Cannot deactivate or remove superuser privileges from the last active administrator.")

        # 3. Only superusers or staff with change_user can manage staff status
        if "is_staff" in attrs and (not current_user or not current_user.is_superuser):
            new_staff = attrs["is_staff"]
            if target_user and target_user.is_staff != new_staff and not current_user.has_perm("auth.change_user"):
                raise serializers.ValidationError({"is_staff": "Permission required to change staff status."})

        # 4. Password validation via Django password APIs
        password = attrs.get("password")
        if password:
            if len(password) < 8:
                raise serializers.ValidationError({"password": ["This password is too short. It must contain at least 8 characters."]})
            try:
                password_validation.validate_password(password, user=target_user)
            except serializers.ValidationError as err:
                raise err
            except Exception as err:
                raise serializers.ValidationError({"password": list(err)})

        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        groups = validated_data.pop("groups", None)
        user_permissions = validated_data.pop("user_permissions", None)

        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()

        if groups is not None:
            user.groups.set(groups)
        if user_permissions is not None:
            user.user_permissions.set(user_permissions)

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        groups = validated_data.pop("groups", None)
        user_permissions = validated_data.pop("user_permissions", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)
        instance.save()

        if groups is not None:
            instance.groups.set(groups)
        if user_permissions is not None:
            instance.user_permissions.set(user_permissions)

        return instance
