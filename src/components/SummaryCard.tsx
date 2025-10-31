import type { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  color: 'green' | 'red' | 'blue';
}

export const SummaryCard = ({ title, amount, icon: Icon, color }: SummaryCardProps) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700'
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">
        ${amount.toFixed(2)}
      </p>
    </div>
  );
};
