
import React from 'react';
import { Trade } from '@/pages/Index';

interface CalendarGridProps {
  trades: Trade[];
  onDateClick: (date: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ trades, onDateClick }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Create array of dates for the calendar
  const calendarDates = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDates.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDates.push(day);
  }

  const formatDate = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDayPL = (day: number) => {
    const dateStr = formatDate(day);
    const dayTrades = trades.filter(trade => trade.date === dateStr);
    return dayTrades.reduce((total, trade) => {
      return total + (trade.type === 'profit' ? trade.amount : -trade.amount);
    }, 0);
  };

  const getTradeCount = (day: number) => {
    const dateStr = formatDate(day);
    return trades.filter(trade => trade.date === dateStr).length;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full">
      {/* Month header */}
      <div className="text-center mb-2">
        <h3 className="text-base font-semibold text-primary">
          {monthNames[currentMonth]} {currentYear}
        </h3>
      </div>

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDates.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-12" />;
          }

          const dayPL = getDayPL(day);
          const tradeCount = getTradeCount(day);
          const isToday = day === today.getDate() && 
                         currentMonth === today.getMonth() && 
                         currentYear === today.getFullYear();

          return (
            <button
              key={day}
              onClick={() => onDateClick(formatDate(day))}
              className={`h-12 p-1 rounded border transition-all duration-200 hover:shadow-md ${
                isToday 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border bg-background hover:bg-accent'
              } ${tradeCount > 0 ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="h-full flex flex-col items-center justify-center">
                <div className={`text-xs font-medium ${
                  isToday ? 'text-primary' : 'text-foreground'
                }`}>
                  {day}
                </div>
                {tradeCount > 0 && (
                  <>
                    <div className={`text-xs font-bold ${
                      dayPL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {dayPL >= 0 ? '+' : ''}${Math.abs(dayPL).toFixed(0)}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-primary" />
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
