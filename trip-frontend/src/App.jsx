import { useState } from "react";
import TripForm from "./components/TripForm";
import SummaryCards from "./components/SummaryCards";
import RouteMap from "./components/RouteMap";
import DailyLogs from "./components/DailyLogs";

function App() {
  const [tripData, setTripData] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-blue-300">
            Property-Carrying | 70hrs/8days
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Truck Trip Planner and ELD Log Generator
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Plan compliant routes with required rest and fueling assumptions,
            then generate multi-day ELD-ready log sheets for dispatch and
            review.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <TripForm setTripData={setTripData} />

        {tripData && (
          <>
            <SummaryCards tripData={tripData} />
            <RouteMap
              route={tripData.route}
              fuelStops={tripData.fuel_stops}
              dailyLogs={tripData.daily_logs}
            />
            <DailyLogs
              dailyLogs={tripData.daily_logs}
              tripSummary={tripData.trip_summary}
              fuelStops={tripData.fuel_stops}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;