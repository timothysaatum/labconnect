from rest_framework import pagination # type: ignore


class QueryPagination(pagination.CursorPagination):

	page_size = 1
	ordering = '-date_referred'
	cursor_query_param='cursor'
	page_size_query_param = 'page_size'
	max_page_size = 100

	def get_page_size(self, request):
		page_size = super().get_page_size(request)
		if self.page_size_query_param in request.query_params:
			return min(int(request.query_params[self.page_size_query_param]), 100)  # Limit the max page size to 100
		return page_size
