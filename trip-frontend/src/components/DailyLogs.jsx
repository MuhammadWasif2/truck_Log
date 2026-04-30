const STATUS_ROWS = [
  "Off Duty",
  "Sleeper Berth",
  "Driving",
  "On Duty (Not Driving)",
];

const STATUS_TO_ROW = {
  "Off Duty": "Off Duty",
  Sleeper: "Sleeper Berth",
  "Sleeper Berth": "Sleeper Berth",
  Driving: "Driving",
  "On Duty": "On Duty (Not Driving)",
  Break: "Off Duty",
};

function normalizeStatus(status) {
  return STATUS_TO_ROW[status] || "Off Duty";
}

function buildLogSegments(logEntries = [], tripSummary = {}, fuelStops = [], dayNumber = 1) {
  const segments = [];
  const remarks = [];
  let cursor = 0;
  const dayFuelStops = fuelStops.filter((stop) => stop.day === dayNumber);
  let fuelStopIndex = 0;

  for (const entry of logEntries) {
    if (cursor >= 24) break;

    const duration = Number(entry.hours) || 0;
    if (duration <= 0) continue;

    const next = Math.min(24, cursor + duration);
    const normalizedStatus = normalizeStatus(entry.status);

    segments.push({
      start: cursor,
      end: next,
      status: normalizedStatus,
      rawStatus: entry.status,
    });

    if (entry.remark) {
      let remarkText = entry.remark;
      const lowerRemark = String(entry.remark).toLowerCase();
      if (lowerRemark.includes("pickup") && tripSummary.pickup_location) {
        remarkText = `${entry.remark} - ${tripSummary.pickup_location}`;
      } else if (lowerRemark.includes("dropoff") && tripSummary.dropoff_location) {
        remarkText = `${entry.remark} - ${tripSummary.dropoff_location}`;
      } else if (lowerRemark.includes("fuel")) {
        const stop = dayFuelStops[fuelStopIndex];
        fuelStopIndex += 1;
        if (stop?.miles !== undefined) {
          remarkText = `${entry.remark} - Mile ${stop.miles}`;
        }
      }

      remarks.push({ text: remarkText, time: cursor });
    }

    cursor = next;
  }

  if (cursor < 24) {
    segments.push({
      start: cursor,
      end: 24,
      status: "Off Duty",
      rawStatus: "Off Duty",
    });
  }

  return { segments, remarks };
}

function buildStepPath(segments) {
  if (!segments.length) return "";

  const xScale = (hour) => (hour / 24) * 960;
  const yScale = (status) => {
    const idx = STATUS_ROWS.indexOf(status);
    return idx * 64 + 32;
  };

  let path = `M ${xScale(segments[0].start)} ${yScale(segments[0].status)}`;

  segments.forEach((segment, index) => {
    const xEnd = xScale(segment.end);
    const yCurrent = yScale(segment.status);
    path += ` L ${xEnd} ${yCurrent}`;

    const next = segments[index + 1];
    if (next) {
      const yNext = yScale(next.status);
      path += ` L ${xEnd} ${yNext}`;
    }
  });

  return path;
}

function splitRemarkText(text) {
  const [reasonPart, ...locationParts] = String(text).split(" - ");
  const reason = reasonPart?.trim() || "Event";
  const city = locationParts.join(" - ").trim() || "";
  return { reason, city };
}

