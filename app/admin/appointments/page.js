'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Modal states
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Create form state
  const [newForm, setNewForm] = useState({
    clientName: '',
    email: '',
    phone: '',
    service: 'Financial Planning',
    appointmentDate: '',
    appointmentTime: '10:00 AM',
    notes: '',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (dateFilter) params.set('date', dateFilter);
      params.set('page', page);

      const res = await fetch(`/api/admin/appointments?${params.toString()}`);
      const json = await res.json();

      if (res.ok && json.success) {
        setAppointments(json.data.appointments || []);
        setCounts(json.data.counts || {});
        setPagination(json.data.pagination || { total: 0, totalPages: 1 });
      } else {
        setError(json.message || 'Failed to fetch appointments.');
      }
    } catch {
      setError('Unable to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, statusFilter, dateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAppointments();
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedAppt) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/appointments/${selectedAppt._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`Status updated to ${newStatus}`);
        setIsEditOpen(false);
        fetchAppointments();
      } else {
        alert(json.message || 'Update failed.');
      }
    } catch {
      alert('Error updating appointment.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppt) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/appointments/${selectedAppt._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Appointment deleted successfully.');
        setIsDeleteOpen(false);
        setSelectedAppt(null);
        fetchAppointments();
      } else {
        alert(json.message || 'Delete failed.');
      }
    } catch {
      alert('Error deleting appointment.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Appointment created successfully!');
        setIsCreateOpen(false);
        setNewForm({ clientName: '', email: '', phone: '', service: 'Financial Planning', appointmentDate: '', appointmentTime: '10:00 AM', notes: '' });
        fetchAppointments();
      } else {
        alert(json.message || 'Failed to create appointment.');
      }
    } catch {
      alert('Error scheduling appointment.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'CONFIRMED':
        return { bg: '#dcfce7', color: '#166534', label: 'Confirmed' };
      case 'COMPLETED':
        return { bg: '#e0e7ff', color: '#3730a3', label: 'Completed' };
      case 'CANCELLED':
        return { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' };
      default:
        return { bg: '#fef3c7', color: '#92400e', label: 'Pending' };
    }
  };

  return (
    <AdminLayout title="Appointment Management">
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#fff', padding: '0.85rem 1.4rem', borderRadius: 10, zIndex: 1200, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Header Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', borderTop: '4px solid #101b3b' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{counts.total || 0}</div>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', borderTop: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Pending</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#b45309', marginTop: 4 }}>{counts.pending || 0}</div>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', borderTop: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Confirmed</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: 4 }}>{counts.confirmed || 0}</div>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', borderTop: '4px solid #6366f1' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Completed</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4338ca', marginTop: 4 }}>{counts.completed || 0}</div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Schedule Button */}
      <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: 260, maxWidth: 450 }}>
          <input
            type="text"
            placeholder="Search by client name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '0.6rem 1.1rem', background: '#101b3b', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
            Filter
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
            style={{ padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
          />

          {(statusFilter || dateFilter || search) && (
            <button
              onClick={() => { setStatusFilter(''); setDateFilter(''); setSearch(''); setPage(1); }}
              style={{ padding: '0.6rem 0.9rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              Reset
            </button>
          )}

          <button
            onClick={() => setIsCreateOpen(true)}
            style={{ padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #d4af37 0%, #b8972e 100%)', color: '#0f172a', border: 'none', borderRadius: 8, fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>+</span> Schedule Appointment
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            Loading appointments...
          </div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
            <button onClick={fetchAppointments} style={{ padding: '0.5rem 1rem', borderRadius: 6, background: '#101b3b', color: '#fff', border: 'none', cursor: 'pointer', marginTop: 8 }}>
              Try Again
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>No Appointments Found</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>No client consultations match the specified query filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Client</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Service</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Date & Time</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => {
                  const badge = getStatusBadge(appt.status);
                  return (
                    <tr key={appt._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{appt.clientName}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{appt.email} • {appt.phone}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#334155', fontWeight: 500 }}>
                        {appt.service}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          {new Date(appt.appointmentDate).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{appt.appointmentTime}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 100, fontWeight: 700, background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => { setSelectedAppt(appt); setIsEditOpen(true); }}
                            style={{ padding: '0.35rem 0.75rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#0f172a' }}
                          >
                            Update
                          </button>
                          <button
                            onClick={() => { setSelectedAppt(appt); setIsDeleteOpen(true); }}
                            style={{ padding: '0.35rem 0.75rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#991b1b' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Showing Page {page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{ padding: '0.35rem 0.85rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.82rem', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                style={{ padding: '0.35rem 0.85rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.82rem', cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer', opacity: page >= pagination.totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Status Modal */}
      {isEditOpen && selectedAppt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: 440, maxWidth: '90vw', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a', fontSize: '1.15rem' }}>
              Update Appointment Status
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1.25rem' }}>
              Client: <strong>{selectedAppt.clientName}</strong> ({selectedAppt.service})
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(st)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 8,
                    border: selectedAppt.status === st ? '2px solid #d4af37' : '1px solid #cbd5e1',
                    background: selectedAppt.status === st ? '#fefce8' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    color: '#0f172a',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsEditOpen(false)}
                style={{ padding: '0.55rem 1.25rem', borderRadius: 8, background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && selectedAppt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: 440, maxWidth: '90vw', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>⚠️</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#991b1b', textAlign: 'center', fontSize: '1.2rem' }}>
              Confirm Appointment Deletion
            </h3>
            <p style={{ color: '#475569', fontSize: '0.88rem', textAlign: 'center', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete the appointment for <strong>{selectedAppt.clientName}</strong> on {new Date(selectedAppt.appointmentDate).toLocaleDateString()}? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setIsDeleteOpen(false)}
                style={{ padding: '0.65rem 1.25rem', borderRadius: 8, background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleDelete}
                style={{ padding: '0.65rem 1.25rem', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}
              >
                {actionLoading ? 'Deleting...' : 'Yes, Delete Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {isCreateOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: 500, maxWidth: '90vw', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 0.35rem', color: '#0f172a', fontSize: '1.2rem' }}>
              Schedule New Appointment
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1.25rem' }}>
              Create an advisory consultation session directly in GrowthNest.
            </p>

            <form onSubmit={handleCreateAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Client Full Name *</label>
                <input
                  required
                  type="text"
                  value={newForm.clientName}
                  onChange={(e) => setNewForm({ ...newForm, clientName: e.target.value })}
                  placeholder="e.g. Vikram Sharma"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Email Address *</label>
                  <input
                    required
                    type="email"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    placeholder="vikram@example.com"
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Financial Service *</label>
                <select
                  value={newForm.service}
                  onChange={(e) => setNewForm({ ...newForm, service: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#fff' }}
                >
                  <option value="Financial Planning">Financial Planning</option>
                  <option value="Investment Planning">Investment Planning</option>
                  <option value="Wealth Management">Wealth Management</option>
                  <option value="Retirement Planning">Retirement Planning</option>
                  <option value="Tax Planning">Tax Planning</option>
                  <option value="Insurance Planning">Insurance Planning</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Date *</label>
                  <input
                    required
                    type="date"
                    value={newForm.appointmentDate}
                    onChange={(e) => setNewForm({ ...newForm, appointmentDate: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Time Slot *</label>
                  <select
                    value={newForm.appointmentTime}
                    onChange={(e) => setNewForm({ ...newForm, appointmentTime: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#fff' }}
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Consultation Notes</label>
                <textarea
                  rows={3}
                  value={newForm.notes}
                  onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                  placeholder="Portfolio size, investment goals, discussion points..."
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: 8, background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  type="submit"
                  style={{ padding: '0.65rem 1.4rem', borderRadius: 8, background: '#101b3b', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  {actionLoading ? 'Saving...' : 'Save Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
