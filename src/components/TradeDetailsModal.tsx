
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, TrendingUp, TrendingDown, Save, X } from 'lucide-react';
import { Trade } from '@/pages/Index';

interface TradeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string | null;
  trades: Trade[];
  onUpdateTrade: (trade: Trade) => void;
  onDeleteTrade: (tradeId: string) => void;
}

const TradeDetailsModal: React.FC<TradeDetailsModalProps> = ({
  isOpen,
  onClose,
  date,
  trades,
  onUpdateTrade,
  onDeleteTrade,
}) => {
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNote, setEditNote] = useState('');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDayTotal = () => {
    return trades.reduce((total, trade) => {
      return total + (trade.type === 'profit' ? trade.amount : -trade.amount);
    }, 0);
  };

  const startEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setEditAmount(trade.amount.toString());
    setEditTime(trade.time);
    setEditNote(trade.note || '');
  };

  const cancelEdit = () => {
    setEditingTrade(null);
    setEditAmount('');
    setEditTime('');
    setEditNote('');
  };

  const saveEdit = () => {
    if (!editingTrade || !editAmount || parseFloat(editAmount) <= 0) return;

    const updatedTrade: Trade = {
      ...editingTrade,
      amount: parseFloat(editAmount),
      time: editTime,
      note: editNote.trim() || undefined,
    };

    onUpdateTrade(updatedTrade);
    cancelEdit();
  };

  const dayTotal = getDayTotal();

  if (!date) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {formatDate(date)}
          </DialogTitle>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              dayTotal >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {dayTotal >= 0 ? '+' : ''}${dayTotal.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              {trades.length} trade{trades.length !== 1 ? 's' : ''}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {trades.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No trades for this date
            </div>
          ) : (
            trades.map((trade) => (
              <div key={trade.id} className="border rounded-lg p-3 space-y-3">
                {editingTrade?.id === trade.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="edit-amount">Amount ($)</Label>
                        <Input
                          id="edit-amount"
                          type="number"
                          step="0.01"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-time">Time</Label>
                        <Input
                          id="edit-time"
                          type="time"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-note">Note</Label>
                      <Textarea
                        id="edit-note"
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} size="sm" className="flex-1">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm" className="flex-1">
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {trade.type === 'profit' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`font-semibold ${
                          trade.type === 'profit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.type === 'profit' ? '+' : '-'}${trade.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {trade.time}
                      </div>
                    </div>

                    {trade.note && (
                      <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        {trade.note}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEdit(trade)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="flex-1">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Trade</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this trade? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteTrade(trade.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeDetailsModal;
