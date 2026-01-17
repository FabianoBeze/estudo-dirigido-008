import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Unidades.css';

// Função para decodificar o token JWT e verificar a expiração
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000; // tempo atual em segundos
        return decodedToken.exp < currentTime;
    } catch (e) {
        console.error("Erro ao decodificar token:", e);
        return true; // Token malformado ou outro erro
    }
};

// Função para renovar o token de acesso
const refreshAccessToken = async (refreshToken, navigate) => {
    try {
        const response = await fetch('http://localhost:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            // Se a renovação falhar, o refresh token também pode ter expirado ou ser inválido
            throw new Error('Falha ao renovar o token. Por favor, faça login novamente.');
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
    } catch (error) {
        console.error('Erro ao renovar token:', error);
        // Em caso de falha na renovação, limpa os tokens e redireciona para o login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
        throw error; // Re-lança o erro para que o chamador saiba que falhou
    }
};

// Função de fetch autenticada que lida com a renovação do token
const authenticatedFetch = async (url, options = {}, navigate) => {
    let token = localStorage.getItem('access_token');
    let refreshToken = localStorage.getItem('refresh_token');

    if (!token || isTokenExpired(token)) {
        if (refreshToken) {
            try {
                token = await refreshAccessToken(refreshToken, navigate);
            } catch (error) {
                // Se a renovação falhar, o erro já foi tratado e o usuário redirecionado
                throw error;
            }
        } else {
            // Não há refresh token, força o login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/login');
            throw new Error('Token de acesso expirado e sem token de refresh. Faça login novamente.');
        }
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };

    // Tenta a requisição com o token (novo ou existente)
    const response = await fetch(url, { ...options, headers });

    // Se a resposta for 401, pode ser que o token tenha expirado entre a verificação e a requisição
    // ou que o refresh token também tenha expirado. Força o re-login.
    if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    return response;
};


function Unidades() {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // Estado para controlar a visibilidade do formulário de adição
  const [newUnidadeNome, setNewUnidadeNome] = useState(''); // Estado para o nome da nova unidade
  const [editingUnidade, setEditingUnidade] = useState(null); // Estado para a unidade sendo editada
  const [editedUnidadeNome, setEditedUnidadeNome] = useState(''); // Estado para o nome da unidade editada
  const navigate = useNavigate();

  const fetchUnidades = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await authenticatedFetch('http://localhost:8000/api/unidades/', {}, navigate);
      const data = await response.json();
      setUnidades(data);
    } catch (err) {
      console.error('Erro ao buscar unidades:', err);
      setError('Não foi possível carregar as unidades.');
      // authenticatedFetch já lida com redirecionamento para login em caso de 401
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnidades();
  }, [navigate]);

  const handleAddUnidade = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await authenticatedFetch('http://localhost:8000/api/unidades/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: newUnidadeNome }),
      }, navigate);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.nome ? errorData.nome[0] : 'Falha ao adicionar unidade.');
      }

      setNewUnidadeNome('');
      setShowAddForm(false);
      fetchUnidades(); // Atualiza a lista de unidades
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (unidade) => {
    setEditingUnidade(unidade);
    setEditedUnidadeNome(unidade.nome);
  };

  const handleUpdateUnidade = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await authenticatedFetch(`http://localhost:8000/api/unidades/${editingUnidade.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: editedUnidadeNome }),
      }, navigate);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.nome ? errorData.nome[0] : 'Falha ao atualizar unidade.');
      }

      setEditingUnidade(null);
      setEditedUnidadeNome('');
      fetchUnidades(); // Atualiza a lista de unidades
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUnidade = async (id) => {
    setError(null);
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
      try {
        const response = await authenticatedFetch(`http://localhost:8000/api/unidades/${id}/`, {
          method: 'DELETE',
        }, navigate);

        if (!response.ok) {
          throw new Error('Falha ao excluir unidade.');
        }

        fetchUnidades(); // Atualiza a lista de unidades
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="unidades-container">Carregando unidades...</div>;
  }

  if (error) {
    return <div className="unidades-container error-message">{error}</div>;
  }

  return (
    <div className="unidades-container">
      <h1>Lista de Unidades</h1>

      {error && <p className="error-message">{error}</p>}

      <button onClick={() => setShowAddForm(!showAddForm)} className="add-button">
        {showAddForm ? 'Cancelar Adição' : 'Adicionar Nova Unidade'}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddUnidade} className="add-edit-form">
          <input
            type="text"
            placeholder="Nome da Unidade"
            value={newUnidadeNome}
            onChange={(e) => setNewUnidadeNome(e.target.value)}
            required
          />
          <button type="submit">Salvar Unidade</button>
        </form>
      )}

      {editingUnidade && (
        <form onSubmit={handleUpdateUnidade} className="add-edit-form">
          <h2>Editar Unidade</h2>
          <input
            type="text"
            value={editedUnidadeNome}
            onChange={(e) => setEditedUnidadeNome(e.target.value)}
            required
          />
          <button type="submit">Atualizar Unidade</button>
          <button type="button" onClick={() => setEditingUnidade(null)}>Cancelar</button>
        </form>
      )}

      {unidades.length === 0 ? (
        <p>Nenhuma unidade encontrada.</p>
      ) : (
        <ul className="unidades-list">
          {unidades.map(unidade => (
            <li key={unidade.id} className="unidade-item">
              {unidade.nome}
              <div>
                <button onClick={() => handleEditClick(unidade)} className="edit-button">Editar</button>
                <button onClick={() => handleDeleteUnidade(unidade.id)} className="delete-button">Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-button">
        Voltar ao Dashboard
      </button>
    </div>
  );
}

export default Unidades;