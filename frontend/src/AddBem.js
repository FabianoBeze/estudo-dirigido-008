import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticatedFetch } from './auth'; // Importar de auth.js
import './AddBem.css';

function AddBem() {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [numero_patrimonio, setNumeroPatrimonio] = useState('');
    const [categoria_id, setCategoriaId] = useState('');
    const [unidade_id, setUnidadeId] = useState('');
    const [sala_id, setSalaId] = useState(''); // Novo estado para o ID da sala
    const [data_aquisicao, setDataAquisicao] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [salas, setSalas] = useState([]); // Novo estado para a lista de salas
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOptions = async () => {
            setError(''); // Limpa erros anteriores ao tentar buscar opções
            try {
                // Buscar Categorias usando authenticatedFetch
                const categoriasResponse = await authenticatedFetch('http://localhost:8000/api/categorias/', {}, navigate);
                const categoriasData = await categoriasResponse.json();
                setCategorias(categoriasData);

                // Buscar Unidades usando authenticatedFetch
                const unidadesResponse = await authenticatedFetch('http://localhost:8000/api/unidades/', {}, navigate);
                const unidadesData = await unidadesResponse.json();
                setUnidades(unidadesData);

                // Buscar Salas usando authenticatedFetch
                const salasResponse = await authenticatedFetch('http://localhost:8000/api/salas/', {}, navigate);
                const salasData = await salasResponse.json();
                setSalas(salasData);

            } catch (err) {
                setError(err.message);
                // Se o erro for de autenticação, navigate já foi chamado por authenticatedFetch
            }
        };

        fetchOptions();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await authenticatedFetch('http://localhost:8000/api/bens/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    descricao,
                    numero_patrimonio,
                    categoria: categoria_id,
                    unidade: unidade_id,
                    sala: sala_id || null, // Inclui sala_id, ou null se não for selecionado (já que é opcional no modelo)
                    data_aquisicao,
                }),
            }, navigate);

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.detail || JSON.stringify(errorData);
                throw new Error(errorMessage || 'Falha ao adicionar bem.');
            }

            setSuccess('Bem adicionado com sucesso!');
            // Limpar formulário
            setNome('');
            setDescricao('');
            setNumeroPatrimonio('');
            setCategoriaId('');
            setUnidadeId('');
            setSalaId(''); // Limpa o estado da sala também
            setDataAquisicao('');
            // Opcional: redirecionar para o dashboard após adicionar
            // navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="add-bem-container">
            <h2>Adicionar Novo Bem</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="descricao">Descrição:</label>
                    <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="numero_patrimonio">Número de Patrimônio:</label>
                    <input
                        type="text"
                        id="numero_patrimonio"
                        value={numero_patrimonio}
                        onChange={(e) => setNumeroPatrimonio(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="categoria">Categoria:</label>
                    <select
                        id="categoria"
                        value={categoria_id}
                        onChange={(e) => setCategoriaId(e.target.value)}
                        required
                    >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="unidade">Unidade:</label>
                    <select
                        id="unidade"
                        value={unidade_id}
                        onChange={(e) => setUnidadeId(e.target.value)}
                        required
                    >
                        <option value="">Selecione uma unidade</option>
                        {unidades.map((uni) => (
                            <option key={uni.id} value={uni.id}>
                                {uni.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="sala">Sala:</label>
                    <select
                        id="sala"
                        value={sala_id}
                        onChange={(e) => setSalaId(e.target.value)}
                        // O campo sala é opcional no seu modelo Django (null=True, blank=True),
                        // então não o tornaremos 'required' aqui.
                    >
                        <option value="">Selecione uma sala (Opcional)</option>
                        {salas.map((sal) => (
                            <option key={sal.id} value={sal.id}>
                                {sal.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="data_aquisicao">Data de Aquisição:</label>
                    <input
                        type="date"
                        id="data_aquisicao"
                        value={data_aquisicao}
                        onChange={(e) => setDataAquisicao(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Adicionar Bem</button>
            </form>
            <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-button">
                Voltar ao Dashboard
            </button>
        </div>
    );
}

export default AddBem;