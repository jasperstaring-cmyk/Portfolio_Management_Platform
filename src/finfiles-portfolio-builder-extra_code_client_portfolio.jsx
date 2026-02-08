import React, { useState } from 'react';

// Mock Data - Expanded product list
const MOCK_PRODUCTS = [
  { id: 'MF001', name: 'Vanguard Total Stock Market Index Fund', ticker: 'VTSAX', type: 'Mutual Fund', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.04, aum: 1250000000000, morningstarRating: 5, ytdReturn: 12.5 },
  { id: 'ETF001', name: 'iShares Core U.S. Aggregate Bond ETF', ticker: 'AGG', type: 'ETF', assetClass: 'Fixed Income', category: 'Intermediate Core Bond', region: 'US', riskRating: 2, expenseRatio: 0.03, aum: 94000000000, morningstarRating: 4, ytdReturn: -1.2 },
  { id: 'MF002', name: 'Fidelity International Growth Fund', ticker: 'FIGFX', type: 'Mutual Fund', assetClass: 'Equity', category: 'Foreign Large Growth', region: 'International', riskRating: 5, expenseRatio: 0.89, aum: 12500000000, morningstarRating: 4, ytdReturn: 18.3 },
  { id: 'ETF002', name: 'Invesco QQQ Trust', ticker: 'QQQ', type: 'ETF', assetClass: 'Equity', category: 'Large Growth', region: 'US', riskRating: 5, expenseRatio: 0.20, aum: 245000000000, morningstarRating: 5, ytdReturn: 25.7 },
  { id: 'MF003', name: 'PIMCO Income Fund', ticker: 'PONDX', type: 'Mutual Fund', assetClass: 'Fixed Income', category: 'Multisector Bond', region: 'Global', riskRating: 3, expenseRatio: 0.75, aum: 98000000000, morningstarRating: 5, ytdReturn: 5.8 },
  { id: 'ETF003', name: 'Vanguard FTSE Emerging Markets ETF', ticker: 'VWO', type: 'ETF', assetClass: 'Equity', category: 'Diversified Emerging Mkts', region: 'Emerging', riskRating: 5, expenseRatio: 0.08, aum: 82000000000, morningstarRating: 4, ytdReturn: 8.9 }
];

// Icons
const Icon = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>;
const PlusCircle = () => <Icon d="M12 2 A10 10 0 1 1 2 12 A10 10 0 0 1 12 2 M12 8 L12 16 M8 12 L16 12" />;
const Check = () => <Icon d="M20 6 L9 17 L4 12" />;
const Trash = () => <Icon d="M3 6 L21 6 M19 6 L19 20 A2 2 0 0 1 17 22 L7 22 A2 2 0 0 1 5 20 L5 6 M8 6 L8 4 A2 2 0 0 1 10 2 L14 2 A2 2 0 0 1 16 4 L16 6" />;
const UserPlus = () => <Icon d="M16 21 L16 19 A4 4 0 0 0 12 15 L8 15 A4 4 0 0 0 4 19 L4 21 M12 11 A4 4 0 1 0 12 3 A4 4 0 0 0 12 11 M20 8 L20 14 M23 11 L17 11" />;
const Target = () => <Icon d="M12 22 A10 10 0 1 1 22 12 A10 10 0 0 1 12 22 M12 18 A6 6 0 1 1 18 12 A6 6 0 0 1 12 18 M12 14 A2 2 0 1 1 14 12 A2 2 0 0 1 12 14" />;
const Eye = () => <Icon d="M1 12 C1 12 5 4 12 4 C19 4 23 12 23 12 C23 12 19 20 12 20 C5 20 1 12 1 12 M12 15 A3 3 0 1 1 12 9 A3 3 0 0 1 12 15" />;
const Layers = () => <Icon d="M12 2 L2 7 L12 12 L22 7 L12 2 M2 17 L12 22 L22 17 M2 12 L12 17 L22 12" />;
const ArrowLeft = () => <Icon d="M19 12 L5 12 M12 19 L5 12 L12 5" />;

