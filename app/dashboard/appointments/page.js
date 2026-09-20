'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [form, setForm] = useState({
    service: 'Investment Planning',
    appointmentDate: '',
    appointmentTime: '10:00 AM',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/appointments');
      const data = await res.json();
      if (res.ok && data.success) {
        setAppointments(data.appointments || []);
      } else {
        setError(data.message || 'Unable to retrieve appointments.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleBook = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const errors = {};
    if (!form.service) errors.service = 'Please select a service.';
    if (!form.appointmentDate) errors.appointmentDate = 'Please select a date.';
    if (!form.appointmentTime) errors.appointmentTime = 'Please select a time.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/user/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Appointment booked successfully!');
        setModalOpen(false);
        setForm({
          service: 'Investment Planning',
          appointmentDate: '',
          appointmentTime: '10:00 AM',
          notes: '',
        });
        fetchAppointments();
      } else {
        setFormErrors(data.errors || { general: data.message || 'Failed to book appointment.' });
      }
    } catch {
      setFormErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  return (
    <DashboardLayout>
      <head>
        <title>Appointments | GrowthNest Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, background: '#10b981', color: '#ffffff', padding: '0.85rem 1.4rem', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', fontWeight: 600, fontSize: '0.9rem' }}>
          ✓ {toastMessage}
        </div>
      )}

      <div style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.35rem', color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
              My Appointments
            </h2>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--gray-600)' }}>
              Manage your upcoming financial advisory sessions and consultation records.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn btn-primary"
            style={{ background: '#101b3b', borderColor: '#101b3b' }}
          >
            + Book New Appointment
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((statusKey) => (
            <button
              key={statusKey}
              type="button"
              onClick={() => setFilter(statusKey)}
              style={{
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: filter === statusKey ? '#101b3b' : '#f1f5f9',
                color: filter === statusKey ? '#ffffff' : 'var(--gray-600)',
                transition: 'all 0.15s',
              }}
            >
              {statusKey === 'ALL' ? 'All Sessions' : statusKey}
            </button>
          ))}
        </div>

        {/* List Content */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', background: '#ffffff', borderRadius: '12px' }}>
            <div className="db-spinner" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Loading appointments...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #fee2e2' }}>
            <p style={{ color: '#e11d48', fontWeight: 600 }}>{error}</p>
            <button type="button" onClick={fetchAppointments} className="btn btn-outline btn-sm">
              Retry
            </button>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div style={{ background: '#ffffff', padding: '3rem 1.5rem', textAlign: 'center', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗓️</div>
            <h3 style={{ color: 'var(--primary-900)', margin: '0 0 0.4rem', fontSize: '1.15rem' }}>
              No appointments found
            </h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', margin: '0 0 1.25rem' }}>
              {filter === 'ALL'
                ? 'You do not have any scheduled appointments yet.'
                : `No appointments with status "${filter}".`}
            </p>
            <button type="button" onClick={() => setModalOpen(true)} className="btn btn-primary btn-sm">
              Schedule a Consultation
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {filteredAppointments.map((appt) => (
              <div
                key={appt.id}
                className="glass-card-static"
                style={{
                  background: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  borderLeft: `4px solid ${
                    appt.status === 'CONFIRMED'
                      ? '#16a34a'
                      : appt.status === 'CANCELLED'
                      ? '#ef4444'
                      : '#f59e0b'
                  }`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary-900)' }}>
                    {appt.service}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      background:
                        appt.status === 'CONFIRMED'
                          ? '#dcfce7'
                          : appt.status === 'CANCELLED'
                          ? '#fee2e2'
                          : '#fef3c7',
                      color:
                        appt.status === 'CONFIRMED'
                          ? '#15803d'
                          : appt.status === 'CANCELLED'
                          ? '#b91c1c'
                          : '#b45309',
                    }}
                  >
                    {appt.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                  📅 <strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                  ⏰ <strong>Time:</strong> {appt.appointmentTime}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginBottom: appt.notes ? '0.5rem' : 0 }}>
                  👤 <strong>Advisor:</strong> {appt.advisor}
                </div>
                {appt.notes && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                    &ldquo;{appt.notes}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ background: '#ffffff', maxWidth: '480px', width: '100%', borderRadius: '16px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                📅 Schedule Advisory Session
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--gray-500)' }}
              >
                ✕
              </button>
            </div>

            {formErrors.general && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', color: '#b91c1c', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ⚠️ {formErrors.general}
              </div>
            )}

            <form onSubmit={handleBook} noValidate>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" htmlFor="page-appt-service" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Service *
                </label>
                <select
                  id="page-appt-service"
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="form-input"
                >
                  <option value="Investment Planning">Investment Planning</option>
                  <option value="Retirement Planning">Retirement Planning</option>
                  <option value="Tax Planning">Tax Planning</option>
                  <option value="Insurance Planning">Insurance Planning</option>
                  <option value="Wealth Management">Wealth Management</option>
                  <option value="Financial Planning">360° Financial Planning</option>
                </select>
                {formErrors.service && <p className="sip-error-msg">{formErrors.service}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="page-appt-date" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Date *
                  </label>
                  <input
                    id="page-appt-date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.appointmentDate}
                    onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                    className={`form-input ${formErrors.appointmentDate ? 'is-invalid' : ''}`}
                  />
                  {formErrors.appointmentDate && <p className="sip-error-msg">{formErrors.appointmentDate}</p>}
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="page-appt-time" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Time *
                  </label>
                  <select
                    id="page-appt-time"
                    value={form.appointmentTime}
                    onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
                    className="form-input"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                  </select>
                  {formErrors.appointmentTime && <p className="sip-error-msg">{formErrors.appointmentTime}</p>}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="page-appt-notes" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Notes (Optional)
                </label>
                <textarea
                  id="page-appt-notes"
                  rows={2}
                  placeholder="Share details regarding your questions or financial context..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ background: '#101b3b', borderColor: '#101b3b' }}
                >
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
