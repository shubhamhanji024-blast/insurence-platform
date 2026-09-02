'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    content: '',
    category: 'Wealth Management',
    status: 'DRAFT',
    featuredImageUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState({ text: '', isError: false });

  const fetchInsights = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/admin/insights?${params.toString()}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setInsights(result.data.insights);
        setPagination(result.data.pagination);
      } else {
        setError(result.message || 'Failed to fetch articles.');
      }
    } catch {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInsights(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchInsights]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      shortDescription: '',
      content: '',
      category: 'Wealth Management',
      status: 'DRAFT',
      featuredImageUrl: '',
    });
    setFormMsg({ text: '', isError: false });
    setModalOpen(true);
  };

  const handleOpenEdit = async (id) => {
    setEditingId(id);
    setFormMsg({ text: '', isError: false });
    try {
      const res = await fetch(`/api/admin/insights/${id}`);
      const result = await res.json();
      if (res.ok && result.success) {
        const item = result.data.insight;
        setForm({
          title: item.title || '',
          shortDescription: item.shortDescription || '',
          content: item.content || '',
          category: item.category || 'Wealth Management',
          status: item.status || 'DRAFT',
          featuredImageUrl: item.featuredImageUrl || '',
        });
        setModalOpen(true);
      } else {
        alert(result.message || 'Failed to fetch article details.');
      }
    } catch {
      alert('Error connecting to server.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setFormMsg({ text: 'Title and Content are required.', isError: true });
      return;
    }

    setSubmitting(true);
    setFormMsg({ text: '', isError: false });

    try {
      const url = editingId ? `/api/admin/insights/${editingId}` : '/api/admin/insights';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setModalOpen(false);
        fetchInsights(pagination.page);
      } else {
        setFormMsg({ text: result.message || 'Failed to save article.', isError: true });
      }
    } catch {
      setFormMsg({ text: 'Unable to connect to server.', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete the article "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/insights/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchInsights(pagination.page);
      } else {
        alert(result.message || 'Failed to delete article.');
      }
    } catch {
      alert('Error deleting article.');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/insights/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchInsights(pagination.page);
      } else {
        alert(result.message || 'Failed to update status.');
      }
    } catch {
      alert('Error updating article status.');
    }
  };

  return (
    <AdminLayout title="Insights & Blog Management">
      {/* Top Action & Search Bar */}
      <div className="glass-card-static" style={{ padding: '1.25rem', background: '#ffffff', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '280px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search articles by title, category, or author..."
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                background: '#ffffff',
              }}
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            ✏️ Write New Article
          </button>
        </div>
      </div>

      {/* Main Articles Table */}
      {error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <p style={{ color: '#e11d48', margin: '0 0 1rem' }}>{error}</p>
          <button type="button" onClick={() => fetchInsights(1)} className="btn btn-primary btn-sm">
            🔄 Retry
          </button>
        </div>
      ) : loading ? (
        <div className="glass-card-static" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.5rem' }} />
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading articles...</p>
        </div>
      ) : insights.length === 0 ? (
        <div className="glass-card-static" style={{ padding: '3rem 1.5rem', textAlign: 'center', background: '#ffffff' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📝</span>
          <h3 style={{ color: '#101b3b', margin: '0 0 0.5rem' }}>No articles found</h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Get started by creating your first financial article or insight post.
          </p>
          <button type="button" onClick={handleOpenCreate} className="btn btn-primary btn-sm">
            + Create Article
          </button>
        </div>
      ) : (
        <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Article Title</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Author</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Updated</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {insights.map((item) => (
                  <tr key={item.id || item._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#101b3b' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>/{item.slug}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#334155' }}>
                      {item.category}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#64748b' }}>
                      {item.author}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 10px',
                          borderRadius: '100px',
                          fontWeight: 700,
                          background: item.status === 'PUBLISHED' ? '#dcfce7' : '#fef3c7',
                          color: item.status === 'PUBLISHED' ? '#15803d' : '#92400e',
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(item.updatedAt || item.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id || item._id, item.status)}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          {item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item.id || item._id)}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id || item._id, item.title)}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: '#e11d48', borderColor: '#fca5a5' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing {insights.length > 0 ? (pagination.page - 1) * 20 + 1 : 0}–
              {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} articles
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => fetchInsights(pagination.page - 1)}
                className="btn btn-outline btn-sm"
              >
                Previous
              </button>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem', fontSize: '0.85rem', fontWeight: 600, color: '#101b3b' }}>
                Page {pagination.page} of {pagination.totalPages || 1}
              </span>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchInsights(pagination.page + 1)}
                className="btn btn-outline btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Article Create/Edit */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="glass-card-static"
            style={{
              background: '#ffffff',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ color: '#101b3b', margin: '0 0 1.25rem' }}>
              {editingId ? '✏️ Edit Article' : '✨ Write New Article'}
            </h3>

            {formMsg.text && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  background: formMsg.isError ? '#fef2f2' : '#f0fdf4',
                  color: formMsg.isError ? '#b91c1c' : '#15803d',
                  fontSize: '0.85rem',
                }}
              >
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#101b3b', marginBottom: '0.35rem' }}>
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Master Your Wealth: 5 SIP Strategies for 2026"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#101b3b', marginBottom: '0.35rem' }}>
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      background: '#ffffff',
                    }}
                  >
                    <option value="Wealth Management">Wealth Management</option>
                    <option value="Tax Planning">Tax Planning</option>
                    <option value="Retirement Planning">Retirement Planning</option>
                    <option value="Investment Guides">Investment Guides</option>
                    <option value="Insurance Tips">Insurance Tips</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#101b3b', marginBottom: '0.35rem' }}>
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      background: '#ffffff',
                    }}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#101b3b', marginBottom: '0.35rem' }}>
                  Short Summary / Subtitle
                </label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Brief summary displayed on article cards..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#101b3b', marginBottom: '0.35rem' }}>
                  Featured Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={form.featuredImageUrl}
                  onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#101b3b', marginBottom: '0.35rem' }}>
                  Article Content * (Markdown / HTML text)
                </label>
                <textarea
                  required
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write complete article content here..."
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-sm"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Article' : 'Publish / Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
