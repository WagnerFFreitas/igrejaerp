import React, { useState } from 'react';
import { Printer, X, Calendar, DollarSign, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { Transaction, Member, FinancialAccount } from '../types';

interface ImprimeRelatfinanceiroProps {
  transactions: Transaction[];
  members: Member[];
  accounts: FinancialAccount[];
  onClose: () => void;
}

export const ImprimeRelatfinanceiro: React.FC<ImprimeRelatfinanceiroProps> = ({ 
  transactions, 
  members, 
  accounts, 
  onClose 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'custom'>('current');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Filtrar transações pelo período
  const getFilteredTransactions = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Incluir o dia final completo

    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= start && tDate <= end;
    });
  };

  // Cálculos financeiros
  const filteredTransactions = getFilteredTransactions();
  const totals = filteredTransactions.reduce((acc, curr) => {
    if (curr.status === 'PAID') {
      if (curr.type === 'INCOME') acc.income += curr.amount;
      else acc.expense += curr.amount;
    } else if (curr.status === 'PENDING') acc.payable += curr.amount;
    return acc;
  }, { income: 0, expense: 0, payable: 0 });

  const balance = totals.income - totals.expense;
  const projectedBalance = balance - totals.payable;

  // Formatação
  const fmtCurrency = (v: number) => 
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const fmtDate = (d: string) => 
    new Date(d).toLocaleDateString('pt-BR');

  // Agrupar por categoria
  const byCategory = filteredTransactions.reduce((acc, t) => {
    const cat = t.category || 'OUTROS';
    if (!acc[cat]) acc[cat] = { income: 0, expense: 0, count: 0 };
    if (t.type === 'INCOME') acc[cat].income += t.amount;
    else acc[cat].expense += t.amount;
    acc[cat].count += 1;
    return acc;
  }, {} as Record<string, { income: number; expense: number; count: number }>);

  // Agrupar por mês
  const byMonth = filteredTransactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = { income: 0, expense: 0, count: 0 };
    if (t.type === 'INCOME') acc[month].income += t.amount;
    else acc[month].expense += t.amount;
    acc[month].count += 1;
    return acc;
  }, {} as Record<string, { income: number; expense: number; count: number }>);

  // ── Geração do HTML para impressão ──────────────────────────────────────
  const handlePrint = () => {
    const field = (label: string, value?: string | null) => value ? `
      <div style="margin-bottom:8px">
        <div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px">${label}</div>
        <div style="font-size:11px;color:#1e293b;font-weight:500;line-height:1.3">${value}</div>
      </div>` : '';

    const section = (title: string) => `
      <div style="border-bottom:2px solid #1d4ed8;margin-bottom:10px;padding-bottom:3px">
        <span style="font-size:10px;font-weight:800;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.12em">${title}</span>
      </div>`;

    const tableRow = (cells: string[], isHeader = false) => `
      <tr>
        ${cells.map((cell, i) => `
          <td style="padding:6px 8px;border:1px solid #e2e8f0;font-size:${isHeader ? '9px' : '10px'};font-weight:${isHeader ? '700' : '400'};text-align:${i === cells.length - 1 ? 'right' : 'left'};color:${isHeader ? '#1d4ed8' : '#1e293b'};background:${isHeader ? '#f8fafc' : 'white'}">
            ${cell}
          </td>
        `).join('')}
      </tr>`;

    // Tabela de transações detalhadas
    const transactionsTable = filteredTransactions.length > 0 ? `
      <div style="margin-top:16px">
        ${section('Transações Detalhadas')}
        <table style="width:100%;border-collapse:collapse;font-size:10px;margin-top:8px">
          <thead>
            ${tableRow(['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Status'], true)}
          </thead>
          <tbody>
            ${filteredTransactions.map(t => `
              ${tableRow([
                fmtDate(t.date),
                t.description || '—',
                t.category || 'OUTROS',
                t.type === 'INCOME' ? 'Receita' : 'Despesa',
                fmtCurrency(t.amount),
                t.status === 'PAID' ? 'Liquidado' : 'Em Aberto'
              ])}
            `).join('')}
          </tbody>
        </table>
      </div>` : '';

    // Tabela resumo por categoria
    const categoryTable = Object.keys(byCategory).length > 0 ? `
      <div style="margin-top:16px">
        ${section('Resumo por Categoria')}
        <table style="width:100%;border-collapse:collapse;font-size:10px;margin-top:8px">
          <thead>
            ${tableRow(['Categoria', 'Receitas', 'Despesas', 'Saldo', 'Qtd'], true)}
          </thead>
          <tbody>
            ${Object.entries(byCategory).map(([cat, data]) => `
              ${tableRow([
                cat,
                data.income > 0 ? fmtCurrency(data.income) : '—',
                data.expense > 0 ? fmtCurrency(data.expense) : '—',
                fmtCurrency(data.income - data.expense),
                String(data.count)
              ])}
            `).join('')}
          </tbody>
        </table>
      </div>` : '';

    // Tabela resumo mensal
    const monthlyTable = Object.keys(byMonth).length > 0 ? `
      <div style="margin-top:16px">
        ${section('Resumo Mensal')}
        <table style="width:100%;border-collapse:collapse;font-size:10px;margin-top:8px">
          <thead>
            ${tableRow(['Mês', 'Receitas', 'Despesas', 'Saldo', 'Qtd'], true)}
          </thead>
          <tbody>
            ${Object.entries(byMonth).map(([month, data]) => `
              ${tableRow([
                month,
                data.income > 0 ? fmtCurrency(data.income) : '—',
                data.expense > 0 ? fmtCurrency(data.expense) : '—',
                fmtCurrency(data.income - data.expense),
                String(data.count)
              ])}
            `).join('')}
          </tbody>
        </table>
      </div>` : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Relatório Financeiro — ${fmtDate(startDate)} a ${fmtDate(endDate)}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { width: 100%; height: 100%; background: white; font-family: 'Segoe UI', Arial, sans-serif; }
          @media print { html, body { height: 100%; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          .positive { color: #15803d; }
          .negative { color: #b91c1c; }
          .neutral { color: #1e293b; }
        </style>
      </head>
      <body>
        <div style="width:100%;min-height:100vh;background:white;padding:20px;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif">

          <!-- Cabeçalho -->
          <div style="text-align:center;border-bottom:2px solid #0f172a;padding-bottom:16px;margin-bottom:20px">
            <div style="font-size:24px;font-weight:800;color:#0f172a;margin-bottom:8px">RELATÓRIO FINANCEIRO</div>
            <div style="font-size:14px;color:#475569;margin-bottom:4px">Período: ${fmtDate(startDate)} a ${fmtDate(endDate)}</div>
            <div style="font-size:12px;color:#94a3b8">ADJPA · Sistema de Gestão Ministerial</div>
            <div style="font-size:10px;color:#94a3b8;margin-top:4px">Emitido em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</div>
          </div>

          <!-- Resumo Financeiro -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:20px">
            <div style="padding:12px;background:#dcfce7;border:1px solid #bbf7d0;border-radius:8px;text-align:center">
              <div style="font-size:12px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Receitas</div>
              <div style="font-size:18px;font-weight:800;color:#15803d">${fmtCurrency(totals.income)}</div>
            </div>
            <div style="padding:12px;background:#fee2e2;border:1px solid #fecaca;border-radius:8px;text-align:center">
              <div style="font-size:12px;font-weight:700;color:#b91c1c;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Despesas</div>
              <div style="font-size:18px;font-weight:800;color:#b91c1c">${fmtCurrency(totals.expense)}</div>
            </div>
            <div style="padding:12px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;text-align:center">
              <div style="font-size:12px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Saldo Líquido</div>
              <div style="font-size:18px;font-weight:800;color:${balance >= 0 ? '#15803d' : '#b91c1c'}">${fmtCurrency(balance)}</div>
            </div>
          </div>

          <!-- Informações Adicionais -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
            <div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px">
              <div style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">Resumo Operacional</div>
              ${field('Total de Transações', String(filteredTransactions.length))}
              ${field('Contas a Pagar', fmtCurrency(totals.payable))}
              ${field('Saldo Projetado', fmtCurrency(projectedBalance))}
              ${field('Média por Transação', fmtCurrency(filteredTransactions.length > 0 ? (totals.income + totals.expense) / filteredTransactions.length : 0))}
            </div>
            <div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px">
              <div style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">Estatísticas</div>
              ${field('Total de Categorias', String(Object.keys(byCategory).length))}
              ${field('Meses no Período', String(Object.keys(byMonth).length))}
              ${field('Maior Receita', totals.income > 0 ? fmtCurrency(Math.max(...filteredTransactions.filter(t => t.type === 'INCOME').map(t => t.amount))) : '—')}
              ${field('Maior Despesa', totals.expense > 0 ? fmtCurrency(Math.max(...filteredTransactions.filter(t => t.type === 'EXPENSE').map(t => t.amount))) : '—')}
            </div>
          </div>

          <!-- Tabelas -->
          ${categoryTable}
          ${monthlyTable}
          ${transactionsTable}

          <!-- Rodapé -->
          <div style="border-top:1px solid #e2e8f0;margin-top:30px;padding-top:16px;text-align:center">
            <div style="font-size:10px;color:#94a3b8;margin-bottom:8px">
              Este relatório foi gerado automaticamente pelo ADJPA ERP Sistema de Gestão Ministerial
            </div>
            <div style="font-size:9px;color:#cbd5e1">
              Período de análise: ${fmtDate(startDate)} a ${fmtDate(endDate)} | 
              Total de registros: ${filteredTransactions.length} transações
            </div>
          </div>

        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>`;

    const win = window.open('', '_blank', 'width=1000,height=800');
    if (!win) { alert('Permita pop-ups para imprimir.'); return; }
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Relatório Financeiro</h3>
              <p className="text-[10px] text-slate-400">
                {filteredTransactions.length} transações · Período personalizado · A4 Retrato
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={22} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <div className="space-y-6">
            {/* Seleção de Período */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-600" />
                Período do Relatório
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">Data Inicial</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">Data Final</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Receitas</div>
                    <div className="text-xl font-black text-emerald-700">{fmtCurrency(totals.income)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-rose-600 text-white rounded-xl">
                    <TrendingDown size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-rose-700 uppercase tracking-wider">Despesas</div>
                    <div className="text-xl font-black text-rose-700">{fmtCurrency(totals.expense)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-600 text-white rounded-xl">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-blue-700 uppercase tracking-wider">Saldo</div>
                    <div className={`text-xl font-black ${balance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {fmtCurrency(balance)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h4 className="text-sm font-black text-slate-900 mb-4">Estatísticas do Período</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Total Transações</div>
                  <div className="text-lg font-black text-slate-900">{filteredTransactions.length}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Contas a Pagar</div>
                  <div className="text-lg font-black text-amber-600">{fmtCurrency(totals.payable)}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Categorias</div>
                  <div className="text-lg font-black text-slate-900">{Object.keys(byCategory).length}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Média/Transação</div>
                  <div className="text-lg font-black text-slate-900">
                    {fmtCurrency(filteredTransactions.length > 0 ? (totals.income + totals.expense) / filteredTransactions.length : 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Categorias */}
            {Object.keys(byCategory).length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h4 className="text-sm font-black text-slate-900 mb-4">Top Categorias</h4>
                <div className="space-y-2">
                  {Object.entries(byCategory)
                    .sort(([,a], [,b]) => (b.income + b.expense) - (a.income + a.expense))
                    .slice(0, 5)
                    .map(([cat, data]) => (
                      <div key={cat} className="flex justify-between items-center py-2 border-b border-slate-50">
                        <div>
                          <div className="text-sm font-bold text-slate-900">{cat}</div>
                          <div className="text-[10px] text-slate-400">{data.count} transações</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900">
                            {fmtCurrency(data.income + data.expense)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {data.income > 0 && `+${fmtCurrency(data.income)}`}
                            {data.expense > 0 && ` -${fmtCurrency(data.expense)}`}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-white shrink-0 flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-600 font-black text-xs uppercase hover:bg-slate-50">
            Cancelar
          </button>
          <button onClick={handlePrint} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-indigo-700 flex items-center justify-center gap-2">
            <Printer size={18} /> Imprimir Relatório
          </button>
        </div>
      </div>
    </div>
  );
};
