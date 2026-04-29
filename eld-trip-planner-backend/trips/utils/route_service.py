import requests
from django.conf import settings

BASE_URL = "https://api.openrouteservice.org/v2/directions/driving-hgv"

def get_coordinates(location):
    url = "https://api.openrouteservice.org/geocode/search"
    
    params = {
        "api_key": settings.ORS_API_KEY,
        "text": location,
        "size": 1
    }

    response = requests.get(url, params=params)
    data = response.json()

    features = data.get("features")
    if not features:
        raise ValueError(f"Location not found: {location}")

    coords = features[0]["geometry"]["coordinates"]
    return coords  # [lng, lat]


def get_route(start, end):
    headers = {
        "Authorization": settings.ORS_API_KEY,
        "Content-Type": "application/json"
    }

    body = {
        "coordinates": [start, end]
    }

    response = requests.post(BASE_URL, json=body, headers=headers)
    data = response.json()

    summary = data["routes"][0]["summary"]

    return {
        "distance_miles": summary["distance"] * 0.000621371,
        "duration_hours": summary["duration"] / 3600,
        "geometry": data["routes"][0]["geometry"]
    }