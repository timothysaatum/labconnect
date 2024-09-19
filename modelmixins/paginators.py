from rest_framework import pagination


class QueryPagination(pagination.CursorPagination):
<<<<<<< HEAD:modelmixins/paginators.py

	page_size = 10
=======
	page_size = 1
>>>>>>> 9b301e60459523e6e33b537e39c99571c34d9fae:labs/paginators.py
	ordering = '-date_added'
	cursor_query_param='cursor'
	page_query_param = 'size'
	max_page_size = 100
