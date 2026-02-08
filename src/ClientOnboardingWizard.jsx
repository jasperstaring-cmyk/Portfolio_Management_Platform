import React, { useState, useMemo } from 'react';
import { getActiveGoalTemplates, createGoalFromTemplate } from './utils/GoalTemplates';
import {
  calculateAccumulationFeasibility,
  calculatePreservationMetrics,
  checkDrawdownCompliance,
  formatCurrency,
  getHealthStatusColor
} from './utils/GoalCalculations';

const Icon = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>;
const ChevronRight = () => <Icon d="M9 18l6-6-6-6" />;
const ChevronLeft = () => <Icon d="M15 18l-6-6 6-6" />;
const Check = () => <Icon d="M20 6L9 17l-5-5" />;
const X = () => <Icon d="M18 6L6 18M6 6l12 12" />;
const Plus = () => <Icon d="M12 5v14M5 12h14" />;
const Trash = () => <Icon d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />;
const Target = () => <Icon d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const Shield = () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const AlertTriangle = () => <Icon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />;

const RISK_QUESTIONS = [
  {
    id: 'age',
    question: 'What is your age range?',
    options: [
      { label: 'Under 30', score: 5 },
      { label: '30-45', score: 4 },
      { label: '46-60', score: 3 },
      { label: '61-70', score: 2 },
      { label: 'Over 70', score: 1 }
    ]
  },
  {
    id: 'timeHorizon',
    question: 'What is your investment time horizon?',
    options: [
      { label: 'Less than 3 years', score: 1 },
      { label: '3-5 years', score: 2 },
      { label: '6-10 years', score: 3 },
      { label: '11-20 years', score: 4 },
      { label: 'More than 20 years', score: 5 }
    ]
  },
  {
    id: 'volatility',
    question: 'How would you react to a 20% decline in your portfolio value?',
    options: [
      { label: 'Sell everything immediately', score: 1 },
      { label: 'Sell some investments', score: 2 },
      { label: 'Hold my investments', score: 3 },
      { label: 'Buy more at lower prices', score: 4 },
      { label: 'Aggressively buy more', score: 5 }
    ]
  },
  {
    id: 'income',
    question: 'What is your primary investment objective?',
    options: [
      { label: 'Capital preservation', score: 1 },
      { label: 'Income generation', score: 2 },
      { label: 'Balanced growth and income', score: 3 },
      { label: 'Growth', score: 4 },
      { label: 'Aggressive growth', score: 5 }
    ]
  },
  {
    id: 'knowledge',
    question: 'How would you rate your investment knowledge?',
    options: [
      { label: 'No knowledge', score: 1 },
      { label: 'Limited knowledge', score: 2 },
      { label: 'Moderate knowledge', score: 3 },
      { label: 'Good knowledge', score: 4 },
      { label: 'Expert knowledge', score: 5 }
    ]
  }
];


const calculateRiskScore = (answers) => {
  const scores = Object.values(answers);
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
};

const getRiskLevel = (score) => {
  if (score <= 1.5) return { level: 'Very Conservative', color: '#10b981', description: 'Focus on capital preservation with minimal volatility' };
  if (score <= 2.5) return { level: 'Conservative', color: '#3b82f6', description: 'Emphasis on stability with modest growth potential' };
  if (score <= 3.5) return { level: 'Moderate', color: '#f59e0b', description: 'Balanced approach between growth and preservation' };
  if (score <= 4.5) return { level: 'Aggressive', color: '#ef4444', description: 'Growth-focused with higher volatility tolerance' };
  return { level: 'Very Aggressive', color: '#dc2626', description: 'Maximum growth potential with significant risk' };
};

const getRecommendedPortfoliosByRisk = (riskScore, portfolios) => {
  if (!portfolios || portfolios.length === 0) return [];

  const riskLevel = getRiskLevel(riskScore);

  return portfolios.filter(p => {
    if (!p.holdings || !Array.isArray(p.holdings)) return false;

    const equityAllocation = p.holdings.reduce((sum, h) => {
      const product = h.product || {};
      return product.assetClass === 'Equity' ? sum + h.weight : sum;
    }, 0);

    if (riskScore <= 1.5) return equityAllocation <= 30;
    if (riskScore <= 2.5) return equityAllocation > 30 && equityAllocation <= 50;
    if (riskScore <= 3.5) return equityAllocation > 50 && equityAllocation <= 70;
    if (riskScore <= 4.5) return equityAllocation > 70 && equityAllocation <= 85;
    return equityAllocation > 85;
  });
};

