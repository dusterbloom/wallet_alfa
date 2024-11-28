import React, { useState } from 'react';
import { Header } from '../components/Screen.jsx';

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'send',
    amount: 50.00,
    recipient: 'Alice Smith',
    recipientId: 'alice@cycles.app',
    date: '2024-01-20T10:30:00Z',
    status: 'completed',
    note: 'Lunch',
    category: 'Food & Dining',
    fee: 0,
    exchangeRate: null,
    confirmations: 3,
    transactionId: 'tx_1234567890'
  },
  {
    id: '2',
    type: 'receive',
    amount: 25.50,
    sender: 'Bob Johnson',
    senderId: 'bob@cycles.app',
    date: '2024-01-19T15:45:00Z',
    status: 'completed',
    note: 'Coffee and snacks',
    category: 'Food & Dining',
    fee: 0,
    exchangeRate: null,
    confirmations: 3,
    transactionId: 'tx_0987654321'
  },
  {
    id: '3',
    type: 'cashout',
    amount: 100.00,
    method: 'Bank Transfer',
    date: '2024-01-18T09:15:00Z',
    status: 'processing',
    details: 'IBAN: DE89 ****',
    category: 'Transfer',
    fee: 0.50,
    estimatedArrival: '2024-01-20T09:15:00Z',
    reference: 'BANK-TX-123456',
    bankName: 'Deutsche Bank',
    transactionId: 'tx_5432167890'
  },
  {
    id: '4',
    type: 'split',
    amount: 120.00,
    group: 'Weekend Trip',
    participants: ['You', 'Alice', 'Bob', 'Charlie'],
    shares: [
      { name: 'You', amount: 30.00, status: 'paid' },
      { name: 'Alice', amount: 30.00, status: 'pending' },
      { name: 'Bob', amount: 30.00, status: 'paid' },
      { name: 'Charlie', amount: 30.00, status: 'pending' }
    ],
    date: '2024-01-17T20:20:00Z',
    status: 'completed',
    note: 'Dinner',
    category: 'Food & Dining',
    transactionId: 'tx_6789054321'
  }
];

export const HistoryScreen = ({ onBack }) => {
  const [filter, setFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'send': return '↑';
      case 'receive': return '↓';
      case 'cashout': return '🏦';
      case 'split': return '÷';
      default: return '•';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const filteredTransactions = MOCK_TRANSACTIONS.filter(
    t => filter === 'all' || t.type === filter
  );

  const renderTransactionDetails = (transaction) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-zinc-900 rounded-t-3xl p-6 animate-in slide-in-from-bottom">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-medium mb-1">Transaction Details</h3>
            <p className="text-zinc-500 text-sm">{transaction.transactionId}</p>
          </div>
          <button 
            onClick={() => setSelectedTransaction(null)}
            className="p-2 hover:bg-zinc-800 rounded-full"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl
                          ${transaction.type === 'receive' ? 'bg-green-500' :
                            transaction.type === 'send' ? 'bg-blue-500' :
                            transaction.type === 'cashout' ? 'bg-[#FF9500]' :
                            'bg-purple-500'}`}>
              {getTransactionIcon(transaction.type)}
            </div>
            <div className="text-center">
              <div className="text-3xl font-medium">
                ${transaction.amount.toFixed(2)}
              </div>
              <div className="text-zinc-500">
                {transaction.category}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-zinc-800 rounded-xl p-4">
              <div className="text-sm text-zinc-500 mb-1">Status</div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  transaction.status === 'completed' ? 'bg-green-500' :
                  transaction.status === 'processing' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                <span className="capitalize">{transaction.status}</span>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl p-4">
              <div className="text-sm text-zinc-500 mb-1">Date & Time</div>
              <div>{formatFullDate(transaction.date)}</div>
            </div>

            {transaction.type === 'split' && (
              <div className="bg-zinc-800 rounded-xl p-4">
                <div className="text-sm text-zinc-500 mb-2">Split Details</div>
                <div className="space-y-2">
                  {transaction.shares.map((share, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-zinc-600" />
                        <span>{share.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>${share.amount.toFixed(2)}</span>
                        <span className={`text-sm ${
                          share.status === 'paid' ? 'text-green-500' :
                          'text-yellow-500'
                        }`}>
                          {share.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {transaction.type === 'cashout' && (
              <div className="bg-zinc-800 rounded-xl p-4 space-y-2">
                <div>
                  <div className="text-sm text-zinc-500">Bank Details</div>
                  <div>{transaction.bankName}</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Reference</div>
                  <div>{transaction.reference}</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Estimated Arrival</div>
                  <div>{formatFullDate(transaction.estimatedArrival)}</div>
                </div>
              </div>
            )}

            {(transaction.type === 'send' || transaction.type === 'receive') && (
              <div className="bg-zinc-800 rounded-xl p-4">
                <div className="text-sm text-zinc-500 mb-1">
                  {transaction.type === 'send' ? 'Recipient' : 'Sender'}
                </div>
                <div>{transaction.recipient || transaction.sender}</div>
                <div className="text-sm text-zinc-500">
                  {transaction.recipientId || transaction.senderId}
                </div>
              </div>
            )}

            {transaction.note && (
              <div className="bg-zinc-800 rounded-xl p-4">
                <div className="text-sm text-zinc-500 mb-1">Note</div>
                <div>{transaction.note}</div>
              </div>
            )}

            {transaction.fee > 0 && (
              <div className="bg-zinc-800 rounded-xl p-4">
                <div className="text-sm text-zinc-500 mb-1">Fee</div>
                <div>${transaction.fee.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-black">
      <Header 
        title="Transaction History"
        onBack={onBack}
      />
      
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {[
            { id: 'all', label: 'All' },
            { id: 'send', label: 'Sent' },
            { id: 'receive', label: 'Received' },
            { id: 'cashout', label: 'Cashouts' },
            { id: 'split', label: 'Splits' }
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap
                       transition-all duration-200 ${
                filter === id
                  ? 'bg-[#FF9500] text-black'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <button
              key={transaction.id}
              onClick={() => setSelectedTransaction(transaction)}
              className="w-full text-left bg-zinc-900 rounded-xl p-4 transition-all duration-200
                       hover:bg-zinc-800"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                ${transaction.type === 'receive' ? 'bg-green-500' :
                                  transaction.type === 'send' ? 'bg-blue-500' :
                                  transaction.type === 'cashout' ? 'bg-[#FF9500]' :
                                  'bg-purple-500'}`}>
                    <span className="text-xl">
                      {getTransactionIcon(transaction.type)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {transaction.recipient || transaction.sender || 
                       transaction.method || transaction.group}
                    </div>
                    <div className="text-sm text-zinc-500">
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={transaction.type === 'receive' ? 'text-green-500' : 'text-white'}>
                    {transaction.type === 'receive' ? '+' : ''}
                    ${transaction.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {transaction.status}
                  </div>
                </div>
              </div>
              {transaction.note && (
                <div className="text-sm text-zinc-500 mt-2">
                  {transaction.note}
                </div>
              )}
              {transaction.details && (
                <div className="text-sm text-zinc-500 mt-2">
                  {transaction.details}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedTransaction && renderTransactionDetails(selectedTransaction)}
    </div>
  );
};
