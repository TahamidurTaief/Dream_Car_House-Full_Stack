import json
from rest_framework import serializers
from apps.inventory.models import Brand, ModelGeneration, BodyStyle, Inventory, InventoryImage, Stock


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
