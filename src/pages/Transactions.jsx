import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { exportToCSV } from '../utils/exportToCSV'

function ExportIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  )
}

function formatMoney(value) {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) return '$0.00'

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(numberValue)
}

function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-600 dark:bg-slate-900">
      <p className="text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </p>
      <p className="text-xs text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  )
}

export default function Transactions() {
  const transactions = useStore((s) => s.transactions)
  const role = useStore((s) => s.role)
  const addTransaction = useStore((s) => s.addTransaction)

  const [searchCategory, setSearchCategory] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // 'all' | 'income' | 'expense'

  const [showAddForm, setShowAddForm] = useState(false)
  const [formDate, setFormDate] = useState(() => {
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  })
  const [formCategory, setFormCategory] = useState('')
  const [formType, setFormType] = useState('expense')
  const [formAmount, setFormAmount] = useState('0')

  const filtered = useMemo(() => {
    const q = searchCategory.trim().toLowerCase()
    let list = [...transactions]

    list.sort((a, b) => b.date.localeCompare(a.date))

    if (typeFilter !== 'all') {
      list = list.filter((t) => t.type === typeFilter)
    }

    if (q) {
      list = list.filter((t) =>
        String(t.category).toLowerCase().includes(q),
      )
    }

    return list
  }, [transactions, searchCategory, typeFilter])

  const canAdd = role === 'admin'

  const onSubmitAdd = (e) => {
    e.preventDefault()

    const amountNumber = Number(formAmount)
    const category = formCategory.trim()
    const date = formDate
    const type = formType

    if (!category) return
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) return

    addTransaction({
      date,
      amount: amountNumber,
      category,
      type,
    })

    setFormCategory('')
    setFormAmount('0')
    setFormType('expense')
    setShowAddForm(false)
  }

  return (
    <div className="pb-10">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Transactions
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Search and filter transactions by category and type.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-72">
            <label
              className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
              htmlFor="searchCategory"
            >
              Search category
            </label>
            <input
              id="searchCategory"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              placeholder="e.g. Salary, Groceries"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/30"
            />
          </div>

          <div className="w-full sm:w-56">
            <label
              className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
              htmlFor="typeFilter"
            >
              Type
            </label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/30"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label
              className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
              htmlFor="exportCsv"
            >
              Export
            </label>
            <button
              id="exportCsv"
              type="button"
              onClick={() => exportToCSV(filtered)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-300 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm transition-colors hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-indigo-500/50 dark:bg-slate-900 dark:text-indigo-300 dark:hover:border-indigo-400 dark:hover:bg-indigo-950/50 dark:focus:ring-indigo-400/30 sm:w-auto"
            >
              <ExportIcon className="h-4 w-4 shrink-0" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {canAdd && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="w-fit rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:focus:ring-indigo-400/40"
          >
            + Add Transaction
          </button>

          {showAddForm && (
            <form
              onSubmit={onSubmitAdd}
              className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:max-w-2xl"
            >
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <label
                    className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
                    htmlFor="addCategory"
                  >
                    Category
                  </label>
                  <input
                    id="addCategory"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Consulting"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/30"
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
                    htmlFor="addType"
                  >
                    Type
                  </label>
                  <select
                    id="addType"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/30"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label
                    className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
                    htmlFor="addAmount"
                  >
                    Amount
                  </label>
                  <input
                    id="addAmount"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/30"
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
                    htmlFor="addDate"
                  >
                    Date
                  </label>
                  <input
                    id="addDate"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    type="date"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/30"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:focus:ring-indigo-400/40"
                >
                  Add
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No transactions found"
              description="Try adjusting your search or filters."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const isIncome = t.type === 'income'
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-slate-100 transition-colors duration-150 ease-out last:border-0 hover:bg-slate-50/90 dark:border-slate-800 dark:hover:bg-slate-800/80"
                    >
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                        {t.date}
                      </td>
                      <td
                        className={[
                          'px-4 py-3 text-right font-medium tabular-nums',
                          isIncome
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-rose-700 dark:text-rose-400',
                        ].join(' ')}
                      >
                        {isIncome ? '+' : '−'}
                        {formatMoney(t.amount)}
                      </td>
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                        {t.category}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                            isIncome
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
                          ].join(' ')}
                        >
                          {t.type}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