function DailyLogs({ dailyLogs, tripSummary, fuelStops = [] }) {
  return (
    <section className="mt-10">
      <h2 className="mb-6 text-3xl font-bold">Daily ELD Log Sheets</h2>

      <div className="space-y-6">
        {dailyLogs.map((day) => {
          const { segments, remarks } = buildLogSegments(
            day.log,
            tripSummary,
            fuelStops,
            day.day,
          );
          const stepPath = buildStepPath(segments);

          return (
            <article
              key={day.day}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-2xl font-bold">Day {day.day}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                  <span>Driving: {day.total_driving_hours} hrs</span>
                  <span>On Duty: {day.total_on_duty_hours} hrs</span>
                  <span>Cycle Used: {day.cycle_used} hrs</span>
                </div>
              </div>

              <div className="mb-5 overflow-visible rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
                  <div />
                  <div
                    className="mb-2 grid text-[11px] text-slate-400"
                    style={{ gridTemplateColumns: "repeat(25, minmax(0, 1fr))" }}
                  >
                    {Array.from({ length: 25 }, (_, hour) => (
                      <span key={`hour-${day.day}-${hour}`} className="text-center">
                        {hour === 0 ? "Midnight" : hour === 12 ? "Noon" : hour}
                      </span>
                    ))}
                  </div>

                  <div>
                    <div className="pr-2">
                      <div className="grid h-[256px] grid-rows-4 text-sm text-slate-300">
                        {STATUS_ROWS.map((row) => (
                          <div
                            key={`${day.day}-row-${row}`}
                            className="flex items-center justify-end border-b border-slate-800 pr-2"
                          >
                            {row}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <svg
                    viewBox="0 0 960 256"
                    className="h-[256px] w-full"
                    role="img"
                    preserveAspectRatio="none"
                    aria-label={`Day ${day.day} ELD graph`}
                  >
                    {Array.from({ length: 5 }, (_, idx) => (
                      <line
                        key={`h-${day.day}-${idx}`}
                        x1="0"
                        y1={idx * 64}
                        x2="960"
                        y2={idx * 64}
                        stroke="#334155"
                        strokeWidth="1"
                      />
                    ))}

                    {Array.from({ length: 25 }, (_, hour) => (
                      <line
                        key={`v-${day.day}-${hour}`}
                        x1={(hour / 24) * 960}
                        y1="0"
                        x2={(hour / 24) * 960}
                        y2="256"
                        stroke="#475569"
                        strokeWidth={hour % 2 === 0 ? 1 : 0.5}
                      />
                    ))}

                    <path
                      d={stepPath}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="pr-2 pt-2 text-right text-sm text-slate-300">Remarks</div>
                  <div className="relative h-24 w-full border border-slate-800 overflow-visible">
                      {Array.from({ length: 25 }, (_, hour) => (
                        <div
                          key={`remark-grid-${day.day}-${hour}`}
                          className="absolute top-0 h-full border-r border-slate-800/70"
                          style={{ left: `${(hour / 24) * 100}%` }}
                        />
                      ))}

                      {remarks.map((remark, idx) => {
                        const { reason, city } = splitRemarkText(remark.text);
                        const timePercent = (remark.time / 24) * 100;
                        const safeLeft = Math.min(92, Math.max(8, timePercent));
                        let translateClass = "-translate-x-1/2";
                        if (timePercent < 8) translateClass = "translate-x-0";
                        if (timePercent > 92) translateClass = "-translate-x-full";

                        return (
                          <div
                            key={`${day.day}-remark-${idx}`}
                            className={`absolute ${translateClass} text-[11px] text-blue-300`}
                            style={{ left: `${safeLeft}%`, top: "6px" }}
                            title={`${remark.time.toFixed(2)}h - ${remark.text}`}
                          >
                            <div className="h-5 w-[2px] bg-blue-300 mx-auto" />
                            <div className="mt-1 flex items-center gap-2 whitespace-nowrap">
                              {city ? (
                                <span className="text-right text-blue-200">
                                  {city}
                                </span>
                              ) : null}
                              <span className="font-semibold">{reason}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {day.log.map((entry, index) => (
                  <div
                    key={`${day.day}-${index}`}
                    className="flex flex-wrap justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3"
                  >
                    <div className="text-sm">
                      <span className="font-semibold">{entry.status}</span>
                      {entry.remark ? (
                        <span className="ml-2 text-slate-400">({entry.remark})</span>
                      ) : null}
                    </div>
                    <div className="text-sm text-slate-300">
                      {entry.hours} hrs
                      {entry.miles ? ` | ${entry.miles} mi` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
  }

export default DailyLogs;