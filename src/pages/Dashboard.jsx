import { useMemo } from 'react'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useStore } from '../store/useStore'
import { formatCurrency } from '../utils/currency'

function SkeletonBar({ className = '' }) {
  return (
    <div
      className={`skeleton-shimmer rounded-md ${className}`}
      aria-hidden
    />
  )
}

const MONTHLY_BUDGET = 3000

function BudgetTracker({ totalExpenses, currency }) {
  const pct =
    MONTHLY_BUDGET > 0 ? (totalExpenses / MONTHLY_BUDGET) * 100 : 0
  const fillWidth = Math.min(100, pct)
  const fillClass =
    pct < 50
      ? 'bg-emerald-500 dark:bg-emerald-400'
      : pct <= 80
        ? 'bg-amber-400 dark:bg-amber-400'
        : 'bg-red-500 dark:bg-red-400'

  return (
    <div className="mt-4 rounded-lg border border-indigo-200/80 bg-white/60 p-4 dark:border-indigo-800/50 dark:bg-slate-950/30">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Budget Tracker
        </p>
        <p className="text-xs font-medium tabular-nums text-slate-600 dark:text-slate-400">
          {formatCurrency(totalExpenses, currency)} of {formatCurrency(MONTHLY_BUDGET, currency)}
        </p>
      </div>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
        Total expenses vs. $3,000 monthly budget
      </p>
      <div
        className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(Math.min(100, pct))}
        aria-label="Share of monthly budget used by total expenses"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${fillClass}`}
          style={{ width: `${fillWidth}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="font-medium tabular-nums text-slate-700 dark:text-slate-300">
          {pct >= 100
            ? `${Math.round(pct)}% of budget`
            : `${Math.round(pct)}% used`}
        </span>
        {pct > 100 && (
          <span className="font-medium text-red-600 dark:text-red-400">
            Over budget
          </span>
        )}
      </div>
    </div>
  )
}

function EmptyChart({ title, description }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </p>
      <p className="text-xs text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  )
}

