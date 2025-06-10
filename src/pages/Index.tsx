
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CalendarGrid from '@/components/CalendarGrid';
import AddTradeModal from '@/components/AddTradeModal';
import TradeDetailsModal from '@/components/TradeDetailsModal';
import StatsCards from '@/components/StatsCards';

export interface Trade {
  id: string;
  date: string;
  time: string;
  amount: number;
  type: 'profit' | 'loss';
  note?: string;
}

const Index = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateTrades, setSelectedDateTrades] = useState<Trade[]>([]);

  // Load trades from localStorage on component mount
  useEffect(() => {
    const savedTrades = localStorage.getItem('trades');
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
  }, []);

  // Save trades to localStorage whenever trades change
  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades));
  }, [trades]);

  const addTrade = (trade: Omit<Trade, 'id'>) => {
    const newTrade: Trade = {
      ...trade,
      id: Date.now().toString(),
    };
    setTrades(prev => [...prev, newTrade]);
  };

  const updateTrade = (updatedTrade: Trade) => {
    setTrades(prev => prev.map(trade => 
      trade.id === updatedTrade.id ? updatedTrade : trade
    ));
  };

  const deleteTrade = (tradeId: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== tradeId));
  };

  const handleDateClick = (date: string) => {
    const dayTrades = trades.filter(trade => trade.date === date);
    setSelectedDateTrades(dayTrades);
    setSelectedDate(date);
  };

  const calculateTotalPL = () => {
    return trades.reduce((total, trade) => {
      return total + (trade.type === 'profit' ? trade.amount : -trade.amount);
    }, 0);
  };

  const totalPL = calculateTotalPL();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3">
      <div className="max-w-md mx-auto space-y-3">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">P&L Tracker</h1>
          </div>
          
          {/* Total P&L Display */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-sm text-muted-foreground mb-1">Total P&L</div>
            <div className={`text-2xl font-bold ${
              totalPL >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
            </div>
            <div className="flex items-center justify-center mt-1">
              {totalPL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow-sm border p-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Trading Calendar</h2>
          </div>
          <CalendarGrid trades={trades} onDateClick={handleDateClick} />
        </div>

        {/* Stats Cards */}
        <StatsCards trades={trades} />

        {/* Add Trade Button */}
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="lg"
            className="rounded-full shadow-lg h-12 w-12 p-0 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Modals */}
        <AddTradeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddTrade={addTrade}
        />

        <TradeDetailsModal
          isOpen={!!selectedDate}
          onClose={() => {
            setSelectedDate(null);
            setSelectedDateTrades([]);
          }}
          date={selectedDate}
          trades={selectedDateTrades}
          onUpdateTrade={updateTrade}
          onDeleteTrade={deleteTrade}
        />
      </div>
    </div>
  );
};

export default Index;
