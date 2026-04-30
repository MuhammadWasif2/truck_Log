# Trip Frontend (React + Vite)

Frontend for the Truck Trip Planner and ELD Log Generator assessment.

## Features

- Trip input form:
  - Current location
  - Pickup location
  - Dropoff location
  - Current cycle used (hours)
- Route map with two legs (current -> pickup -> dropoff)
- Fuel and rest context summary
- Multi-day ELD-style daily log sheet rendering

## Local Setup

1. Install dependencies:
   - `npm install`
2. Create env file:
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` if backend is not local
3. Run app:
   - `npm run dev`

## Build and Lint

- `npm run build`
- `npm run lint`

## Deployment (Vercel)

1. Import `trip-frontend` project in Vercel.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variable:
   - `VITE_API_BASE_URL=https://your-backend-domain/api`
