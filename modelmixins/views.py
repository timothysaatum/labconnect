from .models import TestTemplate
from rest_framework.generics import ListAPIView
from .serializers import TestTemplateSerializer
from .paginators import QueryPagination

class FetchTestTemplates(ListAPIView):
    pagination_class = QueryPagination
    serializer_class = TestTemplateSerializer
    queryset = TestTemplate.objects.all()