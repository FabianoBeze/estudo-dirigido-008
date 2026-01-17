import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from './Sidebar'; // Importe o componente Sidebar

function Dashboard() {
  const [bens, setBens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBens = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8000/api/bens/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setBens(response.data);
      } catch (err) {
        console.error('Erro ao buscar bens:', err);
        setError('Não foi possível carregar os bens.');
        if (err.response && err.response.status === 401) {
          navigate('/login'); // Redireciona para login se o token for inválido/expirado
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBens();
  }, [navigate]);

  if (loading) {
    return <div className="dashboard-content">Carregando bens...</div>;
  }

  if (error) {
    return <div className="dashboard-content error-message">{error}</div>;
  }

  return (
    <div className="app-container"> {/* Um container geral para o layout */}
      <Sidebar /> {/* Renderiza a barra lateral */}
      <div className="dashboard-content"> {/* Conteúdo principal do dashboard */}
        <h1>Bem-vindo ao Dashboard!</h1>
        <p className="welcome-message">Você está logado com sucesso.</p>

        <div className="bens-list-section">
          <h2>Bens Cadastrados</h2>
          {bens.length === 0 ? (
            <p>Nenhum bem cadastrado ainda.</p>
          ) : (
            <ul className="bens-list">
              {bens.map(bem => (
                <li key={bem.id} className="bem-item">
                  <strong>Nome:</strong> {bem.nome}<br />
                  <strong>Descrição:</strong> {bem.descricao}<br />
                  <strong>Unidade:</strong> {bem.unidade_nome || bem.unidade}<br /> {/* Ajuste para exibir nome ou ID */}
                  <strong>Sala:</strong> {bem.sala_nome || bem.sala}<br /> {/* Ajuste para exibir nome ou ID */}
                  <strong>Categoria:</strong> {bem.categoria_nome || bem.categoria}<br /> {/* Ajuste para exibir nome ou ID */}
                  <strong>Status:</strong> {bem.status_nome || bem.status} {/* Ajuste para exibir nome ou ID */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;