// Pie Chart Component
const PieChart = ({ data, size = 200 }) => {
  const center = size / 2, radius = size / 2 - 10;
  if (!data?.length) return <svg width={size} height={size}><circle cx={center} cy={center} r={radius} fill="rgba(148,163,184,0.1)"/><text x={center} y={center} textAnchor="middle" fill="#94a3b8" fontSize="14">No data</text></svg>;
  const total = data.reduce((s, i) => s + i.value, 0);
  if (!total) return <svg width={size} height={size}><circle cx={center} cy={center} r={radius} fill="rgba(148,163,184,0.1)"/><text x={center} y={center} textAnchor="middle" fill="#94a3b8" fontSize="14">0%</text></svg>;
  let angle = -90;
  return (
    <svg width={size} height={size}>
      {data.map((item, i) => {
        const a = (item.value / total) * 360;
        const start = angle * Math.PI / 180;
        const end = (angle + a) * Math.PI / 180;
        const x1 = center + radius * Math.cos(start), y1 = center + radius * Math.sin(start);
        const x2 = center + radius * Math.cos(end), y2 = center + radius * Math.sin(end);
        const large = a > 180 ? 1 : 0;
        const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
        angle += a;
        return <path key={i} d={path} fill={item.color} opacity="0.9"/>;
      })}
      <circle cx={center} cy={center} r={radius * 0.5} fill="#1e293b"/>
      <text x={center} y={center - 5} textAnchor="middle" fill="#f1f5f9" fontSize={size > 150 ? "24" : "18"} fontWeight="700">{total.toFixed(0)}%</text>
      <text x={center} y={center + 15} textAnchor="middle" fill="#94a3b8" fontSize={size > 150 ? "12" : "10"}>allocated</text>
    </svg>
  );
};

