function SummaryCards({ tripData }) {
  const summary = tripData.trip_summary;
  const driveHours = summary.estimated_driving_hours || 0;
  const fuelStops = tripData.fuel_stops?.length || 0;
  const dailyLogs = tripData.daily_logs?.length || 0;
  const restStops = Math.max(0, dailyLogs - 1);

  const cards = [
    {
      label: "Total Distance",
      value: `${summary.total_distance_miles} mi`,
      hint: "Combined pickup + dropoff route",
    },
    {
      label: "Driving Hours",
      value: `${driveHours} hrs`,
      hint: "Estimated wheel time",
    },
    {
      label: "Estimated Days",
      value: `${summary.estimated_days}`,
      hint: "Based on HOS assumptions",
    },
    {
      label: "Fuel Stops",
      value: `${fuelStops}`,
      hint: "At least once every 1,000 miles",
    },
    {
      label: "Rest Periods",
      value: `${restStops}`,
      hint: "10-hour off-duty resets",
    },
    {
      label: "Daily Log Sheets",
      value: `${dailyLogs}`,
      hint: "Auto-generated ELD pages",
    },
  ];

  return (
    <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-soft"
        >
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {card.label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{card.value}</p>
          <p className="mt-2 text-sm text-slate-400">{card.hint}</p>
        </article>
      ))}
    </section>
  );
}

export default SummaryCards;
