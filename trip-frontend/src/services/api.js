import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
});

export const planTrip = async (tripData) => {
  const response = await API.post("/plan-trip/", tripData);
  return response.data;
};