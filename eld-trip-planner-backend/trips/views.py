from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import TripSerializer
from .utils.route_service import get_coordinates, get_route
from .utils.hos_calculator import generate_hos_logs


class PlanTripView(APIView):
    def post(self, request):
        serializer = TripSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            current_location = serializer.validated_data["current_location"]
            pickup_location = serializer.validated_data["pickup_location"]
            dropoff_location = serializer.validated_data["dropoff_location"]
            cycle_used = serializer.validated_data["cycle_used"]

            # Step 1: Geocode all locations
            current_coords = get_coordinates(current_location)
            pickup_coords = get_coordinates(pickup_location)
            dropoff_coords = get_coordinates(dropoff_location)

            # Step 2: Route legs
            leg1 = get_route(current_coords, pickup_coords)
            leg2 = get_route(pickup_coords, dropoff_coords)

            # Step 3: Total calculations
            total_distance = leg1["distance_miles"] + leg2["distance_miles"]
            total_duration = leg1["duration_hours"] + leg2["duration_hours"]

            # Step 4: HOS logs
            hos_data = generate_hos_logs(total_distance, cycle_used)

            # Step 5: Response
            return Response({
                "trip_summary": {
                    "current_location": current_location,
                    "pickup_location": pickup_location,
                    "dropoff_location": dropoff_location,
                    "total_distance_miles": round(total_distance, 2),
                    "estimated_driving_hours": round(total_duration, 2),
                    "estimated_days": hos_data["estimated_days"]
                },

                "route": {
                    "leg1": leg1,
                    "leg2": leg2
                },

                "fuel_stops": hos_data["fuel_stops"],

                "daily_logs": hos_data["daily_logs"]

            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            return Response(
                {"error": f"Server Error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )