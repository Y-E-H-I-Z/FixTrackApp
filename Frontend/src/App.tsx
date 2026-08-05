import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Dashboard from './pages/Dashboard.tsx';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- 1. IMPORTAMOS EL COMPONENTE

function App() {
  return (
    <BrowserRouter>
      <CssBaseline /> 
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />  
        <Route path="/register" element={<Register />} /> {/* <-- 2. AÑADIMOS LA RUTA */}
        <Route path="/admin" element={<Dashboard />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;