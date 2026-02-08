import React, { useState } from 'react';
import ClientOnboardingWizard from './ClientOnboardingWizard';
import { ReportGenerator } from './utils/ReportGenerator';
import { DataExporter } from './utils/DataExporter';

const Icon = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>;
const PlusCircle = () => <Icon d="M12 2 A10 10 0 1 1 2 12 A10 10 0 0 1 12 2 M12 8 L12 16 M8 12 L16 12" />;
const Check = () => <Icon d="M20 6 L9 17 L4 12" />;
const Trash = () => <Icon d="M3 6 L21 6 M19 6 L19 20 A2 2 0 0 1 17 22 L7 22 A2 2 0 0 1 5 20 L5 6 M8 6 L8 4 A2 2 0 0 1 10 2 L14 2 A2 2 0 0 1 16 4 L16 6" />;
const UserPlus = () => <Icon d="M16 21 L16 19 A4 4 0 0 0 12 15 L8 15 A4 4 0 0 0 4 19 L4 21 M12 11 A4 4 0 1 0 12 3 A4 4 0 0 0 12 11 M20 8 L20 14 M23 11 L17 11" />;
const Target = () => <Icon d="M12 22 A10 10 0 1 1 22 12 A10 10 0 0 1 12 22 M12 18 A6 6 0 1 1 18 12 A6 6 0 0 1 12 18 M12 14 A2 2 0 1 1 14 12 A2 2 0 0 1 12 14" />;
const Eye = () => <Icon d="M1 12 C1 12 5 4 12 4 C19 4 23 12 23 12 C23 12 19 20 12 20 C5 20 1 12 1 12 M12 15 A3 3 0 1 1 12 9 A3 3 0 0 1 12 15" />;
const Layers = () => <Icon d="M12 2 L2 7 L12 12 L22 7 L12 2 M2 17 L12 22 L22 17 M2 12 L12 17 L22 12" />;
const ArrowLeft = () => <Icon d="M19 12 L5 12 M12 19 L5 12 L12 5" />;
const FileText = () => <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />;
const Download = () => <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" />;
const X = () => <Icon d="M18 6 L6 18 M6 6 L18 18" />;
const BarChart = () => <Icon d="M12 20V10 M18 20V4 M6 20v-4" />;

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

