import React from 'react';

const Icon = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>;
const Search = () => <Icon d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35" />;
const ChevronDown = () => <Icon d="M6 9l6 6 6-6" size={16} />;

const DashboardHome = ({ onNavigate = () => {} }) => {
  const newsItems = [
    {
      id: 1,
      title: 'Are Stock Investors in for Another Tech Wreck?',
      source: 'Provided by PR Newswire Feb 5, 2025 5:28pm',
      color: '#1e293b'
    },
    {
      id: 2,
      title: 'Gold Just Hit a New Record. What\'s Next?',
      source: 'Provided by PR Newswire Feb 5, 2025 5:28pm',
      color: '#d97706'
    },
    {
      id: 3,
      title: 'Why Long-Term Interest Rates Are Still Climbing—And What That Means For Your Portfolio',
      source: 'Provided by PR Newswire Feb 5, 2025 5:28pm',
      color: '#64748b'
    }
  ];

  const watchlistItems = [
    'Watchlist Thematic Funds',
    'Watchlist Europe Large Caps',
    'Watchlist Global Equity',
    'Watchlist High Dividend'
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
        padding: '2rem 3rem',
        borderBottom: '1px solid rgba(59,130,246,0.3)'
      }}>
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
            <button style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'inherit'
            }}>
              Home
            </button>
            <button onClick={() => onNavigate('screener')} style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#bfdbfe',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}>
              Screener
            </button>
            <button onClick={() => onNavigate('universe')} style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#bfdbfe',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}>
              Universe
            </button>
            <button onClick={() => onNavigate('portfolios')} style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#bfdbfe',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}>
              Portfolios
            </button>
            <button onClick={() => onNavigate('riskProfiles')} style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#bfdbfe',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}>
              Risk
            </button>
            <button onClick={() => onNavigate('clients')} style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#bfdbfe',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}>
              Clients
            </button>
            <button onClick={() => onNavigate('goals')} style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#bfdbfe',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}>
              Goals
            </button>
            <button onClick={() => onNavigate('users')} style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#bfdbfe',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}>
              Users
            </button>
          </div>

          <div style={{
            flex: 1,
            maxWidth: '500px',
            position: 'relative'
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
                color: '#1e293b'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
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
              gap: '0.5rem'
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
              gap: '0.5rem'
            }}>
              Model portfolios <ChevronDown />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '2rem 3rem', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(148,163,184,0.2)',
            borderRadius: '12px',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>Global markets</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(148,163,184,0.1)',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}>
                  Graph
                </button>
                <button style={{
                  padding: '0.5rem 1rem',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Heatmap
                </button>
              </div>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>Heatmap sentiment</div>
            <div style={{
              background: 'rgba(15,23,42,0.8)',
              borderRadius: '8px',
              padding: '2rem',
              minHeight: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(148,163,184,0.1)'
            }}>
              <div style={{
                width: '100%',
                height: '200px',
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '0.5rem'
              }}>
                {[
                  '#ef4444', '#dc2626', '#f87171', '#10b981', '#22c55e', '#ef4444',
                  '#fbbf24', '#10b981', '#ef4444', '#22c55e', '#f87171', '#fbbf24',
                  '#10b981', '#ef4444', '#22c55e', '#fbbf24', '#ef4444', '#10b981'
                ].map((color, i) => (
                  <div key={i} style={{
                    background: color,
                    borderRadius: '4px',
                    opacity: 0.7
                  }} />
                ))}
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(148,163,184,0.2)',
            borderRadius: '12px',
            padding: '2rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, marginBottom: '1.5rem', color: '#f1f5f9' }}>Performance Markets</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              <select style={{
                padding: '0.5rem 1rem',
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: '6px',
                color: '#f1f5f9',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                <option>Portfolio</option>
              </select>
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                <button style={{
                  padding: '0.5rem 0.875rem',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  1 month
                </button>
                <button style={{
                  padding: '0.5rem 0.875rem',
                  background: 'rgba(148,163,184,0.1)',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  3 months
                </button>
                <button style={{
                  padding: '0.5rem 0.875rem',
                  background: 'rgba(148,163,184,0.1)',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  YTD
                </button>
                <button style={{
                  padding: '0.5rem 0.875rem',
                  background: 'rgba(148,163,184,0.1)',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  1 year
                </button>
              </div>
            </div>
            <div style={{
              background: 'rgba(15,23,42,0.8)',
              borderRadius: '8px',
              padding: '2rem',
              minHeight: '250px',
              border: '1px solid rgba(148,163,184,0.1)',
              position: 'relative'
            }}>
              <svg width="100%" height="220" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,180 L 30,175 L 60,170 L 90,165 L 120,155 L 150,150 L 180,140 L 210,130 L 240,120 L 270,110 L 300,100 L 330,85 L 360,70 L 390,50 L 420,40 L 450,30 L 480,25 L 510,20 L 540,15 L 570,10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <path
                  d="M 0,180 L 30,175 L 60,170 L 90,165 L 120,155 L 150,150 L 180,140 L 210,130 L 240,120 L 270,110 L 300,100 L 330,85 L 360,70 L 390,50 L 420,40 L 450,30 L 480,25 L 510,20 L 540,15 L 570,10 L 570,220 L 0,220 Z"
                  fill="url(#areaGradient)"
                />
              </svg>
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#3b82f6'
                }} />
                MSCI World
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(148,163,184,0.2)',
            borderRadius: '12px',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>Morningstar News</h2>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>MORNINGSTAR</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {newsItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', cursor: 'pointer' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    background: item.color,
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#f1f5f9',
                      margin: '0 0 0.5rem 0',
                      lineHeight: '1.4'
                    }}>
                      {item.title}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {item.source}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(147,197,253,0.15), rgba(191,219,254,0.05))',
              border: '1px solid rgba(147,197,253,0.3)',
              borderRadius: '12px',
              padding: '2rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, marginBottom: '1.5rem', color: '#f1f5f9' }}>Search clients</h2>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                  <Search />
                </div>
                <input
                  type="text"
                  placeholder="Client number"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 3rem',
                    background: 'rgba(15,23,42,0.6)',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#f1f5f9'
                  }}
                />
              </div>
            </div>

            <div style={{
              background: 'rgba(15,23,42,0.6)',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: '12px',
              padding: '2rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, marginBottom: '1.5rem', color: '#f1f5f9' }}>My watchlist</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {watchlistItems.map((item, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      color: '#60a5fa',
                      fontSize: '0.9375rem',
                      textDecoration: 'none',
                      display: 'block',
                      padding: '0.5rem 0',
                      transition: 'color 0.2s'
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        padding: '2rem 3rem',
        borderTop: '1px solid rgba(148,163,184,0.1)',
        marginTop: '4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>MORNINGSTAR</span>
          <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>FINFILES</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          © Copyright 2025 FinFiles & Morningstar. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
