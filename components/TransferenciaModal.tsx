/**
 * ============================================================================
 * MODAL DE TRANSFERÊNCIA BANCÁRIA
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente modal para realizar transferências entre contas bancárias.
 * 
 * FUNCIONALIDADES:
 * • Selecionar conta de origem
 * • Selecionar conta de destino
 * • Informar valor e descrição
 * • Confirmar transferência
 */

import React, { useState } from 'react';
import { X, ArrowRight, DollarSign } from 'lucide-react';
import { FinancialAccount } from '../types';

interface TransferenciaModalProps {
  accounts: FinancialAccount[];
  fromAccountId?: string;
  toAccountId?: string;
  amount?: number;
  description?: string;
  onClose: () => void;
  onTransfer: (fromId: string, toId: string, amount: number, desc: string) => void;
}

export const TransferenciaModal: React.FC<TransferenciaModalProps> = ({
  accounts,
  fromAccountId,
  toAccountId,
  amount,
  description,
  onClose,
  onTransfer,
}) => {
  const [fromId, setFromId] = useState(fromAccountId || '');
  const [toId, setToId] = useState(toAccountId || '');
  const [value, setValue] = useState(amount || 0);
  const [desc, setDesc] = useState(description || '');

  const handleConfirm = () => {
    if (!fromId || !toId || value <= 0) {
      alert('Preencha todos os campos!');
      return;
    }
    if (fromId === toId) {
      alert('Conta de origem e destino devem ser diferentes!');
      return;
    }
    onTransfer(fromId, toId, value, desc);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Transferência Bancária</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Conta de Origem */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Conta de Origem
            </label>
            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Selecione...</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} - R$ {acc.currentBalance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Conta de Destino */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Conta de Destino
            </label>
            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Selecione...</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} disabled={acc.id === fromId}>
                  {acc.name} - R$ {acc.currentBalance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Valor da Transferência
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <DollarSign size={20} />
              </span>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descrição / Histórico
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              rows={3}
              placeholder="Ex: Transferência para pagamento de fornecedor..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
          >
            <ArrowRight size={18} />
            Transferir
          </button>
        </div>
      </div>
    </div>
  );
};
