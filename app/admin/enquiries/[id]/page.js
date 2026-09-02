'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const STATUSES = ['NEW', 'READ', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'];

export default function AdminEnquiryDetailPage({ params }) {
  const resolvedParams = use(params);
  const enquiryId = resolvedParams.id;

  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState({ text: '', isError: false });

  const fetchEnquiryDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setEnquiry(result.data.enquiry);
      } else {
        setError(result.message || 'Failed to fetch enquiry.');
      }
    } catch {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enquiryId) {
      fetchEnquiryDetail();
    }
  }, [enquiryId]);

  const handleStatusChange = async (newStatus) => {
    if (!newStatus || newStatus === enquiry?.status) return;

    setUpdating(true);
    setMsg({ text: '', isError: false });

    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setEnquiry(result.data.enquiry);
        setMsg({ text: `Status updated to ${newStatus}.`, isError: false });
      } else {
        setMsg({ text: result.message || 'Failed to update status.', isError: true });
      }
    } catch {
      setMsg({ text: 'Error updating status.', isError: true });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout title="Enquiry Detail">
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/admin/enquiries" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          ← Back to Enquiries List
        </Link>
      </div>

      {msg.text && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            background: msg.isError ? '#fef2f2' : '#f0fdf4',
            color: msg.isError ? '#b91c1c' : '#15803d',
            border: `1px solid ${msg.isError ? '#fca5a5' : '#86efac'}`,
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {msg.isError ? '⚠️ ' : '✅ '}
          {msg.text}
        </div>
      )}

      {error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <p style={{ color: '#e11d48', margin: '0 0 1rem' }}>{error}</p>
          <button type="button" onClick={fetchEnquiryDetail} className="btn btn-primary btn-sm">
            🔄 Retry
          </button>
        </div>
      ) : loading ? (
        <div className="glass-card-static" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.5rem' }} />
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading enquiry...</p>
        </div>
      ) : !enquiry ? (
        <div className="glass-card-static" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <p style={{ color: '#6b7280' }}>Enquiry not found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Main Enquiry Content */}
          <div className="glass-card-static" style={{ padding: '1.75rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Service Requested
                </span>
                <h2 style={{ fontSize: '1.4rem', color: '#101b3b', margin: '0.2rem 0 0.5rem' }}>
                  {enquiry.service}
                </h2>
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 14px',
                  borderRadius: '100px',
                  fontWeight: 700,
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fde68a',
                }}
              >
                {enquiry.status}
              </span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '1rem 0' }} />

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Full Message
              </h4>
              <div
                style={{
                  padding: '1.25rem',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  color: '#1e293b',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.95rem',
                }}
              >
                {enquiry.message}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: GrowthNest Enquiry - ${enquiry.service}`)}`}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                ✉️ Reply via Email ({enquiry.email})
              </a>
            </div>
          </div>

          {/* Right Metadata & Status Control */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#101b3b', margin: '0 0 1rem' }}>
                👤 Sender Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Full Name</span>
                  <span style={{ fontWeight: 600, color: '#101b3b' }}>{enquiry.name}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email Address</span>
                  <span style={{ fontWeight: 600, color: '#101b3b' }}>{enquiry.email}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Phone</span>
                  <span style={{ fontWeight: 600, color: '#101b3b' }}>{enquiry.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Submitted Date</span>
                  <span style={{ fontWeight: 600, color: '#101b3b' }}>
                    {new Date(enquiry.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#101b3b', margin: '0 0 1rem' }}>
                ⚙️ Change Enquiry Status
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={updating || enquiry.status === s}
                    onClick={() => handleStatusChange(s)}
                    className={enquiry.status === s ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      fontWeight: enquiry.status === s ? 700 : 500,
                      opacity: enquiry.status === s ? 1 : 0.85,
                    }}
                  >
                    {enquiry.status === s ? '✓ ' : '• '} Mark as {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
