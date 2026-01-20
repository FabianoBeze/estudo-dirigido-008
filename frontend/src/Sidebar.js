import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaBox, FaBuilding, FaTags, FaDoorOpen, FaSignOutAlt, FaUserTie } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove o token e redireciona para login
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  // Função para verificar se o link está ativo (para ficar azul)
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Patri-Tech</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <Link to="/dashboard" className={isActive('/dashboard')}>
            <li>
              <FaHome /> <span>Dashboard</span>
            </li>
          </Link>

          <Link to="/bens" className={isActive('/bens')}>
            <li>
              <FaBox /> <span>Bens</span>
            </li>
          </Link>

          <Link to="/unidades" className={isActive('/unidades')}>
            <li>
              <FaBuilding /> <span>Unidades</span>
            </li>
          </Link>

          <Link to="/categorias" className={isActive('/categorias')}>
            <li>
              <FaTags /> <span>Categorias</span>
            </li>
          </Link>

          <Link to="/salas" className={isActive('/salas')}>
            <li>
              <FaDoorOpen /> <span>Salas</span>
            </li>
          </Link>

          {/* --- NOVO ITEM: GESTORES --- */}
          <Link to="/add-gestor" className={isActive('/add-gestor')}>
            <li>
              <FaUserTie /> <span>Gestores</span>
            </li>
          </Link>

        </ul>
      </nav>

      {/* Botão de Sair (Fica lá embaixo) */}
      <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;