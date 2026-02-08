import React from 'react';

const Icon = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>;
const Search = () => <Icon d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35" />;
const ChevronDown = () => <Icon d="M6 9l6 6 6-6" size={16} />;

const GlobalHeader = ({ activeTab, onTabChange }) => {
  const mainTabs = [
    { id: 'home', label: 'Home' },
    { id: 'screener', label: 'Screener' },
    { id: 'universe', label: 'Universe' },
    { id: 'portfolios', label: 'Portfolios' },
    { id: 'risk', label: 'Risk' },
    { id: 'clients', label: 'Clients' },
    { id: 'goals', label: 'Goals' },
    { id: 'users', label: 'Users' }
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
      borderBottom: '1px solid rgba(59,130,246,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ padding: '2rem 3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#fff',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#1e40af',
              fontSize: '1.25rem'
            }}>
              F
            </div>
            <span style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 600 }}>FinFiles Investment Suite</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ color: '#e0e7ff', fontSize: '0.875rem', cursor: 'pointer' }}>English</span>
            <span style={{ color: '#e0e7ff', fontSize: '0.875rem', cursor: 'pointer' }}>Settings</span>
            <span style={{ color: '#e0e7ff', fontSize: '0.875rem', cursor: 'pointer' }}>Log out</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#fff'
          }}>
            AT
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#bfdbfe', marginBottom: '0.25rem' }}>Welcome Adrian Torfs</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>Investment Portfolio Suite</h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {mainTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                  border: activeTab === tab.id ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
                  borderRadius: '8px',
                  color: activeTab === tab.id ? '#fff' : '#bfdbfe',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{
            flex: 1,
            maxWidth: '500px',
            position: 'relative',
            minWidth: '300px'
          }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
              <Search />
            </div>
            <input
              type="text"
              placeholder="Search investments"
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 3rem',
                background: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#1e293b',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <button style={{
              padding: '0.875rem 1.25rem',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit'
            }}>
              Selection lists <ChevronDown />
            </button>
            <button style={{
              padding: '0.875rem 1.25rem',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit'
            }}>
              Model portfolios <ChevronDown />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalHeader;
