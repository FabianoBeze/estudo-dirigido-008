import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBox, faPlus, faBuilding, faTags, faSignOutAlt, faDoorOpen } from '@fortawesome/free-solid-svg-icons'; // Adicione faDoorOpen aqui
import './Sidebar.css';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true); // Começa aberto por padrão
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <button onClick={toggleSidebar} className="sidebar-toggle">
                    <FontAwesomeIcon icon={faBars} />
                </button>
                {isOpen && <h2>Patri-Tech</h2>}
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <Link to="/dashboard">
                            <FontAwesomeIcon icon={faBox} />
                            {isOpen && <span>Bens</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/add-bem">
                            <FontAwesomeIcon icon={faPlus} />
                            {isOpen && <span>Adicionar Bem</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/unidades">
                            <FontAwesomeIcon icon={faBuilding} />
                            {isOpen && <span>Unidades</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/categorias"> {/* Novo link para Categorias */}
                            <FontAwesomeIcon icon={faTags} />
                            {isOpen && <span>Categorias</span>}
                        </Link>
                    </li>
                    <li> {/* Descomente este bloco */}
                        <Link to="/salas">
                            <FontAwesomeIcon icon={faDoorOpen} />
                            {isOpen && <span>Salas</span>}
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="logout-button">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            {isOpen && <span>Sair</span>}
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;