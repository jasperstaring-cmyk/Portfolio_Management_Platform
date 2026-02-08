export class DataExporter {
  static arrayToCSV(headers, rows) {
    const csvRows = [];

    csvRows.push(headers.map(h => this.escapeCSVValue(h)).join(','));

    rows.forEach(row => {
      csvRows.push(row.map(cell => this.escapeCSVValue(cell)).join(','));
    });

    return csvRows.join('\n');
  }

  static escapeCSVValue(value) {
    if (value === null || value === undefined) return '';

    const stringValue = String(value);

    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }

  static downloadCSV(filename, csvContent) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  static exportUniverseToCSV(products) {
    const headers = [
      'Ticker',
      'Name',
      'Asset Class',
      'Category',
      'Expense Ratio',
      'AUM (millions)',
      'Inception Date',
      'Description'
    ];

    const rows = products.map(p => [
      p.ticker || '',
      p.name || '',
      p.assetClass || '',
      p.category || '',
      p.expenseRatio || 0,
      p.aum || 0,
      p.inceptionDate || '',
      p.description || ''
    ]);

    const csv = this.arrayToCSV(headers, rows);
    this.downloadCSV('universe-products.csv', csv);
  }

  static exportPortfoliosToCSV(portfolios, products) {
    const rows = [];

    portfolios.forEach(portfolio => {
      portfolio.holdings.forEach(holding => {
        const product = products.find(p => p.id === holding.productId);
        rows.push([
          portfolio.name,
          portfolio.type,
          product?.ticker || 'N/A',
          product?.name || 'Unknown',
          product?.assetClass || 'N/A',
          holding.weight,
          product?.expenseRatio || 0
        ]);
      });
    });

    const headers = [
      'Portfolio Name',
      'Portfolio Type',
      'Ticker',
      'Product Name',
      'Asset Class',
      'Weight (%)',
      'Expense Ratio'
    ];

    const csv = this.arrayToCSV(headers, rows);
    this.downloadCSV('portfolios.csv', csv);
  }

  static exportClientsToCSV(clients) {
    const headers = [
      'Client ID',
      'Name',
      'Email',
      'Phone',
      'Date of Birth',
      'Risk Level',
      'Risk Score',
      'Onboarded Date',
      'Number of Goals',
      'Total AUM'
    ];

    const rows = clients.map(c => [
      c.id || '',
      c.name || '',
      c.email || '',
      c.phone || '',
      c.dateOfBirth || '',
      c.riskLevel || '',
      c.riskScore || 0,
      c.onboardedDate || '',
      c.goals?.length || 0,
      c.goals?.reduce((sum, g) => sum + (g.targetAmount || 0), 0) || 0
    ]);

    const csv = this.arrayToCSV(headers, rows);
    this.downloadCSV('clients.csv', csv);
  }

  static exportClientGoalsToCSV(clients, portfolios) {
    const rows = [];

    clients.forEach(client => {
      client.goals?.forEach(goal => {
        const portfolio = portfolios.find(p => p.id === goal.portfolioId);
        rows.push([
          client.name,
          client.email,
          goal.name,
          goal.targetAmount || 0,
          goal.timeHorizon || '',
          portfolio?.name || 'Not Assigned'
        ]);
      });
    });

    const headers = [
      'Client Name',
      'Client Email',
      'Goal Name',
      'Target Amount',
      'Time Horizon',
      'Assigned Portfolio'
    ];

    const csv = this.arrayToCSV(headers, rows);
    this.downloadCSV('client-goals.csv', csv);
  }

  static parseCSV(csvText) {
    const lines = [];
    let currentLine = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentLine += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === '\n' && !inQuotes) {
        if (currentLine.trim()) {
          lines.push(currentLine);
        }
        currentLine = '';
      } else {
        currentLine += char;
      }
    }

    if (currentLine.trim()) {
      lines.push(currentLine);
    }

    return lines.map(line => this.parseCSVLine(line));
  }

  static parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  static importUniverseFromCSV(csvText, existingProducts) {
    const lines = this.parseCSV(csvText);

    if (lines.length < 2) {
      throw new Error('CSV file must contain headers and at least one data row');
    }

    const headers = lines[0];
    const dataRows = lines.slice(1);

    const requiredHeaders = ['Ticker', 'Name', 'Asset Class'];
    const missingHeaders = requiredHeaders.filter(h =>
      !headers.some(header => header.toLowerCase() === h.toLowerCase())
    );

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const headerIndices = {
      ticker: headers.findIndex(h => h.toLowerCase() === 'ticker'),
      name: headers.findIndex(h => h.toLowerCase() === 'name'),
      assetClass: headers.findIndex(h => h.toLowerCase() === 'asset class'),
      category: headers.findIndex(h => h.toLowerCase() === 'category'),
      expenseRatio: headers.findIndex(h => h.toLowerCase() === 'expense ratio'),
      aum: headers.findIndex(h => h.toLowerCase().includes('aum')),
      inceptionDate: headers.findIndex(h => h.toLowerCase() === 'inception date'),
      description: headers.findIndex(h => h.toLowerCase() === 'description')
    };

    const newProducts = [];
    const errors = [];

    dataRows.forEach((row, index) => {
      try {
        const ticker = row[headerIndices.ticker]?.trim();
        const name = row[headerIndices.name]?.trim();
        const assetClass = row[headerIndices.assetClass]?.trim();

        if (!ticker || !name || !assetClass) {
          errors.push(`Row ${index + 2}: Missing required fields (Ticker, Name, or Asset Class)`);
          return;
        }

        const existingProduct = existingProducts.find(p =>
          p.ticker.toLowerCase() === ticker.toLowerCase()
        );

        if (existingProduct) {
          errors.push(`Row ${index + 2}: Product with ticker ${ticker} already exists`);
          return;
        }

        const product = {
          id: `P${Date.now()}-${index}`,
          ticker: ticker.toUpperCase(),
          name,
          assetClass,
          category: row[headerIndices.category]?.trim() || '',
          expenseRatio: parseFloat(row[headerIndices.expenseRatio]) || 0,
          aum: parseFloat(row[headerIndices.aum]) || 0,
          inceptionDate: row[headerIndices.inceptionDate]?.trim() || '',
          description: row[headerIndices.description]?.trim() || ''
        };

        newProducts.push(product);
      } catch (error) {
        errors.push(`Row ${index + 2}: ${error.message}`);
      }
    });

    return {
      products: newProducts,
      errors,
      imported: newProducts.length,
      failed: errors.length
    };
  }

  static async readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  static exportToJSON(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}

export default DataExporter;
