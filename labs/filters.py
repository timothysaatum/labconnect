import django_filters # type: ignore
from labs.models import Test


class TestFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    id = django_filters.BooleanFilter()

    class Meta:
        model = Test
        fields = ['name', 'id']