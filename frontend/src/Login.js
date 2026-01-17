import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/dashboard'); // Redireciona para o dashboard após o login
    } catch (err) {
      console.error('Erro de login:', err);
      setError('Credenciais inválidas. Por favor, tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/brasao-marica.png" alt="Brasão de Maricá" className="login-logo" />
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuário:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;