from django.http import HttpResponseForbidden

ALLOWED_IPS = ["127.0.0.1", "192.168.1.1"]  # Add your Prometheus server IPs

class MetricsAccessMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == "/metrics/" and request.META.get("REMOTE_ADDR") not in ALLOWED_IPS:
            return HttpResponseForbidden("Access Denied")
        return self.get_response(request)
