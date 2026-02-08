import jsPDF from 'jspdf';

const COLORS = {
  primary: [59, 130, 246],
  secondary: [139, 92, 246],
  success: [16, 185, 129],
  warning: [245, 158, 11],
  danger: [239, 68, 68],
  text: [241, 245, 249],
  textSecondary: [148, 163, 184],
  background: [15, 23, 42],
  border: [148, 163, 184]
};

export class ReportGenerator {
  constructor() {
    this.doc = null;
    this.currentY = 0;
    this.pageWidth = 210;
    this.pageHeight = 297;
    this.margin = 20;
  }

  createNew() {
    this.doc = new jsPDF();
    this.currentY = this.margin;
  }

  addHeader(title, subtitle) {
    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, 20);

    if (subtitle) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(subtitle, this.margin, 30);
    }

    this.currentY = 50;
  }

  addSection(title) {
    this.checkPageBreak(20);

    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 10, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin + 2, this.currentY + 7);

    this.currentY += 15;
    this.doc.setTextColor(0, 0, 0);
  }

  addText(label, value, fontSize = 11) {
    this.checkPageBreak(10);

    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(label + ':', this.margin, this.currentY);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(value, this.margin + 50, this.currentY);

    this.currentY += 7;
  }

  addTable(headers, rows, columnWidths) {
    this.checkPageBreak(20 + rows.length * 8);

    const startY = this.currentY;
    const startX = this.margin;

    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(startX, startY, this.pageWidth - 2 * this.margin, 8, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');

    let xPos = startX + 2;
    headers.forEach((header, i) => {
      this.doc.text(header, xPos, startY + 6);
      xPos += columnWidths[i];
    });

    this.currentY += 8;

    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'normal');

    rows.forEach((row, rowIndex) => {
      if (rowIndex % 2 === 0) {
        this.doc.setFillColor(245, 247, 250);
        this.doc.rect(startX, this.currentY, this.pageWidth - 2 * this.margin, 7, 'F');
      }

      xPos = startX + 2;
      row.forEach((cell, i) => {
        this.doc.text(String(cell), xPos, this.currentY + 5);
        xPos += columnWidths[i];
      });

      this.currentY += 7;
    });

    this.currentY += 5;
  }

  addAllocationBars(data, startX, startY, maxWidth) {
    if (!data || data.length === 0) return;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return;

    this.doc.setFontSize(10);
    let currentY = startY;

    data.forEach((item) => {
      const percentage = item.value / total;
      const barWidth = maxWidth * percentage;

      const colorMap = {
        'Equity': COLORS.danger,
        'Fixed Income': COLORS.primary,
        'Alternatives': COLORS.warning,
        'Cash': COLORS.success,
        'Real Estate': COLORS.secondary
      };

      const color = colorMap[item.label] || [150, 150, 150];

      this.doc.setFillColor(...color);
      this.doc.rect(startX, currentY, barWidth, 8, 'F');

      this.doc.setDrawColor(200, 200, 200);
      this.doc.rect(startX, currentY, maxWidth, 8);

      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(item.label, startX + maxWidth + 5, currentY + 6);

      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`${item.value.toFixed(1)}%`, startX + maxWidth + 60, currentY + 6);

      currentY += 12;
    });

    this.currentY = currentY + 5;
  }

  addKeyMetric(label, value, x, y, width, height, color) {
    this.doc.setFillColor(...color);
    this.doc.rect(x, y, width, height, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(label, x + 3, y + 5);

    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(value, x + 3, y + 14);
  }

  addFooter() {
    const footerY = this.pageHeight - 15;

    this.doc.setFontSize(8);
    this.doc.setTextColor(150, 150, 150);
    this.doc.setFont('helvetica', 'normal');

    const date = new Date().toLocaleDateString();
    this.doc.text(`Generated on ${date}`, this.margin, footerY);
    this.doc.text('FinFiles Portfolio Builder', this.pageWidth - this.margin - 40, footerY);
  }

  checkPageBreak(requiredSpace) {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }

  generatePortfolioReport(portfolio, products) {
    this.createNew();

    this.addHeader('Portfolio Report', portfolio.name);

    this.addSection('Portfolio Overview');
    this.addText('Portfolio Name', portfolio.name);
    if (portfolio.description) {
      this.addText('Description', portfolio.description);
    }
    if (portfolio.riskLevel) {
      this.addText('Risk Level', portfolio.riskLevel);
    }
    this.addText('Holdings Count', portfolio.holdings.length.toString());

    const totalWeight = portfolio.holdings.reduce((sum, h) => sum + (parseFloat(h.weight) || 0), 0);
    this.addText('Total Allocation', `${totalWeight.toFixed(1)}%`);

    const avgExpenseRatio = this.calculateAvgExpenseRatio(portfolio, products);
    this.addText('Avg Expense Ratio', `${avgExpenseRatio.toFixed(2)}%`);

    this.currentY += 5;

    const assetAllocation = this.getAssetAllocation(portfolio, products);
    if (assetAllocation.length > 0) {
      this.addSection('Asset Allocation');
      this.currentY += 5;
      this.addAllocationBars(assetAllocation, this.margin + 10, this.currentY, 100);
    }

    this.addSection('Holdings Detail');
    const holdingsData = portfolio.holdings.map(h => {
      const product = products.find(p => p.id === h.productId);
      const weight = parseFloat(h.weight) || 0;
      return [
        product?.ticker || 'N/A',
        product?.name || 'Unknown',
        product?.assetClass || 'N/A',
        `${weight.toFixed(1)}%`,
        `${(product?.expenseRatio || 0).toFixed(2)}%`
      ];
    });

    this.addTable(
      ['Ticker', 'Name', 'Asset Class', 'Weight', 'Expense'],
      holdingsData,
      [25, 60, 35, 25, 25]
    );

    this.addSection('Risk Metrics');
    const riskMetrics = this.calculateRiskMetrics(portfolio, products);
    this.addText('Equity Exposure', `${riskMetrics.equityExposure.toFixed(1)}%`);
    this.addText('Fixed Income Exposure', `${riskMetrics.fixedIncomeExposure.toFixed(1)}%`);
    this.addText('Diversification Score', riskMetrics.diversificationScore);

    this.addFooter();

    return this.doc;
  }

  generateClientReport(client, portfolios, products, goals) {
    this.createNew();

    this.addHeader('Client Investment Proposal', client.name);

    this.addSection('Client Information');
    this.addText('Name', client.name);
    this.addText('Email', client.email);
    if (client.phone) this.addText('Phone', client.phone);
    if (client.dateOfBirth) this.addText('Date of Birth', client.dateOfBirth);

    this.currentY += 5;

    this.addSection('Risk Assessment');
    this.addText('Risk Profile', client.riskLevel);
    this.addText('Risk Score', `${client.riskScore.toFixed(2)} / 5.0`);

    const riskDescription = this.getRiskDescription(client.riskLevel);
    this.currentY += 3;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'italic');
    this.doc.setTextColor(80, 80, 80);

    const splitDescription = this.doc.splitTextToSize(riskDescription, this.pageWidth - 2 * this.margin - 10);
    splitDescription.forEach(line => {
      this.doc.text(line, this.margin + 5, this.currentY);
      this.currentY += 5;
    });

    this.currentY += 5;

    const totalAUM = goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0);

    this.addKeyMetric('Total AUM', `$${(totalAUM / 1000000).toFixed(2)}M`, this.margin, this.currentY, 60, 20, COLORS.primary);
    this.addKeyMetric('Goals', goals.length.toString(), this.margin + 65, this.currentY, 40, 20, COLORS.success);
    this.addKeyMetric('Portfolios', new Set(goals.map(g => g.portfolioId)).size.toString(), this.margin + 110, this.currentY, 40, 20, COLORS.warning);

    this.currentY += 30;

    this.addSection('Investment Goals');

    goals.forEach((goal, index) => {
      const portfolio = portfolios.find(p => p.id === goal.portfolioId);

      this.checkPageBreak(30);

      this.doc.setFillColor(245, 247, 250);
      this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 25, 'F');

      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(`${index + 1}. ${goal.name}`, this.margin + 3, this.currentY + 7);

      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(`Target: $${goal.targetAmount.toLocaleString()}`, this.margin + 3, this.currentY + 14);
      this.doc.text(`Time Horizon: ${goal.timeHorizon} years`, this.margin + 3, this.currentY + 20);

      if (portfolio) {
        this.doc.setTextColor(...COLORS.primary);
        this.doc.text(`Portfolio: ${portfolio.name}`, this.margin + 70, this.currentY + 14);
      }

      this.currentY += 30;
    });

    this.addSection('Consolidated Asset Allocation');
    const consolidatedAllocation = this.getConsolidatedAllocation(goals, portfolios, products, totalAUM);

    if (consolidatedAllocation.length > 0) {
      this.currentY += 5;
      this.addAllocationBars(consolidatedAllocation, this.margin + 10, this.currentY, 100);
    }

    this.addSection('Projected Growth');
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 80, 80);

    const projectionText = this.doc.splitTextToSize(
      'Projections are based on historical market data and assumed growth rates. Actual returns may vary significantly. Past performance does not guarantee future results. Please consult with your financial advisor for personalized investment advice.',
      this.pageWidth - 2 * this.margin - 10
    );

    projectionText.forEach(line => {
      this.doc.text(line, this.margin + 5, this.currentY);
      this.currentY += 5;
    });

    this.addFooter();

    return this.doc;
  }

  calculateAvgExpenseRatio(portfolio, products) {
    let totalExpense = 0;
    let totalWeight = 0;

    portfolio.holdings.forEach(h => {
      const product = products.find(p => p.id === h.productId);
      const weight = parseFloat(h.weight) || 0;
      if (product && product.expenseRatio) {
        totalExpense += product.expenseRatio * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? totalExpense / totalWeight : 0;
  }

  getAssetAllocation(portfolio, products) {
    const allocation = {};

    portfolio.holdings.forEach(h => {
      const product = products.find(p => p.id === h.productId);
      const weight = parseFloat(h.weight) || 0;
      if (product) {
        allocation[product.assetClass] = (allocation[product.assetClass] || 0) + weight;
      }
    });

    return Object.entries(allocation).map(([label, value]) => ({ label, value }));
  }

  calculateRiskMetrics(portfolio, products) {
    const allocation = this.getAssetAllocation(portfolio, products);

    const equityExposure = allocation.find(a => a.label === 'Equity')?.value || 0;
    const fixedIncomeExposure = allocation.find(a => a.label === 'Fixed Income')?.value || 0;

    const diversificationScore = allocation.length >= 3 ? 'High' : allocation.length === 2 ? 'Medium' : 'Low';

    return {
      equityExposure,
      fixedIncomeExposure,
      diversificationScore
    };
  }

  getConsolidatedAllocation(goals, portfolios, products, totalAUM) {
    const allocation = {};

    goals.forEach(goal => {
      const portfolio = portfolios.find(p => p.id === goal.portfolioId);
      if (!portfolio) return;

      const goalWeight = (goal.targetAmount || 0) / totalAUM;

      portfolio.holdings.forEach(holding => {
        const product = products.find(p => p.id === holding.productId);
        if (!product) return;

        const assetClass = product.assetClass;
        const weight = parseFloat(holding.weight) || 0;
        const allocationPercent = (weight / 100) * goalWeight * 100;

        allocation[assetClass] = (allocation[assetClass] || 0) + allocationPercent;
      });
    });

    return Object.entries(allocation).map(([label, value]) => ({ label, value }));
  }

  getRiskDescription(riskLevel) {
    const descriptions = {
      'Very Conservative': 'This profile focuses on capital preservation with minimal volatility. Investments are primarily in stable, income-generating securities with very low risk of loss.',
      'Conservative': 'This profile emphasizes stability with modest growth potential. A higher allocation to fixed income securities provides steady returns with lower volatility.',
      'Moderate': 'This balanced approach seeks to achieve growth while managing risk. The portfolio includes a mix of equities and fixed income to balance potential returns with stability.',
      'Aggressive': 'This growth-focused profile accepts higher volatility for greater return potential. The portfolio has significant equity exposure for long-term capital appreciation.',
      'Very Aggressive': 'This profile pursues maximum growth potential with significant risk tolerance. Heavy equity allocation targets substantial long-term returns despite higher volatility.'
    };

    return descriptions[riskLevel] || 'Custom risk profile tailored to client objectives.';
  }

  save(filename) {
    if (this.doc) {
      this.doc.save(filename);
    }
  }
}

export default ReportGenerator;