function BalanceChart({ trend, isDark, currency }) {
  const grid = isDark ? '#334155' : '#e2e8f0'
  const tick = isDark ? '#94a3b8' : '#64748b'
  const axis = isDark ? '#475569' : '#cbd5e1'
  const line = isDark ? '#818cf8' : '#4f46e5'
  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
    borderRadius: 8,
  }
  const labelColor = isDark ? '#e2e8f0' : '#334155'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Balance trend
        </p>
        <span className="text-xs text-slate-600 dark:text-slate-400">
          Line chart
        </span>
      </div>

      <div className="h-[280px] w-full">
        {trend.length === 0 ? (
          <EmptyChart
            title="No balance data yet"
            description="Add income/expenses to see the trend."
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trend}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis
                dataKey="date"
                stroke={axis}
                tick={{ fontSize: 12, fill: tick }}
                tickLine={{ stroke: axis }}
              />
              <YAxis
                stroke={axis}
                tick={{ fontSize: 12, fill: tick }}
                tickLine={{ stroke: axis }}
                tickFormatter={(v) => formatCurrency(v, currency)}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value, currency)}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={tooltipStyle}
                labelStyle={{ color: labelColor }}
                itemStyle={{ color: labelColor }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke={line}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

function ExpensePieChart({ data, isDark, currency }) {
  const hasData = data.length > 0

  const colors = [
    '#4f46e5',
    '#db2777',
    '#f97316',
    '#0ea5e9',
    '#22c55e',
    '#f43f5e',
    '#a855f7',
    '#84cc16',
    '#14b8a6',
  ]

  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
    borderRadius: 8,
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Expense breakdown
        </p>
      </div>

      {!hasData ? (
        <EmptyChart
          title="No expenses to show"
          description="Add expenses to see category distribution."
        />
      ) : (
        <div className="space-y-4">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(value, currency),
                    String(name),
                  ]}
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: isDark ? '#e2e8f0' : '#334155' }}
                  itemStyle={{ color: isDark ? '#e2e8f0' : '#334155' }}
                  cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius="85%"
                  innerRadius="50%"
                  labelLine={false}
                  label={false}
                >
                  {data.map((entry, idx) => (
                    <Cell
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${entry.name}-${idx}`}
                      fill={colors[idx % colors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {data.map((entry, idx) => {
                const totalValue = data.reduce((sum, item) => sum + item.value, 0)
                const percentage = ((entry.value / totalValue) * 100).toFixed(1)
                return (
                  <div key={`legend-${entry.name}-${idx}`} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colors[idx % colors.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                        {entry.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {percentage}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const transactions = useStore((s) => s.transactions)
  const role = useStore((s) => s.role)
  const theme = useStore((s) => s.theme)
  const currency = useStore((s) => s.currency)
  const isLoading = useStore((s) => s.isLoading)
  const deleteTransaction = useStore((s) => s.deleteTransaction)
  const isDark = theme === 'dark'

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    let income = 0
    let expenses = 0
    for (const t of transactions) {
      if (t.type === 'income') income += t.amount
      else if (t.type === 'expense') expenses += t.amount
    }
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    }
  }, [transactions])

  const trend = useMemo(() => {
    if (transactions.length === 0) return []

    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))

    const netByDate = new Map()
    for (const t of sorted) {
      const net = t.type === 'income' ? t.amount : -t.amount
      netByDate.set(t.date, (netByDate.get(t.date) ?? 0) + net)
    }

    const dates = [...netByDate.keys()].sort((a, b) => a.localeCompare(b))
    let running = 0
    return dates.map((date) => {
      running += netByDate.get(date) ?? 0
      return { date, balance: running }
    })
  }, [transactions])

  const expenseByCategory = useMemo(() => {
    if (transactions.length === 0) return []

    const map = new Map()
    for (const t of transactions) {
      if (t.type !== 'expense') continue
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
    }

    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const highestSpendingThisMonth = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + 1
    const monthPrefix = `${y}-${String(m).padStart(2, '0')}`

    const byCategory = new Map()
    for (const t of transactions) {
      if (t.type !== 'expense' || !t.date) continue
      if (!t.date.startsWith(monthPrefix)) continue
      byCategory.set(
        t.category,
        (byCategory.get(t.category) ?? 0) + t.amount,
      )
    }

    if (byCategory.size === 0) return null

    let topCategory = null
    let maxAmount = 0
    for (const [category, amount] of byCategory) {
      if (amount > maxAmount) {
        maxAmount = amount
        topCategory = category
      }
    }

    return topCategory ? { category: topCategory, amount: maxAmount } : null
  }, [transactions])

  const canEdit = role === 'admin' || role === 'editor'

  const summaryCardClass =
    'rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300/90 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:shadow-lg dark:hover:shadow-black/20'

  const tableRowClass =
    'border-b border-slate-100 transition-colors duration-150 ease-out last:border-0 hover:bg-slate-50/90 dark:border-slate-800 dark:hover:bg-slate-800/80'

  if (isLoading) {
    const skeletonTableRows = 8
    return (
      <div className="pb-10">
        <section className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <SkeletonBar className="h-3 w-28" />
              <SkeletonBar className="mt-3 h-9 w-40" />
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-5 shadow-sm dark:border-indigo-900/40 dark:from-indigo-950/40 dark:to-slate-900">
          <SkeletonBar className="h-3 w-24" />
          <SkeletonBar className="mt-3 h-4 w-full max-w-xl" />
          <SkeletonBar className="mt-2 h-4 w-2/3 max-w-md" />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <SkeletonBar className="h-3 w-32" />
                <SkeletonBar className="h-3 w-20" />
              </div>
              <div className="h-[280px] w-full overflow-hidden rounded-lg">
                <SkeletonBar className="h-full w-full rounded-lg" />
              </div>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <SkeletonBar className="h-6 w-44" />
          <SkeletonBar className="mt-2 h-4 w-72 max-w-full" />
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                    Date
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                    Amount
                  </th>
                  {canEdit && (
                    <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: skeletonTableRows }).map((_, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-4 py-3">
                      <SkeletonBar className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <SkeletonBar className="h-4 w-36" />
                    </td>
                    <td className="px-4 py-3">
                      <SkeletonBar className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <SkeletonBar className="ml-auto h-4 w-24" />
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3 text-right">
                        <SkeletonBar className="ml-auto h-8 w-16 rounded-lg" />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="pb-10">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className={summaryCardClass}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Total balance
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {formatCurrency(balance, currency)}
          </p>
        </div>
        <div className={summaryCardClass}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Income
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700 dark:text-emerald-400">
            {formatCurrency(totalIncome, currency)}
          </p>
        </div>
        <div className={summaryCardClass}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Expenses
          </p>
          <p className="mt-2 text-2xl font-semibold text-rose-700 dark:text-rose-400">
            {formatCurrency(totalExpenses, currency)}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-5 shadow-sm dark:border-indigo-900/40 dark:from-indigo-950/40 dark:to-slate-900">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-900/70 dark:text-indigo-300/90">
          Insights
        </h3>
        <BudgetTracker totalExpenses={totalExpenses} currency={currency} />
        {highestSpendingThisMonth ? (
          <p className="mt-4 border-t border-indigo-100/90 pt-4 text-sm leading-relaxed text-slate-700 dark:border-indigo-800/50 dark:text-slate-300">
            Your highest spending category this month is{' '}
            <span className="font-semibold text-indigo-900 dark:text-indigo-300">
              {highestSpendingThisMonth.category}
            </span>{' '}
            at{' '}
            <span className="font-medium tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(highestSpendingThisMonth.amount, currency)}
            </span>
            .
          </p>
        ) : (
          <p className="mt-4 border-t border-indigo-100/90 pt-4 text-sm leading-relaxed text-slate-600 dark:border-indigo-800/50 dark:text-slate-400">
            No expense transactions recorded for this calendar month yet. Add
            expenses to see spending insights here.
          </p>
        )}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <BalanceChart trend={trend} isDark={isDark} currency={currency} />
        <ExpensePieChart data={expenseByCategory} isDark={isDark} currency={currency} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Transactions
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {canEdit
            ? 'You can remove rows below.'
            : 'Viewer role: delete is hidden.'}
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                  Date
                </th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                  Category
                </th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                  Type
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                  Amount
                </th>
                {canEdit && (
                  <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className={tableRowClass}>
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                    {t.date}
                  </td>
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                    {t.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        t.type === 'income'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium tabular-nums ${
                      t.type === 'income'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {t.type === 'expense' ? '−' : '+'}
                    {formatCurrency(t.amount, currency)}
                  </td>
                  {canEdit && (
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteTransaction(t.id)}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

