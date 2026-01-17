import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Dashboard from './Dashboard';
import AddBem from './AddBem';
import Unidades from './Unidades';
import Categorias from './Categorias'; // Adicione esta linha
import Salas from './Salas'; // Adicione esta linha

// Componente PrivateRoute para proteger rotas que exigem autenticação
const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('access_token');
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/add-bem" element={<PrivateRoute element={<AddBem />} />} />
        <Route path="/unidades" element={<PrivateRoute element={<Unidades />} />} />
        <Route path="/categorias" element={<PrivateRoute element={<Categorias />} />} /> {/* Descomente esta linha */}
        <Route path="/salas" element={<PrivateRoute element={<Salas />} />} /> {/* Descomente esta linha */}
      </Routes>
    </Router>
  );
}

export default App;