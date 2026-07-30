'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login based on email
    setTimeout(() => {
      setIsLoading(false);
      if (email.includes('admin')) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    }, 1500);
  };

  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)' }}>
      <div className="container" style={{ maxWidth: '450px' }}>
        <div className="glass-card" style={{ padding: '3rem 2.5rem' }}>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <Link href="/" className="footer-logo" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
              <span className="logo-icon">🌱</span>
              <span className="logo-text">Growth<span className="text-accent">Nest</span></span>
            </Link>
            <h3 style={{ marginBottom: '0.5rem' }}>Welcome Back</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sign in to your advisor account</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address or Advisor ID</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="Enter email or ID" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Forgot Password?</a>
              </div>
              <input 
                type="password" 
                className="form-input" 
                required 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="remember" style={{ accentColor: 'var(--primary)' }} />
              <label htmlFor="remember" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Remember me for 30 days</label>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="text-center" style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account? <Link href="/careers" style={{ color: 'var(--primary)', fontWeight: 600 }}>Apply Now</Link>
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-glass)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <strong>Demo Info:</strong><br/>
            Login with any email to view the User Dashboard.<br/>
            Login with email containing 'admin' to view the Admin Dashboard.
          </div>
        </div>
      </div>
    </section>
  );
}
