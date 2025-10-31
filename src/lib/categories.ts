export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Gifts',
  'Other Income'
];

export const EXPENSE_CATEGORIES = [
  'Groceries',
  'Entertainment',
  'Transportation',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Dining',
  'Education',
  'Housing',
  'Other Expense'
];

export const getCategoriesByType = (type: 'income' | 'expense') => {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
};
