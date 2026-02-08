import React, { useState } from 'react';

const Icon = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>;
const PlusCircle = () => <Icon d="M12 2 A10 10 0 1 1 2 12 A10 10 0 0 1 12 2 M12 8 L12 16 M8 12 L16 12" />;
const Check = () => <Icon d="M20 6 L9 17 L4 12" />;
const Trash = () => <Icon d="M3 6 L21 6 M19 6 L19 20 A2 2 0 0 1 17 22 L7 22 A2 2 0 0 1 5 20 L5 6 M8 6 L8 4 A2 2 0 0 1 10 2 L14 2 A2 2 0 0 1 16 4 L16 6" />;
const UserPlus = () => <Icon d="M16 21 L16 19 A4 4 0 0 0 12 15 L8 15 A4 4 0 0 0 4 19 L4 21 M12 11 A4 4 0 1 0 12 3 A4 4 0 0 0 12 11 M20 8 L20 14 M23 11 L17 11" />;
const Target = () => <Icon d="M12 22 A10 10 0 1 1 22 12 A10 10 0 0 1 12 22 M12 18 A6 6 0 1 1 18 12 A6 6 0 0 1 12 18 M12 14 A2 2 0 1 1 14 12 A2 2 0 0 1 12 14" />;
const Eye = () => <Icon d="M1 12 C1 12 5 4 12 4 C19 4 23 12 23 12 C23 12 19 20 12 20 C5 20 1 12 1 12 M12 15 A3 3 0 1 1 12 9 A3 3 0 0 1 12 15" />;
const Layers = () => <Icon d="M12 2 L2 7 L12 12 L22 7 L12 2 M2 17 L12 22 L22 17 M2 12 L12 17 L22 12" />;
const ArrowLeft = () => <Icon d="M19 12 L5 12 M12 19 L5 12 L12 5" />;

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

export function ClientPortfolioModule({ products, portfolios }) {
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
      const product = products.find(p => p.id === holding.productId);
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
    <div>
      {!selectedClient ? (
        <>
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
                          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>{client.riskLevel} • Score: {client.riskScore}</span>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedClient(client); }} style={{ ...s.btn, width: 'auto' }}><Eye />View Details</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div>
          <button onClick={() => { setSelectedClient(null); setShowConsolidatedView(false); }} style={{ padding: '0.5rem 1rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft />Back to Clients
          </button>
          
          <div style={s.card}>
            <h2>{selectedClient.name}</h2>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
               <button onClick={() => setShowConsolidatedView(!showConsolidatedView)} style={s.btn}><Layers />Consolidated View</button>
               <button onClick={() => setShowAddGoal(true)} style={s.btn}><PlusCircle />Add Goal</button>
            </div>
            
            {showConsolidatedView ? (
              <div style={{ marginTop: '2rem' }}>
                 <h3>Allocatie Overzicht</h3>
                 <PieChart data={getConsolidatedAssetAllocation(selectedClient)} />
              </div>
            ) : (
              <div style={{ marginTop: '2rem' }}>
                 {selectedClient.goals.map(goal => (
                   <div key={goal.id} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                     <h4>{goal.name}</h4>
                     <p>${goal.targetAmount.toLocaleString()} - {goal.timeHorizon}</p>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientPortfolioModule;