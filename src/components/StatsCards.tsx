
import React from 'react';
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';
import { Trade } from '@/pages/Index';

interface StatsCardsProps {
  trades: Trade[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ trades }) => {
  const totalProfit = trades
    .filter(trade => trade.type === 'profit')
    .reduce((sum, trade) => sum + trade.amount, 0);

  const totalLoss = trades
    .filter(trade => trade.type === 'loss')
    .reduce((sum, trade) => sum + trade.amount, 0);

  const netPL = totalProfit - totalLoss;
  const totalTrades = trades.length;

  const stats = [
    {
      title: 'Total Profit',
      value: `$${totalProfit.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Loss',
      value: `$${totalLoss.toFixed(2)}`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Net P&L',
      value: `${netPL >= 0 ? '+' : ''}$${netPL.toFixed(2)}`,
      icon: Target,
      color: netPL >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: netPL >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      title: 'Total Trades',
      value: totalTrades.toString(),
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-3">
            <div className={`inline-flex p-1.5 rounded-md ${stat.bgColor} mb-1`}>
              <Icon className={`h-3 w-3 ${stat.color}`} />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs text-muted-foreground font-medium">
                {stat.title}
              </div>
              <div className={`text-sm font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
