import axios from 'axios';

const API_URL = 'https://localhost:7134/api'; // (Asegúrate de que el puerto sea el tuyo)

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