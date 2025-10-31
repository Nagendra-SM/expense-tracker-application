import { useState, useEffect, useCallback } from 'react';

export interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  startDate?: string;
  endDate?: string;
}

const API_BASE_URL = '/api/transactions';

export const useTransactions = (filters?: TransactionFilters) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      // Build query parameters from filters
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [filters?.type, filters?.category, filters?.startDate, filters?.endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add transaction');
      }

      const newTransaction = await response.json();
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update transaction');
      }

      const updatedTransaction = await response.json();
      setTransactions(prev => 
        prev.map(tx => tx._id === id ? { ...tx, ...updatedTransaction } : tx)
      );
      return updatedTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete transaction');
      }

      setTransactions(prev => prev.filter(tx => tx._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
