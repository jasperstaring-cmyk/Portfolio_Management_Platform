export const EXTENDED_MOCK_PRODUCTS = [
  // Large Cap US Equity ETFs
  { id: 'ETF001', ticker: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.09, aum: 428000000000, morningstarRating: 5, ytdReturn: 13.2 },
  { id: 'ETF002', ticker: 'IVV', name: 'iShares Core S&P 500 ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.03, aum: 398000000000, morningstarRating: 5, ytdReturn: 13.1 },
  { id: 'ETF003', ticker: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.03, aum: 412000000000, morningstarRating: 5, ytdReturn: 13.3 },
  { id: 'ETF004', ticker: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.03, aum: 348000000000, morningstarRating: 5, ytdReturn: 12.8 },
  { id: 'ETF005', ticker: 'SCHX', name: 'Schwab U.S. Large-Cap ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.03, aum: 48000000000, morningstarRating: 4, ytdReturn: 12.9 },
  { id: 'ETF006', ticker: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', assetClass: 'Equity', category: 'Large Growth', region: 'US', riskRating: 5, expenseRatio: 0.20, aum: 285000000000, morningstarRating: 5, ytdReturn: 26.4 },
  { id: 'ETF007', ticker: 'VUG', name: 'Vanguard Growth ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Growth', region: 'US', riskRating: 5, expenseRatio: 0.04, aum: 142000000000, morningstarRating: 5, ytdReturn: 24.7 },
  { id: 'ETF008', ticker: 'VTV', name: 'Vanguard Value ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Value', region: 'US', riskRating: 4, expenseRatio: 0.04, aum: 118000000000, morningstarRating: 5, ytdReturn: 15.2 },
  { id: 'ETF009', ticker: 'IWF', name: 'iShares Russell 1000 Growth ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Growth', region: 'US', riskRating: 5, expenseRatio: 0.19, aum: 92000000000, morningstarRating: 4, ytdReturn: 25.1 },
  { id: 'ETF010', ticker: 'IWD', name: 'iShares Russell 1000 Value ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Value', region: 'US', riskRating: 4, expenseRatio: 0.19, aum: 68000000000, morningstarRating: 4, ytdReturn: 14.8 },

  // Mid & Small Cap US Equity
  { id: 'ETF011', ticker: 'IJH', name: 'iShares Core S&P Mid-Cap ETF', type: 'ETF', assetClass: 'Equity', category: 'Mid-Cap Blend', region: 'US', riskRating: 5, expenseRatio: 0.05, aum: 82000000000, morningstarRating: 4, ytdReturn: 11.3 },
  { id: 'ETF012', ticker: 'VO', name: 'Vanguard Mid-Cap ETF', type: 'ETF', assetClass: 'Equity', category: 'Mid-Cap Blend', region: 'US', riskRating: 5, expenseRatio: 0.04, aum: 68000000000, morningstarRating: 4, ytdReturn: 10.9 },
  { id: 'ETF013', ticker: 'IJR', name: 'iShares Core S&P Small-Cap ETF', type: 'ETF', assetClass: 'Equity', category: 'Small Blend', region: 'US', riskRating: 5, expenseRatio: 0.06, aum: 78000000000, morningstarRating: 4, ytdReturn: 9.2 },
  { id: 'ETF014', ticker: 'VB', name: 'Vanguard Small-Cap ETF', type: 'ETF', assetClass: 'Equity', category: 'Small Blend', region: 'US', riskRating: 5, expenseRatio: 0.05, aum: 52000000000, morningstarRating: 4, ytdReturn: 8.7 },
  { id: 'ETF015', ticker: 'VBK', name: 'Vanguard Small-Cap Growth ETF', type: 'ETF', assetClass: 'Equity', category: 'Small Growth', region: 'US', riskRating: 5, expenseRatio: 0.07, aum: 32000000000, morningstarRating: 4, ytdReturn: 7.8 },
  { id: 'ETF016', ticker: 'VBR', name: 'Vanguard Small-Cap Value ETF', type: 'ETF', assetClass: 'Equity', category: 'Small Value', region: 'US', riskRating: 5, expenseRatio: 0.07, aum: 28000000000, morningstarRating: 4, ytdReturn: 12.1 },

  // International Developed Equity
  { id: 'ETF017', ticker: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.05, aum: 128000000000, morningstarRating: 4, ytdReturn: 10.8 },
  { id: 'ETF018', ticker: 'VXUS', name: 'Vanguard Total International Stock ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.08, aum: 98000000000, morningstarRating: 4, ytdReturn: 11.2 },
  { id: 'ETF019', ticker: 'IEFA', name: 'iShares Core MSCI EAFE ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.07, aum: 108000000000, morningstarRating: 4, ytdReturn: 10.5 },
  { id: 'ETF020', ticker: 'EFA', name: 'iShares MSCI EAFE ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.33, aum: 72000000000, morningstarRating: 3, ytdReturn: 10.2 },
  { id: 'ETF021', ticker: 'SCHF', name: 'Schwab International Equity ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.06, aum: 42000000000, morningstarRating: 4, ytdReturn: 9.8 },
  { id: 'ETF022', ticker: 'EFV', name: 'iShares MSCI EAFE Value ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Value', region: 'International', riskRating: 4, expenseRatio: 0.40, aum: 12000000000, morningstarRating: 3, ytdReturn: 11.5 },
  { id: 'ETF023', ticker: 'EFG', name: 'iShares MSCI EAFE Growth ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Growth', region: 'International', riskRating: 4, expenseRatio: 0.40, aum: 10000000000, morningstarRating: 3, ytdReturn: 9.2 },

  // Emerging Markets
  { id: 'ETF024', ticker: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', type: 'ETF', assetClass: 'Equity', category: 'Diversified Emerging Mkts', region: 'Emerging', riskRating: 5, expenseRatio: 0.08, aum: 82000000000, morningstarRating: 4, ytdReturn: 7.9 },
  { id: 'ETF025', ticker: 'IEMG', name: 'iShares Core MSCI Emerging Markets ETF', type: 'ETF', assetClass: 'Equity', category: 'Diversified Emerging Mkts', region: 'Emerging', riskRating: 5, expenseRatio: 0.09, aum: 78000000000, morningstarRating: 4, ytdReturn: 8.2 },
  { id: 'ETF026', ticker: 'EEM', name: 'iShares MSCI Emerging Markets ETF', type: 'ETF', assetClass: 'Equity', category: 'Diversified Emerging Mkts', region: 'Emerging', riskRating: 5, expenseRatio: 0.68, aum: 28000000000, morningstarRating: 3, ytdReturn: 7.5 },
  { id: 'ETF027', ticker: 'SCHE', name: 'Schwab Emerging Markets Equity ETF', type: 'ETF', assetClass: 'Equity', category: 'Diversified Emerging Mkts', region: 'Emerging', riskRating: 5, expenseRatio: 0.11, aum: 18000000000, morningstarRating: 4, ytdReturn: 8.0 },

  // US Bond ETFs
  { id: 'ETF028', ticker: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Intermediate Core Bond', region: 'US', riskRating: 2, expenseRatio: 0.03, aum: 94000000000, morningstarRating: 4, ytdReturn: -0.8 },
  { id: 'ETF029', ticker: 'BND', name: 'Vanguard Total Bond Market ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Intermediate Core Bond', region: 'US', riskRating: 2, expenseRatio: 0.03, aum: 98000000000, morningstarRating: 4, ytdReturn: -0.5 },
  { id: 'ETF030', ticker: 'BNDX', name: 'Vanguard Total International Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'International Bond', region: 'International', riskRating: 3, expenseRatio: 0.07, aum: 62000000000, morningstarRating: 4, ytdReturn: 1.2 },
  { id: 'ETF031', ticker: 'TIP', name: 'iShares TIPS Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Inflation-Protected Bond', region: 'US', riskRating: 2, expenseRatio: 0.19, aum: 42000000000, morningstarRating: 4, ytdReturn: 2.8 },
  { id: 'ETF032', ticker: 'LQD', name: 'iShares iBoxx Investment Grade Corporate Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Corporate Bond', region: 'US', riskRating: 2, expenseRatio: 0.14, aum: 52000000000, morningstarRating: 4, ytdReturn: 1.5 },
  { id: 'ETF033', ticker: 'VCIT', name: 'Vanguard Intermediate-Term Corporate Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Corporate Bond', region: 'US', riskRating: 2, expenseRatio: 0.05, aum: 48000000000, morningstarRating: 4, ytdReturn: 1.8 },
  { id: 'ETF034', ticker: 'VCSH', name: 'Vanguard Short-Term Corporate Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Short-term Bond', region: 'US', riskRating: 1, expenseRatio: 0.04, aum: 58000000000, morningstarRating: 4, ytdReturn: 4.2 },
  { id: 'ETF035', ticker: 'BSV', name: 'Vanguard Short-Term Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Short-term Bond', region: 'US', riskRating: 1, expenseRatio: 0.04, aum: 42000000000, morningstarRating: 4, ytdReturn: 4.5 },
  { id: 'ETF036', ticker: 'BIV', name: 'Vanguard Intermediate-Term Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Intermediate Core Bond', region: 'US', riskRating: 2, expenseRatio: 0.04, aum: 38000000000, morningstarRating: 4, ytdReturn: 0.8 },
  { id: 'ETF037', ticker: 'BLV', name: 'Vanguard Long-Term Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Long-term Bond', region: 'US', riskRating: 3, expenseRatio: 0.04, aum: 28000000000, morningstarRating: 3, ytdReturn: -2.5 },
  { id: 'ETF038', ticker: 'HYG', name: 'iShares iBoxx High Yield Corporate Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'High Yield Bond', region: 'US', riskRating: 4, expenseRatio: 0.49, aum: 18000000000, morningstarRating: 3, ytdReturn: 6.2 },
  { id: 'ETF039', ticker: 'JNK', name: 'SPDR Bloomberg High Yield Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'High Yield Bond', region: 'US', riskRating: 4, expenseRatio: 0.40, aum: 12000000000, morningstarRating: 3, ytdReturn: 6.5 },
  { id: 'ETF040', ticker: 'MUB', name: 'iShares National Muni Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Municipal Bond', region: 'US', riskRating: 2, expenseRatio: 0.07, aum: 32000000000, morningstarRating: 4, ytdReturn: 0.2 },
  { id: 'ETF041', ticker: 'SHY', name: 'iShares 1-3 Year Treasury Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Short-term Bond', region: 'US', riskRating: 1, expenseRatio: 0.15, aum: 28000000000, morningstarRating: 2, ytdReturn: 5.1 },
  { id: 'ETF042', ticker: 'IEF', name: 'iShares 7-10 Year Treasury Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Intermediate Core Bond', region: 'US', riskRating: 2, expenseRatio: 0.15, aum: 32000000000, morningstarRating: 3, ytdReturn: 1.2 },
  { id: 'ETF043', ticker: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Long-term Bond', region: 'US', riskRating: 3, expenseRatio: 0.15, aum: 48000000000, morningstarRating: 3, ytdReturn: -4.8 },

  // Sector ETFs - Technology
  { id: 'ETF044', ticker: 'XLK', name: 'Technology Select Sector SPDR Fund', type: 'ETF', assetClass: 'Equity', category: 'Sector Technology', region: 'US', riskRating: 5, expenseRatio: 0.10, aum: 58000000000, morningstarRating: 5, ytdReturn: 28.5 },
  { id: 'ETF045', ticker: 'VGT', name: 'Vanguard Information Technology ETF', type: 'ETF', assetClass: 'Equity', category: 'Sector Technology', region: 'US', riskRating: 5, expenseRatio: 0.10, aum: 78000000000, morningstarRating: 5, ytdReturn: 29.2 },
  { id: 'ETF046', ticker: 'SOXX', name: 'iShares Semiconductor ETF', type: 'ETF', assetClass: 'Equity', category: 'Sector Technology', region: 'US', riskRating: 5, expenseRatio: 0.43, aum: 18000000000, morningstarRating: 4, ytdReturn: 35.1 },

  // Sector ETFs - Financials
  { id: 'ETF047', ticker: 'XLF', name: 'Financial Select Sector SPDR Fund', type: 'ETF', assetClass: 'Equity', category: 'Sector Financials', region: 'US', riskRating: 5, expenseRatio: 0.10, aum: 42000000000, morningstarRating: 4, ytdReturn: 18.2 },
  { id: 'ETF048', ticker: 'VFH', name: 'Vanguard Financials ETF', type: 'ETF', assetClass: 'Equity', category: 'Sector Financials', region: 'US', riskRating: 5, expenseRatio: 0.10, aum: 22000000000, morningstarRating: 4, ytdReturn: 17.9 },

  // Sector ETFs - Healthcare
  { id: 'ETF049', ticker: 'XLV', name: 'Health Care Select Sector SPDR Fund', type: 'ETF', assetClass: 'Equity', category: 'Sector Healthcare', region: 'US', riskRating: 4, expenseRatio: 0.10, aum: 38000000000, morningstarRating: 4, ytdReturn: 8.5 },
  { id: 'ETF050', ticker: 'VHT', name: 'Vanguard Health Care ETF', type: 'ETF', assetClass: 'Equity', category: 'Sector Healthcare', region: 'US', riskRating: 4, expenseRatio: 0.10, aum: 28000000000, morningstarRating: 4, ytdReturn: 8.8 },
  { id: 'ETF051', ticker: 'IBB', name: 'iShares Biotechnology ETF', type: 'ETF', assetClass: 'Equity', category: 'Sector Healthcare', region: 'US', riskRating: 5, expenseRatio: 0.45, aum: 12000000000, morningstarRating: 3, ytdReturn: 4.2 },

  // Sector ETFs - Energy
  { id: 'ETF052', ticker: 'XLE', name: 'Energy Select Sector SPDR Fund', type: 'ETF', assetClass: 'Equity', category: 'Sector Energy', region: 'US', riskRating: 5, expenseRatio: 0.10, aum: 32000000000, morningstarRating: 3, ytdReturn: 22.8 },
  { id: 'ETF053', ticker: 'VDE', name: 'Vanguard Energy ETF', type: 'ETF', assetClass: 'Equity', category: 'Sector Energy', region: 'US', riskRating: 5, expenseRatio: 0.10, aum: 18000000000, morningstarRating: 3, ytdReturn: 21.5 },

  // Sector ETFs - Industrials
  { id: 'ETF054', ticker: 'XLI', name: 'Industrial Select Sector SPDR Fund', type: 'ETF', assetClass: 'Equity', category: 'Sector Industrials', region: 'US', riskRating: 4, expenseRatio: 0.10, aum: 28000000000, morningstarRating: 4, ytdReturn: 12.8 },
  { id: 'ETF055', ticker: 'VIS', name: 'Vanguard Industrials ETF', type: 'ETF', assetClass: 'Equity', category: 'Sector Industrials', region: 'US', riskRating: 4, expenseRatio: 0.10, aum: 12000000000, morningstarRating: 4, ytdReturn: 12.3 },

  // Sector ETFs - Consumer
  { id: 'ETF056', ticker: 'XLY', name: 'Consumer Discretionary Select Sector SPDR Fund', type: 'ETF', assetClass: 'Equity', category: 'Sector Consumer Cyclical', region: 'US', riskRating: 5, expenseRatio: 0.10, aum: 22000000000, morningstarRating: 4, ytdReturn: 16.2 },
  { id: 'ETF057', ticker: 'XLP', name: 'Consumer Staples Select Sector SPDR Fund', type: 'ETF', assetClass: 'Equity', category: 'Sector Consumer Defensive', region: 'US', riskRating: 3, expenseRatio: 0.10, aum: 18000000000, morningstarRating: 4, ytdReturn: 5.8 },
  { id: 'ETF058', ticker: 'VCR', name: 'Vanguard Consumer Discretionary ETF', type: 'ETF', assetClass: 'Equity', category: 'Sector Consumer Cyclical', region: 'US', riskRating: 5, expenseRatio: 0.10, aum: 8200000000, morningstarRating: 4, ytdReturn: 15.9 },
  { id: 'ETF059', ticker: 'VDC', name: 'Vanguard Consumer Staples ETF', type: 'ETF', assetClass: 'Equity', category: 'Sector Consumer Defensive', region: 'US', riskRating: 3, expenseRatio: 0.10, aum: 9200000000, morningstarRating: 4, ytdReturn: 6.1 },

  // Sector ETFs - Materials & Utilities
  { id: 'ETF060', ticker: 'XLB', name: 'Materials Select Sector SPDR Fund', type: 'ETF', assetClass: 'Equity', category: 'Sector Materials', region: 'US', riskRating: 4, expenseRatio: 0.10, aum: 12000000000, morningstarRating: 3, ytdReturn: 9.5 },
  { id: 'ETF061', ticker: 'XLU', name: 'Utilities Select Sector SPDR Fund', type: 'ETF', assetClass: 'Equity', category: 'Sector Utilities', region: 'US', riskRating: 3, expenseRatio: 0.10, aum: 18000000000, morningstarRating: 4, ytdReturn: 7.2 },
  { id: 'ETF062', ticker: 'VPU', name: 'Vanguard Utilities ETF', type: 'ETF', assetClass: 'Equity', category: 'Sector Utilities', region: 'US', riskRating: 3, expenseRatio: 0.10, aum: 8200000000, morningstarRating: 4, ytdReturn: 7.5 },

  // Real Estate
  { id: 'ETF063', ticker: 'VNQ', name: 'Vanguard Real Estate ETF', type: 'ETF', assetClass: 'Alternatives', category: 'Real Estate', region: 'US', riskRating: 4, expenseRatio: 0.12, aum: 42000000000, morningstarRating: 4, ytdReturn: 3.8 },
  { id: 'ETF064', ticker: 'SCHH', name: 'Schwab U.S. REIT ETF', type: 'ETF', assetClass: 'Alternatives', category: 'Real Estate', region: 'US', riskRating: 4, expenseRatio: 0.07, aum: 8200000000, morningstarRating: 4, ytdReturn: 4.1 },
  { id: 'ETF065', ticker: 'IYR', name: 'iShares U.S. Real Estate ETF', type: 'ETF', assetClass: 'Alternatives', category: 'Real Estate', region: 'US', riskRating: 4, expenseRatio: 0.40, aum: 12000000000, morningstarRating: 3, ytdReturn: 3.5 },
  { id: 'ETF066', ticker: 'XLRE', name: 'Real Estate Select Sector SPDR Fund', type: 'ETF', assetClass: 'Alternatives', category: 'Real Estate', region: 'US', riskRating: 4, expenseRatio: 0.10, aum: 8500000000, morningstarRating: 4, ytdReturn: 3.9 },

  // Commodities & Alternatives
  { id: 'ETF067', ticker: 'GLD', name: 'SPDR Gold Shares', type: 'ETF', assetClass: 'Alternatives', category: 'Precious Metals', region: 'Global', riskRating: 4, expenseRatio: 0.40, aum: 72000000000, morningstarRating: 3, ytdReturn: 27.5 },
  { id: 'ETF068', ticker: 'IAU', name: 'iShares Gold Trust', type: 'ETF', assetClass: 'Alternatives', category: 'Precious Metals', region: 'Global', riskRating: 4, expenseRatio: 0.25, aum: 32000000000, morningstarRating: 3, ytdReturn: 27.2 },
  { id: 'ETF069', ticker: 'SLV', name: 'iShares Silver Trust', type: 'ETF', assetClass: 'Alternatives', category: 'Precious Metals', region: 'Global', riskRating: 5, expenseRatio: 0.50, aum: 12000000000, morningstarRating: 2, ytdReturn: 32.8 },
  { id: 'ETF070', ticker: 'DBC', name: 'Invesco DB Commodity Index Tracking Fund', type: 'ETF', assetClass: 'Alternatives', category: 'Commodities', region: 'Global', riskRating: 5, expenseRatio: 0.85, aum: 4200000000, morningstarRating: 2, ytdReturn: 18.5 },

  // Dividend ETFs
  { id: 'ETF071', ticker: 'VYM', name: 'Vanguard High Dividend Yield ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Value', region: 'US', riskRating: 4, expenseRatio: 0.06, aum: 58000000000, morningstarRating: 4, ytdReturn: 14.2 },
  { id: 'ETF072', ticker: 'VIG', name: 'Vanguard Dividend Appreciation ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Value', region: 'US', riskRating: 4, expenseRatio: 0.06, aum: 82000000000, morningstarRating: 4, ytdReturn: 15.1 },
  { id: 'ETF073', ticker: 'SCHD', name: 'Schwab U.S. Dividend Equity ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Value', region: 'US', riskRating: 4, expenseRatio: 0.06, aum: 68000000000, morningstarRating: 5, ytdReturn: 16.8 },
  { id: 'ETF074', ticker: 'DVY', name: 'iShares Select Dividend ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Value', region: 'US', riskRating: 4, expenseRatio: 0.38, aum: 18000000000, morningstarRating: 3, ytdReturn: 13.5 },
  { id: 'ETF075', ticker: 'SPHD', name: 'Invesco S&P 500 High Dividend Low Volatility ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Value', region: 'US', riskRating: 3, expenseRatio: 0.30, aum: 8200000000, morningstarRating: 3, ytdReturn: 11.8 },

  // Vanguard Mutual Funds
  { id: 'MF001', ticker: 'VTSAX', name: 'Vanguard Total Stock Market Index Fund Admiral Shares', type: 'Mutual Fund', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.04, aum: 1350000000000, morningstarRating: 5, ytdReturn: 12.8 },
  { id: 'MF002', ticker: 'VFIAX', name: 'Vanguard 500 Index Fund Admiral Shares', type: 'Mutual Fund', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.04, aum: 890000000000, morningstarRating: 5, ytdReturn: 13.1 },
  { id: 'MF003', ticker: 'VTIAX', name: 'Vanguard Total International Stock Index Fund Admiral Shares', type: 'Mutual Fund', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.11, aum: 175000000000, morningstarRating: 4, ytdReturn: 10.9 },
  { id: 'MF004', ticker: 'VBTLX', name: 'Vanguard Total Bond Market Index Fund Admiral Shares', type: 'Mutual Fund', assetClass: 'Fixed Income', category: 'Intermediate Core Bond', region: 'US', riskRating: 2, expenseRatio: 0.05, aum: 315000000000, morningstarRating: 4, ytdReturn: -0.4 },
  { id: 'MF005', ticker: 'VWIUX', name: 'Vanguard International Growth Fund Admiral Shares', type: 'Mutual Fund', assetClass: 'Equity', category: 'Foreign Large Growth', region: 'International', riskRating: 5, expenseRatio: 0.36, aum: 85000000000, morningstarRating: 4, ytdReturn: 12.5 },
  { id: 'MF006', ticker: 'VWENX', name: 'Vanguard Wellington Fund Admiral Shares', type: 'Mutual Fund', assetClass: 'Equity', category: 'Balanced', region: 'US', riskRating: 3, expenseRatio: 0.17, aum: 125000000000, morningstarRating: 5, ytdReturn: 9.8 },
  { id: 'MF007', ticker: 'VWELX', name: 'Vanguard Wellesley Income Fund Admiral Shares', type: 'Mutual Fund', assetClass: 'Fixed Income', category: 'Balanced', region: 'US', riskRating: 2, expenseRatio: 0.16, aum: 78000000000, morningstarRating: 5, ytdReturn: 4.2 },
  { id: 'MF008', ticker: 'VGSLX', name: 'Vanguard Real Estate Index Fund Admiral Shares', type: 'Mutual Fund', assetClass: 'Alternatives', category: 'Real Estate', region: 'US', riskRating: 4, expenseRatio: 0.12, aum: 48000000000, morningstarRating: 4, ytdReturn: 3.7 },
  { id: 'MF009', ticker: 'VSMGX', name: 'Vanguard LifeStrategy Moderate Growth Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Allocation', region: 'Global', riskRating: 3, expenseRatio: 0.13, aum: 28000000000, morningstarRating: 4, ytdReturn: 8.9 },
  { id: 'MF010', ticker: 'VSCGX', name: 'Vanguard LifeStrategy Conservative Growth Fund', type: 'Mutual Fund', assetClass: 'Fixed Income', category: 'Allocation', region: 'Global', riskRating: 2, expenseRatio: 0.13, aum: 22000000000, morningstarRating: 4, ytdReturn: 5.2 },

  // Fidelity Mutual Funds
  { id: 'MF011', ticker: 'FSKAX', name: 'Fidelity Total Market Index Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.015, aum: 485000000000, morningstarRating: 5, ytdReturn: 12.9 },
  { id: 'MF012', ticker: 'FXAIX', name: 'Fidelity 500 Index Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.015, aum: 512000000000, morningstarRating: 5, ytdReturn: 13.2 },
  { id: 'MF013', ticker: 'FTIHX', name: 'Fidelity Total International Index Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.06, aum: 98000000000, morningstarRating: 4, ytdReturn: 11.0 },
  { id: 'MF014', ticker: 'FXNAX', name: 'Fidelity U.S. Bond Index Fund', type: 'Mutual Fund', assetClass: 'Fixed Income', category: 'Intermediate Core Bond', region: 'US', riskRating: 2, expenseRatio: 0.025, aum: 78000000000, morningstarRating: 4, ytdReturn: -0.6 },
  { id: 'MF015', ticker: 'FGDAX', name: 'Fidelity Capital & Income Fund', type: 'Mutual Fund', assetClass: 'Fixed Income', category: 'High Yield Bond', region: 'US', riskRating: 4, expenseRatio: 0.70, aum: 18000000000, morningstarRating: 5, ytdReturn: 7.8 },
  { id: 'MF016', ticker: 'FCNTX', name: 'Fidelity Contrafund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Large Growth', region: 'US', riskRating: 5, expenseRatio: 0.82, aum: 128000000000, morningstarRating: 4, ytdReturn: 22.5 },
  { id: 'MF017', ticker: 'FBALX', name: 'Fidelity Balanced Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Balanced', region: 'US', riskRating: 3, expenseRatio: 0.53, aum: 32000000000, morningstarRating: 4, ytdReturn: 10.2 },
  { id: 'MF018', ticker: 'FPURX', name: 'Fidelity Puritan Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Balanced', region: 'US', riskRating: 3, expenseRatio: 0.56, aum: 28000000000, morningstarRating: 4, ytdReturn: 9.5 },

  // T. Rowe Price & Others
  { id: 'MF019', ticker: 'PRWCX', name: 'T. Rowe Price Capital Appreciation Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Balanced', region: 'US', riskRating: 3, expenseRatio: 0.70, aum: 42000000000, morningstarRating: 5, ytdReturn: 11.8 },
  { id: 'MF020', ticker: 'PRGFX', name: 'T. Rowe Price Growth Stock Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Large Growth', region: 'US', riskRating: 5, expenseRatio: 0.67, aum: 52000000000, morningstarRating: 4, ytdReturn: 24.2 },
  { id: 'MF021', ticker: 'PRBLX', name: 'T. Rowe Price Blue Chip Growth Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Large Growth', region: 'US', riskRating: 5, expenseRatio: 0.72, aum: 88000000000, morningstarRating: 5, ytdReturn: 26.8 },
  { id: 'MF022', ticker: 'DODGX', name: 'Dodge & Cox Stock Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Large Value', region: 'US', riskRating: 4, expenseRatio: 0.52, aum: 82000000000, morningstarRating: 5, ytdReturn: 16.5 },
  { id: 'MF023', ticker: 'DODBX', name: 'Dodge & Cox Balanced Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Balanced', region: 'US', riskRating: 3, expenseRatio: 0.53, aum: 28000000000, morningstarRating: 4, ytdReturn: 10.8 },
  { id: 'MF024', ticker: 'DODIX', name: 'Dodge & Cox International Stock Fund', type: 'Mutual Fund', assetClass: 'Equity', category: 'Foreign Large Value', region: 'International', riskRating: 4, expenseRatio: 0.64, aum: 52000000000, morningstarRating: 4, ytdReturn: 13.2 },
  { id: 'MF025', ticker: 'PONDX', name: 'PIMCO Income Fund', type: 'Mutual Fund', assetClass: 'Fixed Income', category: 'Multisector Bond', region: 'Global', riskRating: 3, expenseRatio: 0.75, aum: 98000000000, morningstarRating: 5, ytdReturn: 6.1 },
  { id: 'MF026', ticker: 'PTTRX', name: 'PIMCO Total Return Fund', type: 'Mutual Fund', assetClass: 'Fixed Income', category: 'Intermediate Core Bond', region: 'US', riskRating: 2, expenseRatio: 0.71, aum: 42000000000, morningstarRating: 4, ytdReturn: 1.2 },
  { id: 'MF027', ticker: 'VMMXX', name: 'Vanguard Prime Money Market Fund', type: 'Mutual Fund', assetClass: 'Cash', category: 'Money Market', region: 'US', riskRating: 1, expenseRatio: 0.16, aum: 168000000000, morningstarRating: 2, ytdReturn: 5.3 },
  { id: 'MF028', ticker: 'VMFXX', name: 'Vanguard Federal Money Market Fund', type: 'Mutual Fund', assetClass: 'Cash', category: 'Money Market', region: 'US', riskRating: 1, expenseRatio: 0.16, aum: 122000000000, morningstarRating: 2, ytdReturn: 5.2 },

  // Additional Popular ETFs
  { id: 'ETF076', ticker: 'RSP', name: 'Invesco S&P 500 Equal Weight ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.20, aum: 42000000000, morningstarRating: 4, ytdReturn: 14.5 },
  { id: 'ETF077', ticker: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF Trust', type: 'ETF', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.16, aum: 32000000000, morningstarRating: 4, ytdReturn: 11.8 },
  { id: 'ETF078', ticker: 'IWM', name: 'iShares Russell 2000 ETF', type: 'ETF', assetClass: 'Equity', category: 'Small Blend', region: 'US', riskRating: 5, expenseRatio: 0.19, aum: 62000000000, morningstarRating: 4, ytdReturn: 8.5 },
  { id: 'ETF079', ticker: 'MDY', name: 'SPDR S&P MidCap 400 ETF Trust', type: 'ETF', assetClass: 'Equity', category: 'Mid-Cap Blend', region: 'US', riskRating: 5, expenseRatio: 0.24, aum: 22000000000, morningstarRating: 4, ytdReturn: 10.2 },
  { id: 'ETF080', ticker: 'SPYG', name: 'SPDR Portfolio S&P 500 Growth ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Growth', region: 'US', riskRating: 5, expenseRatio: 0.04, aum: 28000000000, morningstarRating: 4, ytdReturn: 25.8 },
  { id: 'ETF081', ticker: 'SPYV', name: 'SPDR Portfolio S&P 500 Value ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Value', region: 'US', riskRating: 4, expenseRatio: 0.04, aum: 22000000000, morningstarRating: 4, ytdReturn: 15.5 },
  { id: 'ETF082', ticker: 'SCHG', name: 'Schwab U.S. Large-Cap Growth ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Growth', region: 'US', riskRating: 5, expenseRatio: 0.04, aum: 32000000000, morningstarRating: 5, ytdReturn: 26.2 },
  { id: 'ETF083', ticker: 'SCHV', name: 'Schwab U.S. Large-Cap Value ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Value', region: 'US', riskRating: 4, expenseRatio: 0.04, aum: 18000000000, morningstarRating: 4, ytdReturn: 14.9 },
  { id: 'ETF084', ticker: 'MGC', name: 'Vanguard Mega Cap ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.07, aum: 8200000000, morningstarRating: 4, ytdReturn: 13.5 },
  { id: 'ETF085', ticker: 'QUAL', name: 'iShares MSCI USA Quality Factor ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 4, expenseRatio: 0.15, aum: 28000000000, morningstarRating: 4, ytdReturn: 18.2 },
  { id: 'ETF086', ticker: 'MTUM', name: 'iShares MSCI USA Momentum Factor ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 5, expenseRatio: 0.15, aum: 18000000000, morningstarRating: 4, ytdReturn: 20.5 },
  { id: 'ETF087', ticker: 'VLUE', name: 'iShares MSCI USA Value Factor ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Value', region: 'US', riskRating: 4, expenseRatio: 0.15, aum: 12000000000, morningstarRating: 3, ytdReturn: 14.1 },
  { id: 'ETF088', ticker: 'SIZE', name: 'iShares MSCI USA Size Factor ETF', type: 'ETF', assetClass: 'Equity', category: 'Small Blend', region: 'US', riskRating: 5, expenseRatio: 0.15, aum: 4200000000, morningstarRating: 3, ytdReturn: 9.8 },
  { id: 'ETF089', ticker: 'USMV', name: 'iShares MSCI USA Min Vol Factor ETF', type: 'ETF', assetClass: 'Equity', category: 'Large Blend', region: 'US', riskRating: 3, expenseRatio: 0.15, aum: 32000000000, morningstarRating: 4, ytdReturn: 10.5 },
  { id: 'ETF090', ticker: 'ACWI', name: 'iShares MSCI ACWI ETF', type: 'ETF', assetClass: 'Equity', category: 'World Stock', region: 'Global', riskRating: 4, expenseRatio: 0.32, aum: 22000000000, morningstarRating: 4, ytdReturn: 12.8 },
  { id: 'ETF091', ticker: 'ACWX', name: 'iShares MSCI ACWI ex U.S. ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.32, aum: 8200000000, morningstarRating: 3, ytdReturn: 10.1 },
  { id: 'ETF092', ticker: 'IXUS', name: 'iShares Core MSCI Total International Stock ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.07, aum: 32000000000, morningstarRating: 4, ytdReturn: 11.0 },
  { id: 'ETF093', ticker: 'EWJ', name: 'iShares MSCI Japan ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.49, aum: 12000000000, morningstarRating: 3, ytdReturn: 8.5 },
  { id: 'ETF094', ticker: 'FEZ', name: 'SPDR EURO STOXX 50 ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.29, aum: 8200000000, morningstarRating: 3, ytdReturn: 12.8 },
  { id: 'ETF095', ticker: 'EWG', name: 'iShares MSCI Germany ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.49, aum: 4200000000, morningstarRating: 2, ytdReturn: 6.2 },
  { id: 'ETF096', ticker: 'EWU', name: 'iShares MSCI United Kingdom ETF', type: 'ETF', assetClass: 'Equity', category: 'Foreign Large Blend', region: 'International', riskRating: 4, expenseRatio: 0.49, aum: 3800000000, morningstarRating: 3, ytdReturn: 9.8 },
  { id: 'ETF097', ticker: 'MCHI', name: 'iShares MSCI China ETF', type: 'ETF', assetClass: 'Equity', category: 'Diversified Emerging Mkts', region: 'Emerging', riskRating: 5, expenseRatio: 0.59, aum: 8200000000, morningstarRating: 2, ytdReturn: -5.2 },
  { id: 'ETF098', ticker: 'EWZ', name: 'iShares MSCI Brazil ETF', type: 'ETF', assetClass: 'Equity', category: 'Diversified Emerging Mkts', region: 'Emerging', riskRating: 5, expenseRatio: 0.59, aum: 6200000000, morningstarRating: 2, ytdReturn: 3.5 },
  { id: 'ETF099', ticker: 'EPI', name: 'WisdomTree India Earnings Fund', type: 'ETF', assetClass: 'Equity', category: 'Diversified Emerging Mkts', region: 'Emerging', riskRating: 5, expenseRatio: 0.85, aum: 4200000000, morningstarRating: 3, ytdReturn: 15.8 },
  { id: 'ETF100', ticker: 'KWEB', name: 'KraneShares CSI China Internet ETF', type: 'ETF', assetClass: 'Equity', category: 'Diversified Emerging Mkts', region: 'Emerging', riskRating: 5, expenseRatio: 0.71, aum: 5200000000, morningstarRating: 2, ytdReturn: -8.5 },
  { id: 'ETF101', ticker: 'EMLC', name: 'VanEck Emerging Markets Local Currency Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Emerging Markets Bond', region: 'Emerging', riskRating: 4, expenseRatio: 0.30, aum: 3200000000, morningstarRating: 3, ytdReturn: 4.2 },
  { id: 'ETF102', ticker: 'EMB', name: 'iShares J.P. Morgan USD Emerging Markets Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Emerging Markets Bond', region: 'Emerging', riskRating: 4, expenseRatio: 0.39, aum: 18000000000, morningstarRating: 3, ytdReturn: 5.1 },
  { id: 'ETF103', ticker: 'VCLT', name: 'Vanguard Long-Term Corporate Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Long-term Bond', region: 'US', riskRating: 3, expenseRatio: 0.06, aum: 12000000000, morningstarRating: 4, ytdReturn: -1.8 },
  { id: 'ETF104', ticker: 'SCHP', name: 'Schwab U.S. TIPS ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Inflation-Protected Bond', region: 'US', riskRating: 2, expenseRatio: 0.04, aum: 28000000000, morningstarRating: 4, ytdReturn: 2.9 },
  { id: 'ETF105', ticker: 'VTIP', name: 'Vanguard Short-Term Inflation-Protected Securities ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Inflation-Protected Bond', region: 'US', riskRating: 1, expenseRatio: 0.04, aum: 18000000000, morningstarRating: 3, ytdReturn: 4.8 },
  { id: 'ETF106', ticker: 'GOVT', name: 'iShares U.S. Treasury Bond ETF', type: 'ETF', assetClass: 'Fixed Income', category: 'Intermediate Core Bond', region: 'US', riskRating: 2, expenseRatio: 0.05, aum: 32000000000, morningstarRating: 3, ytdReturn: 1.5 },
];
