import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid login credentials!');
      }
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'Login failed');
    }
    setIsLoading(false);
  };

  if (user && user.role_name === 'Administrator') return <Navigate to="/admin" replace />;
  if (user && user.role_name === 'Manager') return <Navigate to="/manager" replace />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="login-page">
      {/* ---------------- LEFT BRAND PANEL ---------------- */}
      <aside className="login-brand">
        <div className="login-brand-grid" aria-hidden="true" />

        <header className="login-brand-header">
          <div className="login-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z" />
            </svg>
          </div>
          <h1 className="login-brand-name">EnerLink</h1>
        </header>

        <div className="login-brand-hero">
          <div className="login-brand-eyebrow">
            <span className="pulse-dot" />
            CRM for energy vendors
          </div>
          <h2 className="login-brand-title">
            Manage customers and&nbsp;<span>energy sales</span> in&nbsp;one place.
          </h2>
          <p className="login-brand-subtitle">
            EnerLink streamlines customer management, contract tracking and
            sales performance analysis — with dedicated views for
            administrators, managers and sales representatives.
          </p>

          <ul className="login-brand-features">
            <li>
              <span className="check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              Database of customers, contracts and energy provider tariffs
            </li>
            <li>
              <span className="check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              Analytics dashboards and team performance ranking
            </li>
          </ul>
        </div>

        <footer className="login-brand-footer">
          <span>&copy; {new Date().getFullYear()} EnerLink</span>
        </footer>
      </aside>

      {/* ---------------- RIGHT FORM PANEL ---------------- */}
      <main className="login-form-panel">
        <div className="login-form-card">
          <div className="login-form-header">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-subtitle">
              Sign in to access the EnerLink CRM panel.
            </p>
          </div>

          {error && (
            <div className="login-alert" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="login-email" className="login-label">Email</label>
              <div className="login-input-wrap">
                <input
                  id="login-email"
                  type="email"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  disabled={isLoading}
                  autoComplete="email"
                />
                <span className="login-input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password" className="login-label">Password</label>
              <div className="login-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <span className="login-input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <button
                  type="button"
                  className="login-input-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="checkmark" />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="login-spinner" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="login-form-footer">
            Trouble signing in? Contact your system administrator.
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
