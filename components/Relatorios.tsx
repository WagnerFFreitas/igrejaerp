/**
 * ============================================================================
 * RELATORIOS.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para relatorios.
 *
 * ONDE É USADO?
 * -------------
 * Usado na interface React como parte do frontend.
 *
 * COMO FUNCIONA?
 * --------------
 * Controla a apresentação e interações da interface com o usuário.
 */


import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, DollarSign, Users, Briefcase, Share2, CheckCircle2, Loader2, FileJson, Printer, Calculator, TrendingUp, FileText } from 'lucide-react';
import { Transaction, Member, SocialChargesReport, Payroll } from '../types';

interface RelatoriosProps {
  transactions: Transaction[];
  members: Member[];
  employees?: Payroll[];
}

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (relatorios).
 */

export const Relatorios: React.FC<RelatoriosProps> = ({ transactions, members, employees = [] }) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  const handleExport = async (type: string, format: string, data: any) => {
    setIsExporting(`${type}_${format}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `EXPORT_${type}_${new Date().getTime()}.${format.toLowerCase()}`);
    dl.click();
    setIsExporting(null);
  };

  const handlePrint = () => {
    const fmtCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const fmtDate = (d: string) => new Date(d).toLocaleDateString('pt-BR');

    // Calcular totais
    const totals = transactions.reduce((acc, curr) => {
      if (curr.status === 'PAID') {
        if (curr.type === 'INCOME') acc.income += curr.amount;
        else acc.expense += curr.amount;
      } else if (curr.status === 'PENDING') acc.payable += curr.amount;
      return acc;
    }, { income: 0, expense: 0, payable: 0 });

    const balance = totals.income - totals.expense;

    // Agrupar por categoria
    const byCategory = transactions.reduce((acc, t) => {
      const cat = t.category || 'OUTROS';
      if (!acc[cat]) acc[cat] = { income: 0, expense: 0, count: 0 };
      if (t.type === 'INCOME') acc[cat].income += t.amount;
      else acc[cat].expense += t.amount;
      acc[cat].count += 1;
      return acc;
    }, {} as Record<string, { income: number; expense: number; count: number }>);

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

    // Gerar HTML do relatório
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Relatório Financeiro - ADJPA ERP</title>
        <style>
          @page { size: A4 portrait; margin: 8mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { width: 100%; background: white; font-family: 'Segoe UI', Arial, sans-serif; }
          @media print { html, body { width: 100%; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .positive { color: #15803d; }
          .negative { color: #b91c1c; }
          .neutral { color: #1e293b; }
        </style>
      </head>
      <body>
        <div style="width:100%;background:white;padding:8px;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif;font-size:7px">

          <!-- Cabeçalho -->
          <div style="text-align:center;border-bottom:1px solid #0f172a;padding-bottom:6px;margin-bottom:8px">
            <div style="font-size:16px;font-weight:800;color:#0f172a;margin-bottom:3px">RELATÓRIO FINANCEIRO</div>
            <div style="font-size:9px;color:#475569;margin-bottom:2px">ADJPA · Sistema de Gestão Ministerial</div>
            <div style="font-size:8px;color:#94a3b8">Emitido em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</div>
          </div>

          <!-- Resumo Financeiro -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px">
            <div style="padding:6px;background:#dcfce7;border:1px solid #bbf7d0;border-radius:4px;text-align:center">
              <div style="font-size:7px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:1px">Receitas</div>
              <div style="font-size:12px;font-weight:800;color:#15803d">${fmtCurrency(totals.income)}</div>
            </div>
            <div style="padding:6px;background:#fee2e2;border:1px solid #fecaca;border-radius:4px;text-align:center">
              <div style="font-size:7px;font-weight:700;color:#b91c1c;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:1px">Despesas</div>
              <div style="font-size:12px;font-weight:800;color:#b91c1c">${fmtCurrency(totals.expense)}</div>
            </div>
            <div style="padding:6px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:4px;text-align:center">
              <div style="font-size:7px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:1px">Saldo Líquido</div>
              <div style="font-size:12px;font-weight:800;color:${balance >= 0 ? '#15803d' : '#b91c1c'}">${fmtCurrency(balance)}</div>
            </div>
          </div>

          <!-- Informações Adicionais -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
            <div style="padding:6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px">
              ${section('Resumo Operacional')}
              ${field('Total de Transações', String(transactions.length))}
              ${field('Contas a Pagar', fmtCurrency(totals.payable))}
              ${field('Saldo Projetado', fmtCurrency(balance - totals.payable))}
              ${field('Média por Transação', transactions.length > 0 ? fmtCurrency((totals.income + totals.expense) / transactions.length) : 'R$ 0,00')}
            </div>
            <div style="padding:6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px">
              ${section('Estatísticas')}
              ${field('Total de Categorias', String(Object.keys(byCategory).length))}
              ${field('Maior Receita', totals.income > 0 ? fmtCurrency(Math.max(...transactions.filter(t => t.type === 'INCOME').map(t => t.amount))) : '—')}
              ${field('Maior Despesa', totals.expense > 0 ? fmtCurrency(Math.max(...transactions.filter(t => t.type === 'EXPENSE').map(t => t.amount))) : '—')}
            </div>
          </div>

          <!-- Tabela de Transações -->
          <div style="margin-top:6px">
            ${section('Transações Detalhadas')}
            <table style="width:100%;border-collapse:collapse;font-size:7px;margin-top:3px">
              <thead>
                ${tableRow(['Data', 'Descrição', 'Cat', 'Tipo', 'Valor', 'Status'], true)}
              </thead>
              <tbody>
                ${transactions.slice(0, 12).map(t => `
                  ${tableRow([
                    fmtDate(t.date),
                    (t.description || '—').substring(0, 25) + (t.description && t.description.length > 25 ? '...' : ''),
                    (t.category || 'OUTROS').substring(0, 8),
                    t.type === 'INCOME' ? 'R' : 'D',
                    fmtCurrency(t.amount),
                    t.status === 'PAID' ? 'L' : 'A'
                  ])}
                `).join('')}
              </tbody>
            </table>
            ${transactions.length > 12 ? `<div style="font-size:7px;color:#64748b;margin-top:3px;text-align:center">... e mais ${transactions.length - 12} transações</div>` : ''}
          </div>

          <!-- Tabela Resumo por Categoria -->
          ${Object.keys(byCategory).length > 0 ? `
          <div style="margin-top:6px">
            ${section('Resumo por Categoria')}
            <table style="width:100%;border-collapse:collapse;font-size:7px;margin-top:3px">
              <thead>
                ${tableRow(['Categoria', 'Receitas', 'Despesas', 'Saldo', 'Qtd'], true)}
              </thead>
              <tbody>
                ${Object.entries(byCategory).map(([cat, data]) => `
                  ${tableRow([
                    cat.substring(0, 10),
                    data.income > 0 ? fmtCurrency(data.income) : '—',
                    data.expense > 0 ? fmtCurrency(data.expense) : '—',
                    fmtCurrency(data.income - data.expense),
                    String(data.count)
                  ])}
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          <!-- Rodapé -->
          <div style="border-top:1px solid #e2e8f0;margin-top:8px;padding-top:6px;text-align:center">
            <div style="font-size:7px;color:#94a3b8;margin-bottom:3px">
              Este relatório foi gerado automaticamente pelo ADJPA ERP Sistema de Gestão Ministerial
            </div>
            <div style="font-size:6px;color:#cbd5e1">
              Total de registros: ${transactions.length} transações
            </div>
          </div>

        </div>
      </body>
      </html>`;

    // Abrir nova janela para impressão
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) { 
      alert('Permita pop-ups para imprimir.'); 
      return; 
    }

    // Escrever o conteúdo e garantir que seja carregado antes de imprimir
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Aguardar o conteúdo carregar completamente
    printWindow.onload = function() {
      setTimeout(function() {
        printWindow.focus();
        printWindow.print();
      }, 500);
    };
  };

  // Funções específicas para cada tipo de relatório
  const generateMonthlyBalance = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
    
    const income = monthlyTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const expense = monthlyTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      title: 'Balancete Mensal',
      period: currentMonth,
      income,
      expense,
      balance: income - expense,
      transactions: monthlyTransactions,
      totalTransactions: monthlyTransactions.length
    };
  };

  const generateTithingReport = () => {
    const tithingTransactions = transactions.filter(t => 
      t.category === 'Dizimo' || t.category.includes('Dizimo')
    );
    
    const monthlyTithing = tithingTransactions.reduce((acc, t) => {
      const month = t.date.slice(0, 7);
      if (!acc[month]) acc[month] = { amount: 0, count: 0 };
      acc[month].amount += t.amount;
      acc[month].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    return {
      title: 'Relatório de Dízimos',
      totalTithing: tithingTransactions.reduce((sum, t) => sum + t.amount, 0),
      totalDonors: tithingTransactions.length,
      monthlyBreakdown: monthlyTithing,
      transactions: tithingTransactions
    };
  };

  const generateTalentBoard = () => {
    const activeMembers = members.filter(m => m.status === 'ACTIVE');
    const memberSkills = activeMembers.map(m => ({
      name: m.name,
      skills: m.mainMinistry || 'Não definido',
      position: m.ecclesiasticalPosition || 'Membro',
      memberSince: m.membershipDate
    }));

    return {
      title: 'Quadro de Talentos',
      totalMembers: activeMembers.length,
      skillsDistribution: memberSkills.reduce((acc, m) => {
        const skill = m.skills;
        if (!acc[skill]) acc[skill] = 0;
        acc[skill] += 1;
        return acc;
      }, {} as Record<string, number>),
      members: memberSkills
    };
  };

  const generatePerformanceReport = () => {
    const activeEmployees = employees.filter(e => !e.data_demissao);
    
    return {
      title: 'Avaliação de Desempenho',
      totalEmployees: activeEmployees.length,
      averageSalary: activeEmployees.reduce((sum, e) => sum + (e.salario_base || 0), 0) / activeEmployees.length,
      employees: activeEmployees.map(e => ({
        name: e.nome,
        position: e.cargo,
        salary: e.salario_base || 0,
        admission: e.data_admissao
      }))
    };
  };

  const generateSalaryHistory = () => {
    const salaryData = employees.map(e => ({
      name: e.nome,
      currentSalary: e.salario_base || 0,
      position: e.cargo,
      admission: e.data_admissao,
      department: e.departamento
    }));

    return {
      title: 'Histórico Salarial',
      totalPayroll: salaryData.reduce((sum, e) => sum + e.currentSalary, 0),
      averageSalary: salaryData.reduce((sum, e) => sum + e.currentSalary, 0) / salaryData.length,
      employees: salaryData
    };
  };

  const generateMemberMonthlyBalance = () => {
    const memberContributions = transactions.filter(t => 
      t.memberId || t.category.includes('Membro') || t.category.includes('Contribuição')
    );
    
    return {
      title: 'Balancete Mensal de Membros',
      totalContributions: memberContributions.reduce((sum, t) => sum + t.amount, 0),
      contributorsCount: memberContributions.length,
      transactions: memberContributions
    };
  };

  const generateMemberTithingReport = () => {
    const memberTithing = transactions.filter(t => 
      (t.memberId || t.category.includes('Membro')) && 
      (t.category === 'Dizimo' || t.category.includes('Dizimo'))
    );

    return {
      title: 'Dízimos por Período - Membros',
      totalTithing: memberTithing.reduce((sum, t) => sum + t.amount, 0),
      totalMembers: memberTithing.length,
      transactions: memberTithing
    };
  };

  // Função para exportar relatórios específicos
  const exportReport = (reportType: string) => {
    let reportData: any;
    
    switch(reportType) {
      case 'BALANCETE_MENSAL':
        reportData = generateMonthlyBalance();
        break;
      case 'DIZIMOS_PERIODO':
        reportData = generateTithingReport();
        break;
      case 'QUADRO_TALENTOS':
        reportData = generateTalentBoard();
        break;
      case 'AVALIACAO_DESEMPENHO':
        reportData = generatePerformanceReport();
        break;
      case 'HISTORICO_SALARIAL':
        reportData = generateSalaryHistory();
        break;
      case 'BALANCETE_MEMBROS':
        reportData = generateMemberMonthlyBalance();
        break;
      case 'DIZIMOS_MEMBROS':
        reportData = generateMemberTithingReport();
        break;
      default:
        return;
    }

    // Exportar como JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `${reportType}_${new Date().getTime()}.json`);
    dl.click();
  };
  const generateSocialChargesReport = (): SocialChargesReport => {
    const activeEmployees = employees.filter(emp => emp.data_demissao ? false : true);
    
    // Valores simulados - em produção viriam do cálculo real da folha
    const grossSalaryTotal = activeEmployees.reduce((sum, emp) => sum + (emp.salario_base || 0), 0);
    const totalEmployees = activeEmployees.length;
    
    // Cálculos de encargos (valores padrão)
    const fgtsBase = grossSalaryTotal;
    const fgtsRate = 0.08;
    const fgtsValue = fgtsBase * fgtsRate;
    
    const inssEmployerBase = grossSalaryTotal;
    const inssEmployerRate = 0.20; // 20% para empregador
    const inssEmployerValue = inssEmployerBase * inssEmployerRate;
    
    const ratBase = grossSalaryTotal;
    const ratRate = 0.01; // 1% RAT médio
    const ratValue = ratBase * ratRate;
    
    const thirdPartiesBase = grossSalaryTotal;
    const thirdPartiesRate = 0.055; // 5.5% terceiros
    const thirdPartiesValue = thirdPartiesBase * thirdPartiesRate;
    
    const totalEmployerCharges = fgtsValue + inssEmployerValue + ratValue + thirdPartiesValue;
    
    // Cálculos INSS empregado
    const inssEmployeeBase = grossSalaryTotal;
    const inssEmployeeRate = 0.075; // 7.5% médio
    const inssEmployeeValue = inssEmployeeBase * inssEmployeeRate;
    
    // Cálculos IRRF
    const irrfBase = grossSalaryTotal - inssEmployeeValue;
    const irrfRate = 0.15; // 15% médio
    const irrfValue = Math.max(0, irrfBase * irrfRate - 354.80 * totalEmployees);
    
    const totalDeductions = inssEmployeeValue + irrfValue;
    const totalNetSalary = grossSalaryTotal - totalDeductions;
    const totalEmployerCost = grossSalaryTotal + totalEmployerCharges;
    const averageEmployerCost = totalEmployerCost / totalEmployees;
    const employerCostPercentage = (totalEmployerCharges / grossSalaryTotal) * 100;
    
    // Detalhes por funcionário
    const employeeDetails = activeEmployees.map(emp => {
      const empGrossSalary = emp.salario_base || 0;
      const empInssValue = empGrossSalary * inssEmployeeRate;
      const empIrrfBase = empGrossSalary - empInssValue;
      const empIrrfValue = Math.max(0, empIrrfBase * irrfRate - 354.80);
      const empNetSalary = empGrossSalary - empInssValue - empIrrfValue;
      const empFgtsValue = empGrossSalary * fgtsRate;
      const empEmployerCost = empGrossSalary + (empGrossSalary * (inssEmployerRate + ratRate + thirdPartiesRate + fgtsRate));
      
      return {
        employeeId: emp.id,
        employeeName: emp.employeeName || 'Não informado',
        employeeCpf: emp.cpf || 'Não informado',
        grossSalary: empGrossSalary,
        netSalary: empNetSalary,
        employerCost: empEmployerCost,
        inssValue: empInssValue,
        irrfValue: empIrrfValue,
        fgtsValue: empFgtsValue
      };
    });
    
    return {
      competencyMonth: selectedMonth,
      totalEmployees,
      grossSalaryTotal,
      employerCharges: {
        fgts: { base: fgtsBase, rate: fgtsRate, value: fgtsValue },
        inssEmployer: { base: inssEmployerBase, rate: inssEmployerRate, value: inssEmployerValue },
        rat: { base: ratBase, rate: ratRate, value: ratValue },
        thirdParties: { base: thirdPartiesBase, rate: thirdPartiesRate, value: thirdPartiesValue },
        totalEmployerCharges
      },
      employeeDeductions: {
        inss: { base: inssEmployeeBase, rate: inssEmployeeRate, value: inssEmployeeValue },
        irrf: { base: irrfBase, rate: irrfRate, value: irrfValue },
        totalDeductions
      },
      financialSummary: {
        totalGrossSalary: grossSalaryTotal,
        totalNetSalary,
        totalEmployerCost,
        averageEmployerCost,
        employerCostPercentage
      },
      employeeDetails
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic font-serif">Relatórios & Exportação</h1>
          <p className="text-slate-500 font-medium">Extração de dados para contabilidade e gestão estratégica ADJPA.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 py-3 px-6 bg-slate-100 text-slate-700 rounded-2xl font-black uppercase text-xs shadow-sm transition-all hover:bg-slate-200 active:scale-95"
        >
          <Printer size={16} /> Imprimir
        </button>
      </div>

      <div className="bg-indigo-600 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden">
        <div className="bg-slate-900 rounded-[2.3rem] p-8 md:p-10 flex flex-col lg:flex-row gap-10 items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-lg"><Share2 size={24} /></div>
              <h2 className="text-2xl font-black text-white">Integração Contábil (Fiscal)</h2>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed max-w-md">Exporte balancetes e dados da folha em formatos compatíveis com os principais softwares contábeis.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => handleExport('FINANCEIRO', 'CSV', transactions)} className="flex items-center gap-2 py-4 px-8 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs shadow-xl transition-all hover:scale-105 active:scale-95">{isExporting?.includes('FINANCEIRO') ? <Loader2 size={16} className="animate-spin"/> : <FileSpreadsheet size={16}/>} Financeiro CSV</button>
             <button onClick={() => handleExport('FOLHA', 'JSON', members)} className="flex items-center gap-2 py-4 px-8 bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs shadow-xl transition-all hover:scale-105 active:scale-95">{isExporting?.includes('FOLHA') ? <Loader2 size={16} className="animate-spin"/> : <FileJson size={16}/>} Folha/DP JSON</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Financeiro', 'Recursos Humanos', 'Membros'].map((cat, i) => (
          <div key={i} className="bg-white rounded-[2.2rem] border border-slate-100 p-8 shadow-sm group hover:shadow-md transition-shadow">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-4 mb-6 flex justify-between items-center">{cat} <BarChart3 size={14} className="text-slate-300"/></h3>
            <div className="space-y-2">
               {cat === 'Recursos Humanos' ? (
                 <>
                   <button 
                     onClick={() => handleExport('ENCARGOS_SOCIAIS', 'JSON', generateSocialChargesReport())} 
                     className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all"
                   >
                     <span className="flex items-center gap-2">
                       <Calculator size={14} className="text-indigo-600" />
                       Encargos Sociais
                     </span>
                     <Download size={14} className="text-slate-300 group-hover:text-indigo-600"/>
                   </button>
                   <button 
                     onClick={() => exportReport('AVALIACAO_DESEMPENHO')}
                     className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all"
                   >
                     <span className="flex items-center gap-2">
                       <TrendingUp size={14} className="text-indigo-600" />
                       Avaliação de Desempenho
                     </span>
                     <Download size={14} className="text-slate-300 group-hover:text-indigo-600"/>
                   </button>
                   <button 
                     onClick={() => exportReport('HISTORICO_SALARIAL')}
                     className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all"
                   >
                     <span className="flex items-center gap-2">
                       <FileText size={14} className="text-indigo-600" />
                       Histórico Salarial
                     </span>
                     <Download size={14} className="text-slate-300 group-hover:text-indigo-600"/>
                   </button>
                 </>
               ) : (
                 <div className="space-y-2">
                   {cat === 'Financeiro' && (
                     <>
                       <button 
                         onClick={() => exportReport('BALANCETE_MENSAL')}
                         className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all"
                       >
                         <span className="flex items-center gap-2">
                           <FileText size={14} className="text-indigo-600" />
                           Balancete Mensal
                         </span>
                         <Download size={14} className="text-slate-300 group-hover:text-indigo-600"/>
                       </button>
                       <button 
                         onClick={() => exportReport('DIZIMOS_PERIODO')}
                         className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all"
                       >
                         <span className="flex items-center gap-2">
                           <FileText size={14} className="text-indigo-600" />
                           Dízimos por Período
                         </span>
                         <Download size={14} className="text-slate-300 group-hover:text-indigo-600"/>
                       </button>
                       <button 
                         onClick={() => exportReport('QUADRO_TALENTOS')}
                         className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all"
                       >
                         <span className="flex items-center gap-2">
                           <FileText size={14} className="text-indigo-600" />
                           Quadro de Talentos
                         </span>
                         <Download size={14} className="text-slate-300 group-hover:text-indigo-600"/>
                       </button>
                     </>
                   )}
                   {cat === 'Membros' && (
                     <>
                       <button 
                         onClick={() => exportReport('BALANCETE_MEMBROS')}
                         className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all"
                       >
                         <span className="flex items-center gap-2">
                           <FileText size={14} className="text-indigo-600" />
                           Balancete Mensal
                         </span>
                         <Download size={14} className="text-slate-300 group-hover:text-indigo-600"/>
                       </button>
                       <button 
                         onClick={() => exportReport('DIZIMOS_MEMBROS')}
                         className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all"
                       >
                         <span className="flex items-center gap-2">
                           <FileText size={14} className="text-indigo-600" />
                           Dízimos por Período
                         </span>
                         <Download size={14} className="text-slate-300 group-hover:text-indigo-600"/>
                       </button>
                     </>
                   )}
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Seção de Relatório de Encargos Sociais */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden">
        <div className="bg-white rounded-[2.3rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600">
                <Calculator size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Relatório de Encargos Sociais</h2>
                <p className="text-slate-600 font-medium">Consolidado mensal de INSS, FGTS e IRRF</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mês de Competência</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <button
                onClick={() => handleExport('ENCARGOS_SOCIAIS', 'JSON', generateSocialChargesReport())}
                disabled={isExporting?.includes('ENCARGOS_SOCIAIS')}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting?.includes('ENCARGOS_SOCIAIS') ? <Loader2 size={16} className="animate-spin"/> : <Download size={16}/>}
                Gerar Relatório
              </button>
            </div>
          </div>

          {/* Preview do Relatório */}
          {employees && employees.length > 0 && (
            <div className="mt-8 border-t border-slate-100 pt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" />
                Prévia do Relatório - {new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Resumo Financeiro */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-[0.1em]">Resumo Financeiro</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total Funcionários</span>
                      <span className="text-sm font-bold text-slate-900">{employees.filter(e => !e.data_demissao).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Salários Brutos</span>
                      <span className="text-sm font-bold text-slate-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                          employees.filter(e => !e.data_demissao).reduce((sum, e) => sum + (e.salario_base || 0), 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Encargos Empregador</span>
                      <span className="text-sm font-bold text-indigo-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                          employees.filter(e => !e.data_demissao).reduce((sum, e) => sum + ((e.salario_base || 0) * 0.345), 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Custo Total</span>
                      <span className="text-sm font-bold text-emerald-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                          employees.filter(e => !e.data_demissao).reduce((sum, e) => sum + ((e.salario_base || 0) * 1.345), 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detalhes dos Encargos */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-[0.1em]">Detalhes dos Encargos</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">FGTS (8%)</span>
                      <span className="text-sm font-bold text-slate-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                          employees.filter(e => !e.data_demissao).reduce((sum, e) => sum + ((e.salario_base || 0) * 0.08), 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">INSS Empregador (20%)</span>
                      <span className="text-sm font-bold text-slate-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                          employees.filter(e => !e.data_demissao).reduce((sum, e) => sum + ((e.salario_base || 0) * 0.20), 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">RAT (1%)</span>
                      <span className="text-sm font-bold text-slate-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                          employees.filter(e => !e.data_demissao).reduce((sum, e) => sum + ((e.salario_base || 0) * 0.01), 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Terceiros (5.5%)</span>
                      <span className="text-sm font-bold text-slate-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                          employees.filter(e => !e.data_demissao).reduce((sum, e) => sum + ((e.salario_base || 0) * 0.055), 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