function App() {
  // Portfolios State
  const [portfolios] = useState([
    { id: 'P1', name: 'Conservative Growth', description: 'Low-risk capital preservation', riskLevel: 'Conservative', holdings: [{ productId: 'ETF001', weight: 60 }, { productId: 'MF001', weight: 30 }, { productId: 'MF003', weight: 10 }] },
    { id: 'P2', name: 'Balanced Moderate', description: 'Growth and stability mix', riskLevel: 'Moderate', holdings: [{ productId: 'MF001', weight: 50 }, { productId: 'ETF001', weight: 40 }, { productId: 'MF002', weight: 10 }] },
    { id: 'P3', name: 'Aggressive Growth', description: 'High-growth equity focus', riskLevel: 'Aggressive', holdings: [{ productId: 'ETF002', weight: 50 }, { productId: 'MF002', weight: 30 }, { productId: 'MF001', weight: 20 }] }
  ]);

  // Clients State with Goals
  const [clients, setClients] = useState([
    {
      id: 'C1',
      name: 'Robert Johnson',
      email: 'robert.j@email.com',
      riskLevel: 'Moderate',
      riskScore: 12,
      onboardedDate: '2026-01-15',
      goals: [
        { id: 'G1', name: 'Retirement', targetAmount: 1000000, timeHorizon: '20 years', portfolioId: 'P2' },
        { id: 'G2', name: 'Education Fund', targetAmount: 200000, timeHorizon: '10 years', portfolioId: 'P1' }
      ]
    },
    {
      id: 'C2',
      name: 'Jennifer Martinez',
      email: 'jmartinez@email.com',
      riskLevel: 'Aggressive',
      riskScore: 17,
      onboardedDate: '2026-01-22',
      goals: [
        { id: 'G3', name: 'Wealth Building', targetAmount: 500000, timeHorizon: '15 years', portfolioId: 'P3' }
      ]
    }
  ]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showConsolidatedView, setShowConsolidatedView] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '' });
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: 0, timeHorizon: '', portfolioId: '', useCustom: false, customHoldings: [] });

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
  
  const s = {
    input: { width: '100%', padding: '0.75rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.875rem', fontFamily: 'inherit' },
    btn: { padding: '0.875rem 1.5rem', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' },
    card: { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px', padding: '1.5rem' }
  };

  // Helper Functions
  const getConsolidatedPortfolio = (client) => {
    const consolidatedHoldings = {};
    let totalValue = 0;

    client.goals.forEach(goal => {
      const portfolio = portfolios.find(p => p.id === goal.portfolioId);
      if (!portfolio) return;

      const goalValue = goal.targetAmount || 0;
      totalValue += goalValue;

      portfolio.holdings.forEach(holding => {
        const allocatedValue = (holding.weight / 100) * goalValue;
        if (consolidatedHoldings[holding.productId]) {
          consolidatedHoldings[holding.productId] += allocatedValue;
        } else {
          consolidatedHoldings[holding.productId] = allocatedValue;
        }
      });
    });

    return Object.entries(consolidatedHoldings).map(([productId, value]) => ({
      productId,
      weight: totalValue > 0 ? (value / totalValue) * 100 : 0,
      value: value
    }));
  };

  const getConsolidatedAssetAllocation = (client) => {
    const assetClassTotals = {};
    const consolidated = getConsolidatedPortfolio(client);

    consolidated.forEach(holding => {
      const product = MOCK_PRODUCTS.find(p => p.id === holding.productId);
      if (!product) return;

      if (assetClassTotals[product.assetClass]) {
        assetClassTotals[product.assetClass] += holding.weight;
      } else {
        assetClassTotals[product.assetClass] = holding.weight;
      }
    });

    return Object.entries(assetClassTotals).map(([assetClass, weight], i) => ({
      label: assetClass,
      value: weight,
      color: colors[i % colors.length]
    }));
  };

  const saveClient = () => {
    if (!newClient.name || !newClient.email) return alert('Name and email required');
    const newClientObj = {
      ...newClient,
      id: `C${clients.length + 1}`,
      onboardedDate: new Date().toISOString().split('T')[0],
      goals: [],
      riskScore: Math.floor(Math.random() * 15) + 5,
      riskLevel: ['Conservative', 'Moderate', 'Aggressive'][Math.floor(Math.random() * 3)]
    };
    setClients([...clients, newClientObj]);
    setShowCreateClient(false);
    setNewClient({ name: '', email: '' });
    alert(`Client ${newClient.name} onboarded successfully!`);
  };

  const addGoalHolding = () => {
    setNewGoal({ ...newGoal, customHoldings: [...newGoal.customHoldings, { productId: '', weight: 0 }] });
  };

  const updateGoalHolding = (i, k, v) => {
    const holdings = [...newGoal.customHoldings];
    holdings[i][k] = v;
    setNewGoal({ ...newGoal, customHoldings: holdings });
  };

  const removeGoalHolding = (i) => {
    setNewGoal({ ...newGoal, customHoldings: newGoal.customHoldings.filter((_, idx) => idx !== i) });
  };

  const saveGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) return alert('Goal name and target amount required');
    
    if (newGoal.useCustom) {
      const total = newGoal.customHoldings.reduce((s, h) => s + (parseFloat(h.weight) || 0), 0);
      if (Math.abs(total - 100) > 0.01) return alert(`Portfolio must total 100%. Current: ${total.toFixed(1)}%`);
      if (!newGoal.customHoldings.length) return alert('Custom portfolio needs holdings');
    } else {
      if (!newGoal.portfolioId) return alert('Select a model portfolio');
    }

    const goalToAdd = {
      id: `G${Date.now()}`,
      name: newGoal.name,
      targetAmount: newGoal.targetAmount,
      timeHorizon: newGoal.timeHorizon,
      portfolioId: newGoal.useCustom ? null : newGoal.portfolioId,
      customHoldings: newGoal.useCustom ? newGoal.customHoldings : null
    };

    setClients(clients.map(c => 
      c.id === selectedClient.id 
        ? { ...c, goals: [...c.goals, goalToAdd] }
        : c
    ));

    setSelectedClient({ ...selectedClient, goals: [...selectedClient.goals, goalToAdd] });
    setShowAddGoal(false);
    setNewGoal({ name: '', targetAmount: 0, timeHorizon: '', portfolioId: '', useCustom: false, customHoldings: [] });
  };

  const deleteGoal = (goalId) => {
    if (!confirm('Delete this investment goal?')) return;
    setClients(clients.map(c => 
      c.id === selectedClient.id 
        ? { ...c, goals: c.goals.filter(g => g.id !== goalId) }
        : c
    ));
    setSelectedClient({ ...selectedClient, goals: selectedClient.goals.filter(g => g.id !== goalId) });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', color: '#f1f5f9', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
      <nav style={{ background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid rgba(148,163,184,0.1)', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FinFiles Portfolio Builder - Client Management Demo
          </h1>
        </div>
      </nav>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {!selectedClient ? (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Client Portfolio Management</h2>
                <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Onboard clients and build goal-based portfolios</p>
              </div>
              {!showCreateClient && (
                <button onClick={() => setShowCreateClient(true)} style={s.btn}>
                  <UserPlus />Onboard Client
                </button>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginBottom: '0.5rem', fontWeight: 600 }}>TOTAL CLIENTS</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{clients.length}</div>
              </div>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 600 }}>INVESTMENT GOALS</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{clients.reduce((sum, c) => sum + c.goals.length, 0)}</div>
              </div>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginBottom: '0.5rem', fontWeight: 600 }}>TOTAL AUM</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>${(clients.reduce((sum, c) => sum + c.goals.reduce((gsum, g) => gsum + g.targetAmount, 0), 0) / 1000000).toFixed(1)}M</div>
              </div>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginBottom: '0.5rem', fontWeight: 600 }}>AVG GOALS/CLIENT</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{clients.length ? (clients.reduce((sum, c) => sum + c.goals.length, 0) / clients.length).toFixed(1) : '0'}</div>
              </div>
            </div>

            {/* Create Client Form */}
            {showCreateClient && (
              <div style={{ ...s.card, marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Onboard New Client</h3>
                <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Client Name *</label>
                    <input type="text" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} placeholder="e.g., John Smith" style={s.input} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Email Address *</label>
                    <input type="email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} placeholder="john.smith@email.com" style={s.input} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => { setShowCreateClient(false); setNewClient({ name: '', email: '' }); }} style={{ flex: 1, padding: '0.875rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                  <button onClick={saveClient} style={{ flex: 1, ...s.btn }}><Check />Save Client</button>
                </div>
              </div>
            )}

            {/* Client List */}
            {!showCreateClient && (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {clients.map(client => {
                  const totalInvested = client.goals.reduce((sum, g) => sum + g.targetAmount, 0);
                  
                  return (
                    <div key={client.id} style={s.card} onClick={() => setSelectedClient(client)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', cursor: 'pointer' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700 }}>
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>{client.name}</h3>
                              <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>{client.email}</div>
                            </div>
                            {client.riskLevel && (
                              <span style={{ 
                                padding: '0.25rem 0.75rem', 
                                background: client.riskLevel === 'Conservative' ? 'rgba(16,185,129,0.1)' : client.riskLevel === 'Moderate' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', 
                                border: `1px solid ${client.riskLevel === 'Conservative' ? 'rgba(16,185,129,0.3)' : client.riskLevel === 'Moderate' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`, 
                                borderRadius: '6px', 
                                fontSize: '0.75rem', 
                                fontWeight: 600, 
                                color: client.riskLevel === 'Conservative' ? '#10b981' : client.riskLevel === 'Moderate' ? '#f59e0b' : '#ef4444' 
                              }}>
                                {client.riskLevel} • Score: {client.riskScore}
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Investment Goals</div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{client.goals.length} {client.goals.length === 1 ? 'goal' : 'goals'}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Total Target</div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>${(totalInvested / 1000).toFixed(0)}K</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Onboarded</div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{new Date(client.onboardedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            </div>
                          </div>
                        </div>
                        <div style={{ marginLeft: '2rem' }}>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedClient(client); }} style={{ padding: '0.5rem 1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Eye />View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* CLIENT DETAIL VIEW */
          <div>
            {/* Back Button & Header */}
            <div style={{ marginBottom: '2rem' }}>
              <button onClick={() => { setSelectedClient(null); setShowConsolidatedView(false); }} style={{ padding: '0.5rem 1rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft />Back to Clients
              </button>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700 }}>
                      {selectedClient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>{selectedClient.name}</h2>
                      <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>{selectedClient.email}</p>
                    </div>
                    {selectedClient.riskLevel && (
                      <span style={{ 
                        padding: '0.5rem 1rem', 
                        background: selectedClient.riskLevel === 'Conservative' ? 'rgba(16,185,129,0.1)' : selectedClient.riskLevel === 'Moderate' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', 
                        border: `1px solid ${selectedClient.riskLevel === 'Conservative' ? 'rgba(16,185,129,0.3)' : selectedClient.riskLevel === 'Moderate' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`, 
                        borderRadius: '8px', 
                        fontSize: '0.875rem', 
                        fontWeight: 600, 
                        color: selectedClient.riskLevel === 'Conservative' ? '#10b981' : selectedClient.riskLevel === 'Moderate' ? '#f59e0b' : '#ef4444' 
                      }}>
                        {selectedClient.riskLevel} Risk • Score: {selectedClient.riskScore}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {selectedClient.goals.length > 0 && (
                    <button 
                      onClick={() => setShowConsolidatedView(!showConsolidatedView)} 
                      style={{ 
                        padding: '0.75rem 1.25rem', 
                        background: showConsolidatedView ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)', 
                        border: '1px solid rgba(139,92,246,0.3)', 
                        borderRadius: '8px', 
                        color: '#a78bfa', 
                        cursor: 'pointer', 
                        fontWeight: 600, 
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Layers />
                      {showConsolidatedView ? 'View Individual Goals' : 'View Consolidated Portfolio'}
                    </button>
                  )}
                  {!showAddGoal && !showConsolidatedView && (
                    <button onClick={() => setShowAddGoal(true)} style={{ ...s.btn, padding: '0.75rem 1.25rem' }}>
                      <PlusCircle />Add Investment Goal
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Consolidated Portfolio View */}
            {showConsolidatedView && selectedClient.goals.length > 0 && (
              <div style={{ ...s.card, marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers />
                  Consolidated Portfolio Overview
                </h3>
                <p style={{ margin: '0 0 2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                  Total exposure across all {selectedClient.goals.length} investment {selectedClient.goals.length === 1 ? 'goal' : 'goals'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  {/* Asset Class Breakdown */}
                  <div>
                    <h4 style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>CONSOLIDATED ASSET ALLOCATION</h4>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                      <PieChart data={getConsolidatedAssetAllocation(selectedClient)} size={220} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {getConsolidatedAssetAllocation(selectedClient).map((asset, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: asset.color }}></div>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{asset.label}</span>
                          </div>
                          <span style={{ fontSize: '1.125rem', fontWeight: 700, color: asset.color }}>{asset.value.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Consolidated Holdings */}
                  <div>
                    <h4 style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>CONSOLIDATED HOLDINGS</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {getConsolidatedPortfolio(selectedClient)
                        .sort((a, b) => b.weight - a.weight)
                        .map((holding, i) => {
                          const product = MOCK_PRODUCTS.find(p => p.id === holding.productId);
                          if (!product) return null;
                          
                          return (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px' }}>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{product.ticker}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{product.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                  {product.assetClass} • ${(holding.value / 1000).toFixed(0)}K
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6' }}>{holding.weight.toFixed(1)}%</div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Total Portfolio Value</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                            ${(selectedClient.goals.reduce((sum, g) => sum + g.targetAmount, 0) / 1000).toFixed(0)}K
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Unique Holdings</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                            {getConsolidatedPortfolio(selectedClient).length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Goal Form */}
            {showAddGoal && !showConsolidatedView && (
              <div style={{ ...s.card, marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Add Investment Goal</h3>
                
                <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Goal Name *</label>
                    <input type="text" value={newGoal.name} onChange={e => setNewGoal({ ...newGoal, name: e.target.value })} placeholder="e.g., Retirement, Education, Home Purchase" style={s.input} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Target Amount *</label>
                      <input type="number" value={newGoal.targetAmount} onChange={e => setNewGoal({ ...newGoal, targetAmount: parseFloat(e.target.value) || 0 })} placeholder="500000" style={s.input} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Time Horizon</label>
                      <input type="text" value={newGoal.timeHorizon} onChange={e => setNewGoal({ ...newGoal, timeHorizon: e.target.value })} placeholder="e.g., 10 years, 20 years" style={s.input} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={newGoal.useCustom} onChange={e => setNewGoal({ ...newGoal, useCustom: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#94a3b8' }}>Build custom portfolio (instead of using model)</span>
                    </label>

                    {!newGoal.useCustom ? (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Select Model Portfolio *</label>
                        <select value={newGoal.portfolioId} onChange={e => setNewGoal({ ...newGoal, portfolioId: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                          <option value="">Choose a portfolio...</option>
                          {portfolios.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.riskLevel})</option>
                          ))}
                        </select>
                        {newGoal.portfolioId && (() => {
                          const portfolio = portfolios.find(p => p.id === newGoal.portfolioId);
                          return portfolio ? (
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px' }}>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>PREVIEW</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {portfolio.holdings.map((h, i) => {
                                  const prod = MOCK_PRODUCTS.find(p => p.id === h.productId);
                                  return prod ? (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                      <span>{prod.ticker} - {prod.name}</span>
                                      <span style={{ fontWeight: 600, color: '#3b82f6' }}>{h.weight}%</span>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>
                            Custom Holdings ({newGoal.customHoldings.reduce((s, h) => s + (parseFloat(h.weight) || 0), 0).toFixed(1)}% allocated)
                          </h4>
                          <button onClick={addGoalHolding} style={{ padding: '0.5rem 1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <PlusCircle />Add Holding
                          </button>
                        </div>
                        {!newGoal.customHoldings.length ? (
                          <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(15,23,42,0.4)', border: '2px dashed rgba(148,163,184,0.2)', borderRadius: '8px', color: '#64748b', fontSize: '0.875rem' }}>
                            No holdings yet. Click "Add Holding" to build a custom portfolio.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {newGoal.customHoldings.map((h, i) => (
                              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px' }}>
                                <select value={h.productId} onChange={e => updateGoalHolding(i, 'productId', e.target.value)} style={{ ...s.input, cursor: 'pointer', padding: '0.625rem' }}>
                                  <option value="">Select Product</option>
                                  {MOCK_PRODUCTS.map(p => (
                                    <option key={p.id} value={p.id}>{p.ticker} - {p.name}</option>
                                  ))}
                                </select>
                                <input type="number" value={h.weight} onChange={e => updateGoalHolding(i, 'weight', parseFloat(e.target.value))} placeholder="Weight %" min="0" max="100" step="0.1" style={{ ...s.input, padding: '0.625rem' }} />
                                <button onClick={() => removeGoalHolding(i)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}>
                                  <Trash />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => { setShowAddGoal(false); setNewGoal({ name: '', targetAmount: 0, timeHorizon: '', portfolioId: '', useCustom: false, customHoldings: [] }); }} style={{ flex: 1, padding: '0.875rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                  <button onClick={saveGoal} style={{ flex: 1, ...s.btn }}><Check />Save Goal</button>
                </div>
              </div>
            )}

            {/* Goals List */}
            {!showAddGoal && !showConsolidatedView && (
              <div>
                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Investment Goals ({selectedClient.goals.length})</h3>
                {selectedClient.goals.length === 0 ? (
                  <div style={{ ...s.card, padding: '3rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><Target /></div>
                    <p style={{ margin: '0', color: '#64748b' }}>No investment goals yet. Click "Add Investment Goal" to get started.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {selectedClient.goals.map(goal => {
                      const portfolio = goal.customHoldings ? { holdings: goal.customHoldings } : portfolios.find(p => p.id === goal.portfolioId);
                      
                      return (
                        <div key={goal.id} style={s.card}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <Target />
                                <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>{goal.name}</h4>
                                {goal.customHoldings && (
                                  <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, color: '#a78bfa' }}>
                                    Custom
                                  </span>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                                <div>Target: <span style={{ fontWeight: 600, color: '#f1f5f9' }}>${(goal.targetAmount / 1000).toFixed(0)}K</span></div>
                                {goal.timeHorizon && <div>Horizon: <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{goal.timeHorizon}</span></div>}
                              </div>
                            </div>
                            <button onClick={() => deleteGoal(goal.id)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}>
                              <Trash />
                            </button>
                          </div>

                          {portfolio && (
                            <div>
                              <h5 style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>PORTFOLIO ALLOCATION</h5>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {portfolio.holdings.map((h, i) => {
                                  const prod = MOCK_PRODUCTS.find(p => p.id === h.productId);
                                  return prod ? (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px' }}>
                                      <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{prod.ticker}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{prod.name}</div>
                                      </div>
                                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#3b82f6' }}>{h.weight}%</div>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
