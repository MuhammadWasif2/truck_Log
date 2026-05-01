from django.urls import path, include
from django.contrib import admin
from django.http import HttpResponse

def home(request):
    return HttpResponse("Truck Log Backend is Running Successfully!")

urlpatterns = [
    path('', home),   # Homepage
    path('admin/', admin.site.urls),
    path('api/', include('trips.urls')),
]