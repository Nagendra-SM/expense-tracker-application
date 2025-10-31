import { useMemo } from 'react';
import type { Transaction } from '../lib/database.types';

interface ChartProps {
  transactions: Transaction[];
}

export const Chart = ({ transactions }: ChartProps) => {
  const { totalIncome, totalExpense, categoryData } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const catData: Record<string, { amount: number; type: 'income' | 'expense' }> = {};
    transactions.forEach(t => {
      if (!catData[t.category]) {
        catData[t.category] = { amount: 0, type: t.type };
      }
      catData[t.category].amount += Number(t.amount);
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      categoryData: Object.entries(catData)
        .map(([category, data]) => ({ category, ...data }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 8)
    };
  }, [transactions]);

  const total = totalIncome + totalExpense;
  const incomePercentage = total > 0 ? (totalIncome / total) * 100 : 50;

  const maxCategoryAmount = Math.max(...categoryData.map(c => c.amount), 1);

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">Financial Overview</h3>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">Income vs Expenses</span>
          <span className="text-sm text-gray-600">
            {incomePercentage.toFixed(0)}% / {(100 - incomePercentage).toFixed(0)}%
          </span>
        </div>
        <div className="flex overflow-hidden h-8 bg-gray-100 rounded-lg">
          <div
            className="flex justify-center items-center text-xs font-medium text-white bg-green-500 transition-all duration-500 ease-out"
            style={{ width: `${incomePercentage}%` }}
          >
            {incomePercentage > 15 && `$${totalIncome.toFixed(0)}`}
          </div>
          <div
            className="flex justify-center items-center text-xs font-medium text-white bg-red-500 transition-all duration-500 ease-out"
            style={{ width: `${100 - incomePercentage}%` }}
          >
            {100 - incomePercentage > 15 && `$${totalExpense.toFixed(0)}`}
          </div>
        </div>
      </div>

      {categoryData.length > 0 && (
        <div>
          <h4 className="mb-4 text-sm font-medium text-gray-700">Top Categories</h4>
          <div className="space-y-3">
            {categoryData.map(({ category, amount, type }) => {
              const percentage = (amount / maxCategoryAmount) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className={`text-sm font-semibold ${
                      type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="overflow-hidden h-2 bg-gray-100 rounded-full">
                    <div
                      className={`h-full transition-all duration-500 ease-out ${
                        type === 'income' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {categoryData.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          No transactions to display
        </div>
      )}
    </div>
  );
};
