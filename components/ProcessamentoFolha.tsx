/**
 * ============================================================================
 * PROCESSAMENTOFOLHA.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para processamento folha.
 *
 * ONDE É USADO?
 * -------------
 * Usado na interface React como parte do frontend.
 *
 * COMO FUNCIONA?
 * --------------
 * Controla a apresentação e interações da interface com o usuário.
 */


import React, { useState, useEffect } from 'react';
import { Calculator, Printer, Check, Edit3, DollarSign, ArrowDownRight, ArrowUpRight, Save, Loader2, RefreshCw, FileText, TrendingUp, Shield, Calendar, Lock, Unlock, AlertCircle, Download, Filter, Eye, X, Search } from 'lucide-react';
import { dbService } from '../services/databaseService';
import { exportService } from '../services/exportService';
import { Payroll, PayrollInput, TaxConfig, PayrollPeriod } from '../types';
import { payrollService } from '../services/payrollService';
import IndexedDBService from '../src/services/indexedDBService';
import { DEFAULT_TAX_CONFIG } from '../constants';
import { jsPDF } from 'jspdf';
import AuthService from '../src/services/authService';

interface ProcessamentoFolhaProps {
  employees: Payroll[];
  setEmployees: React.Dispatch<React.SetStateAction<Payroll[]>>;
  currentUnitId: string;
  user?: any;
}

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (processamento folha).
 */

