import { MapContainer, Polyline, TileLayer } from "react-leaflet";

function decodePolyline(encoded) {
  let points = [];
  let index = 0,
    lat = 0,
    lng = 0;

  while (index < encoded.length) {
    let b,
      shift = 0,
      result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    let dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    let dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

function RouteMap({ route, fuelStops = [], dailyLogs = [] }) {
  const leg1Coords = decodePolyline(route.leg1.geometry);
  const leg2Coords = decodePolyline(route.leg2.geometry);
  const fullRoute = [...leg1Coords, ...leg2Coords];
  const restingNights = Math.max(0, dailyLogs.length - 1);
  const totalRouteMiles = (
    (route.leg1.distance_miles || 0) + (route.leg2.distance_miles || 0)
  ).toFixed(2);

  return (
    <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-bold">Route and Stops</h2>
        <p className="text-sm text-slate-400">
          Free map tiles by OpenStreetMap and route from OpenRouteService
        </p>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs uppercase text-slate-400">Leg 1</p>
          <p className="font-semibold">{route.leg1.distance_miles.toFixed(2)} mi</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs uppercase text-slate-400">Leg 2</p>
          <p className="font-semibold">{route.leg2.distance_miles.toFixed(2)} mi</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs uppercase text-slate-400">Fuel Stops</p>
          <p className="font-semibold">{fuelStops.length}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs uppercase text-slate-400">Overnight Rests</p>
          <p className="font-semibold">{restingNights}</p>
        </div>
      </div>

      <MapContainer center={fullRoute[0]} zoom={5} scrollWheelZoom className="h-[460px] w-full rounded-xl">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={leg1Coords} pathOptions={{ color: "#38bdf8", weight: 5 }} />
        <Polyline positions={leg2Coords} pathOptions={{ color: "#22c55e", weight: 5 }} />
      </MapContainer>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Fueling Plan
          </h3>
          {fuelStops.length === 0 ? (
            <p className="text-sm text-slate-400">
              No fueling stop required for this total distance.
            </p>
          ) : (
            <ul className="space-y-1 text-sm text-slate-200">
              {fuelStops.map((stop, idx) => (
                <li key={`${stop.day}-${idx}`}>
                  Day {stop.day}: around mile {stop.miles}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Route Snapshot
          </h3>
          <p className="text-sm text-slate-200">
            Total mapped distance: {totalRouteMiles} miles. Blue segment covers
            current to pickup, and green segment covers pickup to dropoff.
          </p>
        </div>
      </div>
    </section>
  );
}

export default RouteMap;