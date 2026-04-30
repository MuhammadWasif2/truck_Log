# Truck Trip Planner + ELD Logs

Full-stack assessment project built with Django (API) and React (Vite + Tailwind).

## Project Structure

- `eld-trip-planner-backend` - Django API for trip planning and HOS log generation
- `trip-frontend` - React UI for trip inputs, route map, and ELD log sheets

## Core Assessment Functionality

- Inputs:
  - Current location
  - Pickup location
  - Dropoff location
  - Current cycle used (hours)
- Outputs:
  - Route map with stop/rest context
  - Daily ELD-style multi-day log sheets

Assumptions implemented:

- Property-carrying driver
- 70 hours / 8 days cycle
- No adverse driving conditions
- Fueling at least once every 1,000 miles
- 1 hour for pickup and 1 hour for dropoff

## Run Locally

### 1) Backend

```bash
cd eld-trip-planner-backend
python -m venv venv
venv\Scripts\activate
pip install django djangorestframework django-cors-headers python-dotenv requests
copy .env.example .env
python manage.py migrate
python manage.py runserver
```

### 2) Frontend

```bash
cd trip-frontend
npm install
copy .env.example .env
npm run dev
```

Frontend default: `http://localhost:5173`  
Backend default: `http://127.0.0.1:8000`

## Deployment Checklist

### Frontend (Vercel)

- Set root directory to `trip-frontend`
- Build command: `npm run build`
- Output directory: `dist`
- `vercel.json` already added in `trip-frontend` for SPA routing fallback
- Env var:
  - `VITE_API_BASE_URL=https://<your-backend-domain>/api`

### Backend (Render/Railway/other)

- Set root directory to `eld-trip-planner-backend`
- `render.yaml` added at project root for one-click Render setup
- Start command (production):
  - `python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
- Env vars:
  - `DEBUG=False`
  - `DJANGO_SECRET_KEY=<secure-key>`
  - `ALLOWED_HOSTS=<your-backend-domain>`
  - `CORS_ALLOWED_ORIGINS=https://<your-frontend-domain>`
  - `ORS_API_KEY=<openrouteservice-key>`

## Submission Assets

- Recruiter-ready message template: `SUBMISSION_TEMPLATE.md`

## 3-5 Minute Loom Script (Suggested)

1. Intro (20-30s)
   - Problem statement and stack choice (Django + React).
2. Input flow (40-60s)
   - Show all four inputs and submit behavior.
3. Output walkthrough (1.5-2 min)
   - Route map and segment details.
   - Fuel stop and rest assumptions.
   - Daily ELD log sheets and multi-day behavior.
4. Code walkthrough (1-1.5 min)
   - Django endpoint and HOS calculator.
   - React components for form/map/log rendering.
5. Wrap-up (20-30s)
   - Hosted links, assumptions, and trade-offs.
