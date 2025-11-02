import { useState, useEffect, useCallback } from 'react';

export type UpdateTransactionData = {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
};

export interface Transaction extends UpdateTransactionData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  // Aliases for compatibility
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

// Helper function to get cookie by name
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null; // For SSR
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const getAuthToken = () => {
  const token = getCookie('auth_token');
  console.log("Token from cookie:", token ? token : 'Not found');
  return token;
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
        credentials: 'include', // Important for cookies
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
      // Map the backend response to our frontend Transaction interface
      const mappedTransactions = Array.isArray(data) 
        ? data.map(tx => ({
            id: tx.id || tx._id,  // Handle both id and _id from backend
            user_id: tx.user_id || '',  // Ensure user_id is set
            type: tx.type,
            amount: tx.amount,
            description: tx.description,
            category: tx.category,
            date: tx.date,
            created_at: tx.created_at || tx.createdAt,
            updated_at: tx.updated_at || tx.updatedAt,
            // Aliases for compatibility
            createdAt: tx.created_at || tx.createdAt,
            updatedAt: tx.updated_at || tx.updatedAt
          }))
        : [];
      setTransactions(mappedTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [filters?.type, filters?.category, filters?.startDate, filters?.endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      console.log('Auth token in addTransaction:', token);

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('Error response:', errorData);
        } catch (e) {
          console.error('Failed to parse error response:', e);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.message || 'Failed to add transaction');
      }

      const data = await response.json();
      console.log('Transaction added successfully:', data);
      setTransactions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add transaction';
      console.error('Error in addTransaction:', errorMessage, err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, updates: UpdateTransactionData) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        credentials: 'include', // Important for cookies
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
        prev.map(tx => tx.id === id ? { ...tx, ...updatedTransaction } : tx)
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
      if (!id || id === 'undefined') {
        throw new Error('Invalid transaction ID');
      }
      
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete transaction');
      }

      // Remove the transaction from the local state
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction.id !== id)
      );
      
      return await response.json();
    } catch (err) {
      console.error('Error deleting transaction:', err);
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
