import React, { useState, useEffect } from 'react';
import { ClientPortfolioModule } from './ClientPortfolioModule';

// Mock Data
const MOCK_PRODUCTS = [
  { id: 'MF001', name: 'Vanguard Total Stock Market Index Fund', ticker: 'VTSAX', type: 'Mutual Fund', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.04, aum: 1250000000000, morningstarRating: 5, ytdReturn: 12.5 },
  { id: 'ETF001', name: 'iShares Core U.S. Aggregate Bond ETF', ticker: 'AGG', type: 'ETF', assetClass: 'Fixed Income', category: 'Intermediate Core Bond', region: 'US', riskRating: 2, expenseRatio: 0.03, aum: 94000000000, morningstarRating: 4, ytdReturn: -1.2 },
  { id: 'MF002', name: 'Fidelity International Growth Fund', ticker: 'FIGFX', type: 'Mutual Fund', assetClass: 'Equity', category: 'Foreign Large Growth', region: 'International', riskRating: 5, expenseRatio: 0.89, aum: 12500000000, morningstarRating: 4, ytdReturn: 18.3 },
  { id: 'ETF002', name: 'Invesco QQQ Trust', ticker: 'QQQ', type: 'ETF', assetClass: 'Equity', category: 'Large Growth', region: 'US', riskRating: 5, expenseRatio: 0.20, aum: 245000000000, morningstarRating: 5, ytdReturn: 25.7 },
  { id: 'MF003', name: 'PIMCO Income Fund', ticker: 'PONDX', type: 'Mutual Fund', assetClass: 'Fixed Income', category: 'Multisector Bond', region: 'Global', riskRating: 3, expenseRatio: 0.75, aum: 98000000000, morningstarRating: 5, ytdReturn: 5.8 }
];

// Icons
const Icon = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>;
const PlusCircle = () => <Icon d="M12 2 A10 10 0 1 1 2 12 A10 10 0 0 1 12 2 M12 8 L12 16 M8 12 L16 12" />;
const Search = ({ size = 20 }) => <Icon d="M11 19 A8 8 0 1 1 19 11 A8 8 0 0 1 11 19 M21 21 L16.65 16.65" size={size} />;
const Check = () => <Icon d="M20 6 L9 17 L4 12" />;
const X = () => <Icon d="M18 6 L6 18 M6 6 L18 18" />;
const Trash = () => <Icon d="M3 6 L21 6 M19 6 L19 20 A2 2 0 0 1 17 22 L7 22 A2 2 0 0 1 5 20 L5 6 M8 6 L8 4 A2 2 0 0 1 10 2 L14 2 A2 2 0 0 1 16 4 L16 6" />;
const Edit = () => <Icon d="M11 4 L4 4 A2 2 0 0 0 2 6 L2 20 A2 2 0 0 0 4 22 L18 22 A2 2 0 0 0 20 20 L20 13 M18.5 2.5 A2.121 2.121 0 0 1 21.5 5.5 L12 15 L8 16 L9 12 Z" />;
const Play = () => <Icon d="M5 3 L19 12 L5 21 Z" />;
const Users = () => <Icon d="M17 21 L17 19 A4 4 0 0 0 13 15 L11 15 A4 4 0 0 0 7 19 L7 21 M12 11 A4 4 0 1 0 12 3 A4 4 0 0 0 12 11 M23 21 L23 19 A4 4 0 0 0 19.03 15.05 M16 3.13 A4 4 0 0 1 16 11" />;
const UserPlus = () => <Icon d="M16 21 L16 19 A4 4 0 0 0 12 15 L8 15 A4 4 0 0 0 4 19 L4 21 M12 11 A4 4 0 1 0 12 3 A4 4 0 0 0 12 11 M20 8 L20 14 M23 11 L17 11" />;
const ToggleLeft = () => <Icon d="M1 12 A6 6 0 0 0 7 18 L17 18 A6 6 0 0 0 23 12 A6 6 0 0 0 17 6 L7 6 A6 6 0 0 0 1 12 M7 15 A3 3 0 1 1 7 9 A3 3 0 0 1 7 15" />;
const ToggleRight = () => <Icon d="M1 12 A6 6 0 0 0 7 18 L17 18 A6 6 0 0 0 23 12 A6 6 0 0 0 17 6 L7 6 A6 6 0 0 0 1 12 M17 15 A3 3 0 1 1 17 9 A3 3 0 0 1 17 15" />;
const Shield = () => <Icon d="M12 22 L12 22 C12 22 3 18 3 12 L3 5 L12 2 L21 5 L21 12 C21 18 12 22 12 22 Z" />;

