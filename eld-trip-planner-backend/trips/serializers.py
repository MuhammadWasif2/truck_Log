from rest_framework import serializers


class TripSerializer(serializers.Serializer):
    current_location = serializers.CharField()
    pickup_location = serializers.CharField()
    dropoff_location = serializers.CharField()
    cycle_used = serializers.FloatField()