import axios from 'axios';

// Vite leerá la variable de internet, y si no la encuentra (como en tu PC), usará localhost
const API_URL = import.meta.env.VITE_API_URL || 'https://fixtrack-api.onrender.com/'; 

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Se ejecuta ANTES de cada petición al backend
api.interceptors.request.use((config) => {
  // Buscamos si hay un token guardado en el navegador
  const token = localStorage.getItem('token');
  
  if (token) {
    // Si existe, lo añadimos a la cabecera de Autorización
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});