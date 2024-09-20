from rest_framework import pagination


class QueryPagination(pagination.CursorPagination):

	page_size = 8
	ordering = '-date_added'
	cursor_query_param='cursor'
	page_query_param = 'size'
	max_page_size = 100
