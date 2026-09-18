import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import BrandVisual from '../components/auth/BrandVisual.jsx';
import InputField from '../components/auth/InputField.jsx';
import PasswordField from '../components/auth/PasswordField.jsx';
import PasswordStrength from '../components/auth/PasswordStrength.jsx';
import SocialLoginButton from '../components/auth/SocialLoginButton.jsx';
import FormError from '../components/auth/FormError.jsx';
import { MailIcon, UserIcon, CheckCircleIcon } from '../components/auth/Icons.jsx';
import { validateSignupForm } from '../utils/validation.js';
import { signup, loginWithProvider } from '../utils/auth.js';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const benefits = [
  'Track your daily expenses',
  'Understand your spending habits',
  'Predict upcoming expenses',
];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [socialProvider, setSocialProvider] = useState(null);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTermsChange = (event) => {
    setAgreedToTerms(event.target.checked);
    if (errors.agreedToTerms) {
      setErrors((prev) => ({ ...prev, agreedToTerms: undefined }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateSignupForm({ ...form, agreedToTerms });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const result = signup({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      setIsSubmitting(false);

      if (!result.success) {
        setErrors((prev) => ({ ...prev, email: result.error }));
        return;
      }

      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    }, 900);
  };

  const handleSocialSignup = (provider) => {
    if (isSubmitting || socialProvider) return;

    if (!agreedToTerms) {
      setErrors((prev) => ({ ...prev, agreedToTerms: 'You must accept the Terms of Service to continue.' }));
      return;
    }

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
      heading="Start taking control of your expenses"
      description="Track your spending, discover patterns, and predict your future expenses with Expenses Predictor."
      benefits={benefits}
      visual={<BrandVisual />}
    >
      <div className="auth-card">
        {isSuccess ? (
          <div className="auth-success">
            <span className="auth-success__icon">
              <CheckCircleIcon />
            </span>
            <h2>Account created successfully!</h2>
            <p>Taking you to the login page…</p>
          </div>
        ) : (
          <>
            <div className="auth-card__header">
              <h2>Create your account</h2>
              <p>Start managing and understanding your expenses today.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <InputField
                id="signup-name"
                label="Full name"
                icon={<UserIcon />}
                placeholder="Jordan Rivera"
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange('fullName')}
                error={errors.fullName}
              />

              <InputField
                id="signup-email"
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
                id="signup-password"
                label="Password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
              >
                <PasswordStrength password={form.password} />
              </PasswordField>

              <PasswordField
                id="signup-confirm-password"
                label="Confirm password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={errors.confirmPassword}
              />

              <div className="field">
                <label className="checkbox-row" htmlFor="agree-terms">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={handleTermsChange}
                    aria-invalid={Boolean(errors.agreedToTerms)}
                    aria-describedby={errors.agreedToTerms ? 'agree-terms-error' : undefined}
                  />
                  <span>
                    I agree to the <a href="#terms">Terms of Service</a> and{' '}
                    <a href="#privacy">Privacy Policy</a>
                  </span>
                </label>
                <FormError id="agree-terms-error">{errors.agreedToTerms}</FormError>
              </div>

              <button type="submit" className="btn-primary" disabled={isSubmitting || Boolean(socialProvider)}>
                {isSubmitting ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Creating account…
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <div className="divider">or continue with</div>

            <div className="social-row">
              <SocialLoginButton
                provider="google"
                onClick={() => handleSocialSignup('google')}
                loading={socialProvider === 'google'}
                disabled={isSubmitting || (socialProvider && socialProvider !== 'google')}
              />
              <SocialLoginButton
                provider="github"
                onClick={() => handleSocialSignup('github')}
                loading={socialProvider === 'github'}
                disabled={isSubmitting || (socialProvider && socialProvider !== 'github')}
              />
            </div>

            <p className="auth-switch">
              Already have an account? <Link className="link-quiet" to="/login">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}