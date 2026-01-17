import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticatedFetch } from './auth';
import './Categorias.css';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoriaNome, setNewCategoriaNome] = useState('');
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [editedCategoriaNome, setEditedCategoriaNome] = useState('');
  const navigate = useNavigate();

  const fetchCategorias = useCallback(async () => {
    console.log("Attempting to fetch categories...");
    setError(null); // Limpa erros anteriores
    try {
      const response = await authenticatedFetch('http://localhost:8000/api/categorias/', {}, navigate);
      const data = await response.json();
      setCategorias(data);
      console.log("Categories fetched successfully:", data);
      setLoading(false); // Adicionado para parar o estado de carregamento
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Erro ao carregar categorias. Por favor, tente novamente.");
      setLoading(false); // Adicionado para parar o estado de carregamento em caso de erro
    }
  }, [navigate]);

  useEffect(() => {
    fetchCategorias();
  }, [navigate, fetchCategorias]);

  const handleAddCategoria = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await authenticatedFetch('http://localhost:8000/api/categorias/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: newCategoriaNome }),
      }, navigate);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.nome ? errorData.nome[0] : 'Falha ao adicionar categoria.');
      }

      setNewCategoriaNome('');
      setShowAddForm(false);
      fetchCategorias();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (categoria) => {
    setEditingCategoria(categoria);
    setEditedCategoriaNome(categoria.nome);
  };

  const handleUpdateCategoria = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await authenticatedFetch(`http://localhost:8000/api/categorias/${editingCategoria.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: editedCategoriaNome }),
      }, navigate);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.nome ? errorData.nome[0] : 'Falha ao atualizar categoria.');
      }

      setEditingCategoria(null);
      setEditedCategoriaNome('');
      fetchCategorias();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategoria = async (id) => {
    setError(null);
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        const response = await authenticatedFetch(`http://localhost:8000/api/categorias/${id}/`, {
          method: 'DELETE',
        }, navigate);

        if (!response.ok) {
          throw new Error('Falha ao excluir categoria.');
        }

        fetchCategorias();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="categorias-container">Carregando categorias...</div>;
  }

  if (error) {
    return (
      <div className="categorias-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/login')} className="back-to-dashboard-button">
          Ir para Login
        </button>
      </div>
    );
  }

  return (
    <div className="categorias-container">
      <h1>Lista de Categorias</h1>

      {error && <p className="error-message">{error}</p>}

      <button onClick={() => setShowAddForm(!showAddForm)} className="add-button">
        {showAddForm ? 'Cancelar Adição' : 'Adicionar Nova Categoria'}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddCategoria} className="add-edit-form">
          <input
            type="text"
            placeholder="Nome da Categoria"
            value={newCategoriaNome}
            onChange={(e) => setNewCategoriaNome(e.target.value)}
            required
          />
          <button type="submit">Salvar Categoria</button>
        </form>
      )}

      {editingCategoria && (
        <form onSubmit={handleUpdateCategoria} className="add-edit-form">
          <h2>Editar Categoria</h2>
          <input
            type="text"
            value={editedCategoriaNome}
            onChange={(e) => setEditedCategoriaNome(e.target.value)}
            required
          />
          <button type="submit">Atualizar Categoria</button>
          <button type="button" onClick={() => setEditingCategoria(null)}>Cancelar</button>
        </form>
      )}

      {categorias.length === 0 ? (
        <p>Nenhuma categoria encontrada.</p>
      ) : (
        <ul className="categorias-list">
          {categorias.map(categoria => (
            <li key={categoria.id} className="categoria-item">
              {categoria.nome}
              <div>
                <button onClick={() => handleEditClick(categoria)} className="edit-button">Editar</button>
                <button onClick={() => handleDeleteCategoria(categoria.id)} className="delete-button">Excluir</button>
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

export default Categorias;