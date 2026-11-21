import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    if (trimmedUser === 'admin' && password === 'admin') {
      setIsLoading(true);
      setTimeout(() => {
        onLogin();
      }, 300);
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác! Vui lòng thử lại.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-backdrop-glow" />
      
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-header">
          <div className="login-badge-wrap">
            <span className="login-brand-icon">🇻🇳</span>
            <span className="login-badge">STUDIO</span>
          </div>
          <h1 className="login-title">
            Vietnam <span className="logo-accent">GeoQuiz</span>
          </h1>
          <p className="login-subtitle">
            Hệ thống tạo video Quiz tự động chuyên nghiệp
          </p>
        </div>

        {/* Security Tag */}
        <div className="login-security-notice">
          <ShieldCheck size={16} className="security-icon" />
          <span>Vui lòng đăng nhập để tiếp tục</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert" role="alert">
            <AlertCircle size={16} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="login-field">
            <label htmlFor="login-username">Tên đăng nhập</label>
            <div className="login-input-wrap">
              <User size={18} className="field-icon" />
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                autoFocus
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="login-password">Mật khẩu</label>
            <div className="login-input-wrap">
              <Lock size={18} className="field-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-btn-content">
                <span className="login-spinner" />
                Đang xác thực...
              </span>
            ) : (
              <span className="login-btn-content">
                <LogIn size={18} />
                Đăng nhập
              </span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="login-footer">
          <span>Vietnam GeoQuiz Video Maker &bull; Quản trị viên</span>
        </div>
      </div>
    </div>
  );
}

