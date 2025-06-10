
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, TrendingDown, Calendar, Clock } from 'lucide-react';
import { Trade } from '@/pages/Index';

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
}

const AddTradeModal: React.FC<AddTradeModalProps> = ({ isOpen, onClose, onAddTrade }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [note, setNote] = useState('');

  const handleSubmit = (type: 'profit' | 'loss') => {
    if (!amount || parseFloat(amount) <= 0) return;

    onAddTrade({
      amount: parseFloat(amount),
      date,
      time,
      type,
      note: note.trim() || undefined,
    });

    // Reset form
    setAmount('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toTimeString().slice(0, 5));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-2xl mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">Add Trade</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-medium text-center"
            />
          </div>

          {/* Date and Time - Horizontal Layout */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center justify-center gap-1">
                <Calendar className="h-4 w-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-center"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center justify-center gap-1">
                <Clock className="h-4 w-4" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-center"
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note" className="text-center block">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a note about this trade..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="text-center"
            />
          </div>

          {/* Action Buttons - Horizontal Layout */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button
              onClick={() => handleSubmit('profit')}
              disabled={!amount || parseFloat(amount) <= 0}
              className="bg-green-600 hover:bg-green-700 text-white h-12 rounded-lg"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Profit
            </Button>
            <Button
              onClick={() => handleSubmit('loss')}
              disabled={!amount || parseFloat(amount) <= 0}
              className="bg-red-600 hover:bg-red-700 text-white h-12 rounded-lg"
            >
              <TrendingDown className="h-5 w-5 mr-2" />
              Loss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTradeModal;
