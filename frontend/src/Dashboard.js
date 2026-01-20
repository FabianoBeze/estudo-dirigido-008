import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Dashboard.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FaBox, FaBuilding, FaTags, FaDollarSign } from 'react-icons/fa';

function Dashboard() {
  const [bens, setBens] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    axios.get('http://127.0.0.1:8000/api/bens/', config).then(res => setBens(res.data));
    axios.get('http://127.0.0.1:8000/api/unidades/', config).then(res => setUnidades(res.data));
    axios.get('http://127.0.0.1:8000/api/categorias/', config).then(res => setCategorias(res.data));
  }, []);

  // --- CÁLCULOS ---
  const bensAtivos = bens.filter(bem => !bem.data_baixa);

  const valorTotal = bensAtivos.reduce((acc, bem) => {
    return acc + Number(bem.valor || 0);
  }, 0);

  const dadosGrafico = categorias.map(cat => {
    const qtd = bensAtivos.filter(b => b.categoria === cat.id).length;
    return { name: cat.nome, value: qtd };
  }).filter(item => item.value > 0);

  const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // --- FUNÇÃO PARA FORMATAR DATA (O SEGREDO!) ---
  const formatarData = (dataISO) => {
    if (!dataISO) return '-';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR'); // Formata para DD/MM/AAAA
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="content">
        
        <div className="page-header">
            <div>
              <h1>Bem-vindo ao Dashboard!</h1>
              <p>Visão geral dos dados do sistema em tempo real.</p>
            </div>
        </div>

        {/* CARDS */}
        <div className="cards-container">
          <div className="card">
            <div className="card-icon" style={{background: '#e0f2fe', color: '#0284c7'}}>
                <FaBox />
            </div>
            <div className="card-info">
                <span>Total de Bens</span>
                <h3>{bens.length}</h3>
            </div>
          </div>

          <div className="card">
            <div className="card-icon" style={{background: '#dcfce7', color: '#16a34a'}}>
                <FaBuilding />
            </div>
            <div className="card-info">
                <span>Unidades</span>
                <h3>{unidades.length}</h3>
            </div>
          </div>

          <div className="card">
            <div className="card-icon" style={{background: '#ffedd5', color: '#ea580c'}}>
                <FaTags />
            </div>
            <div className="card-info">
                <span>Categorias</span>
                <h3>{categorias.length}</h3>
            </div>
          </div>

          <div className="card">
            <div className="card-icon" style={{background: '#f3e8ff', color: '#9333ea'}}>
                <FaDollarSign />
            </div>
            <div className="card-info">
                <span>Valor Estimado (Ativos)</span>
                <h3 style={{color: '#9333ea'}}>R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>

        {/* PARTE DE BAIXO */}
        <div className="dashboard-bottom">
            
            {/* GRÁFICO */}
            <div className="chart-container">
                <h3>Bens Ativos por Categoria</h3>
                {dadosGrafico.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={dadosGrafico}
                                cx="50%" cy="50%"
                                innerRadius={60} outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {dadosGrafico.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p style={{textAlign:'center', color:'#999', marginTop:'50px'}}>Sem bens ativos para exibir.</p>
                )}
                <div style={{display:'flex', justifyContent:'center', gap:'15px', fontSize:'12px', flexWrap:'wrap'}}>
                    {dadosGrafico.map((entry, index) => (
                        <div key={index} style={{display:'flex', alignItems:'center'}}>
                            <div style={{width:'10px', height:'10px', backgroundColor: CORES[index % CORES.length], marginRight:'5px', borderRadius:'50%'}}></div>
                            {entry.name}: {entry.value}
                        </div>
                    ))}
                </div>
            </div>

            {/* TABELA RECENTES COM DATA */}
            <div className="recent-table">
                <h3>Últimos Bens Cadastrados</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th> {/* Nova Coluna */}
                            <th>Bem</th>
                            <th>Unidade</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bens.slice(-5).reverse().map(bem => (
                            <tr key={bem.id}>
                                {/* Aqui aplicamos a formatação */}
                                <td style={{color:'#666', fontSize:'13px'}}>
                                    {formatarData(bem.criado_em)}
                                </td>
                                <td>{bem.nome}</td>
                                <td>
                                    {unidades.find(u => u.id == bem.unidade)?.nome || '...'}
                                </td>
                                <td>
                                    {bem.data_baixa ? 
                                        <span style={{color:'red', fontSize:'11px', fontWeight:'bold', background:'#fee2e2', padding:'2px 6px', borderRadius:'4px'}}>BAIXADO</span> : 
                                        <span style={{color:'green', fontSize:'11px', fontWeight:'bold', background:'#dcfce7', padding:'2px 6px', borderRadius:'4px'}}>ATIVO</span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;