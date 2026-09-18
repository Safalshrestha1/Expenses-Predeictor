import React, { useState, useEffect, useMemo, useRef } from "react";
import "../styles/Dashboard1.css";

/* ---------------------------------------------------------- */
/* Constants & helpers                                         */
/* ---------------------------------------------------------- */

const STORAGE_KEY = "expensesPredictorData_v1";
const CATEGORY_PALETTE = [
  "#111827", "#4b5563", "#7b8491", "#a7adb6",
  "#c5c9cf", "#d7dae0", "#e6e8eb", "#94a3b8", "#64748b",
];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const EXPENSE_CATEGORIES = ["Food","Transportation","Shopping","Bills & Utilities","Entertainment","Education","Health","Other"];

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
function pad(n) { return n < 10 ? "0" + n : "" + n; }
function toISO(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function fromISO(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function fmtShort(d) { return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`; }
function fmtMoney(n) {
  n = Math.round(n);
  const neg = n < 0;
  n = Math.abs(n);
  return (neg ? "-" : "") + "Rs. " + n.toLocaleString("en-US");
}
function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

const today = new Date();

/* ---------------------------------------------------------- */
/* Seed / persistence                                          */
/* ---------------------------------------------------------- */

function seedData() {
  const y = today.getFullYear(), m = today.getMonth();
  const back = (days) => {
    const dt = new Date(y, m, today.getDate());
    dt.setDate(dt.getDate() - days);
    return toISO(dt);
  };
  const fwd = (days) => {
    const dt = new Date(y, m, today.getDate());
    dt.setDate(dt.getDate() + days);
    return toISO(dt);
  };

  const transactions = [
    { id: uid(), date: back(0), description: "Grocery Shopping", category: "Food", amount: 1850, type: "expense" },
    { id: uid(), date: back(1), description: "Monthly Salary", category: "Income", amount: 65000, type: "income" },
    { id: uid(), date: back(2), description: "Internet Bill", category: "Bills & Utilities", amount: 1800, type: "expense" },
    { id: uid(), date: back(3), description: "Bus & Taxi", category: "Transportation", amount: 750, type: "expense" },
    { id: uid(), date: back(4), description: "Online Course", category: "Education", amount: 2000, type: "expense" },
    { id: uid(), date: back(5), description: "Movie & Food", category: "Entertainment", amount: 1250, type: "expense" },
    { id: uid(), date: back(6), description: "Clothing", category: "Shopping", amount: 3200, type: "expense" },
    { id: uid(), date: back(7), description: "Electricity Bill", category: "Bills & Utilities", amount: 2400, type: "expense" },
    { id: uid(), date: back(8), description: "Phone Recharge", category: "Other", amount: 500, type: "expense" },
  ];

  const recurring = [
    { id: uid(), name: "Internet", date: fwd(2), amount: 1800 },
    { id: uid(), name: "Electricity", date: fwd(4), amount: 2400 },
    { id: uid(), name: "Rent", date: fwd(13), amount: 15000 },
    { id: uid(), name: "Netflix Subscription", date: fwd(15), amount: 650 },
    { id: uid(), name: "Other Subscription", date: fwd(17), amount: 500 },
  ];

  const monthlyHistory = [];
  for (let i = 5; i >= 1; i--) {
    const mm = new Date(y, m - i, 1);
    monthlyHistory.push({
      label: MONTH_NAMES[mm.getMonth()],
      income: 58000 + (5 - i) * 1500,
      expense: 26000 + (5 - i) * 1300,
    });
  }

  return {
    name: "Safal Shrestha",
    startBalance: 16300,
    budget: 40000,
    savingsGoal: 35000,
    theme: "auto",
    transactions,
    recurring,
    monthlyHistory,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.transactions) return parsed;
    }
  } catch (e) {
    /* fall through to seed */
  }
  return seedData();
}

/* ---------------------------------------------------------- */
/* Component                                                    */
/* ---------------------------------------------------------- */

function Dashboard() {
  const [state, setState] = useState(loadState);
  const [transactionFilter, setTransactionFilter] = useState("");
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [range, setRange] = useState("this_month");
  const [activeModal, setActiveModal] = useState(null); // 'expense' | 'income' | 'budget' | 'recurring' | 'settings' | null
  const [notifOpen, setNotifOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activeNav, setActiveNav] = useState("home");
  const [txnError, setTxnError] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [recError, setRecError] = useState("");

  // section refs, for smooth-scroll on nav click
  const sectionRefs = {
    home: useRef(null),
    transactions: useRef(null),
    prediction: useRef(null),
    analytics: useRef(null),
    budget: useRef(null),
    categories: useRef(null),
    reports: useRef(null),
  };

  // persist on every state change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { /* storage unavailable */ }
  }, [state]);

  // theme
  useEffect(() => {
    const t = state.theme || "auto";
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
  }, [state.theme]);

  function showToast(msg) {
    const id = uid();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }

  function goTo(id, filter) {
    setActiveNav(id);
    if (typeof filter === "string") setTransactionFilter(filter);
    if (id === "transactions") setShowAllTransactions(false);
    const ref = sectionRefs[id];
    if (ref && ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------------- derived calculations ---------------- */

  const derived = useMemo(() => {
    const y = today.getFullYear(), m = today.getMonth();
    const dim = daysInMonth(y, m);
    const dayOfMonth = today.getDate();

    const currentMonthTxns = state.transactions.filter((t) => {
      const dt = fromISO(t.date);
      return dt.getFullYear() === y && dt.getMonth() === m;
    });

    let totalIncome = 0, totalExpense = 0;
    currentMonthTxns.forEach((t) => {
      if (t.type === "income") totalIncome += Number(t.amount);
      else totalExpense += Number(t.amount);
    });

    const catMap = {};
    currentMonthTxns
      .filter((t) => t.type === "expense")
      .forEach((t) => { catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount); });

    const categories = Object.keys(catMap)
      .map((name) => ({ name, amount: catMap[name] }))
      .sort((a, b) => b.amount - a.amount)
      .map((c) => ({ ...c, percentage: totalExpense > 0 ? (c.amount / totalExpense) * 100 : 0 }));

    const lastHist = state.monthlyHistory.length
      ? state.monthlyHistory[state.monthlyHistory.length - 1]
      : { income: 0, expense: 0 };

    const incomeChangePct = lastHist.income > 0 ? ((totalIncome - lastHist.income) / lastHist.income) * 100 : 0;
    const expenseChangePct = lastHist.expense > 0 ? ((totalExpense - lastHist.expense) / lastHist.expense) * 100 : 0;

    const avgDaily = dayOfMonth > 0 ? totalExpense / dayOfMonth : 0;
    const predictedExpense = avgDaily * dim;
    const predictedLow = predictedExpense * 0.92;
    const predictedHigh = predictedExpense * 1.10;
    const predictedChangePct = lastHist.expense > 0 ? ((predictedExpense - lastHist.expense) / lastHist.expense) * 100 : 0;

    const balance = Number(state.startBalance) + totalIncome - totalExpense;
    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
    const budgetUsedPct = state.budget > 0 ? (totalExpense / state.budget) * 100 : 0;
    const savingsGoalPct = state.savingsGoal > 0 ? clamp((savings / state.savingsGoal) * 100, 0, 100) : 0;

    return {
      y, m, dim, dayOfMonth, currentMonthTxns,
      totalIncome, totalExpense, categories,
      lastHist, incomeChangePct, expenseChangePct,
      avgDaily, predictedExpense, predictedLow, predictedHigh, predictedChangePct,
      balance, savings, savingsRate, budgetUsedPct, savingsGoalPct,
    };
  }, [state.transactions, state.monthlyHistory, state.startBalance, state.budget, state.savingsGoal]);

  const rangeStats = useMemo(() => {
    const now = today;
    let start, end;
    if (range === "this_month") { start = new Date(now.getFullYear(), now.getMonth(), 1); end = new Date(now.getFullYear(), now.getMonth(), now.getDate()); }
    else if (range === "last_month") { start = new Date(now.getFullYear(), now.getMonth() - 1, 1); end = new Date(now.getFullYear(), now.getMonth(), 0); }
    else if (range === "last_3") { start = new Date(now.getFullYear(), now.getMonth() - 2, 1); end = now; }
    else if (range === "last_6") { start = new Date(now.getFullYear(), now.getMonth() - 5, 1); end = now; }
    else { start = new Date(now.getFullYear(), 0, 1); end = now; }

    let total = 0;
    state.transactions.forEach((t) => {
      if (t.type !== "expense") return;
      const dt = fromISO(t.date);
      if (dt >= start && dt <= end) total += Number(t.amount);
    });
    const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
    return { total, avgDaily: total / days };
  }, [range, state.transactions]);

  const notifications = useMemo(() => {
    const notes = [];
    if (derived.budgetUsedPct >= 100) {
      notes.push(`You've exceeded your monthly budget by ${fmtMoney(derived.totalExpense - state.budget)}.`);
    } else if (derived.budgetUsedPct >= 80) {
      notes.push(`You've used ${derived.budgetUsedPct.toFixed(0)}% of your monthly budget.`);
    }
    state.recurring
      .filter((r) => {
        const diff = Math.round((fromISO(r.date) - today) / 86400000);
        return diff >= 0 && diff <= 3;
      })
      .sort((a, b) => fromISO(a.date) - fromISO(b.date))
      .forEach((r) => {
        const diff = Math.round((fromISO(r.date) - today) / 86400000);
        notes.push(`${r.name} (${fmtMoney(r.amount)}) is due ${diff === 0 ? "today" : `in ${diff} day${diff > 1 ? "s" : ""}`}.`);
      });
    if (derived.savingsGoalPct >= 100 && state.savingsGoal > 0) {
      notes.push("You've reached your monthly savings goal 🎉");
    }
    return notes;
  }, [derived, state.recurring, state.savingsGoal, state.budget]);

  /* ---------------- transactions list ---------------- */

  const visibleTransactions = useMemo(() => {
    let rows = [...state.transactions].sort((a, b) => fromISO(b.date) - fromISO(a.date));
    if (transactionFilter) rows = rows.filter((t) => t.type === transactionFilter);
    if (!showAllTransactions) rows = rows.slice(0, 6);
    return rows;
  }, [state.transactions, transactionFilter, showAllTransactions]);

  /* ---------------- chart bars ---------------- */

  const chartBars = useMemo(() => {
    const bars = [...state.monthlyHistory, { label: MONTH_NAMES[derived.m], income: derived.totalIncome, expense: derived.totalExpense }];
    let maxVal = 1;
    bars.forEach((b) => { maxVal = Math.max(maxVal, b.income, b.expense); });
    const ceiling = maxVal * 1.15;
    return { bars, ceiling };
  }, [state.monthlyHistory, derived.m, derived.totalIncome, derived.totalExpense]);

  /* ---------------- donut gradient ---------------- */

  const donutStyle = useMemo(() => {
    if (!derived.categories.length) return { background: "conic-gradient(#e9ecf0 0deg 360deg)" };
    let cum = 0;
    const parts = derived.categories.map((c, i) => {
      const color = CATEGORY_PALETTE[i % CATEGORY_PALETTE.length];
      const start = cum;
      cum += (c.percentage / 100) * 360;
      return `${color} ${start.toFixed(2)}deg ${cum.toFixed(2)}deg`;
    });
    return { background: `conic-gradient(${parts.join(", ")})` };
  }, [derived.categories]);

  /* ---------------- mutators ---------------- */

  function addTransaction(type, desc, amount, date, category) {
    setState((s) => ({
      ...s,
      transactions: [...s.transactions, { id: uid(), date, description: desc, category, amount, type }],
    }));
  }
  function deleteTransaction(id) {
    setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));
    showToast("Transaction deleted.");
  }
  function setBudget(val) {
    setState((s) => ({ ...s, budget: val }));
  }
  function addRecurring(name, amount, date) {
    setState((s) => ({ ...s, recurring: [...s.recurring, { id: uid(), name, amount, date }] }));
  }
  function deleteRecurring(id) {
    setState((s) => ({ ...s, recurring: s.recurring.filter((r) => r.id !== id) }));
    showToast("Recurring item removed.");
  }
  function saveSettings(name, startBalance, savingsGoal, theme) {
    setState((s) => ({ ...s, name, startBalance, savingsGoal, theme }));
  }
  function resetAllData() {
    const fresh = seedData();
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    setState(fresh);
    showToast("Data reset to demo defaults.");
  }

  /* ---------------- form refs ---------------- */

  const txnDescRef = useRef(null), txnAmountRef = useRef(null), txnDateRef = useRef(null), txnCategoryRef = useRef(null);
  const budgetInputRef = useRef(null);
  const recNameRef = useRef(null), recAmountRef = useRef(null), recDateRef = useRef(null);
  const setNameRef = useRef(null), setStartBalanceRef = useRef(null), setSavingsGoalRef = useRef(null), setThemeRef = useRef(null);

  function openTxnModal(type) { setTxnError(""); setActiveModal(type === "income" ? "income" : "expense"); }

  function handleTxnSubmit(e) {
    e.preventDefault();
    const type = activeModal === "income" ? "income" : "expense";
    const desc = txnDescRef.current.value.trim();
    const amount = parseFloat(txnAmountRef.current.value);
    const date = txnDateRef.current.value;
    const category = type === "income" ? "Income" : txnCategoryRef.current.value;
    if (!desc || !amount || amount <= 0 || !date) { setTxnError("Please fill in all fields with valid values."); return; }
    addTransaction(type, desc, amount, date, category);
    setActiveModal(null);
    showToast((type === "income" ? "Income" : "Expense") + " added.");
  }

  function handleBudgetSubmit(e) {
    e.preventDefault();
    const val = parseFloat(budgetInputRef.current.value);
    if (!val || val <= 0) { setBudgetError("Enter a valid budget amount."); return; }
    setBudget(val);
    setBudgetError("");
    setActiveModal(null);
    showToast("Budget updated.");
  }

  function handleRecurringSubmit(e) {
    e.preventDefault();
    const name = recNameRef.current.value.trim();
    const amount = parseFloat(recAmountRef.current.value);
    const date = recDateRef.current.value;
    if (!name || !amount || amount <= 0 || !date) { setRecError("Please fill all fields."); return; }
    addRecurring(name, amount, date);
    recNameRef.current.value = ""; recAmountRef.current.value = ""; recDateRef.current.value = "";
    setRecError("");
    showToast("Recurring expense added.");
  }

  function handleSettingsSubmit(e) {
    e.preventDefault();
    const name = setNameRef.current.value.trim() || state.name;
    const startBalance = parseFloat(setStartBalanceRef.current.value) || 0;
    const savingsGoal = parseFloat(setSavingsGoalRef.current.value) || 0;
    const theme = setThemeRef.current.value;
    saveSettings(name, startBalance, savingsGoal, theme);
    setActiveModal(null);
    showToast("Settings saved.");
  }

  /* ---------------- derived display bits ---------------- */

  const firstName = (state.name || "there").split(" ")[0];
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const budgetPct = clamp(derived.budgetUsedPct, 0, 999);
  const remaining = Math.max(0, state.savingsGoal - derived.savings);
  const trendLabel = derived.expenseChangePct > 3 ? "Increasing" : derived.expenseChangePct < -3 ? "Decreasing" : "Stable";
  const trendText = derived.expenseChangePct > 3
    ? "Recent spending is higher than last month."
    : derived.expenseChangePct < -3
      ? "Recent spending is lower than last month."
      : "Recent spending is similar to last month.";

  /* ============================================================ */
  /* Render                                                         */
  /* ============================================================ */

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">₹</div>
          <span>Expenses Predictor</span>
        </div>

        <nav className="navigation">
          <div className="nav-section-title">MAIN</div>

          <button className={"nav-item" + (activeNav === "home" ? " active" : "")} onClick={() => goTo("home", "")}>
            <span>⌂</span>Home
          </button>
          <button className={"nav-item" + (activeNav === "transactions" && transactionFilter === "expense" ? " active" : "")} onClick={() => goTo("transactions", "expense")}>
            <span>↗</span>Expenses
          </button>
          <button className={"nav-item" + (activeNav === "transactions" && transactionFilter === "income" ? " active" : "")} onClick={() => goTo("transactions", "income")}>
            <span>↙</span>Income
          </button>
          <button className={"nav-item" + (activeNav === "prediction" ? " active" : "")} onClick={() => goTo("prediction")}>
            <span>◉</span>Prediction
          </button>
          <button className={"nav-item" + (activeNav === "analytics" ? " active" : "")} onClick={() => goTo("analytics")}>
            <span>▥</span>Analytics
          </button>
          <button className={"nav-item" + (activeNav === "budget" ? " active" : "")} onClick={() => goTo("budget")}>
            <span>▤</span>Budget
          </button>
          <button className={"nav-item" + (activeNav === "categories" ? " active" : "")} onClick={() => goTo("categories")}>
            <span>◈</span>Categories
          </button>
          <button className={"nav-item" + (activeNav === "reports" ? " active" : "")} onClick={() => goTo("reports")}>
            <span>▦</span>Reports
          </button>

          <div className="nav-section-title account-title">ACCOUNT</div>

          <button className="nav-item" onClick={() => setActiveModal("settings")}>
            <span>⚙</span>Settings
          </button>
          <button className="nav-item logout" onClick={() => showToast("Logout is disabled in this demo dashboard.")}>
            <span>↪</span>Logout
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini">
            <div className="avatar">{firstName.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{firstName}</strong>
              <small>Personal Account</small>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOP BAR */}
        <header className="topbar">
          <div><p className="breadcrumb">Home / Dashboard</p></div>

          <div className="topbar-right">
            <div className="dropdown-wrap">
              <button className="icon-button" onClick={() => setNotifOpen((o) => !o)}>
                🔔{notifications.length > 0 && <span className="notif-dot"></span>}
              </button>
              {notifOpen && (
                <div className="dropdown-panel">
                  <div className="dropdown-title">Notifications</div>
                  {notifications.length
                    ? notifications.map((n, i) => <div className="notif-item" key={i}>{n}</div>)
                    : <div className="notif-empty">You're all caught up.</div>}
                </div>
              )}
            </div>

            <button className="profile" onClick={() => setActiveModal("settings")} style={{ border: "none", background: "none" }}>
              <div className="avatar">{firstName.charAt(0).toUpperCase()}</div>
              <div>
                <strong>{state.name}</strong>
                <span>Personal Account</span>
              </div>
            </button>
          </div>
        </header>

        {/* WELCOME */}
        <section className="welcome-section" ref={sectionRefs.home}>
          <div>
            <h1>{greeting}, {firstName}</h1>
            <p>Here's your financial overview for this month.</p>
          </div>
          <div className="current-date">
            <span>Today</span>
            <strong>{today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</strong>
          </div>
        </section>

        {/* FINANCIAL SUMMARY */}
        <section className="summary-grid">
          <div className="summary-card">
            <div className="card-top"><span>Total Balance</span><div className="summary-icon balance">₹</div></div>
            <h2>{fmtMoney(derived.balance)}</h2>
            <p className="neutral-text">Available balance</p>
          </div>

          <div className="summary-card">
            <div className="card-top"><span>Total Income</span><div className="summary-icon income">↗</div></div>
            <h2>{fmtMoney(derived.totalIncome)}</h2>
            <p className={derived.incomeChangePct >= 0 ? "positive" : "negative"}>
              {derived.incomeChangePct >= 0 ? "↑" : "↓"} {Math.abs(derived.incomeChangePct).toFixed(1)}% <span>vs last month</span>
            </p>
          </div>

          <div className="summary-card">
            <div className="card-top"><span>Total Expenses</span><div className="summary-icon expense">↘</div></div>
            <h2>{fmtMoney(derived.totalExpense)}</h2>
            <p className={derived.expenseChangePct <= 0 ? "positive" : "negative"}>
              {derived.expenseChangePct >= 0 ? "↑" : "↓"} {Math.abs(derived.expenseChangePct).toFixed(1)}% <span>vs last month</span>
            </p>
          </div>

          <div className="summary-card">
            <div className="card-top"><span>Predicted Expenses</span><div className="summary-icon prediction">◉</div></div>
            <h2>{fmtMoney(derived.predictedExpense)}</h2>
            <p className="prediction-text">Estimated this month</p>
          </div>
        </section>

        {/* ANALYTICS: EXPENSE OVERVIEW + CATEGORY */}
        <section className="two-column" ref={sectionRefs.analytics}>
          <div className="dashboard-card overview-card">
            <div className="section-header">
              <div><h2>Expense Overview</h2><p>Income vs expenses over time</p></div>
              <select value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="last_3">Last 3 Months</option>
                <option value="last_6">Last 6 Months</option>
                <option value="this_year">This Year</option>
              </select>
            </div>

            <div className="overview-stats">
              <div><span>Total Spent</span><strong>{fmtMoney(rangeStats.total)}</strong></div>
              <div><span>Average Daily Spending</span><strong>{fmtMoney(rangeStats.avgDaily)}</strong></div>
            </div>

            <div className="chart-container">
              <div className="chart-y-axis">
                {[4, 3, 2, 1, 0].map((i) => {
                  const v = Math.round(chartBars.ceiling * (i / 4));
                  return <span key={i}>{v >= 1000 ? Math.round(v / 1000) + "k" : v}</span>;
                })}
              </div>

              <div className="chart">
                <div className="grid-line" style={{ top: 0 }}></div>
                <div className="grid-line" style={{ top: "25%" }}></div>
                <div className="grid-line" style={{ top: "50%" }}></div>
                <div className="grid-line" style={{ top: "75%" }}></div>

                <div className="bars">
                  {chartBars.bars.map((b, i) => (
                    <div className="bar-group" key={i}>
                      <div className="bar income-bar" style={{ height: clamp((b.income / chartBars.ceiling) * 100, 1, 100) + "%" }}></div>
                      <div className="bar expense-bar" style={{ height: clamp((b.expense / chartBars.ceiling) * 100, 1, 100) + "%" }}></div>
                      <small>{b.label}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="chart-legend">
              <span><i className="income-dot"></i>Income</span>
              <span><i className="expense-dot"></i>Expenses</span>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="dashboard-card" ref={sectionRefs.categories}>
            <div className="section-header">
              <div><h2>Spending by Category</h2><p>This month's spending</p></div>
            </div>

            <div className="category-chart-area">
              <div className="donut" style={donutStyle}>
                <div className="donut-center">
                  <strong>{fmtMoney(derived.totalExpense)}</strong>
                  <span>Total spent</span>
                </div>
              </div>
            </div>

            <div className="category-list">
              {derived.categories.length === 0 && <div className="empty-note">No expenses recorded this month yet.</div>}
              {derived.categories.map((category, i) => (
                <div className="category-row" key={category.name}>
                  <div className="category-name">
                    <span className="category-dot" style={{ background: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length] }}></span>
                    <span>{category.name}</span>
                  </div>
                  <div className="category-value">
                    <strong>{fmtMoney(category.amount)}</strong>
                    <span>{category.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PREDICTION + BUDGET */}
        <section className="two-column">
          <div className="dashboard-card" ref={sectionRefs.prediction}>
            <div className="section-header">
              <div><h2>Expense Prediction</h2><p>Estimated spending for this month</p></div>
              <span className="prediction-badge">Estimated</span>
            </div>

            <div className="prediction-main">
              <span>Predicted Expenses</span>
              <h2>{fmtMoney(derived.predictedExpense)}</h2>
              <span className="prediction-change">
                {derived.predictedChangePct >= 0 ? "↑" : "↓"} {Math.abs(derived.predictedChangePct).toFixed(1)}% compared with previous month
              </span>
            </div>

            <div className="prediction-range">
              <div><span>Prediction Range</span><strong>{fmtMoney(derived.predictedLow)} – {fmtMoney(derived.predictedHigh)}</strong></div>
              <div><span>Previous Month</span><strong>{fmtMoney(derived.lastHist.expense)}</strong></div>
            </div>

            <div className="prediction-info">
              <strong>How this prediction works</strong>
              <p>This estimate uses your average daily spending so far this month, projected across the full month, combined with your recorded category patterns. It updates automatically as you add transactions.</p>
            </div>

            <button className="primary-button" onClick={() => goTo("reports")}>View Full Breakdown →</button>
          </div>

          {/* BUDGET */}
          <div className="dashboard-card" ref={sectionRefs.budget}>
            <div className="section-header">
              <div><h2>Budget Overview</h2><p>Your monthly spending budget</p></div>
              <span className={budgetPct >= 80 ? "warning-badge" : "ok-badge"}>{budgetPct.toFixed(1)}% used</span>
            </div>

            <div className="budget-numbers">
              <div><span>Monthly Budget</span><strong>{fmtMoney(state.budget)}</strong></div>
              <div><span>Amount Spent</span><strong>{fmtMoney(derived.totalExpense)}</strong></div>
              <div><span>Remaining</span><strong>{fmtMoney(Math.max(0, state.budget - derived.totalExpense))}</strong></div>
            </div>

            <div className="progress-wrapper">
              <div className="progress-label"><span>Budget used</span><strong>{budgetPct.toFixed(1)}%</strong></div>
              <div className="progress-bar">
                <div
                  className={"progress-fill" + (budgetPct >= 100 ? " bad" : budgetPct >= 80 ? "" : " good")}
                  style={{ width: Math.min(budgetPct, 100) + "%" }}
                ></div>
              </div>
            </div>

            <div className={"budget-warning" + (budgetPct < 80 ? " good" : "")}>
              <strong>{budgetPct >= 100 ? "Budget exceeded" : budgetPct >= 80 ? "Budget warning" : "Budget on track"}</strong>
              <p>
                {budgetPct >= 100
                  ? `You've gone over your monthly budget by ${fmtMoney(derived.totalExpense - state.budget)}. Consider adjusting spending or your budget.`
                  : budgetPct >= 80
                    ? "You've used more than 80% of your monthly budget. Monitor your remaining expenses for the rest of the month."
                    : "You're within a healthy range for this point in the month. Keep it up."}
              </p>
            </div>

            <button className="secondary-button" onClick={() => setActiveModal("budget")}>Manage Budget</button>
          </div>
        </section>

        {/* INSIGHTS */}
        <section className="dashboard-card" ref={sectionRefs.reports}>
          <div className="section-header">
            <div><h2>Financial Insights</h2><p>Automatically generated from your spending data</p></div>
          </div>

          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">📊</div>
              <div>
                {derived.categories.length ? (
                  <>
                    <h3>{derived.categories[0].name} is your top category</h3>
                    <p>{derived.categories[0].name} makes up {derived.categories[0].percentage.toFixed(1)}% of this month's spending ({fmtMoney(derived.categories[0].amount)}).</p>
                  </>
                ) : (
                  <>
                    <h3>No spending yet</h3>
                    <p>Add an expense to start seeing category insights here.</p>
                  </>
                )}
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">{derived.expenseChangePct >= 0 ? "📈" : "📉"}</div>
              <div>
                <h3>{derived.expenseChangePct >= 0 ? "Spending is up" : "Spending is down"}</h3>
                <p>Expenses are {derived.expenseChangePct >= 0 ? "up" : "down"} {Math.abs(derived.expenseChangePct).toFixed(1)}% compared with last month.</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">◉</div>
              <div>
                <h3>Projected month-end</h3>
                <p>At your current pace you're projected to spend {fmtMoney(derived.predictedExpense)} by the end of the month.</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">💰</div>
              <div>
                <h3>Budget usage</h3>
                <p>You've used {derived.budgetUsedPct.toFixed(1)}% of your monthly budget, leaving {fmtMoney(Math.max(0, state.budget - derived.totalExpense))} remaining.</p>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="quick-actions">
          <button className="quick-action" onClick={() => openTxnModal("expense")}>
            <div className="quick-icon">+</div>
            <div><h3>Add Expense</h3><p>Record a new expense</p></div>
            <button tabIndex={-1}>→</button>
          </button>

          <button className="quick-action" onClick={() => openTxnModal("income")}>
            <div className="quick-icon income-icon">↗</div>
            <div><h3>Add Income</h3><p>Record new income</p></div>
            <button tabIndex={-1}>→</button>
          </button>

          <button className="quick-action" onClick={() => setActiveModal("budget")}>
            <div className="quick-icon budget-icon">▤</div>
            <div><h3>Set Budget</h3><p>Manage your monthly budget</p></div>
            <button tabIndex={-1}>→</button>
          </button>

          <button className="quick-action" onClick={() => goTo("analytics")}>
            <div className="quick-icon analytics-icon">▥</div>
            <div><h3>View Analytics</h3><p>Explore spending patterns</p></div>
            <button tabIndex={-1}>→</button>
          </button>
        </section>

        {/* RECENT TRANSACTIONS */}
        <section className="dashboard-card" ref={sectionRefs.transactions}>
          <div className="section-header">
            <div><h2>Recent Transactions</h2><p>Your recorded income &amp; expenses</p></div>
            <button className="text-button" onClick={() => setShowAllTransactions((v) => !v)}>
              {showAllTransactions ? "Show Less" : "View All →"}
            </button>
          </div>

          <div className="filter-tabs">
            <button className={"filter-tab" + (transactionFilter === "" ? " active" : "")} onClick={() => setTransactionFilter("")}>All</button>
            <button className={"filter-tab" + (transactionFilter === "income" ? " active" : "")} onClick={() => setTransactionFilter("income")}>Income</button>
            <button className={"filter-tab" + (transactionFilter === "expense" ? " active" : "")} onClick={() => setTransactionFilter("expense")}>Expense</button>
          </div>

          <div className="transaction-table">
            <div className="table-header">
              <span>Date</span><span>Description</span><span>Category</span><span>Amount</span><span>Type</span><span></span>
            </div>

            {visibleTransactions.length === 0 && <div className="empty-note">No transactions to show.</div>}

            {visibleTransactions.map((transaction) => (
              <div className="transaction-row" key={transaction.id}>
                <span>{fmtShort(fromISO(transaction.date))}</span>
                <strong>{transaction.description}</strong>
                <span className="transaction-category">{transaction.category}</span>
                <strong className={transaction.type === "income" ? "amount-income" : "amount-expense"}>
                  {transaction.type === "income" ? "+" : "-"} {fmtMoney(transaction.amount)}
                </strong>
                <span className={transaction.type === "income" ? "type-income" : "type-expense"}>
                  {transaction.type === "income" ? "Income" : "Expense"}
                </span>
                <button className="row-del" title="Delete" onClick={() => deleteTransaction(transaction.id)}>✕</button>
              </div>
            ))}
          </div>
        </section>

        {/* UPCOMING + SAVINGS */}
        <section className="two-column">
          <div className="dashboard-card">
            <div className="section-header">
              <div><h2>Upcoming Expenses</h2><p>Your upcoming recurring payments</p></div>
              <button className="text-button" onClick={() => setActiveModal("recurring")}>Manage</button>
            </div>

            <div className="recurring-list">
              {state.recurring.length === 0 && <div className="empty-note">No upcoming recurring payments.</div>}
              {[...state.recurring].sort((a, b) => fromISO(a.date) - fromISO(b.date)).map((expense) => (
                <div className="recurring-row" key={expense.id}>
                  <div className="recurring-icon">$</div>
                  <div className="recurring-info">
                    <strong>{expense.name}</strong>
                    <span>Due {fmtShort(fromISO(expense.date))}</span>
                  </div>
                  <strong>{fmtMoney(expense.amount)}</strong>
                </div>
              ))}
            </div>

            <div className="upcoming-total">
              <span>Upcoming total</span>
              <strong>{fmtMoney(state.recurring.reduce((s, r) => s + Number(r.amount), 0))}</strong>
            </div>
          </div>

          {/* SAVINGS */}
          <div className="dashboard-card savings-card">
            <div className="section-header"><div><h2>Savings Overview</h2><p>Your monthly savings progress</p></div></div>

            <div className="savings-main">
              <span>Amount Saved</span>
              <h2>{fmtMoney(derived.savings)}</h2>
              <span className={"savings-rate" + (derived.savingsRate < 0 ? " negative" : "")}>
                Savings rate: {derived.savingsRate.toFixed(1)}%
              </span>
            </div>

            <div className="savings-goal">
              <div className="progress-label">
                <span>Monthly savings goal</span>
                <strong>{derived.savingsGoalPct.toFixed(1)}%</strong>
              </div>
              <div className="progress-bar">
                <div className="savings-progress" style={{ width: derived.savingsGoalPct + "%" }}></div>
              </div>
              <p>
                {state.savingsGoal > 0
                  ? (remaining > 0
                      ? `${fmtMoney(remaining)} remaining to reach your ${fmtMoney(state.savingsGoal)} savings goal.`
                      : `You've reached your ${fmtMoney(state.savingsGoal)} savings goal for this month!`)
                  : "Set a savings goal in Settings to track progress here."}
              </p>
            </div>
          </div>
        </section>

        {/* FINANCIAL HEALTH */}
        <section className="dashboard-card health-card">
          <div className="section-header">
            <div><h2>Financial Health Summary</h2><p>A simple overview of your current financial activity</p></div>
          </div>

          <div className="health-grid">
            <div className="health-item">
              <div className="health-icon">₹</div>
              <div><span>Spending</span><strong>{fmtMoney(derived.totalExpense)}</strong><p>Recorded expenses this month.</p></div>
            </div>
            <div className="health-item">
              <div className="health-icon">%</div>
              <div><span>Saving</span><strong>{fmtMoney(derived.savings)}</strong><p>Based on recorded income and expenses.</p></div>
            </div>
            <div className="health-item">
              <div className="health-icon">▤</div>
              <div><span>Budget Usage</span><strong>{derived.budgetUsedPct.toFixed(1)}%</strong><p>Of your monthly budget has been used.</p></div>
            </div>
            <div className="health-item">
              <div className="health-icon">↗</div>
              <div><span>Expense Trend</span><strong>{trendLabel}</strong><p>{trendText}</p></div>
            </div>
          </div>

          <div className="health-summary">
            Your dashboard shows your recorded income, expenses, budget usage, savings, and spending trends — all calculated live from the transactions you add. Keep recording transactions so your analytics and predictions stay accurate.
          </div>
        </section>

        <footer className="dashboard-footer">
          <p>Expenses Predictor © 2026</p>
          <div><span>Privacy</span><span>Terms</span><span>Help</span></div>
        </footer>

      </main>

      {/* MODAL: Add Expense/Income */}
      {(activeModal === "expense" || activeModal === "income") && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setActiveModal(null)}>✕</button>
            <h3>{activeModal === "income" ? "Add Income" : "Add Expense"}</h3>
            <p className="modal-sub">{activeModal === "income" ? "Record a new income entry." : "Record a new expense transaction."}</p>
            <form onSubmit={handleTxnSubmit}>
              <div className="form-field">
                <label>Description</label>
                <input ref={txnDescRef} type="text" placeholder="e.g. Grocery shopping" defaultValue="" required />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Amount (Rs.)</label>
                  <input ref={txnAmountRef} type="number" min="1" step="1" placeholder="0" required />
                </div>
                <div className="form-field">
                  <label>Date</label>
                  <input ref={txnDateRef} type="date" defaultValue={toISO(today)} required />
                </div>
              </div>
              {activeModal === "expense" && (
                <div className="form-field">
                  <label>Category</label>
                  <select ref={txnCategoryRef} defaultValue="Food">
                    {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {txnError && <div className="field-error">{txnError}</div>}
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="primary-button">{activeModal === "income" ? "Add Income" : "Add Expense"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Budget */}
      {activeModal === "budget" && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setActiveModal(null)}>✕</button>
            <h3>Set Monthly Budget</h3>
            <p className="modal-sub">Update your spending limit for this month.</p>
            <form onSubmit={handleBudgetSubmit}>
              <div className="form-field">
                <label>Monthly Budget (Rs.)</label>
                <input ref={budgetInputRef} type="number" min="1" step="1" defaultValue={state.budget} required />
              </div>
              {budgetError && <div className="field-error">{budgetError}</div>}
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="primary-button">Save Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Recurring */}
      {activeModal === "recurring" && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setActiveModal(null)}>✕</button>
            <h3>Manage Recurring Expenses</h3>
            <p className="modal-sub">Add or remove upcoming recurring payments.</p>

            <div className="recurring-manage-list">
              {state.recurring.length === 0 && <div className="empty-note">No recurring items yet.</div>}
              {[...state.recurring].sort((a, b) => fromISO(a.date) - fromISO(b.date)).map((r) => (
                <div className="recurring-manage-row" key={r.id}>
                  <div className="rm-name">
                    <strong>{r.name}</strong>
                    <span>Due {fmtShort(fromISO(r.date))} · {fmtMoney(r.amount)}</span>
                  </div>
                  <button className="row-del" title="Delete" onClick={() => deleteRecurring(r.id)}>✕</button>
                </div>
              ))}
            </div>

            <form onSubmit={handleRecurringSubmit}>
              <div className="form-row">
                <div className="form-field"><label>Name</label><input ref={recNameRef} type="text" placeholder="e.g. Netflix" required /></div>
                <div className="form-field"><label>Amount (Rs.)</label><input ref={recAmountRef} type="number" min="1" required /></div>
              </div>
              <div className="form-field"><label>Due Date</label><input ref={recDateRef} type="date" required /></div>
              {recError && <div className="field-error">{recError}</div>}
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setActiveModal(null)}>Close</button>
                <button type="submit" className="primary-button">Add Recurring</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Settings */}
      {activeModal === "settings" && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setActiveModal(null)}>✕</button>
            <h3>Settings</h3>
            <p className="modal-sub">Personalize your dashboard.</p>
            <form onSubmit={handleSettingsSubmit}>
              <div className="form-field"><label>Full name</label><input ref={setNameRef} type="text" defaultValue={state.name} required /></div>
              <div className="form-field"><label>Starting balance (Rs.)</label><input ref={setStartBalanceRef} type="number" defaultValue={state.startBalance} required /></div>
              <div className="form-field"><label>Monthly savings goal (Rs.)</label><input ref={setSavingsGoalRef} type="number" min="0" defaultValue={state.savingsGoal} required /></div>
              <div className="form-field">
                <label>Theme</label>
                <select ref={setThemeRef} defaultValue={state.theme || "auto"}>
                  <option value="auto">Match system</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="modal-actions" style={{ justifyContent: "space-between" }}>
                <button type="button" className="danger-text-button" onClick={() => {
                  if (window.confirm("Reset all dashboard data back to the default demo data? This cannot be undone.")) {
                    resetAllData();
                    setActiveModal(null);
                  }
                }}>Reset all data</button>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="button" className="secondary-button" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="primary-button">Save Settings</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div className="toast-wrap">
        {toasts.map((t) => <div className="toast" key={t.id}>{t.msg}</div>)}
      </div>

    </div>
  );
}

export default Dashboard;