export function ClientPortfolioModule({ products, portfolios, clients: externalClients }) {
  const [clients, setClients] = useState(externalClients || [
    {
      id: 'C1',
      name: 'Robert Johnson',
      email: 'robert.j@email.com',
      riskLevel: 'Moderate',
      riskScore: 12,
      onboardedDate: '2026-01-15',
      goals: []
    },
    {
      id: 'C2',
      name: 'Jennifer Martinez',
      email: 'jmartinez@email.com',
      riskLevel: 'Aggressive',
      riskScore: 17,
      onboardedDate: '2026-01-22',
      goals: []
    }
  ]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showConsolidatedView, setShowConsolidatedView] = useState(false);
  const [showRiskProfile, setShowRiskProfile] = useState(false);
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

      const goalValue = goal.goalType === 'accumulation'
        ? (parseFloat(goal.targetAmount) || 0)
        : (parseFloat(goal.currentPortfolioValue) || 0);
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

  const handleWizardComplete = (clientData) => {
    const newClientObj = {
      id: `C${clients.length + 1}`,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      dateOfBirth: clientData.dateOfBirth,
      riskLevel: clientData.riskProfile.level,
      riskScore: clientData.riskProfile.score,
      riskAnswers: clientData.riskProfile.answers,
      onboardedDate: new Date().toISOString().split('T')[0],
      goals: clientData.goals,
      totalAUM: clientData.totalAUM
    };
    setClients([...clients, newClientObj]);
    setShowWizard(false);
    setSelectedClient(newClientObj);
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

  const generateClientReport = (client) => {
    const reportGen = new ReportGenerator();
    const doc = reportGen.generateClientReport(client, portfolios, products, client.goals || []);
    doc.save(`${client.name.replace(/\s+/g, '_')}_Proposal.pdf`);
  };

  const exportClientsData = () => {
    DataExporter.exportClientsToCSV(clients);
  };

  const exportClientGoals = () => {
    DataExporter.exportClientGoalsToCSV(clients, portfolios);
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
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={exportClientsData} style={{ ...s.btn, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                <Download /> Export Clients
              </button>
              <button onClick={exportClientGoals} style={{ ...s.btn, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
                <Download /> Export Goals
              </button>
              <button onClick={() => setShowWizard(true)} style={s.btn}>
                <UserPlus />Onboard Client
              </button>
            </div>
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
        </>
      ) : (
        <div>
          <button onClick={() => { setSelectedClient(null); setShowConsolidatedView(false); }} style={{ padding: '0.5rem 1rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft />Back to Clients
          </button>
          
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem' }}>{selectedClient.name}</h2>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>
                    {selectedClient.riskLevel}
                  </span>
                  <button
                    onClick={() => setShowRiskProfile(true)}
                    style={{ padding: '0.25rem 0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <BarChart size={14} />View Risk Profile
                  </button>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
               <button onClick={() => generateClientReport(selectedClient)} style={{ ...s.btn, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}><FileText />Generate Proposal</button>
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

      {showRiskProfile && selectedClient && selectedClient.riskAnswers && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '16px', width: '90%', maxWidth: '700px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(148,163,184,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Risk Profile - {selectedClient.name}</h2>
              <button onClick={() => setShowRiskProfile(false)} style={{ padding: '0.5rem', background: 'rgba(148,163,184,0.1)', border: 'none', borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer' }}>
                <X />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              <div style={{ marginBottom: '2rem', padding: '1.5rem', background: `linear-gradient(135deg, ${selectedClient.riskLevel === 'Moderate' ? '#f59e0b' : selectedClient.riskLevel === 'Aggressive' ? '#ef4444' : '#3b82f6'}15, ${selectedClient.riskLevel === 'Moderate' ? '#f59e0b' : selectedClient.riskLevel === 'Aggressive' ? '#ef4444' : '#3b82f6'}05)`, border: `1px solid ${selectedClient.riskLevel === 'Moderate' ? '#f59e0b' : selectedClient.riskLevel === 'Aggressive' ? '#ef4444' : '#3b82f6'}40`, borderRadius: '12px' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: selectedClient.riskLevel === 'Moderate' ? '#f59e0b' : selectedClient.riskLevel === 'Aggressive' ? '#ef4444' : '#3b82f6' }}>
                  Risk Level: {selectedClient.riskLevel}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  Risk Score: {typeof selectedClient.riskScore === 'number' ? selectedClient.riskScore.toFixed(2) : selectedClient.riskScore} / 25.0
                </div>
              </div>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Risk Assessment Questionnaire Responses</h3>
                {selectedClient.riskAnswers && Object.entries(selectedClient.riskAnswers).map(([questionId, score], idx) => {
                  const questionLabels = {
                    age: 'Age Range',
                    timeHorizon: 'Investment Time Horizon',
                    volatility: 'Reaction to Market Decline',
                    income: 'Investment Objective',
                    knowledge: 'Investment Knowledge'
                  };
                  const answerLabels = {
                    age: { 1: 'Over 70', 2: '61-70', 3: '46-60', 4: '30-45', 5: 'Under 30' },
                    timeHorizon: { 1: 'Less than 3 years', 2: '3-5 years', 3: '6-10 years', 4: '11-20 years', 5: 'More than 20 years' },
                    volatility: { 1: 'Sell everything immediately', 2: 'Sell some investments', 3: 'Hold investments', 4: 'Buy more at lower prices', 5: 'Aggressively buy more' },
                    income: { 1: 'Capital preservation', 2: 'Income generation', 3: 'Balanced growth and income', 4: 'Growth', 5: 'Aggressive growth' },
                    knowledge: { 1: 'No knowledge', 2: 'Limited knowledge', 3: 'Moderate knowledge', 4: 'Good knowledge', 5: 'Expert knowledge' }
                  };

                  return (
                    <div key={questionId} style={{ padding: '1.5rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Question {idx + 1}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                        {questionLabels[questionId] || questionId}
                      </div>
                      <div style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.875rem', color: '#60a5fa', fontWeight: 500 }}>
                          {answerLabels[questionId]?.[score] || `Score: ${score}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(148,163,184,0.1)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRiskProfile(false)} style={{ ...s.btn, background: 'rgba(148,163,184,0.2)' }}>
                <ArrowLeft /> Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showWizard && (
        <ClientOnboardingWizard
          portfolios={portfolios}
          universeProducts={products}
          onComplete={handleWizardComplete}
          onCancel={() => setShowWizard(false)}
        />
      )}
    </div>
  );
}

export default ClientPortfolioModule;