import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import BrandVisual from '../components/auth/BrandVisual.jsx';
import InputField from '../components/auth/InputField.jsx';
import PasswordField from '../components/auth/PasswordField.jsx';
import SocialLoginButton from '../components/auth/SocialLoginButton.jsx';
import FormError from '../components/auth/FormError.jsx';
import { MailIcon, CheckCircleIcon } from '../components/auth/Icons.jsx';
import { validateLoginForm } from '../utils/validation.js';
import { login, loginWithProvider } from '../utils/auth.js';

const initialForm = { email: '', password: '' };

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [socialProvider, setSocialProvider] = useState(null);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateLoginForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const result = login({ email: form.email, password: form.password });

      setIsSubmitting(false);

      if (!result.success) {
        setErrors({ form: result.error });
        return;
      }

      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 700);
    }, 900);
  };

  const handleSocialLogin = (provider) => {
    if (isSubmitting || socialProvider) return;

    setSocialProvider(provider);
    setTimeout(() => {
      loginWithProvider(provider);
      setSocialProvider(null);
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 700);
    }, 1400);
  };

  return (
    <AuthLayout
      heading="Expenses Predictor"
      description="Understand your spending. Predict your future. Track every expense, spot patterns in how you spend, and see what next month is likely to cost."
      visual={<BrandVisual />}
    >
      <div className="auth-card">
        {isSuccess ? (
          <div className="auth-success">
            <span className="auth-success__icon">
              <CheckCircleIcon />
            </span>
            <h2>You're signed in</h2>
            <p>Taking you to your dashboard…</p>
          </div>
        ) : (
          <>
            <div className="auth-card__header">
              <h2>Welcome back</h2>
              <p>Sign in to continue to your Expenses Predictor dashboard.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <FormError id="login-form-error">{errors.form}</FormError>

              <InputField
                id="login-email"
                label="Email address"
                icon={<MailIcon />}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange('email')}
                error={errors.email}
              />

              <PasswordField
                id="login-password"
                label="Password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
              />

              <div className="field-row">
                <label className="checkbox-row" htmlFor="remember-me">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button type="button" className="link-muted" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn-primary" disabled={isSubmitting || Boolean(socialProvider)}>
                {isSubmitting ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="divider">or continue with</div>

            <div className="social-row">
              <SocialLoginButton
                provider="google"
                onClick={() => handleSocialLogin('google')}
                loading={socialProvider === 'google'}
                disabled={isSubmitting || (socialProvider && socialProvider !== 'google')}
              />
              <SocialLoginButton
                provider="github"
                onClick={() => handleSocialLogin('github')}
                loading={socialProvider === 'github'}
                disabled={isSubmitting || (socialProvider && socialProvider !== 'github')}
              />
            </div>

            <p className="auth-switch">
              Don't have an account? <Link className="link-quiet" to="/signup">Sign up</Link>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}