# Expenses Predictor — Auth UI

Frontend-only Login and Signup pages for the Expenses Predictor project. No backend, no
real authentication — form submission is mocked with a short loading state and a success
screen.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. The app redirects `/` to `/login`.

## What's here

```
src/
  components/auth/
    AuthLayout.jsx        Two-column shell shared by both pages
    BrandVisual.jsx        SVG chart illustration for the brand panel
    InputField.jsx         Labeled text input (email, name, etc.)
    PasswordField.jsx      Password input with show/hide toggle
    PasswordStrength.jsx   4-segment strength meter
    SocialLoginButton.jsx  Google / GitHub buttons
    FormError.jsx          Inline field error message
    Icons.jsx               Small inline icon set
    auth.css                Shared design system (cards, inputs, buttons)
  pages/
    Login.jsx
    Signup.jsx
  utils/
    validation.js           Email/password validation + strength scoring
  App.jsx                   Routes: /login, /signup
```

## Wiring up real auth later

`Login.jsx` and `Signup.jsx` each have a single `handleSubmit` function with a
`setTimeout` standing in for a network call. Swap that block for your real API/auth call
(e.g. Firebase, Supabase, your own backend) — the validation, error states, and UI don't
need to change.

## Design notes

- Palette: deep ink navy (`#1c2333`) brand panel, warm paper background, muted emerald
  accent (`#0e7c6b`) — avoids the generic dark-mode-plus-neon or cream-and-terracotta
  look.
- Type: **Fraunces** for the brand headline, **IBM Plex Sans** for UI text, **IBM Plex
  Mono** for the dollar figures in the illustration — gives the numbers a "ledger" feel
  without leaning on a generic sans everywhere.
- All tokens live in `src/index.css` as CSS variables, so retheming is a matter of
  editing one file.
