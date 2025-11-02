import { Plus, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionForm } from '../components/TransactionForm';
import { SummaryCard } from '../components/SummaryCard';
import { FilterBar } from '../components/FilterBar';
import { Chart } from '../components/Chart';
import { TransactionList } from '../components/TransactionList';
import { useState, useMemo } from 'react';
import type { TransactionFilters } from '../hooks/useTransactions';

export function HomePage() {
  const { user, signOut } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const navigate = useNavigate();

  const appliedFilters: TransactionFilters = {
    ...(filterType !== 'all' && { type: filterType }),
    ...(filterCategory && { category: filterCategory }),
    ...(filterStartDate && { startDate: filterStartDate }),
    ...(filterEndDate && { endDate: filterEndDate }),
  };

  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(appliedFilters);

  // Apply filters to transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = !filterCategory || transaction.category === filterCategory;
      const matchesStartDate = !filterStartDate || new Date(transaction.date) >= new Date(filterStartDate);
      const matchesEndDate = !filterEndDate || new Date(transaction.date) <= new Date(filterEndDate);
      
      return matchesType && matchesCategory && matchesStartDate && matchesEndDate;
    });
  }, [transactions, filterType, filterCategory, filterStartDate, filterEndDate]);

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const balance = useMemo(
    () => totalIncome - totalExpenses,
    [totalIncome, totalExpenses]
  );

  const handleResetFilters = () => {
    setFilterType('all');
    setFilterCategory('');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-700">{user?.email}</div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors hover:text-gray-900"
              >
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <SummaryCard
            title="Total Income"
            amount={totalIncome}
            icon={Wallet}
            trend="up"
            trendAmount={0}
          />
          <SummaryCard
            title="Total Expenses"
            amount={totalExpenses}
            icon={Wallet}
            trend="down"
            trendAmount={0}
          />
          <SummaryCard
            title="Balance"
            amount={balance}
            icon={Wallet}
          />
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 font-medium text-white bg-blue-600 rounded-lg shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FilterBar
              filterType={filterType}
              onFilterTypeChange={setFilterType}
              filterCategory={filterCategory}
              onFilterCategoryChange={setFilterCategory}
              filterStartDate={filterStartDate}
              onFilterStartDateChange={setFilterStartDate}
              filterEndDate={filterEndDate}
              onFilterEndDateChange={setFilterEndDate}
              onResetFilters={handleResetFilters}
            />
            <TransactionList
              transactions={filteredTransactions}
              loading={transactionsLoading}
              onUpdate={updateTransaction}
              onDelete={deleteTransaction}
            />
          </div>
          <div>
            <Chart transactions={transactions} />
          </div>
        </div>
      </main>

      {showAddModal && (
        <TransactionForm
          onSubmit={addTransaction}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
