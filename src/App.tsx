/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, LogOut } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';
import { AuthForm } from './components/AuthForm';
import { TransactionForm } from './components/TransactionForm';
import { SummaryCard } from './components/SummaryCard';
import { FilterBar } from './components/FilterBar';
import { Chart } from './components/chart';
import { TransactionList } from './components/TransactionList';
import type { TransactionFilters } from './hooks/useTransactions';

function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const appliedFilters: TransactionFilters = {
    ...(filterType !== 'all' && { type: filterType }),
    ...(filterCategory && { category: filterCategory }),
    ...(filterStartDate && { startDate: filterStartDate }),
    ...(filterEndDate && { endDate: filterEndDate })
  };

  const {
    transactions,
    loading: transactionsLoading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactions(appliedFilters);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [transactions]);

  const handleResetFilters = () => {
    setFilterType('all');
    setFilterCategory('');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSignIn={signIn} onSignUp={signUp} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={signOut}
                className="flex gap-2 items-center px-4 py-2 text-gray-700 transition-colors hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
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
            icon={TrendingUp}
            color="green"
          />
          <SummaryCard
            title="Total Expenses"
            amount={totalExpense}
            icon={TrendingDown}
            color="red"
          />
          <SummaryCard
            title="Balance"
            amount={balance}
            icon={Wallet}
            color="blue"
          />
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex gap-2 items-center px-6 py-3 font-medium text-white bg-blue-600 rounded-lg shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>

        <div className="mb-6">
          <FilterBar
            type={filterType}
            category={filterCategory}
            startDate={filterStartDate}
            endDate={filterEndDate}
            onTypeChange={setFilterType}
            onCategoryChange={setFilterCategory}
            onStartDateChange={setFilterStartDate}
            onEndDateChange={setFilterEndDate}
            onReset={handleResetFilters}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {transactionsLoading ? (
              <div className="p-12 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-600">Loading transactions...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <TransactionList
                transactions={transactions}
                onDelete={deleteTransaction}
                onUpdate={updateTransaction}
              />
            )}
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

export default App;
