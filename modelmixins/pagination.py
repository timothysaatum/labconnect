# from rest_framework.pagination import PageNumberPagination
# from rest_framework.response import Response

# class CustomPagination(PageNumberPagination):
#     page_size = 10  # Set default page size
#     page_size_query_param = 'page_size'  # Allow the client to set page size

#     def get_paginated_response(self, data):
#         return Response({
#             'data': data,  # Customize the key name as needed
#             'pagination': {
#                 'current_page': self.page.number,
#                 'total_pages': self.page.paginator.num_pages,
#                 'total_items': self.page.paginator.count,
#                 'page_size': self.page_size,
#             }
#         })
