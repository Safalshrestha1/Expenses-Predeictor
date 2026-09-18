// src/utils/auth.js
//
// TEMPORARY localStorage-based auth for the demo.
// Every function here returns the same shape it would if it were calling
// a real backend, so later you can rewrite the INSIDE of each function to
// do `fetch('/api/signup', ...)` etc. without touching Login.jsx or
// Signup.jsx at all.

const USERS_KEY = 'expensesPredictor_users';
const SESSION_KEY = 'expensesPredictor_session';

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Creates a new account.
 * @returns {{ success: boolean, error?: string, user?: object }}
 */
export function signup({ fullName, email, password }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const alreadyExists = users.some((u) => u.email === normalizedEmail);
  if (alreadyExists) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  // NOTE: storing plaintext passwords in localStorage is only ok because
  // this is a throwaway frontend-only demo. A real backend must hash them.
  users.push({ fullName, email: normalizedEmail, password });
  saveUsers(users);

  return { success: true, user: { fullName, email: normalizedEmail } };
}

/**
 * Verifies credentials and starts a session if they match.
 * @returns {{ success: boolean, error?: string, user?: object }}
 */
export function login({ email, password }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const match = users.find(
    (u) => u.email === normalizedEmail && u.password === password
  );

  if (!match) {
    return { success: false, error: 'Invalid email or password.' };
  }

  const session = { fullName: match.fullName, email: match.email, loggedInAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, user: session };
}

/**
 * Mock OAuth: starts a session for a social provider without a password.
 */
export function loginWithProvider(provider) {
  const session = {
    fullName: provider.charAt(0).toUpperCase() + provider.slice(1) + ' User',
    email: `${provider}-user@example.com`,
    provider,
    loggedInAt: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}

/**
 * Simple password strength scorer used by PasswordStrength.jsx.
 * @returns {{ score: number, label: string }} score is 0-4
 */
export function getPasswordStrength(password) {
  if (!password) {
    return { score: 0, label: 'Too short' };
  }

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  score = Math.min(score, 4);

  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score] };
}