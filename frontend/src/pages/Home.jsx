import React, { useState, useEffect, useMemo } from 'react';
import { getExpenses, addExpense, getExpenseSummary } from '../api';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'];

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('All');
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState([]);

  const fetchExpenses = () => {
    setLoading(true);
    getExpenses(filter)
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
  }, [filter]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    const newEntry = {
      ...formData,
      amount: parseFloat(formData.amount),
      idempotency_key: uuidv4(),
    };

    addExpense(newEntry)
      .then(() => {
        fetchExpenses(); // Refetch to get the latest list
        fetchSummary();
        setFormData({ ...formData, amount: '', description: '' }); // Reset form
      })
      .catch(err => {
        setError('Failed to add expense.');
        console.error(err);
      });
  };

  const filteredExpenses = useMemo(() => {
    return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  }, [filteredExpenses]);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Expense Tracker</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* --- Add Expense Form --- */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Add New Expense</h3>
        <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="number" placeholder="Amount (₹)" required min="0"
            value={formData.amount} 
            onChange={(e) => setFormData({...formData, amount: e.target.value})} 
          />
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input 
            type="text" placeholder="Description" required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <input 
            type="date" required
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
          <button type="submit" style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Add Expense
          </button>
        </form>
      </section>

      {/* --- Summary View --- */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Category Summary</h3>
        {summary.length > 0 ? (
          <ul style={{ padding: 0 }}>
            {summary.map(item => (
              <li key={item.category} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.category}</span>
                <span>₹{parseFloat(item.total).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
        ) : <p>No summary data.</p>}
      </section>

      {/* --- Filter & Summary --- */}
      <section style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <label>Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          Total: ₹{totalAmount.toLocaleString('en-IN')}
        </div>
      </section>

      {/* --- Expense List --- */}
      <section>
        {loading ? (
          <p>Loading...</p>
        ) : filteredExpenses.length === 0 ? (
          <p style={{ color: '#666' }}>No expenses found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredExpenses.map(exp => (
              <li key={exp.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{exp.description}</strong> <br />
                  <small style={{ color: '#666' }}>{exp.category} • {new Date(exp.date).toLocaleDateString()}</small>
                </div>
                <div style={{ fontWeight: 'bold' }}>₹{parseFloat(exp.amount).toLocaleString('en-IN')}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Home;