# 📊 FinanceHub Dashboard

A modern, responsive, and interactive frontend dashboard built to track and analyze financial activity. This project demonstrates clean architecture, efficient state management, and intuitive UI/UX design.

## ✨ Features Implemented

### 📈 Dashboard & Visualizations
* **Dashboard Overview:** Real-time summary cards displaying Total Balance, Income, and Expenses.
* **Balance Trend (Time-Based):** Interactive line chart visualization tracking financial growth over time.
* **Spending Breakdown (Categorical):** Interactive pie chart visualizing expense distribution by category.
* **Smart Insights:** Automated observation engine highlighting key data points (e.g., Highest spending category).

### 💸 Transaction Management
* **Detailed Ledger:** Comprehensive list view of all transactions (Date, Amount, Category, Type).
* **Advanced Filtering:** Instantly filter transactions by 'Income' or 'Expense' types.
* **Real-time Search:** Search transactions seamlessly by category or description.

### 🔐 Role-Based Access Control (RBAC) Simulation
* **Viewer Role:** Read-only access to explore the dashboard and transaction data.
* **Admin Role:** Elevated privileges revealing UI to add and manage new transactions.
* **Role Switcher:** Instant UI toggle to demonstrate simulated permissions.

### 🛠 Technical Architecture & UX
* **State Management:** Implemented using **Zustand** for lightweight, predictable, and boilerplate-free global state handling.
* **Responsive Design:** Fully fluid UI built with **Tailwind CSS**, ensuring a seamless experience across desktop, tablet, and mobile devices.
* **Graceful Degradation:** Beautifully handled empty states and 'No Data Found' scenarios.

---

## 🚀 Why This Architecture?
* **React + Vite:** Chosen for lightning-fast HMR and optimal build performance.
* **Zustand over Context/Redux:** Provides the perfect balance of simplicity and power for a dashboard of this scale, avoiding the heavy boilerplate of Redux and the unnecessary re-renders of React Context.
* **Recharts:** Selected for declarative, responsive, and easily customizable SVG charts that integrate natively with React.

---

## 💻 Tech Stack
* **Framework:** React.js (via Vite)
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **Charts:** Recharts
* **Notifications:** React-Hot-Toast (if implemented)