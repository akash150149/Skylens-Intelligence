import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const fetchWeather = async (icao) => {
  const response = await api.get(`/weather/${icao}`);
  return response.data;
};

export const decodeChart = async (formData) => {
  const response = await api.post('/decode-chart', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const searchAirports = async (query) => {
  const response = await api.get(`/airports/search?q=${query}`);
  return response.data;
};

export default api;
