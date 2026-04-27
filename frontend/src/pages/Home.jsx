import React, { useState, useEffect, useMemo } from 'react';
import { getExpenses, addExpense, getExpenseSummary } from '../api';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'];

// Added a simple color map for category badges
const CATEGORY_COLORS = {
  Food: { bg: '#dcfce7', text: '#166534' },
  Transport: { bg: '#e0e7ff', text: '#3730a3' },
  Utilities: { bg: '#fef08a', text: '#854d0e' },
  Entertainment: { bg: '#fce7f3', text: '#9d174d' },
  Health: { bg: '#fee2e2', text: '#991b1b' },
  Other: { bg: '#f3f4f6', text: '#374151' },
};

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('date_desc');
  const todayDate = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: todayDate
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState([]);
  const navigate = useNavigate();

  const fetchExpenses = () => {
    setLoading(true);
    getExpenses(filter, sortOrder)
      .then(res => {
        setExpenses(res.data);
        setError(null);
      })
      .catch(err => {
        setError('Failed to fetch expenses.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const fetchSummary = () => {
    getExpenseSummary()
      .then(res => setSummary(res.data))
      .catch(err => console.error('Failed to fetch summary', err));
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [filter, sortOrder]);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate('/login');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;
    if (formData.date > todayDate) {
      setError('Date cannot be later than today.');
      return;
    }

    const newEntry = {
      ...formData,
      amount: parseFloat(formData.amount),
      idempotency_key: uuidv4(),
    };

    addExpense(newEntry)
      .then(() => {
        fetchExpenses(); 
        fetchSummary();
        setFormData({ ...formData, amount: '', description: '', date: todayDate });
      })
      .catch(err => {
        setError('Failed to add expense.');
        console.error(err);
      });
  };

  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  }, [expenses]);

  // Shared styles for inputs
  const inputStyle = {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    backgroundColor: '#f8fafc',
    width: '100%',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontWeight: '600',
    marginBottom: '6px',
    color: '#475569',
    fontSize: '0.9rem'
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '2rem 1rem', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <h1 style={{ color: '#0f172a', margin: 0, fontSize: '1.8rem' }}>💸 Expense Tracker</h1>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Logout
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* --- Left Column: Form --- */}
          <div>
            <section style={{ padding: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
              <h3 style={{ color: '#1e293b', marginTop: 0, marginBottom: '1.5rem' }}>Add New Expense</h3>
              <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={labelStyle}>Description</label>
                  <input
                    type="text" placeholder="e.g., Morning Coffee" required
                    style={inputStyle}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <label style={labelStyle}>Amount (₹)</label>
                    <input
                      type="number" placeholder="0.00" required min="0" step="0.01"
                      style={inputStyle}
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <label style={labelStyle}>Category</label>
                    <select style={inputStyle} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={labelStyle}>Date</label>
                  <input
                    type="date" required
                    style={inputStyle}
                    value={formData.date}
                    max={todayDate}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                  <small style={{ color: '#64748b', marginTop: '6px' }}>Cannot be later than today.</small>
                </div>

                <button type="submit" style={{ marginTop: '0.5rem', padding: '12px', background: '#4f46e5', color: 'white', fontWeight: 'bold', fontSize: '1rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  + Add Expense
                </button>
              </form>
            </section>

            {/* --- Summary View --- */}
            <section style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <h3 style={{ color: '#1e293b', marginTop: 0, marginBottom: '1rem' }}>Category Summary</h3>
              {summary.length > 0 ? (
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {summary.map(item => (
                    <li key={item.category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed #cbd5e1' }}>
                      <span style={{ fontWeight: '500', color: '#475569' }}>{item.category}</span>
                      <span style={{ fontWeight: 'bold', color: '#0f172a' }}>₹{parseFloat(item.total).toLocaleString('en-IN')}</span>
                    </li>
                  ))}
                </ul>
              ) : <p style={{ color: '#64748b', margin: 0 }}>No summary data.</p>}
            </section>
          </div>

          {/* --- Right Column: List --- */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>Filter by Category</label>
                <select style={{...inputStyle, padding: '8px', width: '150px'}} value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <button onClick={() => setSortOrder('date_desc')} style={{ padding: '8px 12px', backgroundColor: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontWeight: '500' }}>
                Sort: Newest First
              </button>
            </div>

            {/* Expense List */}
            <section style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: '#1e293b', margin: 0 }}>Recent Expenses</h3>
                <div style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                  Total: ₹{totalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading expenses...</div>
              ) : expenses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                  No expenses found.
                </div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {expenses.map(item => {
                    const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
                    return (
                      <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', transition: 'transform 0.2s', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem', marginBottom: '4px' }}>
                            {item.description}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ backgroundColor: colors.bg, color: colors.text, padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>
                              {item.category}
                            </span>
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.2rem' }}>
                          ₹{parseFloat(item.amount).toLocaleString('en-IN')}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;