const getRecommendedPortfolioForGoal = (riskScore, timeHorizon, portfolios) => {
  if (!portfolios || portfolios.length === 0) return null;

  let adjustedRisk = riskScore;

  if (timeHorizon < 3) adjustedRisk = Math.min(adjustedRisk, 2.5);
  else if (timeHorizon < 5) adjustedRisk = Math.min(adjustedRisk, 3.5);

  const suitable = getRecommendedPortfoliosByRisk(adjustedRisk, portfolios);

  return suitable.length > 0 ? suitable[0] : null;
};

export default function ClientOnboardingWizard({ portfolios = [], universeProducts = [], onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  });
  const [riskAnswers, setRiskAnswers] = useState({});
  const [goals, setGoals] = useState([]);
  const [editingGoalIndex, setEditingGoalIndex] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [goalForm, setGoalForm] = useState({
    goalName: '',
    goalType: 'accumulation',
    goalTemplateId: '',
    initialInvestment: '',
    monthlyContribution: '',
    timeHorizonYears: '',
    targetAmount: '',
    currentPortfolioValue: '',
    inflationBenchmark: 3,
    targetExcessReturn: 2,
    maxAllowableDrawdown: 20,
    expectedReturn: 5,
    portfolioId: ''
  });

  const goalTemplates = useMemo(() => getActiveGoalTemplates(), []);

  const riskScore = useMemo(() => calculateRiskScore(riskAnswers), [riskAnswers]);
  const riskLevel = useMemo(() => getRiskLevel(riskScore), [riskScore]);
  const recommendedPortfolios = useMemo(() => {
    if (!portfolios || portfolios.length === 0) return [];
    return getRecommendedPortfoliosByRisk(riskScore, portfolios);
  }, [riskScore, portfolios]);

  const totalAUM = useMemo(() =>
    goals.reduce((sum, g) => {
      if (g.goalType === 'accumulation') {
        return sum + (parseFloat(g.targetAmount) || 0);
      } else {
        return sum + (parseFloat(g.currentPortfolioValue) || 0);
      }
    }, 0),
    [goals]
  );

  const consolidatedAllocation = useMemo(() => {
    if (!universeProducts || !portfolios) return {};

    const allocation = {};
    goals.forEach(goal => {
      const portfolio = portfolios.find(p => p.id === goal.portfolioId);
      if (!portfolio) return;

      const goalValue = goal.goalType === 'accumulation'
        ? (parseFloat(goal.targetAmount) || 0)
        : (parseFloat(goal.currentPortfolioValue) || 0);
      const goalWeight = goalValue / totalAUM;

      portfolio.holdings.forEach(holding => {
        const product = universeProducts.find(p => p.id === holding.productId);
        if (!product) return;

        const assetClass = product.assetClass;
        const allocationPercent = (holding.weight / 100) * goalWeight * 100;

        allocation[assetClass] = (allocation[assetClass] || 0) + allocationPercent;
      });
    });
    return allocation;
  }, [goals, portfolios, universeProducts, totalAUM]);

  const s = {
    input: { width: '100%', padding: '0.75rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.875rem', fontFamily: 'inherit' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' },
    btn: { padding: '0.875rem 1.5rem', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' },
    card: { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px', padding: '1.5rem' }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return clientInfo.name && clientInfo.email && clientInfo.phone && clientInfo.dateOfBirth;
      case 2:
        return Object.keys(riskAnswers).length === RISK_QUESTIONS.length;
      case 3:
        return goals.length > 0;
      case 4:
        return goals.every(g => g.portfolioId);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleAddGoal = () => {
    if (!goalForm.goalName) return;

    if (goalForm.goalType === 'accumulation') {
      if (!goalForm.initialInvestment || !goalForm.timeHorizonYears || !goalForm.targetAmount) return;
    } else {
      if (!goalForm.currentPortfolioValue || !goalForm.inflationBenchmark) return;
    }

    let calculatedGoal = {
      id: Date.now(),
      ...goalForm,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    if (goalForm.goalType === 'accumulation') {
      const result = calculateAccumulationFeasibility(
        parseFloat(goalForm.initialInvestment),
        parseFloat(goalForm.monthlyContribution || 0),
        parseInt(goalForm.timeHorizonYears),
        parseFloat(goalForm.targetAmount),
        parseFloat(goalForm.expectedReturn)
      );
      calculatedGoal.feasibilityScore = result.feasibilityScore;
      calculatedGoal.healthStatus = result.healthStatus;
      calculatedGoal.projectedAmount = result.projectedAmount;
    } else {
      const result = calculatePreservationMetrics(
        parseFloat(goalForm.currentPortfolioValue),
        parseFloat(goalForm.inflationBenchmark),
        parseFloat(goalForm.targetExcessReturn),
        parseFloat(goalForm.expectedReturn)
      );
      calculatedGoal.feasibilityScore = result.feasibilityScore;
      calculatedGoal.healthStatus = result.healthStatus;
      calculatedGoal.realReturn = result.realReturn;
    }

    if (editingGoalIndex !== null) {
      const updated = [...goals];
      updated[editingGoalIndex] = calculatedGoal;
      setGoals(updated);
      setEditingGoalIndex(null);
    } else {
      setGoals([...goals, calculatedGoal]);
    }

    setGoalForm({
      goalName: '',
      goalType: 'accumulation',
      goalTemplateId: '',
      initialInvestment: '',
      monthlyContribution: '',
      timeHorizonYears: '',
      targetAmount: '',
      currentPortfolioValue: '',
      inflationBenchmark: 3,
      targetExcessReturn: 2,
      maxAllowableDrawdown: 20,
      expectedReturn: 5,
      portfolioId: ''
    });
    setSelectedTemplate(null);
  };

  const handleEditGoal = (index) => {
    setEditingGoalIndex(index);
    const goal = goals[index];
    setGoalForm(goal);
    if (goal.goalTemplateId) {
      const template = goalTemplates.find(t => t.id === goal.goalTemplateId);
      setSelectedTemplate(template);
    }
  };

  const handleDeleteGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
    if (editingGoalIndex === index) {
      setEditingGoalIndex(null);
      setSelectedTemplate(null);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setGoalForm({
      goalName: template.name,
      goalType: template.goalType,
      goalTemplateId: template.id,
      initialInvestment: template.defaultInitialInvestment || '',
      monthlyContribution: template.defaultMonthlyContribution || '',
      timeHorizonYears: template.defaultTimeHorizonYears || '',
      targetAmount: template.defaultTargetAmount || '',
      currentPortfolioValue: template.defaultCurrentPortfolioValue || '',
      inflationBenchmark: template.defaultInflationBenchmark || 3,
      targetExcessReturn: template.defaultTargetExcessReturn || 2,
      maxAllowableDrawdown: template.defaultMaxAllowableDrawdown || 20,
      expectedReturn: template.defaultExpectedReturn || 5,
      portfolioId: ''
    });
  };

  const handleComplete = () => {
    const clientData = {
      ...clientInfo,
      riskProfile: {
        score: riskScore,
        level: riskLevel.level,
        answers: riskAnswers
      },
      goals: goals,
      totalAUM: totalAUM
    };
    onComplete(clientData);
  };


  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '16px', width: '90%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(148,163,184,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>New Client Onboarding</h2>
          <button
            onClick={onCancel}
            title="Close and exit"
            style={{
              padding: '0.75rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '1.125rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
            }}
          >
            <X />
          </button>
        </div>

        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            {[
              { num: 1, label: 'Basic Info' },
              { num: 2, label: 'Risk Assessment' },
              { num: 3, label: 'Goals' },
              { num: 4, label: 'Portfolios' },
              { num: 5, label: 'Review' }
            ].map((step, idx) => (
              <div key={step.num} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: currentStep > step.num ? 'linear-gradient(135deg,#10b981,#059669)' : currentStep === step.num ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'rgba(148,163,184,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    marginBottom: '0.5rem'
                  }}>
                    {currentStep > step.num ? <Check /> : step.num}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: currentStep >= step.num ? '#f1f5f9' : '#64748b', textAlign: 'center' }}>
                    {step.label}
                  </div>
                </div>
                {idx < 4 && (
                  <div style={{ width: '100%', height: '2px', background: currentStep > step.num ? '#10b981' : 'rgba(148,163,184,0.2)', marginBottom: '2rem' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {currentStep === 1 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Basic Information</h3>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={s.label}>Full Name *</label>
                  <input
                    type="text"
                    value={clientInfo.name}
                    onChange={e => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    style={s.input}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={s.label}>Email Address *</label>
                    <input
                      type="email"
                      value={clientInfo.email}
                      onChange={e => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      style={s.input}
                    />
                  </div>
                  <div>
                    <label style={s.label}>Phone Number *</label>
                    <input
                      type="tel"
                      value={clientInfo.phone}
                      onChange={e => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                      style={s.input}
                    />
                  </div>
                </div>
                <div>
                  <label style={s.label}>Date of Birth *</label>
                  <input
                    type="date"
                    value={clientInfo.dateOfBirth}
                    onChange={e => setClientInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    style={s.input}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Risk Assessment</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Answer these questions to determine the appropriate risk level</p>
              </div>

              <div style={{ display: 'grid', gap: '2rem' }}>
                {RISK_QUESTIONS.map((q, idx) => (
                  <div key={q.id} style={s.card}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                      {idx + 1}. {q.question}
                    </div>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {q.options.map((option) => (
                        <label
                          key={option.label}
                          style={{
                            padding: '0.75rem',
                            background: riskAnswers[q.id] === option.score ? 'rgba(59,130,246,0.2)' : 'rgba(15,23,42,0.4)',
                            border: riskAnswers[q.id] === option.score ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.2)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={riskAnswers[q.id] === option.score}
                            onChange={() => setRiskAnswers(prev => ({ ...prev, [q.id]: option.score }))}
                            style={{ width: '18px', height: '18px' }}
                          />
                          <span style={{ fontSize: '0.875rem' }}>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {Object.keys(riskAnswers).length === RISK_QUESTIONS.length && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: `linear-gradient(135deg, ${riskLevel.color}15, ${riskLevel.color}05)`, border: `1px solid ${riskLevel.color}40`, borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: riskLevel.color }}>
                    Risk Profile: {riskLevel.level}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    Score: {riskScore.toFixed(2)} / 5.0
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
                    {riskLevel.description}
                  </div>
                  {recommendedPortfolios.length > 0 && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Matching Model Portfolios:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {recommendedPortfolios.map(p => (
                          <span key={p.id} style={{ padding: '0.25rem 0.75rem', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: '6px', fontSize: '0.75rem' }}>
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Investment Goals</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Add one or more financial goals for this client</p>
              </div>

              {goals.length > 0 && (
                <div style={{ marginBottom: '2rem', display: 'grid', gap: '1rem' }}>
                  {goals.map((goal, idx) => {
                    const healthColors = getHealthStatusColor(goal.healthStatus);
                    const isAccumulation = goal.goalType === 'accumulation';
                    return (
                      <div key={goal.id} style={s.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                              {isAccumulation ? <Target /> : <Shield />}
                              <span style={{ fontSize: '1rem', fontWeight: 700 }}>{goal.goalName}</span>
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
                              {goal.healthStatus && (
                                <span style={{
                                  padding: '0.25rem 0.75rem',
                                  background: healthColors.bg,
                                  border: `1px solid ${healthColors.border}`,
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: healthColors.text
                                }}>
                                  {goal.healthStatus === 'green' ? 'On Track' : goal.healthStatus === 'yellow' ? 'Monitor' : 'At Risk'}
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                              {isAccumulation ? (
                                <>
                                  <div>
                                    <span style={{ color: '#64748b' }}>Target:</span> {formatCurrency(parseFloat(goal.targetAmount))}
                                  </div>
                                  <div>
                                    <span style={{ color: '#64748b' }}>Horizon:</span> {goal.timeHorizonYears} years
                                  </div>
                                  <div>
                                    <span style={{ color: '#64748b' }}>Monthly:</span> {formatCurrency(parseFloat(goal.monthlyContribution || 0))}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>
                                    <span style={{ color: '#64748b' }}>Portfolio:</span> {formatCurrency(parseFloat(goal.currentPortfolioValue))}
                                  </div>
                                  <div>
                                    <span style={{ color: '#64748b' }}>Real Return:</span> {goal.realReturn}%
                                  </div>
                                  <div>
                                    <span style={{ color: '#64748b' }}>Max Drawdown:</span> {goal.maxAllowableDrawdown}%
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleEditGoal(idx)} style={{ padding: '0.5rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', color: '#a78bfa', cursor: 'pointer' }}>
                              Edit
                            </button>
                            <button onClick={() => handleDeleteGoal(idx)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}>
                              <Trash />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={s.card}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  {editingGoalIndex !== null ? 'Edit Goal' : 'Add New Goal'}
                </h4>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ ...s.label, marginBottom: '0.75rem' }}>Select Goal Template</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {goalTemplates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        style={{
                          padding: '0.75rem',
                          background: selectedTemplate?.id === template.id ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)',
                          border: selectedTemplate?.id === template.id ? '2px solid #3b82f6' : '1px solid rgba(59,130,246,0.3)',
                          borderRadius: '8px',
                          color: '#60a5fa',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.25rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{template.icon}</span>
                        <span style={{ fontWeight: 600 }}>{template.name}</span>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{template.goalType}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedTemplate && (
                  <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{selectedTemplate.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{selectedTemplate.description}</div>
                  </div>
                )}

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={s.label}>Goal Name *</label>
                    <input
                      type="text"
                      value={goalForm.goalName}
                      onChange={e => setGoalForm(prev => ({ ...prev, goalName: e.target.value }))}
                      placeholder="e.g., My Retirement Savings"
                      style={s.input}
                    />
                  </div>

                  {goalForm.goalType === 'accumulation' ? (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={s.label}>Initial Investment ($) *</label>
                          <input
                            type="number"
                            value={goalForm.initialInvestment}
                            onChange={e => setGoalForm(prev => ({ ...prev, initialInvestment: e.target.value }))}
                            placeholder="50000"
                            style={s.input}
                          />
                        </div>
                        <div>
                          <label style={s.label}>Monthly Contribution ($)</label>
                          <input
                            type="number"
                            value={goalForm.monthlyContribution}
                            onChange={e => setGoalForm(prev => ({ ...prev, monthlyContribution: e.target.value }))}
                            placeholder="2000"
                            style={s.input}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={s.label}>Time Horizon (years) *</label>
                          <input
                            type="number"
                            value={goalForm.timeHorizonYears}
                            onChange={e => setGoalForm(prev => ({ ...prev, timeHorizonYears: e.target.value }))}
                            placeholder="20"
                            style={s.input}
                          />
                        </div>
                        <div>
                          <label style={s.label}>Target Amount ($) *</label>
                          <input
                            type="number"
                            value={goalForm.targetAmount}
                            onChange={e => setGoalForm(prev => ({ ...prev, targetAmount: e.target.value }))}
                            placeholder="1000000"
                            style={s.input}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={s.label}>Current Portfolio Value ($) *</label>
                          <input
                            type="number"
                            value={goalForm.currentPortfolioValue}
                            onChange={e => setGoalForm(prev => ({ ...prev, currentPortfolioValue: e.target.value }))}
                            placeholder="2500000"
                            style={s.input}
                          />
                        </div>
                        <div>
                          <label style={s.label}>Inflation Benchmark (%) *</label>
                          <input
                            type="number"
                            step="0.1"
                            value={goalForm.inflationBenchmark}
                            onChange={e => setGoalForm(prev => ({ ...prev, inflationBenchmark: e.target.value }))}
                            placeholder="3.0"
                            style={s.input}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={s.label}>Target Excess Return (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={goalForm.targetExcessReturn}
                            onChange={e => setGoalForm(prev => ({ ...prev, targetExcessReturn: e.target.value }))}
                            placeholder="2.0"
                            style={s.input}
                          />
                        </div>
                        <div>
                          <label style={s.label}>Max Allowable Drawdown (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={goalForm.maxAllowableDrawdown}
                            onChange={e => setGoalForm(prev => ({ ...prev, maxAllowableDrawdown: e.target.value }))}
                            placeholder="20.0"
                            style={s.input}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label style={s.label}>Expected Return (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={goalForm.expectedReturn}
                      onChange={e => setGoalForm(prev => ({ ...prev, expectedReturn: e.target.value }))}
                      placeholder="5.0"
                      style={s.input}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={handleAddGoal}
                      style={s.btn}
                    >
                      <Plus /> {editingGoalIndex !== null ? 'Update Goal' : 'Add Goal'}
                    </button>
                    {editingGoalIndex !== null && (
                      <button
                        onClick={() => {
                          setEditingGoalIndex(null);
                          setSelectedTemplate(null);
                          setGoalForm({
                            goalName: '',
                            goalType: 'accumulation',
                            goalTemplateId: '',
                            initialInvestment: '',
                            monthlyContribution: '',
                            timeHorizonYears: '',
                            targetAmount: '',
                            currentPortfolioValue: '',
                            inflationBenchmark: 3,
                            targetExcessReturn: 2,
                            maxAllowableDrawdown: 20,
                            expectedReturn: 5,
                            portfolioId: ''
                          });
                        }}
                        style={{ ...s.btn, background: 'rgba(148,163,184,0.2)' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Portfolio Assignment</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Assign portfolios to each goal based on risk profile and time horizon</p>
              </div>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {goals.map((goal, idx) => {
                  const assignedPortfolio = portfolios.find(p => p.id === goal.portfolioId);
                  const timeHorizon = goal.goalType === 'accumulation' ? parseInt(goal.timeHorizonYears) || 10 : 10;
                  const suggestedPortfolio = getRecommendedPortfolioForGoal(riskScore, timeHorizon, portfolios);
                  const isAccumulation = goal.goalType === 'accumulation';

                  const hasDrawdownWarning = !isAccumulation && assignedPortfolio && goal.maxAllowableDrawdown &&
                    checkDrawdownCompliance(assignedPortfolio.maxDrawdown || 25, goal.maxAllowableDrawdown).riskLevel === 'high';

                  return (
                    <div key={goal.id} style={s.card}>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: isAccumulation ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)', borderRadius: '8px' }}>
                          {isAccumulation ? <Target /> : <Shield />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>{goal.goalName}</div>
                          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                            {isAccumulation
                              ? `${formatCurrency(parseFloat(goal.targetAmount))} • ${goal.timeHorizonYears} year horizon`
                              : `${formatCurrency(parseFloat(goal.currentPortfolioValue))} • Max Drawdown: ${goal.maxAllowableDrawdown}%`
                            }
                          </div>
                          <span style={{
                            marginTop: '0.5rem',
                            display: 'inline-block',
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
                        </div>
                      </div>

                      {suggestedPortfolio && !goal.portfolioId && (
                        <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Recommended: {suggestedPortfolio.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                            Based on {riskLevel.level} risk profile{isAccumulation && ` and ${timeHorizon} year time horizon`}
                          </div>
                          <button
                            onClick={() => {
                              const updated = [...goals];
                              updated[idx].portfolioId = suggestedPortfolio.id;
                              setGoals(updated);
                            }}
                            style={{ ...s.btn, padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#10b981,#059669)', fontSize: '0.75rem' }}
                          >
                            Use Recommendation
                          </button>
                        </div>
                      )}

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
                          <AlertTriangle />
                          <div>
                            <strong>Compliance Warning:</strong> Portfolio max drawdown ({assignedPortfolio.maxDrawdown}%) exceeds client's allowable limit ({goal.maxAllowableDrawdown}%)
                          </div>
                        </div>
                      )}

                      <div>
                        <label style={s.label}>Select Portfolio</label>
                        <select
                          value={goal.portfolioId}
                          onChange={e => {
                            const updated = [...goals];
                            updated[idx].portfolioId = e.target.value;
                            setGoals(updated);
                          }}
                          style={s.input}
                        >
                          <option value="">Choose a portfolio...</option>
                          {portfolios.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} - {p.riskLevel}
                            </option>
                          ))}
                        </select>
                      </div>

                      {assignedPortfolio && (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(15,23,42,0.4)', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Portfolio Details</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.875rem' }}>
                            <div>
                              <span style={{ color: '#64748b' }}>Holdings:</span> {assignedPortfolio.holdings.length}
                            </div>
                            <div>
                              <span style={{ color: '#64748b' }}>Risk Level:</span> {assignedPortfolio.riskLevel}
                            </div>
                            <div>
                              <span style={{ color: '#64748b' }}>Max Drawdown:</span> {assignedPortfolio.maxDrawdown || 'N/A'}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Review & Confirm</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Review all information before creating the client</p>
              </div>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={s.card}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Client Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Name:</span> <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{clientInfo.name}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Email:</span> <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{clientInfo.email}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Phone:</span> <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{clientInfo.phone}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Date of Birth:</span> <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{clientInfo.dateOfBirth}</span>
                    </div>
                  </div>
                </div>

                <div style={s.card}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Risk Profile</h4>
                  <div style={{ padding: '1rem', background: `linear-gradient(135deg, ${riskLevel.color}15, ${riskLevel.color}05)`, border: `1px solid ${riskLevel.color}40`, borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: riskLevel.color }}>{riskLevel.level}</div>
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>Risk Score: {riskScore.toFixed(2)} / 5.0</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={s.card}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Investment Goals ({goals.length})</h4>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {goals.map(goal => {
                      const portfolio = portfolios.find(p => p.id === goal.portfolioId);
                      const isAccumulation = goal.goalType === 'accumulation';
                      const healthColors = getHealthStatusColor(goal.healthStatus);
                      return (
                        <div key={goal.id} style={{ padding: '1rem', background: 'rgba(15,23,42,0.4)', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {isAccumulation ? <Target /> : <Shield />}
                            <div style={{ fontWeight: 600 }}>{goal.goalName}</div>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              background: isAccumulation ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                              border: `1px solid ${isAccumulation ? 'rgba(59,130,246,0.3)' : 'rgba(139,92,246,0.3)'}`,
                              borderRadius: '4px',
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              color: isAccumulation ? '#60a5fa' : '#a78bfa'
                            }}>
                              {isAccumulation ? 'Accumulation' : 'Preservation'}
                            </span>
                            {goal.healthStatus && (
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                background: healthColors.bg,
                                border: `1px solid ${healthColors.border}`,
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                color: healthColors.text
                              }}>
                                {goal.healthStatus.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                            {isAccumulation
                              ? `${formatCurrency(parseFloat(goal.targetAmount))} target • ${goal.timeHorizonYears} years • ${portfolio?.name || 'No portfolio'}`
                              : `${formatCurrency(parseFloat(goal.currentPortfolioValue))} portfolio • ${goal.maxAllowableDrawdown}% max drawdown • ${portfolio?.name || 'No portfolio'}`
                            }
                          </div>
                          {goal.feasibilityScore && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
                              Feasibility Score: {goal.feasibilityScore}%
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={s.card}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Total AUM & Allocation</h4>
                  <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Total Assets Under Management</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>${totalAUM.toLocaleString()}</div>
                  </div>

                  {Object.keys(consolidatedAllocation).length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Consolidated Asset Allocation</div>
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {Object.entries(consolidatedAllocation).map(([assetClass, percent]) => (
                          <div key={assetClass}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                              <span style={{ color: '#cbd5e1' }}>{assetClass}</span>
                              <span style={{ fontWeight: 600 }}>{percent.toFixed(1)}%</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(148,163,184,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', width: `${percent}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(148,163,184,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              style={{
                ...s.btn,
                background: 'rgba(148,163,184,0.2)',
                opacity: currentStep === 1 ? 0.5 : 1,
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft /> Back
            </button>
            <button
              onClick={onCancel}
              style={{
                ...s.btn,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444'
              }}
            >
              <X /> Cancel
            </button>
          </div>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              style={{
                ...s.btn,
                opacity: !canProceed() ? 0.5 : 1,
                cursor: !canProceed() ? 'not-allowed' : 'pointer'
              }}
            >
              Next <ChevronRight />
            </button>
          ) : (
            <button onClick={handleComplete} style={{ ...s.btn, background: 'linear-gradient(135deg,#10b981,#059669)' }}>
              <Check /> Confirm & Create Client
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
