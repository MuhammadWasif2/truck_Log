# ELD Trip Planner Backend (Django)

Backend API for the Truck Trip Planner and ELD Log Generator assessment.

## API Endpoint

- `POST /api/plan-trip/`

Request body:

```json
{
  "current_location": "Dallas, TX",
  "pickup_location": "Oklahoma City, OK",
  "dropoff_location": "Denver, CO",
  "cycle_used": 12
}
```

Response includes:

- `trip_summary`
- `route` (leg1 and leg2 from OpenRouteService)
- `fuel_stops`
- `daily_logs`

## Local Setup

1. Create virtual environment and activate it.
2. Install packages:
   - `pip install django djangorestframework django-cors-headers python-dotenv requests`
3. Copy `.env.example` to `.env` and fill values.
4. Run migrations:
   - `python manage.py migrate`
5. Start server:
   - `python manage.py runserver`

## Environment Variables

- `DJANGO_SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `ORS_API_KEY`

## Deployment Notes

- Set `DEBUG=False` in production.
- Set strict `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`.
- Ensure the frontend domain is included in `CORS_ALLOWED_ORIGINS`.
