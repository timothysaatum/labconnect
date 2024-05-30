from rest_framework import pagination



class QueryPagination(pagination.PageNumberPagination):
	page_size = 10
	page_query_param = 'page_number'