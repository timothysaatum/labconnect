from rest_framework import pagination


class QueryPagination(pagination.CursorPagination):
<<<<<<< HEAD:modelmixins/paginators.py

	page_size = 5
=======
	page_size = 2
>>>>>>> 6180bff58c80e61ede83ab41a8aaaedf05de861c:labs/paginators.py
	ordering = '-date_added'
	cursor_query_param='cursor'
	page_query_param = 'size'
	max_page_size = 100
