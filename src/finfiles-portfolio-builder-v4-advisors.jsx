import React, { useState, useEffect } from 'react';
import { ClientPortfolioModule } from './ClientPortfolioModule';
import { ScreenerModule } from './ScreenerModule';
import { UniverseModule } from './UniverseModule';
import { PortfolioBuilder } from './PortfolioBuilder';
import GoalPlanningModule from './GoalPlanningModule';
import DashboardHome from './DashboardHome';
import AppHeader from './components/AppHeader';
import { EXTENDED_MOCK_PRODUCTS } from './mockProducts';
import { ReportGenerator } from './utils/ReportGenerator';
import { DataExporter } from './utils/DataExporter';
import { styles, colors } from './styles/sharedStyles';

const MOCK_PRODUCTS = [
  { id: 'MF001', ticker: 'VTSAX', name: 'Vanguard Total Stock Market Index Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.04, aum: 1250000000000, morningstarRating: 5, ytdReturn: 12.5 },
  { id: 'ETF001', ticker: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Intermediate Core Bond', region: 'US', riskRating: 2, expenseRatio: 0.03, aum: 94000000000, morningstarRating: 4, ytdReturn: -1.2 },
  { id: 'MF002', ticker: 'FIGFX', name: 'Fidelity International Growth Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Foreign Large Growth', region: 'International', riskRating: 5, expenseRatio: 0.89, aum: 12500000000, morningstarRating: 4, ytdReturn: 18.3 },
  { id: 'ETF002', ticker: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', assetClass: 'Equity', category: 'Large Growth', region: 'US', riskRating: 5, expenseRatio: 0.20, aum: 245000000000, morningstarRating: 5, ytdReturn: 25.7 },
  { id: 'MF003', ticker: 'PONDX', name: 'PIMCO Income Fund', type: 'Mutual Fund', assetClass: 'Fixed Income', category: 'Multisector Bond', region: 'Global', riskRating: 3, expenseRatio: 0.75, aum: 98000000000, morningstarRating: 5, ytdReturn: 5.8 }
];

// Icons
const Icon = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>;
const PlusCircle = () => <Icon d="M12 2 A10 10 0 1 1 2 12 A10 10 0 0 1 12 2 M12 8 L12 16 M8 12 L16 12" />;
const Search = ({ size = 20 }) => <Icon d="M11 19 A8 8 0 1 1 19 11 A8 8 0 0 1 11 19 M21 21 L16.65 16.65" size={size} />;
const Check = () => <Icon d="M20 6 L9 17 L4 12" />;
const X = () => <Icon d="M18 6 L6 18 M6 6 L18 18" />;
const Trash = ({ size = 18 }) => <Icon d="M3 6 L21 6 M19 6 L19 20 A2 2 0 0 1 17 22 L7 22 A2 2 0 0 1 5 20 L5 6 M8 6 L8 4 A2 2 0 0 1 10 2 L14 2 A2 2 0 0 1 16 4 L16 6" size={size} />;
const Edit = ({ size = 18 }) => <Icon d="M11 4 L4 4 A2 2 0 0 0 2 6 L2 20 A2 2 0 0 0 4 22 L18 22 A2 2 0 0 0 20 20 L20 13 M18.5 2.5 A2.121 2.121 0 0 1 21.5 5.5 L12 15 L8 16 L9 12 Z" size={size} />;
const Play = () => <Icon d="M5 3 L19 12 L5 21 Z" />;
const Users = () => <Icon d="M17 21 L17 19 A4 4 0 0 0 13 15 L11 15 A4 4 0 0 0 7 19 L7 21 M12 11 A4 4 0 1 0 12 3 A4 4 0 0 0 12 11 M23 21 L23 19 A4 4 0 0 0 19.03 15.05 M16 3.13 A4 4 0 0 1 16 11" />;
const UserPlus = () => <Icon d="M16 21 L16 19 A4 4 0 0 0 12 15 L8 15 A4 4 0 0 0 4 19 L4 21 M12 11 A4 4 0 1 0 12 3 A4 4 0 0 0 12 11 M20 8 L20 14 M23 11 L17 11" />;
const ToggleLeft = () => <Icon d="M1 12 A6 6 0 0 0 7 18 L17 18 A6 6 0 0 0 23 12 A6 6 0 0 0 17 6 L7 6 A6 6 0 0 0 1 12 M7 15 A3 3 0 1 1 7 9 A3 3 0 0 1 7 15" />;
const ToggleRight = () => <Icon d="M1 12 A6 6 0 0 0 7 18 L17 18 A6 6 0 0 0 23 12 A6 6 0 0 0 17 6 L7 6 A6 6 0 0 0 1 12 M17 15 A3 3 0 1 1 17 9 A3 3 0 0 1 17 15" />;
const Shield = () => <Icon d="M12 22 L12 22 C12 22 3 18 3 12 L3 5 L12 2 L21 5 L21 12 C21 18 12 22 12 22 Z" />;
const Target = () => <Icon d="M12 22 A10 10 0 1 1 22 12 A10 10 0 0 1 12 22 M12 18 A6 6 0 1 1 18 12 A6 6 0 0 1 12 18 M12 14 A2 2 0 1 1 14 12 A2 2 0 0 1 12 14" />;
const FileText = () => <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />;
const Download = () => <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" />;
const ChevronLeft = () => <Icon d="M15 18 L9 12 L15 6" />;

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
  const [activeTab, setActiveTab] = useState('home');
  const [allProducts] = useState(EXTENDED_MOCK_PRODUCTS);
  const [universeProducts, setUniverseProducts] = useState(MOCK_PRODUCTS);
  const [products] = useState(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAsset, setFilterAsset] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [portfolios, setPortfolios] = useState([
    { id: 'P1', name: 'Conservative Growth', description: 'Low-risk capital preservation', riskLevel: 'Conservative', maxDrawdown: 10, holdings: [{ productId: 'ETF001', weight: 60 }, { productId: 'MF001', weight: 30 }, { productId: 'MF003', weight: 10 }] },
    { id: 'P2', name: 'Balanced Moderate', description: 'Growth and stability mix', riskLevel: 'Moderate', maxDrawdown: 18, holdings: [{ productId: 'MF001', weight: 50 }, { productId: 'ETF001', weight: 40 }, { productId: 'MF002', weight: 10 }] },
    { id: 'P3', name: 'Aggressive Growth', description: 'High-growth equity focus', riskLevel: 'Aggressive', maxDrawdown: 25, holdings: [{ productId: 'ETF002', weight: 50 }, { productId: 'MF002', weight: 30 }, { productId: 'MF001', weight: 20 }] }
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

  // Client Management State
  const [clients, setClients] = useState([
    { id: 'C1', name: 'Robert Johnson', email: 'robert.j@email.com', phone: '555-0123', riskProfile: 'Conservative', assignedAdvisor: 'U2', joinedDate: '2025-11-01', portfolioValue: 450000, status: 'Active' },
    { id: 'C2', name: 'Emma Williams', email: 'emma.w@email.com', phone: '555-0124', riskProfile: 'Moderate', assignedAdvisor: 'U2', joinedDate: '2025-12-15', portfolioValue: 780000, status: 'Active' },
    { id: 'C3', name: 'David Martinez', email: 'david.m@email.com', phone: '555-0125', riskProfile: 'Aggressive', assignedAdvisor: 'U1', joinedDate: '2026-01-10', portfolioValue: 1200000, status: 'Active' }
  ]);

  // User Management State
  const [users, setUsers] = useState([
    { id: 'U1', name: 'Sarah Chen', email: 'sarah.chen@finfiles.com', active: true, assignedPortfolios: ['P1', 'P2'], assignedRiskProfiles: ['R1'], permissions: 'Full Access', role: 'Admin', joinedDate: '2025-11-15' },
    { id: 'U2', name: 'Michael Rodriguez', email: 'michael.r@finfiles.com', active: true, assignedPortfolios: ['P2', 'P3'], assignedRiskProfiles: ['R1'], permissions: 'Full Access', role: 'Advisor', joinedDate: '2025-12-03' },
    { id: 'U3', name: 'Emily Watson', email: 'emily.watson@finfiles.com', active: true, assignedPortfolios: ['P1'], assignedRiskProfiles: [], permissions: 'Limited Access', role: 'Investment Committee', joinedDate: '2025-10-22' },
    { id: 'U4', name: 'James Cooper', email: 'james.cooper@finfiles.com', active: true, assignedPortfolios: [], assignedRiskProfiles: ['R1'], permissions: 'Limited Access', role: 'Compliance Officer', joinedDate: '2025-12-10' }
  ]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', permissions: 'Full Access', role: 'Advisor', assignedPortfolios: [], assignedRiskProfiles: [] });
  const [editingUser, setEditingUser] = useState(null);

  // Risk Level Management State
  const [riskLevels, setRiskLevels] = useState([
    { id: 'RL1', name: 'Conservative', color: '#10b981', description: 'Low-risk capital preservation strategy' },
    { id: 'RL2', name: 'Moderate', color: '#f59e0b', description: 'Balanced growth and stability' },
    { id: 'RL3', name: 'Aggressive', color: '#ef4444', description: 'High-growth equity focused' }
  ]);
  const [showManageRiskLevels, setShowManageRiskLevels] = useState(false);
  const [editingRiskLevel, setEditingRiskLevel] = useState(null);
  const [newRiskLevel, setNewRiskLevel] = useState({ name: '', color: '#3b82f6', description: '' });

  const filteredProducts = products.filter(p => {
    const search = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.ticker.toLowerCase().includes(searchTerm.toLowerCase());
    const filter = filterAsset === 'all' || p.assetClass === filterAsset;
    return search && filter;
  });

  const chartColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
  const getPortfolioData = (portfolio) => portfolio.holdings.map((h, i) => ({ value: h.weight, color: chartColors[i % chartColors.length], label: products.find(p => p.id === h.productId)?.ticker || 'N/A' }));

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
    newPortfolio.holdings.forEach(holding => {
      if (holding.productId) {
        localStorage.setItem(`product_last_used_${holding.productId}`, Date.now().toString());
      }
    });
    setPortfolios([...portfolios, { ...newPortfolio, id: `P${portfolios.length + 1}` }]);
    setShowCreatePortfolio(false);
    setNewPortfolio({ name: '', description: '', riskLevel: 'Moderate', holdings: [] });
  };
  const deletePortfolio = (id) => { if (confirm('Delete portfolio?')) setPortfolios(portfolios.filter(p => p.id !== id)); };

  const generatePortfolioReport = (portfolio) => {
    try {
      const reportGen = new ReportGenerator();
      const doc = reportGen.generatePortfolioReport(portfolio, products);
      doc.save(`${portfolio.name.replace(/\s+/g, '_')}_Report.pdf`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please check the console for details.');
    }
  };

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

  // User Management Functions
  const saveUser = () => {
    if (!newUser.name || !newUser.email) return alert('Name and email required');
    if (!newUser.role) return alert('Role is required');
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...newUser } : u));
      setEditingUser(null);
    } else {
      setUsers([...users, { ...newUser, id: `U${users.length + 1}`, active: true, joinedDate: new Date().toISOString().split('T')[0] }]);
    }
    setShowCreateUser(false);
    setNewUser({ name: '', email: '', permissions: 'Full Access', role: 'Advisor', assignedPortfolios: [], assignedRiskProfiles: [] });
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const deleteUser = (id) => {
    if (confirm('Delete this user? This action cannot be undone.')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      permissions: user.permissions,
      role: user.role,
      assignedPortfolios: user.assignedPortfolios,
      assignedRiskProfiles: user.assignedRiskProfiles
    });
    setShowCreateUser(true);
  };

  const togglePortfolioAssignment = (portfolioId) => {
    const current = newUser.assignedPortfolios;
    setNewUser({
      ...newUser,
      assignedPortfolios: current.includes(portfolioId)
        ? current.filter(id => id !== portfolioId)
        : [...current, portfolioId]
    });
  };

  const toggleRiskProfileAssignment = (riskId) => {
    const current = newUser.assignedRiskProfiles;
    setNewUser({
      ...newUser,
      assignedRiskProfiles: current.includes(riskId)
        ? current.filter(id => id !== riskId)
        : [...current, riskId]
    });
  };

  // Risk Level Management Functions
  const saveRiskLevel = () => {
    if (!newRiskLevel.name.trim()) return alert('Risk level name is required');
    if (editingRiskLevel) {
      setRiskLevels(riskLevels.map(rl => rl.id === editingRiskLevel.id ? { ...editingRiskLevel, ...newRiskLevel } : rl));
      setEditingRiskLevel(null);
    } else {
      setRiskLevels([...riskLevels, { ...newRiskLevel, id: `RL${riskLevels.length + 1}` }]);
    }
    setNewRiskLevel({ name: '', color: '#3b82f6', description: '' });
  };

  const deleteRiskLevel = (id) => {
    const inUse = portfolios.some(p => p.riskLevel === riskLevels.find(rl => rl.id === id)?.name);
    if (inUse) return alert('Cannot delete: This risk level is assigned to one or more portfolios');
    if (confirm('Delete this risk level?')) setRiskLevels(riskLevels.filter(rl => rl.id !== id));
  };

  const editRiskLevel = (riskLevel) => {
    setEditingRiskLevel(riskLevel);
    setNewRiskLevel({ name: riskLevel.name, color: riskLevel.color, description: riskLevel.description });
  };

  const getRiskLevelByName = (name) => riskLevels.find(rl => rl.name === name) || { color: '#94a3b8' };

  const getRoleColor = (role) => {
    const colors = {
      'Admin': { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)', text: '#a78bfa' },
      'Advisor': { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa' },
      'Investment Committee': { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', text: '#818cf8' },
      'Compliance Officer': { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' }
    };
    return colors[role] || { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)', text: '#94a3b8' };
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.background.primary, color: colors.text.primary, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
      {activeTab !== 'home' && <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />}

      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: activeTab === 'home' ? '0' : '2rem 3rem' }}>
        {activeTab === 'home' && <DashboardHome onNavigate={setActiveTab} />}

        {activeTab === 'screener' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={styles.sectionTitle}>Product Screener</h2>
              <p style={styles.sectionSubtitle}>Search and filter investment products to add to your universe</p>
            </div>
            <ScreenerModule allProducts={allProducts} universeProducts={universeProducts} onAddToUniverse={(products) => {
              products.forEach(product => {
                localStorage.setItem(`product_added_${product.id}`, Date.now().toString());
              });
              setUniverseProducts([...universeProducts, ...products]);
              alert(`Added ${products.length} product${products.length !== 1 ? 's' : ''} to your universe!`);
            }} />
          </div>
        )}

        {activeTab === 'universe' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={styles.sectionTitle}>Product Universe</h2>
              <p style={styles.sectionSubtitle}>Manage and organize your investment product universe</p>
            </div>
            <UniverseModule
              universeProducts={universeProducts}
              portfolios={portfolios}
              onRemoveProduct={(productId) => {
                setUniverseProducts(universeProducts.filter(p => p.id !== productId));
                localStorage.removeItem(`product_labels_${productId}`);
              }}
              onAddProducts={(newProducts) => {
                setUniverseProducts([...universeProducts, ...newProducts]);
              }}
            />
          </div>
        )}

        {activeTab === 'portfolios' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div><h2 style={styles.sectionTitle}>Model Portfolios</h2><p style={styles.sectionSubtitle}>Create and manage portfolio templates</p></div>
              {!showCreatePortfolio && <button onClick={() => setShowCreatePortfolio(true)} style={s.btn}><PlusCircle />Create Portfolio</button>}
            </div>

            <div style={{ ...s.card, marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(59,130,246,0.05))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>Risk Level Manager</h3>
                  <p style={styles.sectionSubtitle}>Define risk levels for portfolio categorization</p>
                </div>
                <button onClick={() => setShowManageRiskLevels(!showManageRiskLevels)} style={{ padding: '0.625rem 1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                  {showManageRiskLevels ? 'Hide' : 'Manage Risk Levels'}
                </button>
              </div>

              {showManageRiskLevels && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {riskLevels.map(rl => (
                      <div key={rl.id} style={{ padding: '1rem', background: 'rgba(15,23,42,0.4)', border: `2px solid ${rl.color}33`, borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: rl.color }}></div>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{rl.name}</h4>
                          </div>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button onClick={() => { editRiskLevel(rl); }} style={{ padding: '0.375rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#60a5fa', cursor: 'pointer', fontSize: '0.75rem' }}><Edit size={14} /></button>
                            <button onClick={() => deleteRiskLevel(rl.id)} style={{ padding: '0.375rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}><Trash size={14} /></button>
                          </div>
                        </div>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>{rl.description || 'No description'}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '1.5rem', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>
                      {editingRiskLevel ? 'EDIT RISK LEVEL' : 'ADD NEW RISK LEVEL'}
                    </h4>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Risk Level Name</label>
                          <input type="text" value={newRiskLevel.name} onChange={e => setNewRiskLevel({ ...newRiskLevel, name: e.target.value })} placeholder="e.g., Moderately Conservative" style={s.input} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Color</label>
                          <input type="color" value={newRiskLevel.color} onChange={e => setNewRiskLevel({ ...newRiskLevel, color: e.target.value })} style={{ ...s.input, height: '42px', cursor: 'pointer' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Description</label>
                        <input type="text" value={newRiskLevel.description} onChange={e => setNewRiskLevel({ ...newRiskLevel, description: e.target.value })} placeholder="Brief description of this risk level" style={s.input} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={saveRiskLevel} style={{ ...s.btn, flex: 1 }}>
                          {editingRiskLevel ? 'Update Risk Level' : 'Add Risk Level'}
                        </button>
                        {editingRiskLevel && (
                          <button onClick={() => { setEditingRiskLevel(null); setNewRiskLevel({ name: '', color: '#3b82f6', description: '' }); }} style={{ padding: '0.875rem 1.5rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, cursor: 'pointer' }}>
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!showCreatePortfolio ? (
              <div style={{ display: 'grid', gap: '1.5rem' }}>{portfolios.map(p => {
                const riskLevelInfo = getRiskLevelByName(p.riskLevel);
                const riskColor = riskLevelInfo.color;
                return (
                <div key={p.id} style={s.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1 }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}><h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{p.name}</h3><span style={{ padding: '0.25rem 0.75rem', background: `${riskColor}1A`, border: `1px solid ${riskColor}4D`, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: riskColor }}>{p.riskLevel}</span></div><p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>{p.description}</p></div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => generatePortfolioReport(p)} style={{ padding: '0.5rem 1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}><FileText /> Generate Report</button>
                      <button onClick={() => deletePortfolio(p.id)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}><Trash /></button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div><h4 style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>HOLDINGS</h4><div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{p.holdings.map((h, i) => { const prod = products.find(pr => pr.id === h.productId); return prod ? <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px' }}><div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{prod.ticker}</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>{prod.name}</div></div><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6' }}>{h.weight}%</div></div> : null; })}</div></div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><h4 style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>ALLOCATION</h4><PieChart data={getPortfolioData(p)} /></div>
                  </div>
                </div>
              );
              })}</div>
            ) : (
              <PortfolioBuilder
                portfolios={portfolios}
                universeProducts={universeProducts}
                riskLevels={riskLevels}
                onSave={(portfolio) => {
                  setPortfolios([...portfolios, portfolio]);
                  setShowCreatePortfolio(false);
                }}
                onCancel={() => {
                  setShowCreatePortfolio(false);
                  setNewPortfolio({ name: '', description: '', riskLevel: 'Moderate', holdings: [] });
                }}
                getProductLabels={(productId) => {
                  return JSON.parse(localStorage.getItem(`product_labels_${productId}`) || '{"tags":[],"available":true}');
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'risk' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div><h2 style={styles.sectionTitle}>Risk Profile Builder</h2><p style={styles.sectionSubtitle}>Create risk questionnaires and scoring rules</p></div>
              {!showCreateRisk && <button onClick={() => setShowCreateRisk(true)} style={s.btn}><PlusCircle />Create Risk Profile</button>}
            </div>

            {!showCreateRisk ? (
              <div style={{ display: 'grid', gap: '1.5rem' }}>{riskProfiles.map(r => (
                <div key={r.id} style={s.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div><h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{r.name}</h3><p style={styles.sectionSubtitle}>{r.description}</p></div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => { setNewRisk(r); setShowCreateRisk(true); setShowPreview(false); }} style={{ padding: '0.5rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer' }}><Edit /></button>
                      <button onClick={() => deleteRisk(r.id)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}><Trash /></button>
                    </div>
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
                      <div style={{ padding: '1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.875rem', color: '#60a5fa' }}>📋 Preview: How users/clients will see this</div>
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
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(148,163,184,0.2)' }}>
                        <button
                          onClick={() => setShowPreview(false)}
                          style={{
                            flex: 1,
                            padding: '0.875rem',
                            background: 'rgba(148,163,184,0.1)',
                            border: '1px solid rgba(148,163,184,0.2)',
                            borderRadius: '8px',
                            color: '#f1f5f9',
                            cursor: 'pointer',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <ChevronLeft /> Back to Editor
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <ClientPortfolioModule products={products} portfolios={portfolios} clients={clients} />
        )}

        {activeTab === 'goals' && (
          <GoalPlanningModule clients={clients} portfolios={portfolios} riskProfiles={riskProfiles} />
        )}

        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={styles.sectionTitle}>User Management</h2>
                <p style={styles.sectionSubtitle}>Manage system users and their roles</p>
              </div>
              {!showCreateUser && (
                <button onClick={() => setShowCreateUser(true)} style={s.btn}>
                  <UserPlus />Add User
                </button>
              )}
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginBottom: '0.5rem', fontWeight: 600 }}>TOTAL USERS</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{users.length}</div>
              </div>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 600 }}>ACTIVE</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{users.filter(u => u.active).length}</div>
              </div>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginBottom: '0.5rem', fontWeight: 600 }}>PORTFOLIOS ASSIGNED</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{users.reduce((sum, u) => sum + u.assignedPortfolios.length, 0)}</div>
              </div>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginBottom: '0.5rem', fontWeight: 600 }}>RISK PROFILES ASSIGNED</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{users.reduce((sum, u) => sum + u.assignedRiskProfiles.length, 0)}</div>
              </div>
            </div>

            {!showCreateUser ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {users.map(user => {
                  const roleColors = getRoleColor(user.role);
                  return (
                  <div key={user.id} style={{ ...s.card, opacity: user.active ? 1 : 0.6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700 }}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>{user.name}</h3>
                            <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>{user.email}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem', flexWrap: 'wrap' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              background: user.active ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)',
                              border: `1px solid ${user.active ? 'rgba(16,185,129,0.3)' : 'rgba(148,163,184,0.3)'}`,
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: user.active ? '#10b981' : '#94a3b8'
                            }}>
                              {user.active ? '● Active' : '○ Inactive'}
                            </span>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              background: roleColors.bg,
                              border: `1px solid ${roleColors.border}`,
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: roleColors.text
                            }}>
                              {user.role}
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
                              {user.permissions}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Joined</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Assigned Portfolios</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                              {user.assignedPortfolios.length === 0 ? (
                                <span style={{ color: '#64748b' }}>None assigned</span>
                              ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                  {user.assignedPortfolios.map(pid => {
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
                              {user.assignedRiskProfiles.length === 0 ? (
                                <span style={{ color: '#64748b' }}>None assigned</span>
                              ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                  {user.assignedRiskProfiles.map(rid => {
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
                          onClick={() => toggleUserStatus(user.id)}
                          style={{
                            padding: '0.5rem',
                            background: user.active ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                            border: `1px solid ${user.active ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                            borderRadius: '8px',
                            color: user.active ? '#f59e0b' : '#10b981',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title={user.active ? 'Disable user' : 'Enable user'}
                        >
                          {user.active ? <ToggleRight /> : <ToggleLeft />}
                        </button>
                        <button
                          onClick={() => editUser(user)}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(59,130,246,0.1)',
                            border: '1px solid rgba(59,130,246,0.3)',
                            borderRadius: '8px',
                            color: '#60a5fa',
                            cursor: 'pointer'
                          }}
                          title="Edit user"
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '8px',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                          title="Delete user"
                        >
                          <Trash />
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div style={s.card}>
                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>

                <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={e => setNewUser({ ...newUser, name: e.target.value })}
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
                      value={newUser.email}
                      onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="sarah.chen@finfiles.com"
                      style={s.input}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Role *
                    </label>
                    <select
                      value={newUser.role}
                      onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                      style={{ ...s.input, cursor: 'pointer' }}
                    >
                      <option value="Admin">Admin - Full system administrator</option>
                      <option value="Advisor">Advisor - Financial advisor with client management</option>
                      <option value="Investment Committee">Investment Committee - Portfolio review and approval</option>
                      <option value="Compliance Officer">Compliance Officer - Compliance oversight</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                      Permissions Level
                    </label>
                    <select
                      value={newUser.permissions}
                      onChange={e => setNewUser({ ...newUser, permissions: e.target.value })}
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
                      ({newUser.assignedPortfolios.length} selected)
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
                            background: newUser.assignedPortfolios.includes(portfolio.id) ? 'rgba(59,130,246,0.1)' : 'rgba(15,23,42,0.4)', 
                            border: `1px solid ${newUser.assignedPortfolios.includes(portfolio.id) ? 'rgba(59,130,246,0.3)' : 'rgba(148,163,184,0.1)'}`, 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <input 
                            type="checkbox" 
                            checked={newUser.assignedPortfolios.includes(portfolio.id)} 
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
                      ({newUser.assignedRiskProfiles.length} selected)
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
                            background: newUser.assignedRiskProfiles.includes(risk.id) ? 'rgba(139,92,246,0.1)' : 'rgba(15,23,42,0.4)', 
                            border: `1px solid ${newUser.assignedRiskProfiles.includes(risk.id) ? 'rgba(139,92,246,0.3)' : 'rgba(148,163,184,0.1)'}`, 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <input 
                            type="checkbox" 
                            checked={newUser.assignedRiskProfiles.includes(risk.id)} 
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
                      setShowCreateUser(false);
                      setNewUser({ name: '', email: '', permissions: 'Full Access', role: 'Advisor', assignedPortfolios: [], assignedRiskProfiles: [] });
                      setEditingUser(null);
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
                    onClick={saveUser}
                    style={{ flex: 1, ...s.btn }}
                  >
                    <Check />
                    {editingUser ? 'Update User' : 'Save User'}
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
