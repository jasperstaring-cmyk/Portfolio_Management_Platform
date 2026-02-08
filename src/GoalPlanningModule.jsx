import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Shield, AlertTriangle, CheckCircle, XCircle, Plus, Edit, Trash, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  calculateAccumulationFeasibility,
  calculatePreservationMetrics,
  checkDrawdownCompliance,
  formatCurrency,
  getHealthStatusColor
} from './utils/GoalCalculations';

function GoalPlanningModule({ clients, portfolios, riskProfiles }) {
  const [goals, setGoals] = useState([]);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [goalType, setGoalType] = useState('accumulation');

  const [newGoal, setNewGoal] = useState({
    goalName: '',
    clientId: '',
    goalType: 'accumulation',
    initialInvestment: 0,
    monthlyContribution: 0,
    timeHorizonYears: 0,
    targetAmount: 0,
    currentPortfolioValue: 0,
    inflationBenchmark: 3,
    targetExcessReturn: 2,
    maxAllowableDrawdown: 20,
    expectedReturn: 5,
    assignedPortfolioId: '',
    assignedRiskProfileId: ''
  });

  useEffect(() => {
    const sampleGoals = [
      {
        id: 'G1',
        clientId: 'C1',
        goalName: 'Retirement Savings',
        goalType: 'accumulation',
        initialInvestment: 50000,
        monthlyContribution: 2000,
        timeHorizonYears: 20,
        targetAmount: 1000000,
        expectedReturn: 5,
        status: 'active',
        assignedPortfolioId: 'P1',
        createdAt: '2026-01-15'
      },
      {
        id: 'G2',
        clientId: 'C2',
        goalName: 'Wealth Preservation',
        goalType: 'preservation',
        currentPortfolioValue: 2500000,
        inflationBenchmark: 3,
        targetExcessReturn: 2,
        maxAllowableDrawdown: 15,
        expectedReturn: 5,
        status: 'active',
        assignedPortfolioId: 'P2',
        createdAt: '2026-01-20'
      },
      {
        id: 'G3',
        clientId: 'C1',
        goalName: 'Education Fund',
        goalType: 'accumulation',
        initialInvestment: 10000,
        monthlyContribution: 500,
        timeHorizonYears: 15,
        targetAmount: 200000,
        expectedReturn: 5,
        status: 'active',
        assignedPortfolioId: 'P3',
        createdAt: '2026-02-01'
      }
    ];
    setGoals(sampleGoals);
  }, []);

  const saveGoal = () => {
    if (!newGoal.goalName || !newGoal.clientId) {
      return alert('Goal name and client are required');
    }

    if (goalType === 'accumulation') {
      if (!newGoal.initialInvestment || !newGoal.timeHorizonYears || !newGoal.targetAmount) {
        return alert('Please fill in all required fields for accumulation goal');
      }
    } else {
      if (!newGoal.currentPortfolioValue || !newGoal.inflationBenchmark) {
        return alert('Please fill in all required fields for preservation goal');
      }
    }

    let calculatedGoal = { ...newGoal, goalType };

    if (goalType === 'accumulation') {
      const result = calculateAccumulationFeasibility(
        parseFloat(newGoal.initialInvestment),
        parseFloat(newGoal.monthlyContribution),
        parseInt(newGoal.timeHorizonYears),
        parseFloat(newGoal.targetAmount),
        parseFloat(newGoal.expectedReturn)
      );
      calculatedGoal.feasibilityScore = result.feasibilityScore;
      calculatedGoal.healthStatus = result.healthStatus;
    } else {
      const result = calculatePreservationMetrics(
        parseFloat(newGoal.currentPortfolioValue),
        parseFloat(newGoal.inflationBenchmark),
        parseFloat(newGoal.targetExcessReturn),
        parseFloat(newGoal.expectedReturn)
      );
      calculatedGoal.feasibilityScore = result.feasibilityScore;
      calculatedGoal.healthStatus = result.healthStatus;
    }

    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? { ...editingGoal, ...calculatedGoal } : g));
      setEditingGoal(null);
    } else {
      setGoals([...goals, {
        ...calculatedGoal,
        id: `G${goals.length + 1}`,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      }]);
    }

    resetForm();
  };

  const resetForm = () => {
    setShowCreateGoal(false);
    setNewGoal({
      goalName: '',
      clientId: '',
      goalType: 'accumulation',
      initialInvestment: 0,
      monthlyContribution: 0,
      timeHorizonYears: 0,
      targetAmount: 0,
      currentPortfolioValue: 0,
      inflationBenchmark: 3,
      targetExcessReturn: 2,
      maxAllowableDrawdown: 20,
      expectedReturn: 5,
      assignedPortfolioId: '',
      assignedRiskProfileId: ''
    });
    setGoalType('accumulation');
  };

  const editGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({ ...goal });
    setGoalType(goal.goalType);
    setShowCreateGoal(true);
  };

  const deleteGoal = (id) => {
    if (confirm('Delete this goal? This action cannot be undone.')) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const getClientName = (clientId) => {
    const client = clients?.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getPortfolioName = (portfolioId) => {
    const portfolio = portfolios?.find(p => p.id === portfolioId);
    return portfolio ? portfolio.name : 'Not Assigned';
  };

  const filterGoals = () => {
    if (!selectedClient) return goals;
    return goals.filter(g => g.clientId === selectedClient);
  };

  const s = {
    card: {
      padding: '1.5rem',
      background: 'rgba(15,23,42,0.6)',
      border: '1px solid rgba(148,163,184,0.1)',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      background: 'rgba(15,23,42,0.4)',
      border: '1px solid rgba(148,163,184,0.2)',
      borderRadius: '8px',
      color: '#f1f5f9',
      fontSize: '0.875rem'
    },
    btn: {
      padding: '0.875rem 1.5rem',
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem'
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Goal-Based Investing</h2>
          <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
            Define and track client investment goals with precision
          </p>
        </div>
        {!showCreateGoal && (
          <button onClick={() => setShowCreateGoal(true)} style={s.btn}>
            <Plus size={18} />Create Goal
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginBottom: '0.5rem', fontWeight: 600 }}>TOTAL GOALS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{goals.length}</div>
        </div>
        <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 600 }}>ACTIVE GOALS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{goals.filter(g => g.status === 'active').length}</div>
        </div>
        <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginBottom: '0.5rem', fontWeight: 600 }}>ACCUMULATION</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{goals.filter(g => g.goalType === 'accumulation').length}</div>
        </div>
        <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginBottom: '0.5rem', fontWeight: 600 }}>PRESERVATION</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{goals.filter(g => g.goalType === 'preservation').length}</div>
        </div>
      </div>

      {clients && clients.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
            Filter by Client
          </label>
          <select
            value={selectedClient}
            onChange={e => setSelectedClient(e.target.value)}
            style={{ ...s.input, maxWidth: '300px', cursor: 'pointer' }}
          >
            <option value="">All Clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
      )}

      {!showCreateGoal ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filterGoals().map(goal => {
            const healthColors = getHealthStatusColor(goal.healthStatus);
            const isAccumulation = goal.goalType === 'accumulation';

            let metrics;
            if (isAccumulation) {
              metrics = calculateAccumulationFeasibility(
                goal.initialInvestment,
                goal.monthlyContribution,
                goal.timeHorizonYears,
                goal.targetAmount,
                goal.expectedReturn
              );
            } else {
              metrics = calculatePreservationMetrics(
                goal.currentPortfolioValue,
                goal.inflationBenchmark,
                goal.targetExcessReturn,
                goal.expectedReturn
              );
            }

            const assignedPortfolio = portfolios?.find(p => p.id === goal.assignedPortfolioId);
            const hasDrawdownWarning = !isAccumulation && assignedPortfolio &&
              checkDrawdownCompliance(assignedPortfolio.maxDrawdown || 25, goal.maxAllowableDrawdown).riskLevel === 'high';

            return (
              <div key={goal.id} style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: isAccumulation ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isAccumulation ? <Target size={24} /> : <Shield size={24} />}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{goal.goalName}</h3>
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          {getClientName(goal.clientId)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: isAccumulation ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                          border: `1px solid ${isAccumulation ? 'rgba(59,130,246,0.3)' : 'rgba(139,92,246,0.3)'}`,
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: isAccumulation ? '#60a5fa' : '#a78bfa'
                        }}>
                          {isAccumulation ? 'Accumulation' : 'Preservation'}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: healthColors.bg,
                          border: `1px solid ${healthColors.border}`,
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: healthColors.text,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {goal.healthStatus === 'green' ? <CheckCircle size={14} /> : goal.healthStatus === 'yellow' ? <AlertTriangle size={14} /> : <XCircle size={14} />}
                          {goal.healthStatus === 'green' ? 'On Track' : goal.healthStatus === 'yellow' ? 'Monitor' : 'At Risk'}
                        </span>
                      </div>
                    </div>

                    {hasDrawdownWarning && (
                      <div style={{
                        padding: '0.75rem',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#ef4444'
                      }}>
                        <AlertTriangle size={16} />
                        <strong>Compliance Warning:</strong> Portfolio max drawdown ({assignedPortfolio.maxDrawdown}%) exceeds client's allowable limit ({goal.maxAllowableDrawdown}%)
                      </div>
                    )}

                    {isAccumulation ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>GOAL PROGRESS</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            {metrics.feasibilityScore}%
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(148,163,184,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${Math.min(100, metrics.feasibilityScore)}%`,
                              height: '100%',
                              background: healthColors.text,
                              transition: 'width 0.3s'
                            }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>PROJECTED vs TARGET</div>
                          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#60a5fa' }}>
                            {formatCurrency(metrics.projectedAmount)}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                            Target: {formatCurrency(metrics.targetAmount)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>INITIAL INVESTMENT</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{formatCurrency(goal.initialInvestment)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>MONTHLY CONTRIBUTION</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{formatCurrency(goal.monthlyContribution)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>TIME HORIZON</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{goal.timeHorizonYears} years</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>EXPECTED RETURN</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{goal.expectedReturn}% annually</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>CURRENT PORTFOLIO VALUE</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#a78bfa' }}>
                            {formatCurrency(goal.currentPortfolioValue)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>REAL RETURN</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: metrics.realReturn >= 0 ? '#10b981' : '#ef4444' }}>
                            {metrics.realReturn}%
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                            ({goal.expectedReturn}% - {goal.inflationBenchmark}% inflation)
                          </div>
                        </div>
                        <div style={{
                          gridColumn: '1 / -1',
                          padding: '1rem',
                          background: 'rgba(139,92,246,0.1)',
                          border: '1px solid rgba(139,92,246,0.3)',
                          borderRadius: '8px'
                        }}>
                          <div style={{ fontSize: '0.875rem', color: '#a78bfa', marginBottom: '0.75rem', fontWeight: 600 }}>
                            PURCHASING POWER PROTECTION (10-Year Projection)
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Future Value</div>
                              <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{formatCurrency(metrics.futureValue10Years)}</div>
                            </div>
                            <TrendingUp size={24} color="#a78bfa" />
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Inflation-Adjusted</div>
                              <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{formatCurrency(metrics.inflationAdjustedValue)}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Real Growth</div>
                              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: metrics.purchasingPowerProtection > 0 ? '#10b981' : '#ef4444' }}>
                                {metrics.purchasingPowerProtection > 0 ? '+' : ''}{metrics.purchasingPowerProtection}%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>INFLATION BENCHMARK</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{goal.inflationBenchmark}%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>TARGET EXCESS RETURN</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{goal.targetExcessReturn}%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>MAX ALLOWABLE DRAWDOWN</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{goal.maxAllowableDrawdown}%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>ASSIGNED PORTFOLIO</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{getPortfolioName(goal.assignedPortfolioId)}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '2rem' }}>
                    <button
                      onClick={() => editGoal(goal)}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        borderRadius: '8px',
                        color: '#60a5fa',
                        cursor: 'pointer'
                      }}
                      title="Edit goal"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                      title="Delete goal"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filterGoals().length === 0 && (
            <div style={{
              ...s.card,
              textAlign: 'center',
              padding: '3rem',
              color: '#64748b'
            }}>
              <Target size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>No goals found</p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
                {selectedClient ? 'This client has no goals yet' : 'Create your first investment goal to get started'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={s.card}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
            {editingGoal ? 'Edit Goal' : 'Create New Goal'}
          </h3>

          <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                Goal Name *
              </label>
              <input
                type="text"
                value={newGoal.goalName}
                onChange={e => setNewGoal({ ...newGoal, goalName: e.target.value })}
                placeholder="e.g., Retirement Savings, Wealth Preservation"
                style={s.input}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                Client *
              </label>
              <select
                value={newGoal.clientId}
                onChange={e => setNewGoal({ ...newGoal, clientId: e.target.value })}
                style={{ ...s.input, cursor: 'pointer' }}
              >
                <option value="">Select a client</option>
                {clients?.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.75rem', color: '#94a3b8' }}>
                Goal Type *
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setGoalType('accumulation')}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: goalType === 'accumulation' ? 'rgba(59,130,246,0.2)' : 'rgba(15,23,42,0.4)',
                    border: `2px solid ${goalType === 'accumulation' ? 'rgba(59,130,246,0.5)' : 'rgba(148,163,184,0.2)'}`,
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <Target size={20} color="#60a5fa" />
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>Wealth Accumulation</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Target-driven growth to reach a specific future amount
                  </div>
                </button>
                <button
                  onClick={() => setGoalType('preservation')}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: goalType === 'preservation' ? 'rgba(139,92,246,0.2)' : 'rgba(15,23,42,0.4)',
                    border: `2px solid ${goalType === 'preservation' ? 'rgba(139,92,246,0.5)' : 'rgba(148,163,184,0.2)'}`,
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <Shield size={20} color="#a78bfa" />
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>Wealth Preservation</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Protect and grow existing capital with controlled risk
                  </div>
                </button>
              </div>
            </div>

            {goalType === 'accumulation' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Initial Investment *
                    </label>
                    <input
                      type="number"
                      value={newGoal.initialInvestment}
                      onChange={e => setNewGoal({ ...newGoal, initialInvestment: e.target.value })}
                      placeholder="50000"
                      style={s.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Monthly Contribution
                    </label>
                    <input
                      type="number"
                      value={newGoal.monthlyContribution}
                      onChange={e => setNewGoal({ ...newGoal, monthlyContribution: e.target.value })}
                      placeholder="2000"
                      style={s.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Time Horizon (Years) *
                    </label>
                    <input
                      type="number"
                      value={newGoal.timeHorizonYears}
                      onChange={e => setNewGoal({ ...newGoal, timeHorizonYears: e.target.value })}
                      placeholder="20"
                      style={s.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Target Amount *
                    </label>
                    <input
                      type="number"
                      value={newGoal.targetAmount}
                      onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                      placeholder="1000000"
                      style={s.input}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Current Portfolio Value *
                    </label>
                    <input
                      type="number"
                      value={newGoal.currentPortfolioValue}
                      onChange={e => setNewGoal({ ...newGoal, currentPortfolioValue: e.target.value })}
                      placeholder="2500000"
                      style={s.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Inflation Benchmark (%) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newGoal.inflationBenchmark}
                      onChange={e => setNewGoal({ ...newGoal, inflationBenchmark: e.target.value })}
                      placeholder="3.0"
                      style={s.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Target Excess Return (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newGoal.targetExcessReturn}
                      onChange={e => setNewGoal({ ...newGoal, targetExcessReturn: e.target.value })}
                      placeholder="2.0"
                      style={s.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Max Allowable Drawdown (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newGoal.maxAllowableDrawdown}
                      onChange={e => setNewGoal({ ...newGoal, maxAllowableDrawdown: e.target.value })}
                      placeholder="20.0"
                      style={s.input}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                Expected Return (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={newGoal.expectedReturn}
                onChange={e => setNewGoal({ ...newGoal, expectedReturn: e.target.value })}
                placeholder="5.0"
                style={s.input}
              />
            </div>

            {portfolios && portfolios.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                  Assign Portfolio (Optional)
                </label>
                <select
                  value={newGoal.assignedPortfolioId}
                  onChange={e => setNewGoal({ ...newGoal, assignedPortfolioId: e.target.value })}
                  style={{ ...s.input, cursor: 'pointer' }}
                >
                  <option value="">No portfolio assigned</option>
                  {portfolios.map(portfolio => (
                    <option key={portfolio.id} value={portfolio.id}>
                      {portfolio.name} - {portfolio.riskLevel}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={resetForm}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: 'rgba(148,163,184,0.1)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: '8px',
                color: '#f1f5f9',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Cancel
            </button>
            <button
              onClick={saveGoal}
              style={{ flex: 1, ...s.btn }}
            >
              <CheckCircle size={18} />
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoalPlanningModule;
