import { useState } from "react";
import { planTrip } from "../services/api";

function TripForm({ setTripData }) {
  const [formData, setFormData] = useState({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    cycle_used: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        cycle_used: Number(formData.cycle_used),
      };

      if (Number.isNaN(payload.cycle_used)) {
        setError("Cycle used must be a valid number.");
        return;
      }

      // Helps debug production 400/500 payload issues
      console.log("planTrip payload:", payload);

      const data = await planTrip(payload);

      setTripData(data);
    } catch (err) {
      const data = err.response?.data;
      const message =
        (data && typeof data === "object" && "error" in data && data.error) ||
        (data && typeof data === "object" ? JSON.stringify(data) : null) ||
        err.message ||
        "Failed to plan trip. Check backend/server.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-soft">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Plan Your Trip</h2>
        <p className="text-sm text-slate-400">
          Include city + state for best geocoding accuracy.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        {[
          ["current_location", "Current location", "e.g. Dallas, TX"],
          ["pickup_location", "Pickup location", "e.g. Oklahoma City, OK"],
          ["dropoff_location", "Dropoff location", "e.g. Denver, CO"],
        ].map(([name, label, placeholder]) => (
          <label key={name} className="space-y-2">
            <span className="text-sm text-slate-300">{label}</span>
            <input
              type="text"
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 p-3 outline-none transition focus:border-blue-500"
            />
          </label>
        ))}

        <label className="space-y-2">
          <span className="text-sm text-slate-300">Current cycle used (hrs)</span>
          <input
            type="number"
            name="cycle_used"
            min="0"
            max="70"
            step="0.5"
            placeholder="0"
            value={formData.cycle_used}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 p-3 outline-none transition focus:border-blue-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-900"
        >
          {loading ? "Planning route and logs..." : "Generate route + ELD logs"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/50 bg-red-950/40 p-3 font-medium text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export default TripForm;