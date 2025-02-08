# views.py
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .serializers import FileUploadSerializer

class FileUploadView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            file = serializer.validated_data['file']
            url = settings.VERCEL_BLOB_BASE_URL + "/upload"  # Adjust the endpoint if necessary
            headers = {
                'Authorization': f"Bearer {settings.VERCEL_BLOB_API_KEY}"
            }
            files = {'file': (file.name, file, file.content_type)}
            
            response = requests.post(url, headers=headers, files=files)

            if response.status_code == 200:
                return Response(response.json(), status=status.HTTP_201_CREATED)
            return Response({"error": "Failed to upload to Vercel Blob"}, status=response.status_code)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