export const ProcessamentoFolha: React.FC<ProcessamentoFolhaProps> = ({ employees, setEmployees, currentUnitId, user }) => {
  const canWritePayroll = AuthService.hasPermission(user, 'payroll', 'write');
  const canManagePayroll = AuthService.hasPermission(user, 'payroll', 'manage');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Payroll | null>(null);
  const [taxConfig, setTaxConfig] = useState<TaxConfig>(DEFAULT_TAX_CONFIG);
  
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [pendingAction, setPendingAction] = useState<'PDF' | 'PROCESS' | 'ANALYTICAL' | 'SUMMARY' | 'ENCARGOS' | null>(null);
  
  // Estados para controle de período
  const [currentPeriod, setCurrentPeriod] = useState<PayrollPeriod | null>(null);
  const [periodHistory, setPeriodHistory] = useState<PayrollPeriod[]>([]);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  
  // Estados para filtros e relatórios
  const [reportType, setReportType] = useState<'analytical' | 'summary' | 'encargos'>('analytical');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterSalaryRange, setFilterSalaryRange] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getResolvedTaxConfig = () => {
    const source: any = taxConfig || DEFAULT_TAX_CONFIG || {};

    return {
      inssBrackets: Array.isArray(source.inssBrackets)
        ? source.inssBrackets
        : Array.isArray(source.inss)
          ? source.inss
          : DEFAULT_TAX_CONFIG.inssBrackets,
      irrfBrackets: Array.isArray(source.irrfBrackets)
        ? source.irrfBrackets
        : Array.isArray(source.irrf)
          ? source.irrf
          : DEFAULT_TAX_CONFIG.irrfBrackets,
      fgtsRate: source.fgtsRate ?? source.fgts?.rate ?? DEFAULT_TAX_CONFIG.fgtsRate,
      patronalRate: source.patronalRate ?? source.patronal?.rate ?? DEFAULT_TAX_CONFIG.patronalRate,
      ratRate: source.ratRate ?? DEFAULT_TAX_CONFIG.ratRate,
      terceirosRate: source.terceirosRate ?? DEFAULT_TAX_CONFIG.terceirosRate
    };
  };

  const formatMatricula = (m: string) => {
    if (!m) return '-';
    if (/^F\d{2,}\/\d{4}$/.test(m)) return m;
    const match = m.match(/^F(\d+)$/);
    if (match) {
      const num = parseInt(match[1]).toString().padStart(2, '0');
      return `F${num}/${new Date().getFullYear()}`;
    }
    return m;
  };

  // Carregar configurações fiscais e períodos
  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar configurações fiscais
        const savedConfig = await IndexedDBService.get('system_config', 'tax_config');
        if (savedConfig) {
          setTaxConfig(savedConfig);
        }
        
        // Carregar dados dos funcionários
        const latestEmployees = await dbService.getEmployees(currentUnitId);
        setEmployees(latestEmployees);
        
        // Carregar períodos
        const periods = await IndexedDBService.get('payroll_periods', 'all') || [];
        setPeriodHistory(periods);
        
        // Verificar período atual
        const currentDate = new Date();
        const currentMonthYear = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        const existingPeriod = periods.find((p: PayrollPeriod) => 
          p.year === currentDate.getFullYear() && p.month === currentDate.getMonth() + 1 && p.unitId === currentUnitId
        );
        
        if (existingPeriod) {
          setCurrentPeriod(existingPeriod);
        } else {
          // Criar novo período aberto
          const newPeriod: PayrollPeriod = {
            id: `period-${currentMonthYear}-${currentUnitId}`,
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear(),
            status: 'OPEN',
            startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
            endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString(),
            totalEmployees: 0,
            totalPayroll: 0,
            totalINSS: 0,
            totalFGTS: 0,
            totalIRRF: 0,
            unitId: currentUnitId,
            createdBy: 'system'
          };
          setCurrentPeriod(newPeriod);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadData();
  }, [currentUnitId]);

  const toggleSelectAll = () => {
    if (selectedIds.length === employees.length) setSelectedIds([]);
    else setSelectedIds(employees.map(e => e.id));
  };

  const handleSyncData = async () => {
    setIsLoading(true);
    try {
      const latestEmployees = await dbService.getEmployees(currentUnitId);
      setEmployees(latestEmployees);
      alert('Lista de funcionários sincronizada com sucesso.');
    } catch (error) {
      console.error('Erro ao sincronizar funcionários:', error);
      alert('Erro ao sincronizar funcionários.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAction = async () => {
    setIsRangeModalOpen(false);
    
    console.log('🔍 Filtrando funcionários. Faixa:', rangeStart, rangeEnd);
    console.log('👥 Total de funcionários:', employees.length);

    // Filter employees based on range
    const filteredEmployees = employees.filter(emp => {
      const matricula = (emp.matricula || '').toString().trim();
      const start = rangeStart.toString().trim();
      const end = rangeEnd.toString().trim();
      
      const getNum = (s: string) => parseInt(s.replace(/\D/g, ''), 10);
      const matNum = getNum(matricula);
      const startNum = getNum(start);
      const endNum = getNum(end);
      
      // Numeric comparison
      if (start && !isNaN(startNum) && !isNaN(matNum) && matNum < startNum) return false;
      if (end && !isNaN(endNum) && !isNaN(matNum) && matNum > endNum) return false;
      
      // Fallback to localeCompare
      const startComp = start ? matricula.localeCompare(start, undefined, {numeric: true, sensitivity: 'base'}) : 0;
      const endComp = end ? matricula.localeCompare(end, undefined, {numeric: true, sensitivity: 'base'}) : 0;
      
      console.log(`Checking emp: ${emp.employeeName}, matricula: '${matricula}', range: '${start}'-'${end}', startComp: ${startComp}, endComp: ${endComp}`);
      
      // If start is provided, matricula must be >= start (startComp >= 0)
      if (start && startComp < 0) return false;
      // If end is provided, matricula must be <= end (endComp <= 0)
      if (end && endComp > 0) return false;
      
      return true;
    });

    // Sort filtered employees by matricula
    filteredEmployees.sort((a, b) => {
      const parse = (m: string) => {
        const withYear = m.match(/F(\d+)\/(\d+)/);
        if (withYear) return { num: parseInt(withYear[1]), ano: parseInt(withYear[2]) };
        const noYear = m.match(/F(\d+)/);
        return noYear ? { num: parseInt(noYear[1]), ano: 0 } : { num: 0, ano: 0 };
      };
      const matA = parse(a.matricula || '');
      const matB = parse(b.matricula || '');
      if (matA.ano !== matB.ano) return matA.ano - matB.ano;
      return matA.num - matB.num;
    });

    console.log('✅ Funcionários filtrados e ordenados:', filteredEmployees.length);
    filteredEmployees.forEach(emp => console.log(`  - ${emp.employeeName} (${emp.matricula})`));

    if (filteredEmployees.length === 0) {
      alert('Nenhum funcionário encontrado na faixa selecionada.');
      return;
    }

    if (pendingAction === 'PDF') {
      await executeGeneratePDF(filteredEmployees);
    } else if (pendingAction === 'PROCESS') {
      await executeProcessPayroll(filteredEmployees);
    } else if (pendingAction === 'ANALYTICAL') {
      await generateAnalyticalReport(filteredEmployees);
    } else if (pendingAction === 'SUMMARY') {
      await generateSummaryReport(filteredEmployees);
    } else if (pendingAction === 'ENCARGOS') {
      await generateEncargosReport(filteredEmployees);
    }
  };

  // Novas funções para relatórios avançados
  const generateAnalyticalReport = async (selectedEmployees: Payroll[]) => {
    setIsLoading(true);
    try {
      const pdf = new jsPDF('l', 'mm', 'a4', true); // Landscape para aproveitar melhor o espaço
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      // Título
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Folha Analítica Completa', 148, 15, { align: 'center' });
      
      // Período
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Período: ${String(currentMonth).padStart(2, '0')}/${currentYear}`, 148, 25, { align: 'center' });
      
      let yPos = 40;
      
      // Configuração da tabela - reduzida para caber na folha
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const colWidths = {
        matricula: 25,
        nome: 50,
        salario: 35,
        proventos: 35,
        descontos: 35,
        liquido: 35,
        inss: 30,
        irrf: 30
      };
      
      // Cabeçalho da tabela
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      let xPos = margin;
      
      pdf.text('Matrícula', xPos, yPos);
      xPos += colWidths.matricula;
      pdf.text('Nome', xPos, yPos);
      xPos += colWidths.nome;
      pdf.text('Salário Base', xPos, yPos);
      xPos += colWidths.salario;
      pdf.text('Proventos', xPos, yPos);
      xPos += colWidths.proventos;
      pdf.text('Descontos', xPos, yPos);
      xPos += colWidths.descontos;
      pdf.text('Líquido', xPos, yPos);
      xPos += colWidths.liquido;
      pdf.text('INSS', xPos, yPos);
      xPos += colWidths.inss;
      pdf.text('IRRF', xPos, yPos);
      
      yPos += 7;
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 5;
      
      // Dados
      pdf.setFont('helvetica', 'normal');
      selectedEmployees.forEach((emp, index) => {
        if (yPos > 180) { // Limite mais seguro para landscape
          pdf.addPage();
          yPos = 25;
          // Repetir cabeçalho na nova página
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          xPos = margin;
          pdf.text('Matrícula', xPos, yPos);
          xPos += colWidths.matricula;
          pdf.text('Nome', xPos, yPos);
          xPos += colWidths.nome;
          pdf.text('Salário Base', xPos, yPos);
          xPos += colWidths.salario;
          pdf.text('Proventos', xPos, yPos);
          xPos += colWidths.proventos;
          pdf.text('Descontos', xPos, yPos);
          xPos += colWidths.descontos;
          pdf.text('Líquido', xPos, yPos);
          xPos += colWidths.liquido;
          pdf.text('INSS', xPos, yPos);
          xPos += colWidths.inss;
          pdf.text('IRRF', xPos, yPos);
          yPos += 7;
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
        }
        
        pdf.setFontSize(8);
        xPos = margin;
        
        pdf.text(emp.matricula || 'N/A', xPos, yPos);
        xPos += colWidths.matricula;
        pdf.text(emp.employeeName.substring(0, 30), xPos, yPos); // Reduzido para caber melhor
        xPos += colWidths.nome;
        pdf.text(`R$ ${(emp.salario_base || 0).toFixed(2)}`, xPos, yPos);
        xPos += colWidths.salario;
        pdf.text(`R$ ${(emp.total_proventos || 0).toFixed(2)}`, xPos, yPos);
        xPos += colWidths.proventos;
        pdf.text(`R$ ${(emp.total_descontos || 0).toFixed(2)}`, xPos, yPos);
        xPos += colWidths.descontos;
        pdf.text(`R$ ${(emp.salario_liquido || 0).toFixed(2)}`, xPos, yPos);
        xPos += colWidths.liquido;
        pdf.text(`R$ ${(emp.inss || 0).toFixed(2)}`, xPos, yPos);
        xPos += colWidths.inss;
        pdf.text(`R$ ${(emp.irrf || 0).toFixed(2)}`, xPos, yPos);
        
        yPos += 8; // Espaçamento reduzido
      });
      
      // Totais
      yPos += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      const totalPayroll = selectedEmployees.reduce((sum, emp) => sum + (emp.total_proventos || 0), 0);
      const totalDeductions = selectedEmployees.reduce((sum, emp) => sum + (emp.total_descontos || 0), 0);
      const totalNet = selectedEmployees.reduce((sum, emp) => sum + (emp.salario_liquido || 0), 0);
      const totalINSS = selectedEmployees.reduce((sum, emp) => sum + (emp.inss || 0), 0);
      const totalIRRF = selectedEmployees.reduce((sum, emp) => sum + (emp.irrf || 0), 0);
      
      xPos = margin;
      pdf.text(`Totais (${selectedEmployees.length} funcionários):`, xPos, yPos);
      xPos += colWidths.matricula + colWidths.nome + colWidths.salario;
      pdf.text(`R$ ${totalPayroll.toFixed(2)}`, xPos, yPos);
      xPos += colWidths.proventos;
      pdf.text(`R$ ${totalDeductions.toFixed(2)}`, xPos, yPos);
      xPos += colWidths.descontos;
      pdf.text(`R$ ${totalNet.toFixed(2)}`, xPos, yPos);
      xPos += colWidths.liquido;
      pdf.text(`R$ ${totalINSS.toFixed(2)}`, xPos, yPos);
      xPos += colWidths.inss;
      pdf.text(`R$ ${totalIRRF.toFixed(2)}`, xPos, yPos);
      
      pdf.save(`folha-analitica-${currentYear}-${String(currentMonth).padStart(2, '0')}.pdf`);
      alert('Relatório analítico gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório analítico:', error);
      alert('Erro ao gerar relatório analítico.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSummaryReport = async (selectedEmployees: Payroll[]) => {
    setIsLoading(true);
    try {
      const pdf = new jsPDF('l', 'mm', 'a4', true); // Landscape para aproveitar melhor o espaço
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      // Título
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Resumo Financeiro da Folha', 148, 15, { align: 'center' });
      
      // Período
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Período: ${String(currentMonth).padStart(2, '0')}/${currentYear}`, 148, 25, { align: 'center' });
      
      // Cálculos
      const totalPayroll = selectedEmployees.reduce((sum, emp) => sum + (emp.total_proventos || 0), 0);
      const totalDeductions = selectedEmployees.reduce((sum, emp) => sum + (emp.total_descontos || 0), 0);
      const totalNet = selectedEmployees.reduce((sum, emp) => sum + (emp.salario_liquido || 0), 0);
      const totalINSS = selectedEmployees.reduce((sum, emp) => sum + (emp.inss || 0), 0);
      const totalIRRF = selectedEmployees.reduce((sum, emp) => sum + (emp.irrf || 0), 0);
      const fgtsTotal = totalPayroll * 0.08; // 8% FGTS
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = 45;
      
      // Layout em 3 colunas para landscape - ocupando toda largura
      const leftColumn = margin;
      const middleColumn = pageWidth / 2 - 30;
      const rightColumn = pageWidth - 70;
      
      // Cabeçalho das 3 colunas
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Resumo Financeiro', leftColumn, yPos);
      pdf.text('Encargos Sociais', middleColumn, yPos);
      pdf.text('Médias', rightColumn, yPos);
      
      yPos += 18;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      // Resumo Financeiro - Esquerda
      pdf.text(`Total de Funcionários: ${selectedEmployees.length}`, leftColumn, yPos);
      yPos += 12;
      pdf.text(`Total da Folha Bruta: R$ ${totalPayroll.toFixed(2)}`, leftColumn, yPos);
      yPos += 12;
      pdf.text(`Total de Descontos: R$ ${totalDeductions.toFixed(2)}`, leftColumn, yPos);
      yPos += 12;
      pdf.text(`Total Líquido: R$ ${totalNet.toFixed(2)}`, leftColumn, yPos);
      
      // Reiniciar yPos para Encargos Sociais
      yPos = 63;
      pdf.text(`INSS (Retido): R$ ${totalINSS.toFixed(2)}`, middleColumn, yPos);
      yPos += 12;
      pdf.text(`IRRF (Retido): R$ ${totalIRRF.toFixed(2)}`, middleColumn, yPos);
      yPos += 12;
      pdf.text(`FGTS (Empresa): R$ ${fgtsTotal.toFixed(2)}`, middleColumn, yPos);
      yPos += 12;
      pdf.text(`Custo Total (Encargos): R$ ${(totalPayroll + fgtsTotal).toFixed(2)}`, middleColumn, yPos);
      
      // Reiniciar yPos para Médias
      yPos = 63;
      pdf.text(`Salário Médio: R$ ${(totalPayroll / selectedEmployees.length).toFixed(2)}`, rightColumn, yPos);
      yPos += 12;
      pdf.text(`Líquido Médio: R$ ${(totalNet / selectedEmployees.length).toFixed(2)}`, rightColumn, yPos);
      
      pdf.save(`resumo-financeiro-${currentYear}-${String(currentMonth).padStart(2, '0')}.pdf`);
      alert('Resumo financeiro gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar resumo financeiro:', error);
      alert('Erro ao gerar resumo financeiro.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateEncargosReport = async (selectedEmployees: Payroll[]) => {
    setIsLoading(true);
    try {
      const pdf = new jsPDF('l', 'mm', 'a4', true); // Landscape para aproveitar melhor o espaço
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      // Título
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Relatório de Encargos Sociais', 148, 15, { align: 'center' });
      
      // Período
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Período: ${String(currentMonth).padStart(2, '0')}/${currentYear}`, 148, 25, { align: 'center' });
      
      // Cálculos
      const totalPayroll = selectedEmployees.reduce((sum, emp) => sum + (emp.total_proventos || 0), 0);
      const totalINSS = selectedEmployees.reduce((sum, emp) => sum + (emp.inss || 0), 0);
      const totalIRRF = selectedEmployees.reduce((sum, emp) => sum + (emp.irrf || 0), 0);
      
      // Cálculo de encargos
      const inssCompany = totalPayroll * 0.20; // 20% INSS Empresa
      const fgtsCompany = totalPayroll * 0.08; // 8% FGTS
      const rat = totalPayroll * 0.01; // 1% RAT (variável)
      const otherCharges = totalPayroll * 0.028; // 2.8% outros encargos
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = 45;
      
      // Layout em 2 colunas para landscape - mais compacto
      const leftColumn = margin;
      const rightColumn = pageWidth / 2 + 15;
      
      // Encargos Retidos - Esquerda
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Encargos Retidos dos Funcionários', leftColumn, yPos);
      
      yPos += 15;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`INSS Retido: R$ ${totalINSS.toFixed(2)}`, leftColumn, yPos);
      yPos += 10;
      pdf.text(`IRRF Retido: R$ ${totalIRRF.toFixed(2)}`, leftColumn, yPos);
      
      // Encargos da Empresa - Direita
      yPos = 45;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Encargos da Empresa', rightColumn, yPos);
      
      yPos += 15;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`INSS Empresa (20%): R$ ${inssCompany.toFixed(2)}`, rightColumn, yPos);
      yPos += 10;
      pdf.text(`FGTS (8%): R$ ${fgtsCompany.toFixed(2)}`, rightColumn, yPos);
      yPos += 10;
      pdf.text(`RAT (1%): R$ ${rat.toFixed(2)}`, rightColumn, yPos);
      yPos += 10;
      pdf.text(`Outros Encargos (2.8%): R$ ${otherCharges.toFixed(2)}`, rightColumn, yPos);
      
      yPos += 15;
      const totalCompanyCharges = inssCompany + fgtsCompany + rat + otherCharges;
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Total Encargos Empresa: R$ ${totalCompanyCharges.toFixed(2)}`, rightColumn, yPos);
      
      // Custo Total - Centro
      yPos += 25;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Custo Total', pageWidth / 2 - 20, yPos);
      
      yPos += 15;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Folha Bruta: R$ ${totalPayroll.toFixed(2)}`, pageWidth / 2 - 20, yPos);
      yPos += 10;
      pdf.text(`Encargos Empresa: R$ ${totalCompanyCharges.toFixed(2)}`, pageWidth / 2 - 20, yPos);
      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Custo Total: R$ ${(totalPayroll + totalCompanyCharges).toFixed(2)}`, pageWidth / 2 - 20, yPos);
      
      pdf.save(`encargos-sociais-${currentYear}-${String(currentMonth).padStart(2, '0')}.pdf`);
      alert('Relatório de encargos gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório de encargos:', error);
      alert('Erro ao gerar relatório de encargos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Funções de controle de período
  const handleOpenPeriod = async () => {
    if (!currentPeriod || currentPeriod.status !== 'OPEN') {
      const currentDate = new Date();
      const newPeriod: PayrollPeriod = {
        id: `period-${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentUnitId}`,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        status: 'OPEN',
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString(),
        totalEmployees: 0,
        totalPayroll: 0,
        totalINSS: 0,
        totalFGTS: 0,
        totalIRRF: 0,
        unitId: currentUnitId,
        createdBy: 'system'
      };
      
      await IndexedDBService.save('payroll_periods', newPeriod);
      setCurrentPeriod(newPeriod);
      setPeriodHistory([...periodHistory, newPeriod]);
      alert('Período aberto com sucesso!');
    }
  };

  const handleClosePeriod = async () => {
    if (!currentPeriod || currentPeriod.status !== 'OPEN') {
      alert('Não há período aberto para fechar.');
      return;
    }
    
    if (!confirm('Deseja fechar o período atual? Esta ação não poderá ser desfeita.')) {
      return;
    }
    
    try {
      const updatedPeriod = {
        ...currentPeriod,
        status: 'CLOSED' as const,
        closedAt: new Date().toISOString(),
        totalEmployees: employees.length,
        totalPayroll: employees.reduce((sum, emp) => sum + (emp.total_proventos || 0), 0),
        totalINSS: employees.reduce((sum, emp) => sum + (emp.inss || 0), 0),
        totalFGTS: employees.reduce((sum, emp) => sum + (emp.total_proventos || 0) * 0.08, 0),
        totalIRRF: employees.reduce((sum, emp) => sum + (emp.irrf || 0), 0)
      };
      
      await IndexedDBService.save('payroll_periods', updatedPeriod);
      setCurrentPeriod(updatedPeriod);
      
      // Atualizar histórico
      const updatedHistory = periodHistory.map(p => p.id === updatedPeriod.id ? updatedPeriod : p);
      setPeriodHistory(updatedHistory);
      
      alert('Período fechado com sucesso!');
    } catch (error) {
      console.error('Erro ao fechar período:', error);
      alert('Erro ao fechar período.');
    }
  };

  const getFilteredEmployees = () => {
    return employees.filter(emp => {
      const matchesSearch = !searchTerm || 
        emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.matricula?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || emp.status === filterStatus;
      const matchesDepartment = !filterDepartment || emp.departamento === filterDepartment;
      const matchesSalary = !filterSalaryRange || {
        '0-2000': (emp.salario_base || 0) <= 2000,
        '2000-5000': (emp.salario_base || 0) > 2000 && (emp.salario_base || 0) <= 5000,
        '5000+': (emp.salario_base || 0) > 5000
      }[filterSalaryRange] || true;
      
      return matchesSearch && matchesStatus && matchesDepartment && matchesSalary;
    });
  };

  const executeGeneratePDF = async (selectedEmployees: Payroll[]) => {
    setIsLoading(true);
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      console.log(`📊 Gerando holerites para ${selectedEmployees.length} funcionários...`);
      const units = await dbService.getUnits();
      const currentUnit = units.find(u => u.id === currentUnitId);

      const payrollsToExport = selectedEmployees.map(emp => ({
        ...emp,
        month: String(currentMonth).padStart(2, '0'),
        year: String(currentYear),
        unit: currentUnit
      }));

      console.log('🚀 Chamando exportarHoleritesPDF para todos os selecionados');
      await exportService.exportarHoleritesPDF(payrollsToExport);
      
      console.log('✅ Todos os holerites foram processados em um único PDF.');
      alert(`${selectedEmployees.length} holerite(s) gerado(s) com sucesso em um único arquivo PDF.`);
    } catch (error) {
      console.error('❌ Erro ao gerar PDF único:', error);
      alert('Erro ao gerar holerites em PDF. Verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  };

  const executeProcessPayroll = async (selectedEmployees: Payroll[]) => {
    setIsLoading(true);
    try {
      const competencyMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      
      const processedResults = await Promise.all(
        selectedEmployees.map(async (emp) => {
          const input: PayrollInput = {
            employee: {
              id: emp.id,
              name: emp.employeeName,
              salary: emp.salario_base || 0,
              workHours: 220,
              dependents: emp.dependentes_lista || [],
              regime: 'CLT',
              unitId: emp.unitId,
              cpf: emp.cpf || '',
              pis: emp.pis || '',
              matricula: emp.matricula || '',
              cargo: emp.cargo || '',
              departamento: emp.departamento || '',
              admissionDate: emp.data_admissao || new Date().toISOString(),
              active: true
            } as any,
            competencyMonth,
            overtimeHours50: emp.he50_qtd || 0,
            overtimeHours100: emp.he100_qtd || 0,
            nightShiftHours: emp.adic_noturno_qtd || 0,
            hazardPayDegree: emp.insalubridade_grau || 'NONE',
            periculosidade: emp.periculosidade_ativo || false,
            dsr: emp.dsr_ativo || false,
            commission: emp.comissoes || 0,
            bonuses: (emp.gratificacoes || 0) + (emp.premios || 0),
            familySalary: emp.salario_familia,
            otherAllowances: (emp.auxilio_moradia || 0) + (emp.arredondamento || 0),
            
            absenceDays: emp.faltas || 0,
            alimony: emp.pensao_alimenticia || 0,
            mealAllowance: emp.va_ativo ? (emp.vale_alimentacao || 0) : 0,
            mealTicket: emp.vr_ativo ? (emp.vale_refeicao || 0) : 0,
            transport: emp.vt_ativo ? (emp.vale_transporte_total || 0) : 0,
            pharmacy: emp.vale_farmacia || 0,
            lifeInsurance: emp.seguro_vida || 0,
            advance: emp.adiantamento || 0,
            consignado: emp.consignado || 0,
            coparticipation: emp.coparticipacoes || 0,
            healthInsurance: emp.ps_ativo ? (emp.plano_saude_colaborador || 0) : 0,
            dentalInsurance: emp.po_ativo ? (emp.plano_odontologico || 0) : 0,
            otherDeductions: emp.outros_descontos || 0,
          };
          
          const calculation = payrollService.generateMonthlyPayroll(input, {}, getResolvedTaxConfig());
          
          const updatedEmp = {
            ...emp,
            total_proventos: calculation.totals.totalAllowances,
            total_descontos: calculation.totals.totalDeductions,
            salario_liquido: calculation.totals.netSalary,
            inss: calculation.deductions.inss,
            irrf: calculation.deductions.irrf,
            status: 'PAID' as const,
            updatedAt: new Date().toISOString()
          };

          await dbService.saveEmployee(updatedEmp);
          return updatedEmp;
        })
      );

      alert(`Folha processada com sucesso para ${processedResults.length} funcionários.`);
      
      const updatedEmployees = employees.map(emp => {
        const processed = processedResults.find(p => p.id === emp.id);
        return processed || emp;
      });
      setEmployees(updatedEmployees);
      setSelectedIds([]);
      
    } catch (error) {
      console.error('Erro ao processar folha:', error);
      alert('Erro ao processar folha de pagamento.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAnalytical = () => {
    setPendingAction('ANALYTICAL');
    setIsRangeModalOpen(true);
  };

  const handleGenerateSummary = () => {
    setPendingAction('SUMMARY');
    setIsRangeModalOpen(true);
  };

  const handleGenerateEncargos = () => {
    setPendingAction('ENCARGOS');
    setIsRangeModalOpen(true);
  };

  const handleProcessPayroll = () => {
    setPendingAction('PROCESS');
    setIsRangeModalOpen(true);
  };

  const handleGeneratePDF = () => {
    setPendingAction('PDF');
    setIsRangeModalOpen(true);
  };

  const handleEdit = (emp: Payroll) => {
    const normalizedEmployee: Payroll = {
      ...emp,
      employeeName: emp.employeeName || '',
      salario_base: Number(emp.salario_base || 0),
      he50_qtd: Number(emp.he50_qtd || 0),
      he100_qtd: Number(emp.he100_qtd || 0),
      adic_noturno_qtd: Number(emp.adic_noturno_qtd || 0),
      comissoes: Number(emp.comissoes || 0),
      gratificacoes: Number(emp.gratificacoes || 0),
      premios: Number(emp.premios || 0),
      auxilio_moradia: Number(emp.auxilio_moradia || 0),
      salario_familia: Number(emp.salario_familia || 0),
      vale_transporte_total: Number(emp.vale_transporte_total || 0),
      vale_alimentacao: Number(emp.vale_alimentacao || 0),
      vale_refeicao: Number(emp.vale_refeicao || 0),
      vale_farmacia: Number(emp.vale_farmacia || 0),
      seguro_vida: Number(emp.seguro_vida || 0),
      adiantamento: Number(emp.adiantamento || 0),
      pensao_alimenticia: Number(emp.pensao_alimenticia || 0),
      consignado: Number(emp.consignado || 0),
      coparticipacoes: Number(emp.coparticipacoes || 0),
      plano_saude_colaborador: Number(emp.plano_saude_colaborador || 0),
      plano_odontologico: Number((emp as any).plano_odontologico || 0),
      outros_descontos: Number(emp.outros_descontos || 0),
      inss: Number(emp.inss || 0),
      irrf: Number(emp.irrf || 0),
      total_proventos: Number(emp.total_proventos || emp.salario_base || 0),
      total_descontos: Number(emp.total_descontos || 0),
      salario_liquido: Number(emp.salario_liquido || 0),
      dependentes_lista: Array.isArray(emp.dependentes_lista) ? emp.dependentes_lista : [],
      vt_ativo: !!emp.vt_ativo,
      va_ativo: !!emp.va_ativo,
      vr_ativo: !!emp.vr_ativo,
      ps_ativo: !!emp.ps_ativo,
      po_ativo: !!emp.po_ativo,
      periculosidade_ativo: !!emp.periculosidade_ativo,
      dsr_ativo: emp.dsr_ativo !== undefined ? !!emp.dsr_ativo : true,
      insalubridade_grau: (emp.insalubridade_grau || 'NONE') as Payroll['insalubridade_grau']
    };

    setEditingEmployee({ 
      ...normalizedEmployee
    });
  };

  // Recalcular impostos quando campos relevantes mudam no modal
  useEffect(() => {
    if (editingEmployee) {
      const input: PayrollInput = {
        employee: {
          id: editingEmployee.id,
          unitId: editingEmployee.unitId,
          name: editingEmployee.employeeName,
          salary: editingEmployee.salario_base || 0,
          workHours: 220,
          dependents: editingEmployee.dependentes_lista || [],
          regime: 'CLT',
          cpf: editingEmployee.cpf || '',
          pis: editingEmployee.pis || '',
          matricula: editingEmployee.matricula || '',
          admissionDate: editingEmployee.data_admissao || '',
          cargo: editingEmployee.cargo || '',
          departamento: editingEmployee.departamento || '',
          active: true
        },
        competencyMonth: new Date().toISOString().slice(0, 7),
        overtimeHours50: editingEmployee.he50_qtd || 0,
        overtimeHours100: editingEmployee.he100_qtd || 0,
        nightShiftHours: editingEmployee.adic_noturno_qtd || 0,
        hazardPayDegree: editingEmployee.insalubridade_grau || 'NONE',
        periculosidade: editingEmployee.periculosidade_ativo || false,
        dsr: !!editingEmployee.dsr_ativo,
        commission: editingEmployee.comissoes || 0,
        bonuses: editingEmployee.premios || 0,
        otherAllowances: (editingEmployee.gratificacoes || 0) + (editingEmployee.auxilio_moradia || 0),
        healthInsurance: editingEmployee.ps_ativo ? (editingEmployee.plano_saude_colaborador || 0) : 0,
        dentalInsurance: editingEmployee.po_ativo ? (editingEmployee.plano_odontologico || 0) : 0,
        mealAllowance: editingEmployee.va_ativo ? (editingEmployee.vale_alimentacao || 0) : 0,
        mealTicket: editingEmployee.vr_ativo ? (editingEmployee.vale_refeicao || 0) : 0,
        transport: editingEmployee.vt_ativo ? (editingEmployee.vale_transporte_total || 0) : 0,
        pharmacy: editingEmployee.vale_farmacia || 0,
        lifeInsurance: editingEmployee.seguro_vida || 0,
        advance: editingEmployee.adiantamento || 0,
        consignado: editingEmployee.consignado || 0,
        coparticipation: editingEmployee.coparticipacoes || 0,
        otherDeductions: editingEmployee.outros_descontos || 0,
      };

      const calculation = payrollService.generateMonthlyPayroll(input, {}, getResolvedTaxConfig());
      
      // Só atualiza se houver mudança para evitar loop
      if (
        calculation.deductions.inss !== editingEmployee.inss || 
        calculation.deductions.irrf !== editingEmployee.irrf ||
        calculation.totals.totalDeductions !== editingEmployee.total_descontos ||
        calculation.totals.netSalary !== editingEmployee.salario_liquido
      ) {
        setEditingEmployee(prev => prev ? {
          ...prev,
          inss: calculation.deductions.inss,
          irrf: calculation.deductions.irrf,
          total_proventos: calculation.totals.totalAllowances,
          total_descontos: calculation.totals.totalDeductions,
          salario_liquido: calculation.totals.netSalary
        } : null);
      }
    }
  }, [
    editingEmployee?.salario_base, 
    editingEmployee?.he50_qtd, 
    editingEmployee?.he100_qtd,
    editingEmployee?.adic_noturno_qtd,
    editingEmployee?.insalubridade_grau,
    editingEmployee?.periculosidade_ativo,
    editingEmployee?.dsr_ativo,
    editingEmployee?.va_ativo,
    editingEmployee?.vr_ativo,
    editingEmployee?.vt_ativo,
    editingEmployee?.ps_ativo,
    editingEmployee?.po_ativo,
    editingEmployee?.comissoes,
    editingEmployee?.premios,
    editingEmployee?.gratificacoes,
    editingEmployee?.auxilio_moradia,
    editingEmployee?.vale_alimentacao, 
    editingEmployee?.vale_refeicao,
    editingEmployee?.vale_transporte_total,
    editingEmployee?.vale_farmacia,
    editingEmployee?.seguro_vida,
    editingEmployee?.adiantamento,
    editingEmployee?.pensao_alimenticia,
    editingEmployee?.consignado,
    editingEmployee?.coparticipacoes,
    editingEmployee?.plano_saude_colaborador,
    editingEmployee?.outros_descontos,
    taxConfig
  ]);

  const handleSaveEdit = async () => {
    if (!canWritePayroll) {
      alert('Você não tem permissão para editar a folha de pagamento.');
      return;
    }

    if (!editingEmployee) return;
    
    setIsLoading(true);
    try {
      await dbService.saveEmployee(editingEmployee);
      alert('Dados atualizados com sucesso.');
      setEditingEmployee(null);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert('Erro ao salvar dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const resolvedTaxConfig = getResolvedTaxConfig();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tight">Cálculo de Folha de Pagamento</h1>
          <p className="text-slate-500 font-medium mt-2 text-[11px] uppercase tracking-widest">Processamento de proventos, encargos e eSocial</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSyncData}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-[10px] uppercase transition-all hover:bg-slate-200 disabled:opacity-50 h-12"
            title="Sincronizar com banco de dados"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''}/> Sincronizar
          </button>
          
          {/* Controle de Período */}
          <button 
            onClick={() => setShowPeriodModal(true)}
            disabled={isLoading || !canManagePayroll}
            className="flex items-center gap-2 px-6 py-3 bg-purple-100 text-purple-600 rounded-xl font-bold text-[10px] uppercase transition-all hover:bg-purple-200 disabled:opacity-50 h-12"
            title="Controle de Período"
          >
            {currentPeriod?.status === 'OPEN' ? <Unlock size={16}/> : <Lock size={16}/>}
            Período: {currentPeriod?.status === 'OPEN' ? 'Aberto' : 'Fechado'}
          </button>
          
          {/* Relatórios Avançados */}
          <button 
            onClick={() => setShowReportsModal(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-600 rounded-xl font-bold text-[10px] uppercase transition-all hover:bg-emerald-200 disabled:opacity-50 h-12"
            title="Relatórios Avançados"
          >
            <FileText size={16}/> Relatórios
          </button>
          
          <button 
            onClick={handleGeneratePDF}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-bold text-[10px] uppercase transition-all hover:bg-slate-300 disabled:opacity-50 h-12"
          >
            <Printer size={16}/> Holerites
          </button>
          <button 
            onClick={handleProcessPayroll}
            disabled={isLoading || currentPeriod?.status !== 'OPEN' || !canWritePayroll}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase shadow-lg transition-all hover:bg-indigo-700 disabled:opacity-50 h-12"
          >
            <Calculator size={16}/> {isLoading ? 'Processando...' : 'Processar Mês Atual'}
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
           <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Total Proventos</p>
           <p className="text-2xl font-black text-emerald-900">
             R$ {employees.reduce((sum, emp) => sum + (emp.total_proventos || 0), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
           </p>
        </div>
        <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
           <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Total Descontos</p>
           <p className="text-2xl font-black text-rose-900">
             R$ {employees.reduce((sum, emp) => sum + (emp.total_descontos || 0), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
           </p>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl">
           <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">Custo Patronal Estimado</p>
           <p className="text-2xl font-black text-white">
             R$ {(employees.reduce((sum, emp) => sum + (emp.total_proventos || 0), 0) * 1.28).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
           </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 w-12 text-center">
                <div onClick={toggleSelectAll} className="cursor-pointer mx-auto flex items-center justify-center">
                   {selectedIds.length === employees.length && employees.length > 0 ? <Check className="text-indigo-600" size={16}/> : <div className="w-4 h-4 border-2 border-slate-200 rounded"/>}
                </div>
              </th>
              <th className="px-4 py-4">Cadastro</th>
              <th className="px-4 py-4">Colaborador</th>
              <th className="px-8 py-4">Vencimentos</th>
              <th className="px-8 py-4">Descontos</th>
              <th className="px-8 py-4">Líquido</th>
              <th className="px-8 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {[...employees].sort((a, b) => {
              const parse = (m: string) => {
                const withYear = m.match(/F(\d+)\/(\d+)/);
                if (withYear) return { num: parseInt(withYear[1]), ano: parseInt(withYear[2]) };
                const noYear = m.match(/F(\d+)/);
                return noYear ? { num: parseInt(noYear[1]), ano: 0 } : { num: 0, ano: 0 };
              };
              const matA = parse(a.matricula || '');
              const matB = parse(b.matricula || '');
              if (matA.ano !== matB.ano) return matA.ano - matB.ano;
              return matA.num - matB.num;
            }).map(emp => {
              const totalProventos = emp.total_proventos || (emp.salario_base || 0);
              const totalDescontos = emp.total_descontos || ((emp.inss || 0) + (emp.irrf || 0)); 
              const salarioLiquido = emp.salario_liquido || (totalProventos - totalDescontos);

              return (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => setSelectedIds(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id])} className="w-4 h-4 accent-indigo-600" />
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-600">{formatMatricula(emp.matricula)}</td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-slate-900 leading-none mb-1">{emp.employeeName}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{emp.cargo}</p>
                  </td>
                  <td className="px-8 py-4 text-emerald-600 font-bold">R$ {totalProventos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                  <td className="px-8 py-4 text-rose-600 font-bold">R$ {totalDescontos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                  <td className="px-8 py-4 text-slate-900 font-black">R$ {salarioLiquido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                  <td className="px-8 py-4 text-right"><button onClick={() => handleEdit(emp)} disabled={!canWritePayroll} className="text-slate-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed"><Edit3 size={16}/></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Modal de Controle de Período */}
      {showPeriodModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase">Controle de Período</h2>
              <button onClick={() => setShowPeriodModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24}/>
              </button>
            </div>
            
            <div className="space-y-6">
              {currentPeriod && (
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <h3 className="text-sm font-black text-slate-600 uppercase mb-4">Período Atual</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Mês/Ano</p>
                      <p className="font-bold">{String(currentPeriod.month).padStart(2, '0')}/{currentPeriod.year}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Status</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        currentPeriod.status === 'OPEN' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {currentPeriod.status === 'OPEN' ? 'Aberto' : 'Fechado'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Funcionários</p>
                      <p className="font-bold">{currentPeriod.totalEmployees}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Total Folha</p>
                      <p className="font-bold">R$ {currentPeriod.totalPayroll.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                {currentPeriod?.status === 'OPEN' ? (
                  <button 
                    onClick={handleClosePeriod}
                    disabled={isLoading || !canManagePayroll}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm uppercase shadow-lg hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    <Lock size={16} className="inline mr-2"/> Fechar Período
                  </button>
                ) : (
                  <button 
                    onClick={handleOpenPeriod}
                    disabled={isLoading || !canManagePayroll}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm uppercase shadow-lg hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    <Unlock size={16} className="inline mr-2"/> Abrir Novo Período
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Relatórios Avançados */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase">Relatórios Avançados</h2>
              <button onClick={() => setShowReportsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24}/>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => { setShowReportsModal(false); handleGenerateAnalytical(); }}
                disabled={isLoading}
                className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-all disabled:opacity-50"
              >
                <FileText className="text-emerald-600 mb-4" size={32}/>
                <h3 className="font-black text-emerald-900 mb-2">Folha Analítica</h3>
                <p className="text-xs text-emerald-600">Relatório completo com todos os funcionários e valores detalhados</p>
              </button>
              
              <button 
                onClick={() => { setShowReportsModal(false); handleGenerateSummary(); }}
                disabled={isLoading}
                className="p-6 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-all disabled:opacity-50"
              >
                <TrendingUp className="text-blue-600 mb-4" size={32}/>
                <h3 className="font-black text-blue-900 mb-2">Resumo Financeiro</h3>
                <p className="text-xs text-blue-600">Totais, médias e encargos sociais consolidados</p>
              </button>
              
              <button 
                onClick={() => { setShowReportsModal(false); handleGenerateEncargos(); }}
                disabled={isLoading}
                className="p-6 bg-purple-50 rounded-2xl border border-purple-100 hover:bg-purple-100 transition-all disabled:opacity-50"
              >
                <Shield className="text-purple-600 mb-4" size={32}/>
                <h3 className="font-black text-purple-900 mb-2">Encargos Sociais</h3>
                <p className="text-xs text-purple-600">INSS, FGTS, RAT e custos trabalhistas detalhados</p>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {editingEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-4xl shadow-2xl my-auto relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black uppercase">Cálculo Individual: {editingEmployee.employeeName}</h2>
              <button onClick={() => setEditingEmployee(null)} className="text-slate-400 hover:text-slate-600">Fechar</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Proventos */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b pb-2">Proventos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Salário Base</label>
                    <input type="number" value={editingEmployee.salario_base} onChange={e => setEditingEmployee({...editingEmployee, salario_base: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">H.E. 50% (Qtd)</label>
                    <input type="number" value={editingEmployee.he50_qtd} onChange={e => setEditingEmployee({...editingEmployee, he50_qtd: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">H.E. 100% (Qtd)</label>
                    <input type="number" value={editingEmployee.he100_qtd} onChange={e => setEditingEmployee({...editingEmployee, he100_qtd: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Adic. Noturno (Qtd)</label>
                    <input type="number" value={editingEmployee.adic_noturno_qtd} onChange={e => setEditingEmployee({...editingEmployee, adic_noturno_qtd: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Insalubridade</label>
                    <select value={editingEmployee.insalubridade_grau} onChange={e => setEditingEmployee({...editingEmployee, insalubridade_grau: e.target.value as any})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold">
                      <option value="NONE">Nenhum</option>
                      <option value="LOW">Mínimo (10%)</option>
                      <option value="MEDIUM">Médio (20%)</option>
                      <option value="HIGH">Máximo (40%)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <input type="checkbox" checked={editingEmployee.periculosidade_ativo} onChange={e => setEditingEmployee({...editingEmployee, periculosidade_ativo: e.target.checked})} className="w-4 h-4 rounded border-slate-200" />
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Periculosidade (30%)</label>
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <input type="checkbox" checked={editingEmployee.dsr_ativo} onChange={e => setEditingEmployee({...editingEmployee, dsr_ativo: e.target.checked})} className="w-4 h-4 rounded border-slate-200" />
                    <label className="text-[10px] font-bold text-slate-400 uppercase">DSR Ativo</label>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Comissões</label>
                    <input type="number" value={editingEmployee.comissoes} onChange={e => setEditingEmployee({...editingEmployee, comissoes: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Salário Família</label>
                    <input type="number" value={editingEmployee.salario_familia} onChange={e => setEditingEmployee({...editingEmployee, salario_familia: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                </div>
              </div>

              {/* Descontos */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest border-b pb-2">Descontos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">INSS (Automático)</label>
                    <input 
                      type="number" 
                      value={editingEmployee.inss} 
                      readOnly 
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-black text-rose-600 bg-slate-50 cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">IRRF (Automático)</label>
                    <input 
                      type="number" 
                      value={editingEmployee.irrf} 
                      readOnly 
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-black text-rose-600 bg-slate-50 cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={editingEmployee.vt_ativo} onChange={e => setEditingEmployee({...editingEmployee, vt_ativo: e.target.checked})} className="w-3 h-3 rounded" />
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Vale Transporte</label>
                    </div>
                    <input 
                      type="number" 
                      value={editingEmployee.vt_ativo ? editingEmployee.vale_transporte_total : 0} 
                      onChange={e => setEditingEmployee({...editingEmployee, vale_transporte_total: Number(e.target.value)})} 
                      className={`w-full p-2 rounded-lg border border-slate-200 text-xs font-bold ${!editingEmployee.vt_ativo ? 'bg-slate-50 text-slate-400' : ''}`}
                      disabled={!editingEmployee.vt_ativo}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={editingEmployee.va_ativo} onChange={e => setEditingEmployee({...editingEmployee, va_ativo: e.target.checked})} className="w-3 h-3 rounded" />
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Vale Alimentação</label>
                    </div>
                    <input 
                      type="number" 
                      value={editingEmployee.va_ativo ? editingEmployee.vale_alimentacao : 0} 
                      onChange={e => setEditingEmployee({...editingEmployee, vale_alimentacao: Number(e.target.value)})} 
                      className={`w-full p-2 rounded-lg border border-slate-200 text-xs font-bold ${!editingEmployee.va_ativo ? 'bg-slate-50 text-slate-400' : ''}`}
                      disabled={!editingEmployee.va_ativo}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={editingEmployee.vr_ativo} onChange={e => setEditingEmployee({...editingEmployee, vr_ativo: e.target.checked})} className="w-3 h-3 rounded" />
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Vale Refeição</label>
                    </div>
                    <input 
                      type="number" 
                      value={editingEmployee.vr_ativo ? editingEmployee.vale_refeicao : 0} 
                      onChange={e => setEditingEmployee({...editingEmployee, vale_refeicao: Number(e.target.value)})} 
                      className={`w-full p-2 rounded-lg border border-slate-200 text-xs font-bold ${!editingEmployee.vr_ativo ? 'bg-slate-50 text-slate-400' : ''}`}
                      disabled={!editingEmployee.vr_ativo}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Vale Farmácia</label>
                    <input type="number" value={editingEmployee.vale_farmacia} onChange={e => setEditingEmployee({...editingEmployee, vale_farmacia: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Seguro de Vida</label>
                    <input type="number" value={editingEmployee.seguro_vida} onChange={e => setEditingEmployee({...editingEmployee, seguro_vida: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Adiantamento</label>
                    <input type="number" value={editingEmployee.adiantamento} onChange={e => setEditingEmployee({...editingEmployee, adiantamento: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Pensão Alimentícia</label>
                    <input type="number" value={editingEmployee.pensao_alimenticia} onChange={e => setEditingEmployee({...editingEmployee, pensao_alimenticia: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Consignado</label>
                    <input type="number" value={editingEmployee.consignado} onChange={e => setEditingEmployee({...editingEmployee, consignado: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Coparticipações</label>
                    <input type="number" value={editingEmployee.coparticipacoes} onChange={e => setEditingEmployee({...editingEmployee, coparticipacoes: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={editingEmployee.ps_ativo} onChange={e => setEditingEmployee({...editingEmployee, ps_ativo: e.target.checked})} className="w-3 h-3 rounded" />
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Plano de Saúde</label>
                    </div>
                    <input 
                      type="number" 
                      value={editingEmployee.ps_ativo ? editingEmployee.plano_saude_colaborador : 0} 
                      onChange={e => setEditingEmployee({...editingEmployee, plano_saude_colaborador: Number(e.target.value)})} 
                      className={`w-full p-2 rounded-lg border border-slate-200 text-xs font-bold ${!editingEmployee.ps_ativo ? 'bg-slate-50 text-slate-400' : ''}`}
                      disabled={!editingEmployee.ps_ativo}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={editingEmployee.po_ativo} onChange={e => setEditingEmployee({...editingEmployee, po_ativo: e.target.checked})} className="w-3 h-3 rounded" />
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Plano Odontológico</label>
                    </div>
                    <input 
                      type="number" 
                      value={editingEmployee.po_ativo ? editingEmployee.plano_odontologico : 0} 
                      onChange={e => setEditingEmployee({...editingEmployee, plano_odontologico: Number(e.target.value)})} 
                      className={`w-full p-2 rounded-lg border border-slate-200 text-xs font-bold ${!editingEmployee.po_ativo ? 'bg-slate-50 text-slate-400' : ''}`}
                      disabled={!editingEmployee.po_ativo}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Outros Descontos</label>
                    <input type="number" value={editingEmployee.outros_descontos} onChange={e => setEditingEmployee({...editingEmployee, outros_descontos: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                </div>
              </div>
            </div>

            {/* Encargos Patronais (Informativo) */}
            <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-white">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Encargos Patronais (Estimados)</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[9px] font-bold uppercase opacity-40">INSS Patronal ({((resolvedTaxConfig.patronalRate || 0.2) * 100).toFixed(1)}%)</p>
                  <p className="text-sm font-black">R$ {(editingEmployee.salario_base * (resolvedTaxConfig.patronalRate || 0.2)).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase opacity-40">FGTS ({(resolvedTaxConfig.fgtsRate * 100).toFixed(1)}%)</p>
                  <p className="text-sm font-black">R$ {(editingEmployee.salario_base * (resolvedTaxConfig.fgtsRate || 0.08)).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase opacity-40">RAT/Terceiros ({(((resolvedTaxConfig.ratRate || 0.02) + (resolvedTaxConfig.terceirosRate || 0.058)) * 100).toFixed(1)}%)</p>
                  <p className="text-sm font-black">R$ ${(editingEmployee.salario_base * ((resolvedTaxConfig.ratRate || 0.02) + (resolvedTaxConfig.terceirosRate || 0.058))).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setEditingEmployee(null)} className="flex-1 py-4 rounded-xl font-black text-xs uppercase bg-slate-100 hover:bg-slate-200 transition-all">Cancelar</button>
              <button onClick={handleSaveEdit} disabled={isLoading || !canWritePayroll} className="flex-1 py-4 rounded-xl font-black text-xs uppercase bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {isLoading ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
      {isRangeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 space-y-4">
            <h2 className="text-lg font-black uppercase">Selecionar Faixa</h2>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Matrícula Inicial</label>
              <input type="text" value={rangeStart} onChange={e => setRangeStart(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Matrícula Final</label>
              <input type="text" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsRangeModalOpen(false)} className="flex-1 py-2 rounded-lg font-bold text-xs uppercase bg-slate-100 hover:bg-slate-200">Cancelar</button>
              <button onClick={confirmAction} className="flex-1 py-2 rounded-lg font-bold text-xs uppercase bg-indigo-600 text-white hover:bg-indigo-700">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
