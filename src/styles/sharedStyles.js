export const colors = {
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    card: 'rgba(15,23,42,0.6)',
    cardHover: 'rgba(59,130,246,0.05)',
    blue: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
    blueLight: 'linear-gradient(135deg, rgba(147,197,253,0.15), rgba(191,219,254,0.05))'
  },
  border: {
    default: 'rgba(148,163,184,0.2)',
    light: 'rgba(148,163,184,0.1)',
    blue: 'rgba(59,130,246,0.3)',
    blueLight: 'rgba(147,197,253,0.3)'
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    muted: '#64748b',
    light: '#e0e7ff',
    blue: '#60a5fa',
    blueLight: '#bfdbfe'
  },
  accent: {
    blue: '#3b82f6',
    purple: '#8b5cf6',
    green: '#10b981',
    red: '#ef4444',
    orange: '#f59e0b',
    yellow: '#fbbf24'
  },
  status: {
    success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
    error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
    warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' },
    info: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa' },
    purple: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)', text: '#a78bfa' }
  }
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  xxl: '2rem',
  xxxl: '3rem'
};

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '50%'
};

export const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: colors.background.primary,
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
    color: colors.text.primary
  },

  header: {
    background: colors.background.blue,
    padding: '2rem 3rem',
    borderBottom: `1px solid ${colors.border.blue}`
  },

  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },

  logo: {
    width: '40px',
    height: '40px',
    background: '#fff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    color: colors.accent.blue,
    fontSize: '1.25rem'
  },

  headerNav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },

  headerLink: {
    color: colors.text.light,
    fontSize: '0.875rem',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: 'inherit'
  },

  welcomeSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
  },

  avatar: {
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
  },

  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#fff',
    margin: 0
  },

  subtitle: {
    fontSize: '0.875rem',
    color: colors.text.blueLight,
    marginBottom: '0.25rem'
  },

  mainNav: {
    display: 'flex',
    gap: '0.5rem'
  },

  navButton: (isActive) => ({
    padding: '0.75rem 1.5rem',
    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: isActive ? '#fff' : colors.text.blueLight,
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    transition: 'all 0.2s'
  }),

  searchContainer: {
    flex: 1,
    maxWidth: '500px',
    position: 'relative'
  },

  searchInput: {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 3rem',
    background: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: colors.background.secondary,
    fontFamily: 'inherit'
  },

  dropdownButton: {
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
  },

  card: {
    background: colors.background.card,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.lg,
    padding: spacing.xl
  },

  cardHeader: {
    fontSize: '1.25rem',
    fontWeight: 700,
    margin: 0,
    marginBottom: spacing.xl,
    color: colors.text.primary
  },

  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    background: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.md,
    color: colors.text.primary,
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s'
  },

  select: {
    padding: '0.875rem 1rem',
    background: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.md,
    color: colors.text.primary,
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    outline: 'none'
  },

  button: {
    padding: '0.875rem 1.5rem',
    background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.purple})`,
    border: 'none',
    borderRadius: borderRadius.md,
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    justifyContent: 'center',
    fontFamily: 'inherit',
    boxShadow: `0 4px 12px rgba(59, 130, 246, 0.3)`,
    transition: 'all 0.2s'
  },

  buttonSecondary: {
    padding: '0.875rem 1.5rem',
    background: 'rgba(148,163,184,0.1)',
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.md,
    color: colors.text.primary,
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    transition: 'all 0.2s'
  },

  buttonDanger: {
    padding: '0.875rem 1.5rem',
    background: 'rgba(239,68,68,0.1)',
    border: `1px solid ${colors.status.error.border}`,
    borderRadius: borderRadius.md,
    color: colors.status.error.text,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.875rem',
    fontFamily: 'inherit'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  tableHeader: {
    background: 'rgba(15,23,42,0.8)',
    borderBottom: `1px solid ${colors.border.light}`
  },

  th: {
    padding: '1rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },

  td: {
    padding: '1rem',
    color: colors.text.secondary,
    fontSize: '0.875rem'
  },

  tableRow: {
    borderBottom: `1px solid rgba(148,163,184,0.05)`,
    cursor: 'pointer',
    transition: 'background 0.15s'
  },

  badge: (type = 'info') => ({
    padding: '0.25rem 0.75rem',
    background: colors.status[type]?.bg || colors.status.info.bg,
    border: `1px solid ${colors.status[type]?.border || colors.status.info.border}`,
    borderRadius: borderRadius.sm,
    fontSize: '0.75rem',
    color: colors.status[type]?.text || colors.status.info.text,
    fontWeight: 500,
    display: 'inline-block'
  }),

  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: spacing.xxl
  },

  modalContent: {
    background: `linear-gradient(135deg, ${colors.background.secondary} 0%, #334155 100%)`,
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
  },

  modalContentLarge: {
    maxWidth: '900px'
  },

  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    margin: 0,
    color: colors.text.primary
  },

  sectionSubtitle: {
    fontSize: '0.875rem',
    color: colors.text.secondary,
    margin: '0.5rem 0 0'
  },

  grid2Col: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: spacing.xxl
  },

  grid3Col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacing.lg
  },

  grid4Col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: spacing.lg
  },

  statCard: (color) => ({
    background: colors.background.card,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderLeft: `4px solid ${color}`
  }),

  label: {
    fontSize: '0.75rem',
    color: colors.text.secondary,
    marginBottom: '0.25rem',
    display: 'block'
  },

  fieldValue: {
    fontWeight: 600,
    color: colors.text.primary
  },

  iconButton: {
    padding: '0.5rem',
    background: 'rgba(148,163,184,0.1)',
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.sm,
    color: colors.text.secondary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },

  highlightCard: {
    background: colors.background.blueLight,
    border: `1px solid ${colors.border.blueLight}`,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl
  }
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
};

export const formatPercent = (value) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};
