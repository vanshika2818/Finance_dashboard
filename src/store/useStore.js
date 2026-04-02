import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { mockTransactions } from '../data/mockTransactions'

function nextId(transactions) {
  const max = transactions.reduce((acc, t) => {
    const n = Number.parseInt(String(t.id).replace(/\D/g, ''), 10)
    return Number.isFinite(n) ? Math.max(acc, n) : acc
  }, 0)
  return `tx-${String(max + 1).padStart(3, '0')}`
}

export const useStore = create(
  persist(
    (set, get) => ({
      transactions: [...mockTransactions],
      role: 'viewer',
      theme: 'light',
      isLoading: true,

      setRole: (role) => set({ role }),

      setIsLoading: (isLoading) => set({ isLoading }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      addTransaction: (transaction) =>
        set((state) => {
          const id = transaction.id ?? nextId(state.transactions)
          return {
            transactions: [...state.transactions, { ...transaction, id }],
          }
        }),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      getFinancialSummary: () => {
        const { transactions } = get()
        let totalIncome = 0
        let totalExpenses = 0
        for (const t of transactions) {
          if (t.type === 'income') totalIncome += t.amount
          else if (t.type === 'expense') totalExpenses += t.amount
        }
        return {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
        }
      },
    }),
    {
      name: 'finance-dashboard',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
      }),
    },
  ),
)
