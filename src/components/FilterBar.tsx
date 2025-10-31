import { Filter } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../lib/categories';

interface FilterBarProps {
  type: 'all' | 'income' | 'expense';
  category: string;
  startDate: string;
  endDate: string;
  onTypeChange: (type: 'all' | 'income' | 'expense') => void;
  onCategoryChange: (category: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
}

export const FilterBar = ({
  type,
  category,
  startDate,
  endDate,
  onTypeChange,
  onCategoryChange,
  onStartDateChange,
  onEndDateChange,
  onReset
}: FilterBarProps) => {
  const categories = type === 'income'
    ? INCOME_CATEGORIES
    : type === 'expense'
    ? EXPENSE_CATEGORIES
    : [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  const hasActiveFilters = type !== 'all' || category !== '' || startDate !== '' || endDate !== '';

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex gap-2 items-center mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="ml-auto text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value as 'all' | 'income' | 'expense')}
            className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-shadow outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-shadow outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-shadow outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-shadow outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};
