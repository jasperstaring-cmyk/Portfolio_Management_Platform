import React, { useState } from 'react';
import ProductDetailView from './ProductDetailView';
import UniverseAnalytics from './UniverseAnalytics';

const Icon = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>;
const Trash = () => <Icon d="M3 6 L21 6 M19 6 L19 20 A2 2 0 0 1 17 22 L7 22 A2 2 0 0 1 5 20 L5 6 M8 6 L8 4 A2 2 0 0 1 10 2 L14 2 A2 2 0 0 1 16 4 L16 6" />;
const Edit = () => <Icon d="M11 4 L4 4 A2 2 0 0 0 2 6 L2 20 A2 2 0 0 0 4 22 L18 22 A2 2 0 0 0 20 20 L20 13 M18.5 2.5 A2.121 2.121 0 0 1 21.5 5.5 L12 15 L8 16 L9 12 Z" />;
const X = () => <Icon d="M18 6 L6 18 M6 6 L18 18" />;
const Plus = () => <Icon d="M12 5 L12 19 M5 12 L19 12" />;
const Eye = () => <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const BarChart = () => <Icon d="M12 20V10 M18 20V4 M6 20v-4" />;
const Tag = () => <Icon d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" />;

const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#eab308'];

export function UniverseModule({ universeProducts, portfolios, onAddLabels, onRemoveProduct }) {
  const [editingProductId, setEditingProductId] = useState(null);
  const [editLabels, setEditLabels] = useState({ tags: [], assetClass: '', available: true });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [showBulkLabelModal, setShowBulkLabelModal] = useState(false);
  const [bulkTagInput, setBulkTagInput] = useState('');
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const getProductLabels = (productId) => {
    return JSON.parse(localStorage.getItem(`product_labels_${productId}`) || '{"tags":[],"available":true}');
  };

  const startEdit = (product) => {
    const labels = getProductLabels(product.id);
    setEditingProductId(product.id);
    setEditLabels({ ...labels, assetClass: product.assetClass });
    setNewTagInput('');
  };

  const saveLabels = () => {
    const labels = {
      tags: editLabels.tags,
      available: editLabels.available,
      assetClass: editLabels.assetClass
    };
    localStorage.setItem(`product_labels_${editingProductId}`, JSON.stringify(labels));
    setEditingProductId(null);
  };

  const addTag = () => {
    if (newTagInput.trim() && !editLabels.tags.includes(newTagInput.trim())) {
      setEditLabels(prev => ({
        ...prev,
        tags: [...prev.tags, newTagInput.trim()]
      }));
      setNewTagInput('');
    }
  };

  const removeTag = (tag) => {
    setEditLabels(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const getPortfolioUsage = (productId) => {
    return portfolios.filter(p =>
      p.holdings.some(h => h.productId === productId)
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === universeProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(universeProducts.map(p => p.id)));
    }
  };

  const toggleSelect = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const applyBulkLabel = () => {
    if (!bulkTagInput.trim()) return;

    selectedProducts.forEach(productId => {
      const labels = getProductLabels(productId);
      if (!labels.tags.includes(bulkTagInput.trim())) {
        labels.tags.push(bulkTagInput.trim());
        localStorage.setItem(`product_labels_${productId}`, JSON.stringify(labels));
      }
    });

    setBulkTagInput('');
    setShowBulkLabelModal(false);
    setSelectedProducts(new Set());
  };

  const removeBulkProducts = () => {
    if (!confirm(`Remove ${selectedProducts.size} products from universe?`)) return;

    selectedProducts.forEach(productId => {
      onRemoveProduct(productId);
    });

    setSelectedProducts(new Set());
  };

  const assetClassBreakdown = {};
  universeProducts.forEach(p => {
    assetClassBreakdown[p.assetClass] = (assetClassBreakdown[p.assetClass] || 0) + 1;
  });

  const usedInPortfolios = universeProducts.filter(p => getPortfolioUsage(p.id).length > 0).length;
  const unusedCount = universeProducts.length - usedInPortfolios;

  const s = {
    input: { width: '100%', padding: '0.75rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.875rem', fontFamily: 'inherit' },
    btn: { padding: '0.875rem 1.5rem', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' },
    card: { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px', padding: '1.5rem' }
  };

  if (universeProducts.length === 0) {
    return (
      <div style={s.card}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>No products in your universe yet</p>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Use the Screener tab to add products</p>
        </div>
      </div>
    );
  }

  if (showAnalytics) {
    return (
      <div>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Universe Analytics</h2>
          <button
            onClick={() => setShowAnalytics(false)}
            style={{ ...s.btn, background: 'rgba(148,163,184,0.1)', color: '#f1f5f9' }}
          >
            Back to Products
          </button>
        </div>
        <UniverseAnalytics
          universeProducts={universeProducts}
          portfolios={portfolios}
          getProductLabels={getProductLabels}
          getPortfolioUsage={getPortfolioUsage}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', flex: 1 }}>
          <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginBottom: '0.5rem', fontWeight: 600 }}>TOTAL PRODUCTS</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{universeProducts.length}</div>
          </div>
          <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 600 }}>USED IN PORTFOLIOS</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{usedInPortfolios}</div>
          </div>
          <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginBottom: '0.5rem', fontWeight: 600 }}>UNUSED</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{unusedCount}</div>
          </div>
          <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginBottom: '0.5rem', fontWeight: 600 }}>ASSET CLASSES</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{Object.keys(assetClassBreakdown).length}</div>
          </div>
        </div>

        <button
          onClick={() => setShowAnalytics(true)}
          style={{ ...s.btn, marginLeft: '1rem' }}
        >
          <BarChart /> Analytics
        </button>
      </div>

      {selectedProducts.size > 0 && (
        <div style={{ ...s.card, marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>
              {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowBulkLabelModal(true)}
                style={{ ...s.btn, background: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }}
              >
                <Tag /> Apply Label
              </button>
              <button
                onClick={removeBulkProducts}
                style={{ ...s.btn, background: 'linear-gradient(135deg,#ef4444,#f87171)' }}
              >
                <Trash /> Remove Selected
              </button>
              <button
                onClick={() => setSelectedProducts(new Set())}
                style={{ ...s.btn, background: 'rgba(148,163,184,0.2)', color: '#f1f5f9' }}
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ ...s.card, padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            type="checkbox"
            checked={selectedProducts.size === universeProducts.length}
            onChange={toggleSelectAll}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>
            Select All
          </span>
        </div>

        {universeProducts.map(product => {
          const labels = getProductLabels(product.id);
          const usedIn = getPortfolioUsage(product.id);
          const isEditing = editingProductId === product.id;
          const isSelected = selectedProducts.has(product.id);

          return (
            <div key={product.id} style={{ ...s.card, border: isSelected ? '2px solid rgba(139,92,246,0.5)' : s.card.border }}>
              {isEditing ? (
                <div>
                  <h4 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 700 }}>Edit Labels: {product.ticker}</h4>

                  <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Custom Tags</label>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', minHeight: '32px', alignItems: 'center' }}>
                        {editLabels.tags.map(tag => (
                          <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '6px', fontSize: '0.875rem', color: '#a78bfa' }}>
                            {tag}
                            <button onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', padding: 0, display: 'flex' }}>
                              <X />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={e => setNewTagInput(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && addTag()}
                          placeholder="Add tag..."
                          style={s.input}
                        />
                        <button onClick={addTag} style={{ ...s.btn, padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                          <Plus /> Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
                        <input type="checkbox" checked={editLabels.available} onChange={e => setEditLabels(prev => ({ ...prev, available: e.target.checked }))} style={{ width: '18px', height: '18px' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#94a3b8' }}>Available for Model Portfolios</span>
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setEditingProductId(null)} style={{ flex: 1, padding: '0.875rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                    <button onClick={saveLabels} style={{ flex: 1, ...s.btn }}>Save Labels</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(product.id)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', flexShrink: 0 }}
                  />

                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>{product.ticker}</div>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>{product.name}</div>
                        </div>
                        <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa' }}>
                          {product.assetClass}
                        </span>
                      </div>

                      {labels.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                          {labels.tags.map((tag, i) => (
                            <span key={tag} style={{ padding: '0.25rem 0.5rem', background: colors[i % colors.length], border: 'none', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {usedIn.length > 0 && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', fontSize: '0.875rem' }}>
                          <div style={{ color: '#10b981', fontWeight: 600, marginBottom: '0.25rem' }}>Used in {usedIn.length} portfolio{usedIn.length !== 1 ? 's' : ''}:</div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {usedIn.map(p => (
                              <span key={p.id} style={{ padding: '0.25rem 0.5rem', background: 'rgba(16,185,129,0.2)', borderRadius: '4px', fontSize: '0.75rem', color: '#10b981' }}>
                                {p.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {usedIn.length === 0 && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', fontSize: '0.875rem', color: '#94a3b8' }}>
                          Not used in any portfolio
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Expense Ratio</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>{product.expenseRatio}%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>YTD Return</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: product.ytdReturn > 0 ? '#10b981' : '#ef4444' }}>
                            {product.ytdReturn > 0 ? '+' : ''}{product.ytdReturn}%
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Risk Rating</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>{product.riskRating}/5</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '2rem' }}>
                      <button
                        onClick={() => setSelectedProductDetail(product)}
                        style={{ padding: '0.5rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', cursor: 'pointer' }}
                        title="View Details"
                      >
                        <Eye />
                      </button>
                      <button onClick={() => startEdit(product)} style={{ padding: '0.5rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', color: '#a78bfa', cursor: 'pointer' }}>
                        <Edit />
                      </button>
                      <button onClick={() => onRemoveProduct(product.id)} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showBulkLabelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Apply Label to {selectedProducts.size} Products
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
                Label Name
              </label>
              <input
                type="text"
                value={bulkTagInput}
                onChange={e => setBulkTagInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && applyBulkLabel()}
                placeholder="Enter label name..."
                style={s.input}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowBulkLabelModal(false)}
                style={{ flex: 1, padding: '0.875rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer', fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={applyBulkLabel}
                style={{ flex: 1, ...s.btn }}
                disabled={!bulkTagInput.trim()}
              >
                Apply Label
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProductDetail && (
        <ProductDetailView
          product={selectedProductDetail}
          onClose={() => setSelectedProductDetail(null)}
        />
      )}
    </div>
  );
}
