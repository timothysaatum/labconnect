from django.http import JsonResponse
from django.urls import resolve
from rest_framework.permissions import IsAuthenticated
from rest_framework import status




class PermissionMiddleware:

	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):

		response = self.get_response(request)
		view = resolve(request.path_info).func
		# print(view.view_class.permission_classes)
		if hasattr(view, 'view_class'):

			if IsAuthenticated in view.view_class.permission_classes:

				if not request.COOKIES.get('refresh_token'):

					return JsonResponse({'error': 'Authentication Failed.'}, status=status.HTTP_401_UNAUTHORIZED)

		return response
