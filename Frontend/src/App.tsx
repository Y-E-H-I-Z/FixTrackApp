import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Navbar from './components/Navbar'; // <-- 1. Importamos el Navbar
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <CssBaseline /> 
      <Navbar /> {/* <-- 2. Lo ponemos aquí para que esté visible globalmente */}
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