// Pie Chart
const PieChart = ({ data }) => {
  const size = 200, center = size / 2, radius = size / 2 - 10;
  if (!data?.length) return <svg width={size} height={size}><circle cx={center} cy={center} r={radius} fill="rgba(148,163,184,0.1)"/><text x={center} y={center} textAnchor="middle" fill="#94a3b8" fontSize="14">No data</text></svg>;
  const total = data.reduce((s, i) => s + i.value, 0);
  if (!total) return <svg width={size} height={size}><circle cx={center} cy={center} r={radius} fill="rgba(148,163,184,0.1)"/><text x={center} y={center} textAnchor="middle" fill="#94a3b8" fontSize="14">0%</text></svg>;
  let angle = -90;
  return <svg width={size} height={size}>{data.map((item, i) => { const a = (item.value / total) * 360; const start = angle * Math.PI / 180; const end = (angle + a) * Math.PI / 180; const x1 = center + radius * Math.cos(start), y1 = center + radius * Math.sin(start); const x2 = center + radius * Math.cos(end), y2 = center + radius * Math.sin(end); const large = a > 180 ? 1 : 0; const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`; angle += a; return <path key={i} d={path} fill={item.color} opacity="0.9"/>; })}<circle cx={center} cy={center} r={radius * 0.5} fill="#1e293b"/><text x={center} y={center - 5} textAnchor="middle" fill="#f1f5f9" fontSize="24" fontWeight="700">{total.toFixed(0)}%</text><text x={center} y={center + 15} textAnchor="middle" fill="#94a3b8" fontSize="12">allocated</text></svg>;
};

function App() {
  const [activeTab, setActiveTab] = useState('products');
  const [products] = useState(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAsset, setFilterAsset] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [portfolios, setPortfolios] = useState([
    { id: 'P1', name: 'Conservative Growth', description: 'Low-risk capital preservation', riskLevel: 'Conservative', holdings: [{ productId: 'ETF001', weight: 60 }, { productId: 'MF001', weight: 30 }, { productId: 'MF003', weight: 10 }] },
    { id: 'P2', name: 'Balanced Moderate', description: 'Growth and stability mix', riskLevel: 'Moderate', holdings: [{ productId: 'MF001', weight: 50 }, { productId: 'ETF001', weight: 40 }, { productId: 'MF002', weight: 10 }] },
    { id: 'P3', name: 'Aggressive Growth', description: 'High-growth equity focus', riskLevel: 'Aggressive', holdings: [{ productId: 'ETF002', weight: 50 }, { productId: 'MF002', weight: 30 }, { productId: 'MF001', weight: 20 }] }
  ]);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ name: '', description: '', riskLevel: 'Moderate', holdings: [] });

  const [riskProfiles, setRiskProfiles] = useState([{
    id: 'R1', name: 'Standard Risk Assessment', description: '5-question risk tolerance questionnaire',
    questions: [
      { id: 'Q1', text: 'What is your investment time horizon?', options: [{ text: '1-3 years', points: 1 }, { text: '4-7 years', points: 2 }, { text: '8-10 years', points: 3 }, { text: '10+ years', points: 4 }] },
      { id: 'Q2', text: 'How would you describe your investment knowledge?', options: [{ text: 'Beginner', points: 1 }, { text: 'Intermediate', points: 2 }, { text: 'Advanced', points: 3 }, { text: 'Expert', points: 4 }] },
      { id: 'Q3', text: 'When markets decline significantly, I typically:', options: [{ text: 'Sell to avoid losses', points: 1 }, { text: 'Hold steady', points: 2 }, { text: 'Buy more', points: 4 }] },
      { id: 'Q4', text: 'What percentage decline can you tolerate?', options: [{ text: '0-5%', points: 1 }, { text: '5-10%', points: 2 }, { text: '10-20%', points: 3 }, { text: '20%+', points: 4 }] },
      { id: 'Q5', text: 'My primary investment goal is:', options: [{ text: 'Capital preservation', points: 1 }, { text: 'Income', points: 2 }, { text: 'Balanced growth', points: 3 }, { text: 'Aggressive growth', points: 4 }] }
    ],
    scoringRules: [
      { minScore: 5, maxScore: 8, portfolioId: 'P1', label: 'Conservative' },
      { minScore: 9, maxScore: 14, portfolioId: 'P2', label: 'Moderate' },
      { minScore: 15, maxScore: 20, portfolioId: 'P3', label: 'Aggressive' }
    ]
  }]);
  const [showCreateRisk, setShowCreateRisk] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewAnswers, setPreviewAnswers] = useState({});
  const [newRisk, setNewRisk] = useState({ name: '', description: '', questions: [], scoringRules: [] });

  // NEW: Advisor Management State
  const [advisors, setAdvisors] = useState([
    { id: 'A1', name: 'Sarah Chen', email: 'sarah.chen@finfiles.com', active: true, assignedPortfolios: ['P1', 'P2'], assignedRiskProfiles: ['R1'], permissions: 'Full Access', joinedDate: '2025-11-15' },
    { id: 'A2', name: 'Michael Rodriguez', email: 'michael.r@finfiles.com', active: true, assignedPortfolios: ['P2', 'P3'], assignedRiskProfiles: ['R1'], permissions: 'Full Access', joinedDate: '2025-12-03' },
    { id: 'A3', name: 'Emily Watson', email: 'emily.watson@finfiles.com', active: false, assignedPortfolios: ['P1'], assignedRiskProfiles: [], permissions: 'Limited Access', joinedDate: '2025-10-22' }
  ]);
  const [showCreateAdvisor, setShowCreateAdvisor] = useState(false);
  const [newAdvisor, setNewAdvisor] = useState({ name: '', email: '', permissions: 'Full Access', assignedPortfolios: [], assignedRiskProfiles: [] });
  const [editingAdvisor, setEditingAdvisor] = useState(null);

  const filteredProducts = products.filter(p => {
    const search = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.ticker.toLowerCase().includes(searchTerm.toLowerCase());
    const filter = filterAsset === 'all' || p.assetClass === filterAsset;
    return search && filter;
  });

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
  const getPortfolioData = (portfolio) => portfolio.holdings.map((h, i) => ({ value: h.weight, color: colors[i % colors.length], label: products.find(p => p.id === h.productId)?.ticker || 'N/A' }));

  const s = {
    input: { width: '100%', padding: '0.75rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.875rem', fontFamily: 'inherit' },
    btn: { padding: '0.875rem 1.5rem', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' },
    card: { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px', padding: '1.5rem' }
  };

  // Portfolio Functions
  const addHolding = () => setNewPortfolio({ ...newPortfolio, holdings: [...newPortfolio.holdings, { productId: '', weight: 0 }] });
  const updateHolding = (i, k, v) => { const h = [...newPortfolio.holdings]; h[i][k] = v; setNewPortfolio({ ...newPortfolio, holdings: h }); };
  const removeHolding = (i) => setNewPortfolio({ ...newPortfolio, holdings: newPortfolio.holdings.filter((_, idx) => idx !== i) });
  const savePortfolio = () => {
    if (!newPortfolio.name || !newPortfolio.holdings.length) return alert('Name and holdings required');
    const total = newPortfolio.holdings.reduce((s, h) => s + (parseFloat(h.weight) || 0), 0);
    if (Math.abs(total - 100) > 0.01) return alert(`Total must be 100%. Current: ${total.toFixed(1)}%`);
    setPortfolios([...portfolios, { ...newPortfolio, id: `P${portfolios.length + 1}` }]);
    setShowCreatePortfolio(false);
    setNewPortfolio({ name: '', description: '', riskLevel: 'Moderate', holdings: [] });
  };
  const deletePortfolio = (id) => { if (confirm('Delete portfolio?')) setPortfolios(portfolios.filter(p => p.id !== id)); };

  // Risk Profile Functions
  const addQuestion = () => setNewRisk({ ...newRisk, questions: [...newRisk.questions, { id: `Q${newRisk.questions.length + 1}`, text: '', options: [{ text: '', points: 1 }, { text: '', points: 2 }] }] });
  const updateQuestion = (id, text) => setNewRisk({ ...newRisk, questions: newRisk.questions.map(q => q.id === id ? { ...q, text } : q) });
  const removeQuestion = (id) => setNewRisk({ ...newRisk, questions: newRisk.questions.filter(q => q.id !== id) });
  const addOption = (qid) => setNewRisk({ ...newRisk, questions: newRisk.questions.map(q => q.id === qid ? { ...q, options: [...q.options, { text: '', points: q.options.length + 1 }] } : q) });
  const updateOption = (qid, oi, k, v) => setNewRisk({ ...newRisk, questions: newRisk.questions.map(q => q.id === qid ? { ...q, options: q.options.map((o, i) => i === oi ? { ...o, [k]: k === 'points' ? parseInt(v) || 0 : v } : o) } : q) });
  const removeOption = (qid, oi) => setNewRisk({ ...newRisk, questions: newRisk.questions.map(q => q.id === qid ? { ...q, options: q.options.filter((_, i) => i !== oi) } : q) });
  const addRule = () => setNewRisk({ ...newRisk, scoringRules: [...newRisk.scoringRules, { minScore: 0, maxScore: 10, portfolioId: '', label: '' }] });
  const updateRule = (i, k, v) => { const r = [...newRisk.scoringRules]; r[i][k] = v; setNewRisk({ ...newRisk, scoringRules: r }); };
  const removeRule = (i) => setNewRisk({ ...newRisk, scoringRules: newRisk.scoringRules.filter((_, idx) => idx !== i) });
  const saveRisk = () => {
    if (!newRisk.name || !newRisk.questions.length || !newRisk.scoringRules.length) return alert('Name, questions, and rules required');
    setRiskProfiles([...riskProfiles, { ...newRisk, id: `R${riskProfiles.length + 1}` }]);
    setShowCreateRisk(false);
    setNewRisk({ name: '', description: '', questions: [], scoringRules: [] });
  };
  const deleteRisk = (id) => { if (confirm('Delete risk profile?')) setRiskProfiles(riskProfiles.filter(r => r.id !== id)); };
  const calcScore = () => Object.keys(previewAnswers).reduce((s, qid) => { const q = newRisk.questions.find(qu => qu.id === qid); return s + (q?.options[previewAnswers[qid]]?.points || 0); }, 0);
  const getRecommended = (score) => { const rule = newRisk.scoringRules.find(r => score >= r.minScore && score <= r.maxScore); return rule ? portfolios.find(p => p.id === rule.portfolioId) : null; };

  // NEW: Advisor Management Functions
  const saveAdvisor = () => {
    if (!newAdvisor.name || !newAdvisor.email) return alert('Name and email required');
    if (editingAdvisor) {
      setAdvisors(advisors.map(a => a.id === editingAdvisor.id ? { ...editingAdvisor, ...newAdvisor } : a));
      setEditingAdvisor(null);
    } else {
      setAdvisors([...advisors, { ...newAdvisor, id: `A${advisors.length + 1}`, active: true, joinedDate: new Date().toISOString().split('T')[0] }]);
    }
    setShowCreateAdvisor(false);
    setNewAdvisor({ name: '', email: '', permissions: 'Full Access', assignedPortfolios: [], assignedRiskProfiles: [] });
  };

  const toggleAdvisorStatus = (id) => {
    setAdvisors(advisors.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAdvisor = (id) => {
    if (confirm('Delete this advisor? This action cannot be undone.')) {
      setAdvisors(advisors.filter(a => a.id !== id));
    }
  };

  const editAdvisor = (advisor) => {
    setEditingAdvisor(advisor);
    setNewAdvisor({
      name: advisor.name,
      email: advisor.email,
      permissions: advisor.permissions,
      assignedPortfolios: advisor.assignedPortfolios,
      assignedRiskProfiles: advisor.assignedRiskProfiles
    });
    setShowCreateAdvisor(true);
  };

  const togglePortfolioAssignment = (portfolioId) => {
    const current = newAdvisor.assignedPortfolios;
    setNewAdvisor({
      ...newAdvisor,
      assignedPortfolios: current.includes(portfolioId) 
        ? current.filter(id => id !== portfolioId)
        : [...current, portfolioId]
    });
  };

  const toggleRiskProfileAssignment = (riskId) => {
    const current = newAdvisor.assignedRiskProfiles;
    setNewAdvisor({
      ...newAdvisor,
      assignedRiskProfiles: current.includes(riskId)
        ? current.filter(id => id !== riskId)
        : [...current, riskId]
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', color: '#f1f5f9', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
      <nav style={{ background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid rgba(148,163,184,0.1)', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FinFiles Portfolio Builder</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['products', 'portfolios', 'risk', 'clients', 'advisors'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.625rem 1.25rem', background: activeTab === tab ? 'rgba(59,130,246,0.2)' : 'transparent', border: activeTab === tab ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent', borderRadius: '8px', color: activeTab === tab ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', transition: 'all 0.2s' }}>{tab === 'products' ? '🔍 Product Universe' : tab === 'portfolios' ? '📊 Model Portfolios' : tab === 'risk' ? '⚖️ Risk Profiles' : tab === 'clients' ? '👨‍💼 Clients' : '👥 Advisors'}</button>
            ))}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div><h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Product Universe</h2><p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Browse and analyze investment products</p></div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ position: 'relative', flex: 1 }}><Search size={18} /><span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></span><input type="text" placeholder="Search by name or ticker..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...s.input, paddingLeft: '2.5rem' }} /></div>
              <select value={filterAsset} onChange={e => setFilterAsset(e.target.value)} style={{ ...s.input, width: 'auto', minWidth: '200px', cursor: 'pointer' }}><option value="all">All Asset Classes</option><option value="Equity">Equity</option><option value="Fixed Income">Fixed Income</option></select>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>{filteredProducts.map(p => (
              <div key={p.id} onClick={() => setSelectedProduct(selectedProduct?.id === p.id ? null : p)} style={{ ...s.card, cursor: 'pointer', transition: 'all 0.2s', border: selectedProduct?.id === p.id ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(148,163,184,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}><h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>{p.name}</h3><span style={{ padding: '0.25rem 0.625rem', background: p.type === 'ETF' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)', border: `1px solid ${p.type === 'ETF' ? 'rgba(59,130,246,0.3)' : 'rgba(139,92,246,0.3)'}`, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500, color: p.type === 'ETF' ? '#60a5fa' : '#a78bfa' }}>{p.type}</span></div><div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', fontSize: '0.875rem' }}><div><span style={{ color: '#64748b' }}>Ticker:</span> <span style={{ fontWeight: 600 }}>{p.ticker}</span></div><div><span style={{ color: '#64748b' }}>Asset Class:</span> <span style={{ fontWeight: 600 }}>{p.assetClass}</span></div><div><span style={{ color: '#64748b' }}>Risk:</span> <span style={{ fontWeight: 600 }}>{p.riskRating}/5</span></div><div><span style={{ color: '#64748b' }}>Expense Ratio:</span> <span style={{ fontWeight: 600 }}>{p.expenseRatio}%</span></div><div><span style={{ color: '#64748b' }}>YTD Return:</span> <span style={{ fontWeight: 600, color: p.ytdReturn > 0 ? '#10b981' : '#ef4444' }}>{p.ytdReturn > 0 ? '+' : ''}{p.ytdReturn}%</span></div></div></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: i < p.morningstarRating ? '#f59e0b' : '#334155', fontSize: '1.25rem' }}>★</span>)}</div>
                </div>
                {selectedProduct?.id === p.id && <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(148,163,184,0.1)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}><div><div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>AUM</div><div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${(p.aum / 1e9).toFixed(1)}B</div></div><div><div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Category</div><div style={{ fontSize: '1rem', fontWeight: 600 }}>{p.category}</div></div><div><div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Region</div><div style={{ fontSize: '1rem', fontWeight: 600 }}>{p.region}</div></div></div>}
              </div>
            ))}</div>
          </div>
        )}

        {activeTab === 'portfolios' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div><h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Model Portfolios</h2><p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Create and manage portfolio templates</p></div>
              {!showCreatePortfolio && <button onClick={() => setShowCreatePortfolio(true)} style={s.btn}><PlusCircle />Create Portfolio</button>}
            </div>

            {!showCreatePortfolio ? (
              <div style={{ display: 'grid', gap: '1.5rem' }}>{portfolios.map(p => (
                <div key={p.id} style={s.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1 }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}><h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{p.name}</h3><span style={{ padding: '0.25rem 0.75rem', background: p.riskLevel === 'Conservative' ? 'rgba(16,185,129,0.1)' : p.riskLevel === 'Moderate' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${p.riskLevel === 'Conservative' ? 'rgba(16,185,129,0.3)' : p.riskLevel === 'Moderate' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: p.riskLevel === 'Conservative' ? '#10b981' : p.riskLevel === 'Moderate' ? '#f59e0b' : '#ef4444' }}>{p.riskLevel}</span></div><p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>{p.description}</p></div>
                    <button onClick={() => deletePortfolio(p.id)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}><Trash /></button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div><h4 style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>HOLDINGS</h4><div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{p.holdings.map((h, i) => { const prod = products.find(pr => pr.id === h.productId); return prod ? <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px' }}><div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{prod.ticker}</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>{prod.name}</div></div><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6' }}>{h.weight}%</div></div> : null; })}</div></div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><h4 style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>ALLOCATION</h4><PieChart data={getPortfolioData(p)} /></div>
                  </div>
                </div>
              ))}</div>
            ) : (
              <div style={s.card}>
                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Create New Portfolio</h3>
                <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Portfolio Name</label><input type="text" value={newPortfolio.name} onChange={e => setNewPortfolio({ ...newPortfolio, name: e.target.value })} placeholder="e.g., Conservative Growth" style={s.input} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Description</label><input type="text" value={newPortfolio.description} onChange={e => setNewPortfolio({ ...newPortfolio, description: e.target.value })} placeholder="Brief description" style={s.input} /></div>
                  <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Risk Level</label><select value={newPortfolio.riskLevel} onChange={e => setNewPortfolio({ ...newPortfolio, riskLevel: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}><option>Conservative</option><option>Moderate</option><option>Aggressive</option></select></div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Holdings ({newPortfolio.holdings.reduce((s, h) => s + (parseFloat(h.weight) || 0), 0).toFixed(1)}% allocated)</h4><button onClick={addHolding} style={{ padding: '0.5rem 1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PlusCircle />Add Holding</button></div>
                  {!newPortfolio.holdings.length ? <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(15,23,42,0.4)', border: '2px dashed rgba(148,163,184,0.2)', borderRadius: '8px', color: '#64748b' }}>No holdings yet. Click "Add Holding" to start building your portfolio.</div> : <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{newPortfolio.holdings.map((h, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px' }}>
                      <select value={h.productId} onChange={e => updateHolding(i, 'productId', e.target.value)} style={{ ...s.input, cursor: 'pointer' }}><option value="">Select Product</option>{products.map(p => <option key={p.id} value={p.id}>{p.ticker} - {p.name}</option>)}</select>
                      <input type="number" value={h.weight} onChange={e => updateHolding(i, 'weight', parseFloat(e.target.value))} placeholder="Weight %" min="0" max="100" step="0.1" style={s.input} />
                      <button onClick={() => removeHolding(i)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}><Trash /></button>
                    </div>
                  ))}</div>}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}><button onClick={() => { setShowCreatePortfolio(false); setNewPortfolio({ name: '', description: '', riskLevel: 'Moderate', holdings: [] }); }} style={{ flex: 1, padding: '0.875rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer', fontWeight: 500 }}>Cancel</button><button onClick={savePortfolio} style={{ flex: 1, ...s.btn }}>Save Portfolio</button></div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'risk' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div><h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Risk Profile Builder</h2><p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Create risk questionnaires and scoring rules</p></div>
              {!showCreateRisk && <button onClick={() => setShowCreateRisk(true)} style={s.btn}><PlusCircle />Create Risk Profile</button>}
            </div>

            {!showCreateRisk ? (
              <div style={{ display: 'grid', gap: '1.5rem' }}>{riskProfiles.map(r => (
                <div key={r.id} style={s.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div><h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{r.name}</h3><p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>{r.description}</p></div>
                    <button onClick={() => deleteRisk(r.id)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}><Trash /></button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px' }}><div style={{ fontSize: '0.75rem', color: '#60a5fa', marginBottom: '0.25rem' }}>Questions</div><div style={{ fontSize: '2rem', fontWeight: 700 }}>{r.questions.length}</div></div>
                    <div style={{ padding: '1rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px' }}><div style={{ fontSize: '0.75rem', color: '#a78bfa', marginBottom: '0.25rem' }}>Scoring Rules</div><div style={{ fontSize: '2rem', fontWeight: 700 }}>{r.scoringRules.length}</div></div>
                    <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px' }}><div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.25rem' }}>Max Score</div><div style={{ fontSize: '2rem', fontWeight: 700 }}>{r.questions.reduce((s, q) => s + Math.max(...q.options.map(o => o.points)), 0)}</div></div>
                  </div>
                  <button onClick={() => { setNewRisk(r); setShowPreview(true); setShowCreateRisk(true); setPreviewAnswers({}); }} style={{ width: '100%', padding: '0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Play />Preview Questionnaire</button>
                </div>
              ))}</div>
            ) : (
              <div style={s.card}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}><button onClick={() => setShowPreview(false)} style={{ flex: 1, padding: '0.75rem', background: !showPreview ? 'rgba(59,130,246,0.2)' : 'rgba(148,163,184,0.1)', border: !showPreview ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: !showPreview ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontWeight: 500 }}>✏️ Build</button><button onClick={() => setShowPreview(true)} style={{ flex: 1, padding: '0.75rem', background: showPreview ? 'rgba(59,130,246,0.2)' : 'rgba(148,163,184,0.1)', border: showPreview ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: showPreview ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontWeight: 500 }}>👁️ Preview</button></div>

                <div style={{ minHeight: '400px' }}>
                  {!showPreview ? (
                    <>
                      <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Profile Name</label><input type="text" value={newRisk.name} onChange={e => setNewRisk({ ...newRisk, name: e.target.value })} placeholder="e.g., Standard Risk Assessment" style={s.input} /></div>
                        <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Description</label><input type="text" value={newRisk.description} onChange={e => setNewRisk({ ...newRisk, description: e.target.value })} placeholder="Brief description" style={s.input} /></div>
                      </div>

                      <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Questions</h3><button onClick={addQuestion} style={{ padding: '0.5rem 1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PlusCircle />Add Question</button></div>
                        {!newRisk.questions.length ? <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(15,23,42,0.4)', border: '2px dashed rgba(148,163,184,0.2)', borderRadius: '8px', color: '#64748b' }}>No questions yet. Click "Add Question" to start.</div> : <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>{newRisk.questions.map((q, qi) => (
                          <div key={q.id} style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                              <div style={{ flex: 1, marginRight: '1rem' }}><label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Question {qi + 1}</label><input type="text" value={q.text} onChange={e => updateQuestion(q.id, e.target.value)} placeholder="Enter question text..." style={s.input} /></div>
                              <button onClick={() => removeQuestion(q.id)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}><Trash /></button>
                            </div>
                            <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}><label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Answer Options</label><button onClick={() => addOption(q.id)} style={{ padding: '0.25rem 0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#60a5fa', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>+ Add Option</button></div><div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>{q.options.map((opt, oi) => (
                              <div key={oi} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
                                <input type="text" value={opt.text} onChange={e => updateOption(q.id, oi, 'text', e.target.value)} placeholder={`Option ${oi + 1}`} style={{ ...s.input, padding: '0.625rem' }} />
                                <input type="number" value={opt.points} onChange={e => updateOption(q.id, oi, 'points', e.target.value)} min="0" placeholder="Points" style={{ ...s.input, padding: '0.625rem' }} />
                                {q.options.length > 2 && <button onClick={() => removeOption(q.id, oi)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}><X /></button>}
                              </div>
                            ))}</div></div>
                          </div>
                        ))}</div>}
                      </div>

                      <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Scoring Rules</h3><button onClick={addRule} disabled={!portfolios.length} style={{ padding: '0.5rem 1rem', background: !portfolios.length ? 'rgba(71,85,105,0.1)' : 'rgba(59,130,246,0.1)', border: `1px solid ${!portfolios.length ? 'rgba(71,85,105,0.3)' : 'rgba(59,130,246,0.3)'}`, borderRadius: '8px', color: !portfolios.length ? '#475569' : '#60a5fa', cursor: !portfolios.length ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: !portfolios.length ? 0.5 : 1 }}><PlusCircle />Add Rule</button></div>
                        {!portfolios.length && <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', color: '#f59e0b', fontSize: '0.875rem', marginBottom: '1rem' }}>⚠️ Create model portfolios first</div>}
                        {!newRisk.scoringRules.length ? <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(15,23,42,0.4)', border: '2px dashed rgba(148,163,184,0.2)', borderRadius: '8px', color: '#64748b' }}>{portfolios.length ? 'No scoring rules. Click "Add Rule".' : 'Create portfolios first.'}</div> : <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{newRisk.scoringRules.map((rule, i) => (
                          <div key={i} style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem' }}>
                                <div><label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Min Score</label><input type="number" value={rule.minScore} onChange={e => updateRule(i, 'minScore', parseInt(e.target.value) || 0)} min="0" style={{ ...s.input, padding: '0.75rem' }} /></div>
                                <div><label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Max Score</label><input type="number" value={rule.maxScore} onChange={e => updateRule(i, 'maxScore', parseInt(e.target.value) || 0)} min="0" style={{ ...s.input, padding: '0.75rem' }} /></div>
                                <div><label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Recommended Portfolio</label><select value={rule.portfolioId} onChange={e => { updateRule(i, 'portfolioId', e.target.value); const sp = portfolios.find(p => p.id === e.target.value); if (sp) updateRule(i, 'label', sp.riskLevel); }} style={{ ...s.input, padding: '0.75rem', cursor: 'pointer' }}><option value="">Select Portfolio</option>{portfolios.map(p => <option key={p.id} value={p.id}>{p.name} ({p.riskLevel})</option>)}</select></div>
                              </div>
                              <button onClick={() => removeRule(i)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', marginLeft: '1rem' }}><Trash /></button>
                            </div>
                          </div>
                        ))}</div>}
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}><button onClick={() => { setShowCreateRisk(false); setNewRisk({ name: '', description: '', questions: [], scoringRules: [] }); }} style={{ flex: 1, padding: '0.875rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer', fontWeight: 500 }}>Cancel</button><button onClick={saveRisk} style={{ flex: 1, ...s.btn }}>Save Risk Profile</button></div>
                    </>
                  ) : (
                    <div>
                      <div style={{ padding: '1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.875rem', color: '#60a5fa' }}>📋 Preview: How advisors/clients will see this</div>
                      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>{newRisk.name || 'Risk Assessment'}</h3>
                      <p style={{ margin: '0 0 2rem', color: '#94a3b8', fontSize: '0.875rem' }}>{newRisk.description || 'Complete this questionnaire'}</p>
                      {newRisk.questions.map((q, qi) => (
                        <div key={q.id} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px' }}>
                          <div style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '1rem' }}>{qi + 1}. {q.text}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>{q.options.map((opt, oi) => (
                            <label key={oi} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', background: previewAnswers[q.id] === oi ? 'rgba(59,130,246,0.1)' : 'rgba(15,23,42,0.6)', border: `1px solid ${previewAnswers[q.id] === oi ? 'rgba(59,130,246,0.3)' : 'rgba(148,163,184,0.2)'}`, borderRadius: '6px', cursor: 'pointer' }}>
                              <input type="radio" name={q.id} checked={previewAnswers[q.id] === oi} onChange={() => setPreviewAnswers({ ...previewAnswers, [q.id]: oi })} style={{ marginRight: '0.75rem' }} />
                              <span style={{ fontSize: '0.875rem' }}>{opt.text}</span>
                              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#64748b' }}>{opt.points} {opt.points === 1 ? 'point' : 'points'}</span>
                            </label>
                          ))}</div>
                        </div>
                      ))}
                      {Object.keys(previewAnswers).length === newRisk.questions.length && (() => {
                        const score = calcScore();
                        const portfolio = getRecommended(score);
                        return (
                          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.1))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px' }}>
                            <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>Assessment Result</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                              <div><div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Total Score</div><div style={{ fontSize: '3rem', fontWeight: 700, color: '#3b82f6' }}>{score}</div></div>
                              {portfolio && <div><div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Recommended Portfolio</div><div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{portfolio.name}</div><div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>{portfolio.description}</div><div style={{ display: 'flex', justifyContent: 'center' }}><PieChart data={getPortfolioData(portfolio)} /></div></div>}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <ClientPortfolioModule products={products} portfolios={portfolios} />
        )}

        {activeTab === 'advisors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Advisor Management</h2>
                <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Onboard and manage financial advisors</p>
              </div>
              {!showCreateAdvisor && (
                <button onClick={() => setShowCreateAdvisor(true)} style={s.btn}>
                  <UserPlus />Onboard Advisor
                </button>
              )}
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginBottom: '0.5rem', fontWeight: 600 }}>TOTAL ADVISORS</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{advisors.length}</div>
              </div>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 600 }}>ACTIVE</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{advisors.filter(a => a.active).length}</div>
              </div>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginBottom: '0.5rem', fontWeight: 600 }}>PORTFOLIOS ASSIGNED</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{advisors.reduce((sum, a) => sum + a.assignedPortfolios.length, 0)}</div>
              </div>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginBottom: '0.5rem', fontWeight: 600 }}>RISK PROFILES ASSIGNED</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{advisors.reduce((sum, a) => sum + a.assignedRiskProfiles.length, 0)}</div>
              </div>
            </div>

            {!showCreateAdvisor ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {advisors.map(advisor => (
                  <div key={advisor.id} style={{ ...s.card, opacity: advisor.active ? 1 : 0.6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700 }}>
                            {advisor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>{advisor.name}</h3>
                            <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>{advisor.email}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                            <span style={{ 
                              padding: '0.25rem 0.75rem', 
                              background: advisor.active ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)', 
                              border: `1px solid ${advisor.active ? 'rgba(16,185,129,0.3)' : 'rgba(148,163,184,0.3)'}`, 
                              borderRadius: '6px', 
                              fontSize: '0.75rem', 
                              fontWeight: 600, 
                              color: advisor.active ? '#10b981' : '#94a3b8' 
                            }}>
                              {advisor.active ? '● Active' : '○ Inactive'}
                            </span>
                            <span style={{ 
                              padding: '0.25rem 0.75rem', 
                              background: 'rgba(139,92,246,0.1)', 
                              border: '1px solid rgba(139,92,246,0.3)', 
                              borderRadius: '6px', 
                              fontSize: '0.75rem', 
                              fontWeight: 600, 
                              color: '#a78bfa',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              <Shield />
                              {advisor.permissions}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Joined</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{new Date(advisor.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Assigned Portfolios</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                              {advisor.assignedPortfolios.length === 0 ? (
                                <span style={{ color: '#64748b' }}>None assigned</span>
                              ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                  {advisor.assignedPortfolios.map(pid => {
                                    const portfolio = portfolios.find(p => p.id === pid);
                                    return portfolio ? (
                                      <span key={pid} style={{ 
                                        padding: '0.125rem 0.5rem', 
                                        background: 'rgba(59,130,246,0.1)', 
                                        border: '1px solid rgba(59,130,246,0.3)', 
                                        borderRadius: '4px', 
                                        fontSize: '0.75rem',
                                        color: '#60a5fa'
                                      }}>
                                        {portfolio.name}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Assigned Risk Profiles</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                              {advisor.assignedRiskProfiles.length === 0 ? (
                                <span style={{ color: '#64748b' }}>None assigned</span>
                              ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                  {advisor.assignedRiskProfiles.map(rid => {
                                    const risk = riskProfiles.find(r => r.id === rid);
                                    return risk ? (
                                      <span key={rid} style={{ 
                                        padding: '0.125rem 0.5rem', 
                                        background: 'rgba(139,92,246,0.1)', 
                                        border: '1px solid rgba(139,92,246,0.3)', 
                                        borderRadius: '4px', 
                                        fontSize: '0.75rem',
                                        color: '#a78bfa'
                                      }}>
                                        {risk.name}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '2rem' }}>
                        <button 
                          onClick={() => toggleAdvisorStatus(advisor.id)} 
                          style={{ 
                            padding: '0.5rem', 
                            background: advisor.active ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', 
                            border: `1px solid ${advisor.active ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`, 
                            borderRadius: '8px', 
                            color: advisor.active ? '#f59e0b' : '#10b981', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title={advisor.active ? 'Disable advisor' : 'Enable advisor'}
                        >
                          {advisor.active ? <ToggleRight /> : <ToggleLeft />}
                        </button>
                        <button 
                          onClick={() => editAdvisor(advisor)} 
                          style={{ 
                            padding: '0.5rem', 
                            background: 'rgba(59,130,246,0.1)', 
                            border: '1px solid rgba(59,130,246,0.3)', 
                            borderRadius: '8px', 
                            color: '#60a5fa', 
                            cursor: 'pointer' 
                          }}
                          title="Edit advisor"
                        >
                          <Edit />
                        </button>
                        <button 
                          onClick={() => deleteAdvisor(advisor.id)} 
                          style={{ 
                            padding: '0.5rem', 
                            background: 'rgba(239,68,68,0.1)', 
                            border: '1px solid rgba(239,68,68,0.3)', 
                            borderRadius: '8px', 
                            color: '#ef4444', 
                            cursor: 'pointer' 
                          }}
                          title="Delete advisor"
                        >
                          <Trash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={s.card}>
                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
                  {editingAdvisor ? 'Edit Advisor' : 'Onboard New Advisor'}
                </h3>

                <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      value={newAdvisor.name} 
                      onChange={e => setNewAdvisor({ ...newAdvisor, name: e.target.value })} 
                      placeholder="e.g., Sarah Chen" 
                      style={s.input} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      value={newAdvisor.email} 
                      onChange={e => setNewAdvisor({ ...newAdvisor, email: e.target.value })} 
                      placeholder="sarah.chen@finfiles.com" 
                      style={s.input} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Permissions Level
                    </label>
                    <select 
                      value={newAdvisor.permissions} 
                      onChange={e => setNewAdvisor({ ...newAdvisor, permissions: e.target.value })} 
                      style={{ ...s.input, cursor: 'pointer' }}
                    >
                      <option value="Full Access">Full Access - Can view and use all portfolios & risk profiles</option>
                      <option value="Limited Access">Limited Access - Only assigned portfolios & risk profiles</option>
                      <option value="View Only">View Only - Read-only access</option>
                    </select>
                  </div>
                </div>

                {/* Portfolio Assignment */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>
                    Assign Model Portfolios
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', fontWeight: 400, color: '#64748b' }}>
                      ({newAdvisor.assignedPortfolios.length} selected)
                    </span>
                  </h4>
                  {portfolios.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(15,23,42,0.4)', border: '2px dashed rgba(148,163,184,0.2)', borderRadius: '8px', color: '#64748b' }}>
                      No portfolios available. Create portfolios first.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {portfolios.map(portfolio => (
                        <label 
                          key={portfolio.id} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            padding: '1rem', 
                            background: newAdvisor.assignedPortfolios.includes(portfolio.id) ? 'rgba(59,130,246,0.1)' : 'rgba(15,23,42,0.4)', 
                            border: `1px solid ${newAdvisor.assignedPortfolios.includes(portfolio.id) ? 'rgba(59,130,246,0.3)' : 'rgba(148,163,184,0.1)'}`, 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <input 
                            type="checkbox" 
                            checked={newAdvisor.assignedPortfolios.includes(portfolio.id)} 
                            onChange={() => togglePortfolioAssignment(portfolio.id)} 
                            style={{ marginRight: '0.75rem', cursor: 'pointer', width: '18px', height: '18px' }} 
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                              {portfolio.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              {portfolio.description} • {portfolio.riskLevel}
                            </div>
                          </div>
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            background: portfolio.riskLevel === 'Conservative' ? 'rgba(16,185,129,0.1)' : portfolio.riskLevel === 'Moderate' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', 
                            border: `1px solid ${portfolio.riskLevel === 'Conservative' ? 'rgba(16,185,129,0.3)' : portfolio.riskLevel === 'Moderate' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`, 
                            borderRadius: '4px', 
                            fontSize: '0.7rem', 
                            fontWeight: 600, 
                            color: portfolio.riskLevel === 'Conservative' ? '#10b981' : portfolio.riskLevel === 'Moderate' ? '#f59e0b' : '#ef4444' 
                          }}>
                            {portfolio.holdings.length} holdings
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Risk Profile Assignment */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>
                    Assign Risk Profiles
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', fontWeight: 400, color: '#64748b' }}>
                      ({newAdvisor.assignedRiskProfiles.length} selected)
                    </span>
                  </h4>
                  {riskProfiles.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(15,23,42,0.4)', border: '2px dashed rgba(148,163,184,0.2)', borderRadius: '8px', color: '#64748b' }}>
                      No risk profiles available. Create risk profiles first.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {riskProfiles.map(risk => (
                        <label 
                          key={risk.id} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            padding: '1rem', 
                            background: newAdvisor.assignedRiskProfiles.includes(risk.id) ? 'rgba(139,92,246,0.1)' : 'rgba(15,23,42,0.4)', 
                            border: `1px solid ${newAdvisor.assignedRiskProfiles.includes(risk.id) ? 'rgba(139,92,246,0.3)' : 'rgba(148,163,184,0.1)'}`, 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <input 
                            type="checkbox" 
                            checked={newAdvisor.assignedRiskProfiles.includes(risk.id)} 
                            onChange={() => toggleRiskProfileAssignment(risk.id)} 
                            style={{ marginRight: '0.75rem', cursor: 'pointer', width: '18px', height: '18px' }} 
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                              {risk.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              {risk.description}
                            </div>
                          </div>
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            background: 'rgba(139,92,246,0.1)', 
                            border: '1px solid rgba(139,92,246,0.3)', 
                            borderRadius: '4px', 
                            fontSize: '0.7rem', 
                            fontWeight: 600, 
                            color: '#a78bfa' 
                          }}>
                            {risk.questions.length} questions
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => { 
                      setShowCreateAdvisor(false); 
                      setNewAdvisor({ name: '', email: '', permissions: 'Full Access', assignedPortfolios: [], assignedRiskProfiles: [] }); 
                      setEditingAdvisor(null);
                    }} 
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
                    onClick={saveAdvisor} 
                    style={{ flex: 1, ...s.btn }}
                  >
                    <Check />
                    {editingAdvisor ? 'Update Advisor' : 'Save Advisor'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
