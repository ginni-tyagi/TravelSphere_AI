import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ExpenseTracker.css";

function ExpenseTracker() {
  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem("expenses") || "[]")
  );

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const addExpense = (e) => {
    e.preventDefault();

    const newExpense = {
      id: Date.now(),
      title,
      amount: Number(amount),
      category
    };

    const updated = [...expenses, newExpense];

    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));

    setTitle("");
    setAmount("");
  };

  const deleteExpense = (id) => {
    const updated = expenses.filter((item) => item.id !== id);
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  };

  const total = expenses.reduce(
    (sum, item) => sum + item.amount, 0
  );

  const tripBudget = Number(
  JSON.parse(localStorage.getItem("myTrips") || "[]")
    .reduce((sum, trip) => sum + trip.budget, 0)
);

const remainingBudget = tripBudget - total;

  const categoryTotals = expenses.reduce((totals, item) => {
  totals[item.category] = (totals[item.category] || 0) + item.amount;
  return totals;
}, {});

  return (
   <div className="expense-page">

  <Link to="/dashboard" className="back-dashboard">
    ← Back to Dashboard
  </Link>

  <h1>💰 Expense Tracker</h1>
      <h2>Total Expenses: ₹{total.toLocaleString("en-IN")}</h2>

<h3>
  Planned Budget: ₹{tripBudget.toLocaleString("en-IN")}
</h3>

<h3>
  Remaining Budget: ₹{remainingBudget.toLocaleString("en-IN")}
</h3>

{remainingBudget < 0 && (
  <p style={{ color: "red" }}>
    ⚠️ You have exceeded your planned budget!
  </p>
)}

      <form onSubmit={addExpense}>
        <input
          placeholder="Expense name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount (₹)"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Hotel</option>
          <option>Shopping</option>
          <option>Other</option>
        </select>

        <button type="submit">Add Expense</button>
      </form>
<h2>📊 Expense Summary</h2>

<div className="expense-summary">
  {Object.entries(categoryTotals).map(([category, amount]) => (
    <div className="summary-card" key={category}>
      <h3>{category}</h3>
      <p>₹{amount.toLocaleString("en-IN")}</p>
    </div>
  ))}
</div>

<div className="expense-analytics">
  <h2>📈 Spending Analytics</h2>

  {Object.entries(categoryTotals).map(([category, amount]) => (
    <div className="analytics-item" key={category}>
      <p>{category} — ₹{amount}</p>

      <div className="progress-bg">
        <div
          className="progress-fill"
          style={{ width: `${(amount / total) * 100}%` }}
        ></div>
      </div>
    </div>
  ))}
</div>

      <h2>Expense History</h2>

      {expenses.map((item) => (
        <div className="expense-card" key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.category} — ₹{item.amount}</p>
          <button onClick={() => deleteExpense(item.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ExpenseTracker;