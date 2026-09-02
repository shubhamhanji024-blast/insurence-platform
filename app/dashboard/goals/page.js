'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatIndianCurrency } from '@/utils/sipCalculations';

const GOAL_TYPES = [
  { label: 'Retirement', icon: '🌴' },
  { label: 'Home Purchase', icon: '🏡' },
  { label: 'Emergency Fund', icon: '🛡️' },
  { label: 'Education', icon: '🎓' },
  { label: 'Vehicle', icon: '🚗' },
  { label: 'Travel', icon: '✈️' },
  { label: 'Investment', icon: '📈' },
  { label: 'Other', icon: '🎯' },
];

export default function FinancialGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form State
  const [form, setForm] = useState({
    name: '',
    goalType: 'Retirement',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '',
    description: '',
  });

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchGoals = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/goals');
      const data = await res.json();
      if (res.ok && data.success) {
        setGoals(data.goals || []);
      } else {
        setError(data.message || 'Failed to load financial goals.');
      }
    } catch {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const openCreateModal = () => {
    setEditingGoal(null);
    setForm({
      name: '',
      goalType: 'Retirement',
      targetAmount: '',
      currentAmount: '0',
      targetDate: '',
      description: '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setForm({
      name: goal.name,
      goalType: goal.goalType,
      targetAmount: String(goal.targetAmount),
      currentAmount: String(goal.currentAmount || 0),
      targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : '',
      description: goal.description || '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const errs = {};
    const cleanName = form.name.trim();
    if (!cleanName) errs.name = 'Goal name is required.';
    else if (cleanName.length > 100) errs.name = 'Goal name cannot exceed 100 characters.';

    const pTarget = parseFloat(form.targetAmount);
    if (isNaN(pTarget) || pTarget <= 0) errs.targetAmount = 'Target amount must be > 0.';

    const pCurrent = parseFloat(form.currentAmount);
    if (isNaN(pCurrent) || pCurrent < 0) errs.currentAmount = 'Current amount cannot be negative.';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingGoal ? `/api/goals/${editingGoal.id}` : '/api/goals';
      const method = editingGoal ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          goalType: form.goalType,
          targetAmount: pTarget,
          currentAmount: pCurrent,
          targetDate: form.targetDate || null,
          description: form.description.trim() || null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setModalOpen(false);
        fetchGoals();
      } else {
        setFormErrors(data.errors || { general: data.message || 'Failed to save goal.' });
      }
    } catch {
      setFormErrors({ general: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/goals/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeleteId(null);
        fetchGoals();
      } else {
        alert(data.message || 'Failed to delete goal.');
      }
    } catch {
      alert('Failed to connect to server.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.35rem', color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Financial Goals
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray-600)' }}>
            Track and manage your wealth accumulation milestones.
          </p>
        </div>

        <button type="button" onClick={openCreateModal} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>+</span> Add New Goal
        </button>
      </div>

      {error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <p style={{ color: '#e11d48', margin: 0 }}>⚠️ {error}</p>
          <button type="button" onClick={fetchGoals} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      ) : loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff', height: '180px' }}>
              <div style={{ width: '60%', height: '16px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '1rem' }} />
              <div style={{ width: '40%', height: '24px', background: '#cbd5e1', borderRadius: '4px', marginBottom: '1rem' }} />
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      ) : goals.length === 0 ? (
        /* Empty State */
        <div className="glass-card text-center" style={{ padding: '3.5rem 2rem', background: '#ffffff' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e6fffa', color: '#19C3A3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 1.25rem' }}>
            🎯
          </div>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', margin: '0 0 0.5rem', fontFamily: "'Playfair Display', serif" }}>
            No goals yet
          </h3>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
            Create your first financial goal and start tracking your progress towards retirement, a home, or wealth milestones.
          </p>
          <button type="button" onClick={openCreateModal} className="btn btn-primary">
            + Create a Goal
          </button>
        </div>
      ) : (
        /* Goals Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {goals.map((goal) => {
            const pct = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
            const isAchieved = goal.currentAmount >= goal.targetAmount || goal.status === 'ACHIEVED';
            const icon = GOAL_TYPES.find((t) => t.label === goal.goalType)?.icon || '🎯';

            return (
              <div key={goal.id} className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {/* Goal Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.6rem' }}>{icon}</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-900)', fontWeight: 700 }}>
                        {goal.name}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{goal.goalType}</span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      background: isAchieved ? '#dcfce7' : '#e0f2fe',
                      color: isAchieved ? '#15803d' : '#0369a1',
                    }}
                  >
                    {isAchieved ? 'Goal Achieved 🎉' : `${pct}% Complete`}
                  </span>
                </div>

                {/* Amount Row */}
                <div style={{ margin: '0.75rem 0 1rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    {formatIndianCurrency(goal.currentAmount)}{' '}
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--gray-500)' }}>
                      / {formatIndianCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  {goal.targetDate && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>
                      Target Date: {new Date(goal.targetDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: isAchieved ? '#16a34a' : 'linear-gradient(90deg, #19C3A3 0%, #101b3b 100%)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                {goal.description && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', margin: '0 0 1.25rem', flex: 1, lineHeight: 1.5 }}>
                    {goal.description}
                  </p>
                )}

                {/* Card Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    type="button"
                    onClick={() => openEditModal(goal)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                  >
                    ✏️ Edit Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(goal.id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#e11d48', borderColor: '#fecdd3' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Create / Edit Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ background: '#ffffff', maxWidth: '520px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
                {editingGoal ? 'Edit Financial Goal' : 'Create Financial Goal'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--gray-500)' }}>
                ✕
              </button>
            </div>

            {formErrors.general && (
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ⚠️ {formErrors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Goal Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="goal-name">
                  Goal Name *
                </label>
                <input
                  id="goal-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`form-input ${formErrors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g. Dream House Fund"
                />
                {formErrors.name && <p className="sip-error-msg">{formErrors.name}</p>}
              </div>

              {/* Goal Type */}
              <div className="form-group">
                <label className="form-label" htmlFor="goal-type">
                  Goal Type *
                </label>
                <select
                  id="goal-type"
                  value={form.goalType}
                  onChange={(e) => setForm({ ...form, goalType: e.target.value })}
                  className="form-input"
                >
                  {GOAL_TYPES.map((t) => (
                    <option key={t.label} value={t.label}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target & Current Amount */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="target-amount">
                    Target Amount (₹) *
                  </label>
                  <input
                    id="target-amount"
                    type="number"
                    value={form.targetAmount}
                    onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                    className={`form-input ${formErrors.targetAmount ? 'is-invalid' : ''}`}
                    placeholder="2500000"
                  />
                  {formErrors.targetAmount && <p className="sip-error-msg">{formErrors.targetAmount}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="current-amount">
                    Current Savings (₹)
                  </label>
                  <input
                    id="current-amount"
                    type="number"
                    value={form.currentAmount}
                    onChange={(e) => setForm({ ...form, currentAmount: e.target.value })}
                    className={`form-input ${formErrors.currentAmount ? 'is-invalid' : ''}`}
                    placeholder="500000"
                  />
                  {formErrors.currentAmount && <p className="sip-error-msg">{formErrors.currentAmount}</p>}
                </div>
              </div>

              {/* Target Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="target-date">
                  Target Date (Optional)
                </label>
                <input
                  id="target-date"
                  type="date"
                  value={form.targetDate}
                  onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Description */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="goal-desc">
                  Notes / Description (Optional)
                </label>
                <textarea
                  id="goal-desc"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="form-input"
                  rows={3}
                  placeholder="Optional details or target plan strategy..."
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card text-center" style={{ background: '#ffffff', maxWidth: '400px', width: '100%', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗑️</div>
            <h3 style={{ color: 'var(--primary-900)', margin: '0 0 0.5rem' }}>Delete Goal?</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this financial goal? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={() => setDeleteId(null)} className="btn btn-outline w-full">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} className="btn btn-primary w-full" style={{ background: '#e11d48', borderColor: '#e11d48' }} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete Goal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
