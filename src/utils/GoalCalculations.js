export const calculateAccumulationFeasibility = (initialInvestment, monthlyContribution, timeHorizonYears, targetAmount, expectedReturn = 5) => {
  const monthlyRate = expectedReturn / 100 / 12;
  const months = timeHorizonYears * 12;

  const futureValueInitial = initialInvestment * Math.pow(1 + monthlyRate, months);

  const futureValueContributions = monthlyContribution *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  const projectedAmount = futureValueInitial + futureValueContributions;

  const feasibilityScore = (projectedAmount / targetAmount) * 100;

  let healthStatus;
  if (feasibilityScore >= 95) {
    healthStatus = 'green';
  } else if (feasibilityScore >= 75) {
    healthStatus = 'yellow';
  } else {
    healthStatus = 'red';
  }

  return {
    projectedAmount: Math.round(projectedAmount),
    targetAmount,
    feasibilityScore: Math.round(feasibilityScore),
    healthStatus,
    shortfall: Math.max(0, targetAmount - projectedAmount),
    surplus: Math.max(0, projectedAmount - targetAmount)
  };
};

export const calculatePreservationMetrics = (currentPortfolioValue, inflationBenchmark, targetExcessReturn, expectedReturn = 5) => {
  const realReturn = expectedReturn - inflationBenchmark;

  const targetRealReturn = inflationBenchmark + targetExcessReturn;

  const futureValue10Years = currentPortfolioValue * Math.pow(1 + expectedReturn / 100, 10);
  const inflationAdjustedValue = currentPortfolioValue * Math.pow(1 + inflationBenchmark / 100, 10);

  const purchasingPowerProtection = ((futureValue10Years - inflationAdjustedValue) / inflationAdjustedValue) * 100;

  let healthStatus;
  if (realReturn >= targetExcessReturn) {
    healthStatus = 'green';
  } else if (realReturn >= targetExcessReturn * 0.7) {
    healthStatus = 'yellow';
  } else {
    healthStatus = 'red';
  }

  const feasibilityScore = Math.min(100, (realReturn / targetExcessReturn) * 100);

  return {
    realReturn: realReturn.toFixed(2),
    targetRealReturn: targetRealReturn.toFixed(2),
    purchasingPowerProtection: purchasingPowerProtection.toFixed(2),
    futureValue10Years: Math.round(futureValue10Years),
    inflationAdjustedValue: Math.round(inflationAdjustedValue),
    healthStatus,
    feasibilityScore: Math.round(feasibilityScore)
  };
};

export const checkDrawdownCompliance = (portfolioMaxDrawdown, clientMaxAllowableDrawdown) => {
  return {
    isCompliant: portfolioMaxDrawdown <= clientMaxAllowableDrawdown,
    difference: portfolioMaxDrawdown - clientMaxAllowableDrawdown,
    riskLevel: portfolioMaxDrawdown > clientMaxAllowableDrawdown ? 'high' : 'acceptable'
  };
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const getHealthStatusColor = (status) => {
  const colors = {
    green: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
    yellow: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
    red: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' }
  };
  return colors[status] || colors.yellow;
};
