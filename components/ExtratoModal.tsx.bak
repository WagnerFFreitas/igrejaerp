/**
 * ============================================================================
 * MODAL DE EXTRATO BANCÁRIO
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente modal para visualização de extrato de conta bancária.
 * 
 * FUNCIONALIDADES:
 * • Lista todas as transações da conta
 * • Mostra saldo atual
 * • Filtra por período
 * • Exporta extrato
 */

import React, { useState } from 'react';
import { X, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../types';

interface ExtratoModalProps {
  accountId: string;
  transactions: Transaction[];
  onClose: () => void;
}

export const ExtratoModal: React.FC<ExtratoModalProps> = ({
  accountId,
  transactions,
  onClose,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtra transações por período
  const filteredTransactions = transactions.filter((t) => {
    if (!startDate && !endDate) return true;
    const tDate = new Date(t.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && tDate < start) return false;
    if (end && tDate > end) return false;
    return true;
  });

  // Calcula totais
  const totalCredits = filteredTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebits = filteredTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleExport = () => {
    // Implementar exportação CSV/PDF
    alert('Funcionalidade de exportação será implementada em breve!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Extrato Bancário</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 pb-4 border-b border-slate-200">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              De:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Até:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
            >
              <Download size={18} />
              Exportar
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-emerald-600" size={20} />
              <span className="text-sm font-medium text-emerald-800">Receitas</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalCredits)}
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="text-red-600" size={20} />
              <span className="text-sm font-medium text-red-800">Despesas</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalDebits)}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-blue-600" size={20} />
              <span className="text-sm font-medium text-blue-800">Saldo</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalCredits - totalDebits)}
            </p>
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Transações ({filteredTransactions.length})
          </h3>
          
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Calendar size={48} className="mx-auto mb-2 opacity-50" />
              <p>Nenhuma transação no período selecionado</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        t.type === 'INCOME'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {t.type === 'INCOME' ? (
                        <TrendingUp size={20} />
                      ) : (
                        <TrendingDown size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{t.description}</p>
                      <p className="text-xs text-slate-500">
                        {formatDate(t.date)} • {t.category}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      t.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
