import requests
from django.conf import settings

GEOCODE_URL = "https://api.openrouteservice.org/geocode/search"
DIRECTION_BASE_URL = "https://api.openrouteservice.org/v2/directions"


def _safe_json(response):
    try:
        return response.json()
    except ValueError:
        return {}

def get_coordinates(location):
    params = {
        "api_key": settings.ORS_API_KEY,
        "text": location,
        "size": 1
    }

    response = requests.get(GEOCODE_URL, params=params, timeout=30)
    data = _safe_json(response)

    if response.status_code != 200:
        raise ValueError(f"Geocoding failed for location: {location}")

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
        "coordinates": [start, end],
        # Helps when geocoded points are slightly off the road network.
        "radiuses": [5000, 5000],
    }

    profiles = ["driving-hgv", "driving-car"]

    for profile in profiles:
        response = requests.post(
            f"{DIRECTION_BASE_URL}/{profile}",
            json=body,
            headers=headers,
            timeout=45,
        )
        data = _safe_json(response)
        routes = data.get("routes") or []
        if response.status_code == 200 and routes:
            summary = routes[0]["summary"]
            return {
                "distance_miles": summary["distance"] * 0.000621371,
                "duration_hours": summary["duration"] / 3600,
                "geometry": routes[0]["geometry"]
            }

    raise ValueError("Unable to build route between supplied locations.")