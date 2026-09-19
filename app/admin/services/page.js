'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Financial Planning',
    icon: '💼',
    status: 'ACTIVE',
    features: '',
    order: 0,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/admin/services?${params.toString()}`);
      const json = await res.json();

      if (res.ok && json.success) {
        setServices(json.data.services || []);
      } else {
        setError(json.message || 'Failed to load services.');
      }
    } catch {
      setError('Unable to connect to services database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setForm({
      name: '',
      description: '',
      category: 'Financial Planning',
      icon: '💼',
      status: 'ACTIVE',
      features: '',
      order: services.length + 1,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setForm({
      name: svc.name,
      description: svc.description,
      category: svc.category || 'Financial Planning',
      icon: svc.icon || '💼',
      status: svc.status,
      features: Array.isArray(svc.features) ? svc.features.join('\n') : '',
      order: svc.order || 0,
    });
    setIsFormOpen(true);
  };

  const handleToggleStatus = async (svc) => {
    const nextStatus = svc.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/services/${svc._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`Service "${svc.name}" is now ${nextStatus}`);
        setServices((prev) =>
          prev.map((s) => (s._id === svc._id ? { ...s, status: nextStatus } : s))
        );
      } else {
        alert(json.message || 'Status toggle failed.');
      }
    } catch {
      alert('Error updating status.');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        icon: form.icon,
        status: form.status,
        order: Number(form.order),
        features: form.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
      };

      const url = editingService
        ? `/api/admin/services/${editingService._id}`
        : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(editingService ? 'Service updated successfully!' : 'Service created successfully!');
        setIsFormOpen(false);
        fetchServices();
      } else {
        alert(json.message || 'Operation failed.');
      }
    } catch {
      alert('Error saving service.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/services/${serviceToDelete._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`Service "${serviceToDelete.name}" deleted.`);
        setIsDeleteOpen(false);
        setServiceToDelete(null);
        fetchServices();
      } else {
        alert(json.message || 'Delete failed.');
      }
    } catch {
      alert('Error deleting service.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout title="Services Management">
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#fff', padding: '0.85rem 1.4rem', borderRadius: 10, zIndex: 1200, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Header Controls */}
      <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: 260, maxWidth: 420 }}>
          <input
            type="text"
            placeholder="Search service name, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '0.6rem 1.1rem', background: '#101b3b', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          <button
            onClick={handleOpenAdd}
            style={{ padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #d4af37 0%, #b8972e 100%)', color: '#0f172a', border: 'none', borderRadius: 8, fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>+</span> Add Service
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          Loading services catalog from database...
        </div>
      ) : error ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444', background: '#fff', borderRadius: 12 }}>
          <p style={{ fontWeight: 600 }}>{error}</p>
          <button onClick={fetchServices} style={{ padding: '0.5rem 1rem', borderRadius: 6, background: '#101b3b', color: '#fff', border: 'none', cursor: 'pointer', marginTop: 8 }}>
            Retry
          </button>
        </div>
      ) : services.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b', background: '#fff', borderRadius: 12 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💼</div>
          <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>No Services Configured</h3>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem' }}>Add your first advisory service to display it across the platform.</p>
          <button onClick={handleOpenAdd} style={{ padding: '0.6rem 1.2rem', background: '#101b3b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            + Create Service
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {services.map((svc) => (
            <div
              key={svc._id}
              style={{
                background: '#ffffff',
                borderRadius: 14,
                border: '1px solid #e2e8f0',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                opacity: svc.status === 'INACTIVE' ? 0.75 : 1,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {svc.icon || '💼'}
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '3px 10px',
                      borderRadius: 100,
                      fontWeight: 700,
                      background: svc.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                      color: svc.status === 'ACTIVE' ? '#166534' : '#991b1b',
                    }}
                  >
                    {svc.status}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>
                  {svc.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'inline-block', marginBottom: '0.75rem' }}>
                  Category: {svc.category}
                </span>

                <p style={{ margin: '0 0 1rem', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                  {svc.description}
                </p>

                {svc.features && svc.features.length > 0 && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Key Features
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {svc.features.slice(0, 3).map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ color: '#16a34a' }}>✓</span> {f}
                        </li>
                      ))}
                      {svc.features.length > 3 && (
                        <li style={{ color: '#94a3b8', fontSize: '0.75rem' }}>+{svc.features.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => handleToggleStatus(svc)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    background: svc.status === 'ACTIVE' ? '#fef2f2' : '#f0fdf4',
                    color: svc.status === 'ACTIVE' ? '#b91c1c' : '#15803d',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {svc.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    style={{ padding: '0.35rem 0.75rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#0f172a' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { setServiceToDelete(svc); setIsDeleteOpen(true); }}
                    style={{ padding: '0.35rem 0.75rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#991b1b' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isFormOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: 520, maxWidth: '90vw', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 0.35rem', color: '#0f172a', fontSize: '1.25rem' }}>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1.25rem' }}>
              Configure GrowthNest financial advisory service offering.
            </p>

            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Service Name *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Retirement Planning"
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Icon Emoji</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="🏖️"
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', textAlign: 'center' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Wealth, Investments"
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#fff' }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed overview of what this advisory service delivers..."
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Key Features (1 per line)</label>
                <textarea
                  rows={4}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="Goal-Based Roadmap&#10;Portfolio Rebalancing&#10;Dedicated Advisor"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: 8, background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  type="submit"
                  style={{ padding: '0.65rem 1.4rem', borderRadius: 8, background: '#101b3b', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  {actionLoading ? 'Saving...' : editingService ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && serviceToDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: 440, maxWidth: '90vw', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>⚠️</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#991b1b', textAlign: 'center', fontSize: '1.2rem' }}>
              Delete Service
            </h3>
            <p style={{ color: '#475569', fontSize: '0.88rem', textAlign: 'center', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete <strong>{serviceToDelete.name}</strong> from GrowthNest? Existing consultations tied to this service will remain intact.
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
                {actionLoading ? 'Deleting...' : 'Yes, Delete Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
