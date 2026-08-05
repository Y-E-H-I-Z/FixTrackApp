import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Dashboard from './pages/Dashboard'; // <--- Asegúrate de que sea 'Dashboard' con 'D' mayúscula
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <CssBaseline /> 
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />  
        <Route path="/register" element={<Register />} /> 
        <Route path="/admin" element={<Dashboard />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;