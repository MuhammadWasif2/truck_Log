from django.http import JsonResponse
from django.urls import path

from .views import PlanTripView


def api_root(request):
    return JsonResponse(
        {
            "service": "eld-trip-planner",
            "endpoints": {
                "plan_trip": {"url": "/api/plan-trip/", "method": "POST"},
            },
        }
    )


urlpatterns = [
    path("", api_root),
    path("plan-trip/", PlanTripView.as_view(), name="plan-trip"),
]
