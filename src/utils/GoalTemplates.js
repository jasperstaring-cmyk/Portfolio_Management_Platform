export const GOAL_TEMPLATES = [
  {
    id: 'GT1',
    name: 'Retirement Savings',
    description: 'Build wealth for retirement with systematic contributions',
    goalType: 'accumulation',
    icon: '🏖️',
    category: 'Retirement',
    isActive: true,
    defaultInitialInvestment: 50000,
    defaultMonthlyContribution: 2000,
    defaultTimeHorizonYears: 25,
    defaultTargetAmount: 2000000,
    defaultExpectedReturn: 6.0,
    suggestedRiskLevel: 'Moderate'
  },
  {
    id: 'GT2',
    name: 'College Education Fund',
    description: 'Save for future educational expenses',
    goalType: 'accumulation',
    icon: '🎓',
    category: 'Education',
    isActive: true,
    defaultInitialInvestment: 25000,
    defaultMonthlyContribution: 1000,
    defaultTimeHorizonYears: 15,
    defaultTargetAmount: 300000,
    defaultExpectedReturn: 5.5,
    suggestedRiskLevel: 'Moderate'
  },
  {
    id: 'GT3',
    name: 'Home Down Payment',
    description: 'Accumulate capital for real estate purchase',
    goalType: 'accumulation',
    icon: '🏠',
    category: 'Home',
    isActive: true,
    defaultInitialInvestment: 10000,
    defaultMonthlyContribution: 1500,
    defaultTimeHorizonYears: 5,
    defaultTargetAmount: 100000,
    defaultExpectedReturn: 4.5,
    suggestedRiskLevel: 'Conservative'
  },
  {
    id: 'GT4',
    name: 'Wealth Accumulation',
    description: 'Long-term wealth building strategy',
    goalType: 'accumulation',
    icon: '📈',
    category: 'Wealth',
    isActive: true,
    defaultInitialInvestment: 100000,
    defaultMonthlyContribution: 3000,
    defaultTimeHorizonYears: 20,
    defaultTargetAmount: 3000000,
    defaultExpectedReturn: 7.0,
    suggestedRiskLevel: 'Aggressive'
  },
  {
    id: 'GT5',
    name: 'Emergency Fund',
    description: 'Build financial safety net',
    goalType: 'accumulation',
    icon: '💰',
    category: 'Emergency',
    isActive: true,
    defaultInitialInvestment: 5000,
    defaultMonthlyContribution: 500,
    defaultTimeHorizonYears: 2,
    defaultTargetAmount: 25000,
    defaultExpectedReturn: 3.0,
    suggestedRiskLevel: 'Very Conservative'
  },
  {
    id: 'GT6',
    name: 'Capital Preservation',
    description: 'Protect existing wealth with minimal risk',
    goalType: 'preservation',
    icon: '🛡️',
    category: 'Preservation',
    isActive: true,
    defaultCurrentPortfolioValue: 1000000,
    defaultInflationBenchmark: 2.5,
    defaultTargetExcessReturn: 1.5,
    defaultMaxAllowableDrawdown: 10.0,
    defaultExpectedReturn: 4.0,
    suggestedRiskLevel: 'Conservative'
  },
  {
    id: 'GT7',
    name: 'Income Generation',
    description: 'Generate steady income while preserving capital',
    goalType: 'preservation',
    icon: '💵',
    category: 'Income',
    isActive: true,
    defaultCurrentPortfolioValue: 2000000,
    defaultInflationBenchmark: 3.0,
    defaultTargetExcessReturn: 2.0,
    defaultMaxAllowableDrawdown: 15.0,
    defaultExpectedReturn: 5.0,
    suggestedRiskLevel: 'Moderate'
  },
  {
    id: 'GT8',
    name: 'Wealth Management',
    description: 'Balance growth and preservation',
    goalType: 'preservation',
    icon: '⚖️',
    category: 'Wealth',
    isActive: true,
    defaultCurrentPortfolioValue: 5000000,
    defaultInflationBenchmark: 3.0,
    defaultTargetExcessReturn: 2.5,
    defaultMaxAllowableDrawdown: 20.0,
    defaultExpectedReturn: 6.0,
    suggestedRiskLevel: 'Moderate'
  },
  {
    id: 'GT9',
    name: 'Legacy Planning',
    description: 'Long-term wealth preservation for future generations',
    goalType: 'preservation',
    icon: '🌳',
    category: 'Legacy',
    isActive: true,
    defaultCurrentPortfolioValue: 10000000,
    defaultInflationBenchmark: 2.0,
    defaultTargetExcessReturn: 1.0,
    defaultMaxAllowableDrawdown: 12.0,
    defaultExpectedReturn: 4.5,
    suggestedRiskLevel: 'Conservative'
  },
  {
    id: 'GT10',
    name: 'Custom Goal',
    description: 'Create a custom investment goal',
    goalType: 'accumulation',
    icon: '🎯',
    category: 'Custom',
    isActive: true,
    defaultInitialInvestment: 0,
    defaultMonthlyContribution: 0,
    defaultTimeHorizonYears: 10,
    defaultTargetAmount: 0,
    defaultExpectedReturn: 5.0,
    suggestedRiskLevel: 'Moderate'
  }
];

export const getActiveGoalTemplates = () => {
  return GOAL_TEMPLATES.filter(template => template.isActive);
};

export const getGoalTemplateById = (id) => {
  return GOAL_TEMPLATES.find(template => template.id === id);
};

export const getGoalTemplatesByType = (type) => {
  return GOAL_TEMPLATES.filter(template => template.goalType === type && template.isActive);
};

export const getGoalTemplatesByCategory = (category) => {
  return GOAL_TEMPLATES.filter(template => template.category === category && template.isActive);
};

export const createGoalFromTemplate = (template, customValues = {}) => {
  const baseGoal = {
    id: `GOAL_${Date.now()}`,
    goalTemplateId: template.id,
    goalName: customValues.goalName || template.name,
    goalType: template.goalType,
    status: 'active',
    expectedReturn: customValues.expectedReturn || template.defaultExpectedReturn || 5.0,
    createdAt: new Date().toISOString()
  };

  if (template.goalType === 'accumulation') {
    return {
      ...baseGoal,
      initialInvestment: customValues.initialInvestment ?? template.defaultInitialInvestment ?? 0,
      monthlyContribution: customValues.monthlyContribution ?? template.defaultMonthlyContribution ?? 0,
      timeHorizonYears: customValues.timeHorizonYears ?? template.defaultTimeHorizonYears ?? 10,
      targetAmount: customValues.targetAmount ?? template.defaultTargetAmount ?? 0
    };
  } else {
    return {
      ...baseGoal,
      currentPortfolioValue: customValues.currentPortfolioValue ?? template.defaultCurrentPortfolioValue ?? 0,
      inflationBenchmark: customValues.inflationBenchmark ?? template.defaultInflationBenchmark ?? 3.0,
      targetExcessReturn: customValues.targetExcessReturn ?? template.defaultTargetExcessReturn ?? 2.0,
      maxAllowableDrawdown: customValues.maxAllowableDrawdown ?? template.defaultMaxAllowableDrawdown ?? 20.0
    };
  }
};
