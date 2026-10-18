import django_filters
from apps.inventory.models import Inventory, BodyStyle

from django_filters.filters import BaseInFilter

class CharInFilter(BaseInFilter, django_filters.CharFilter):
    pass


class InventoryFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr='lte')

    brand = django_filters.CharFilter(field_name="brand__name", lookup_expr='iexact')
    model = django_filters.CharFilter(field_name="model__model", lookup_expr='iexact')
    model_name = django_filters.CharFilter(field_name="model_name", lookup_expr='iexact')
    brand_id = django_filters.NumberFilter(field_name="brand_id", lookup_expr='exact')
    model_id = django_filters.NumberFilter(field_name="model_id", lookup_expr='exact')
    color = django_filters.CharFilter(field_name="color", lookup_expr='iexact')
    body_style = django_filters.ModelChoiceFilter(queryset=BodyStyle.objects.all())
    inventory_type = django_filters.ChoiceFilter(choices=Inventory.InventoryTypeChoices.choices)
    registered = CharInFilter(field_name="registered", lookup_expr='in')
    car_type = CharInFilter(field_name="car_type", lookup_expr='in')

    class Meta:
        model = Inventory
        fields = [
            'brand',
            'brand_id',
            'model',
            'model_name',
            'model_id',
            'color',
            'engine_capacity',
            'body_style',
            'registered',
            'inventory_type',
            'car_type',
        ]
