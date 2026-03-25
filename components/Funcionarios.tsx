import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, QrCode, Square, CheckSquare, Edit2, Search, Building, 
  UserCheck, Printer, X, Download, Loader2, Save, Trash2, Camera, 
  Landmark, DollarSign, MapPin, Calendar, Info, Users, ShieldCheck, 
  Heart, AlertCircle, Wand2, FileText, CreditCard, Clock, Percent,
  User, Phone, Mail, Award, Tag, History, Users2, Star, TrendingUp,
  MessageSquare, CheckCircle2, XCircle, Calculator
} from 'lucide-react';
import { Payroll, Dependent, UserAuth, TaxConfig } from '../types';
import { DEFAULT_TAX_CONFIG } from '../constants';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { TemplateCrachaFuncionario } from './TemplateCrachaFuncionario';
import { dbService } from '../services/databaseService';
import IndexedDBService from '../src/services/indexedDBService';
import { useAudit } from '../src/hooks/useAudit';

interface FuncionariosProps {
  employees: Payroll[];
  currentUnitId: string;
  setEmployees: React.Dispatch<React.SetStateAction<Payroll[]>>;
  user?: UserAuth;
}

type EmployeeTab = 'pessoais' | 'contrato' | 'jornada' | 'banco_horas' | 'documentos' | 'endereco' | 'bancarios' | 'beneficios' | 'esocial' | 'dependentes' | 'folha';

const InputField = ({ label, value, onChange, placeholder, type = "text", icon: Icon, readOnly = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-slate-300"/>} {label}
    </label>
    <input 
      type={type}
      value={value || ''}
      onChange={(e) => !readOnly && onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none transition-all ${readOnly ? 'bg-slate-100 cursor-not-allowed' : 'bg-slate-50 focus:ring-2 focus:ring-indigo-500'}`}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, icon: Icon }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-slate-300"/>} {label}
    </label>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const Funcionarios: React.FC<FuncionariosProps> = ({ employees, currentUnitId, setEmployees, user }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);

  // Hook de auditoria
  const { logAction } = useAudit(user);

  // Função para identificar campos alterados em funcionários
  const getChangedEmployeeFields = (oldData: Payroll, newData: Partial<Payroll>): string[] => {
    const changedFields: string[] = [];
    
    // Campos principais
    if (oldData.employeeName !== newData.employeeName) changedFields.push('nome');
    if (oldData.cpf !== newData.cpf) changedFields.push('cpf');
    if (oldData.rg !== newData.rg) changedFields.push('rg');
    if (oldData.email !== newData.email) changedFields.push('email');
    if (oldData.matricula !== newData.matricula) changedFields.push('matrícula');
    if (oldData.cargo !== newData.cargo) changedFields.push('cargo');
    if (oldData.funcao !== newData.funcao) changedFields.push('função');
    if (oldData.departamento !== newData.departamento) changedFields.push('departamento');
    if (oldData.salario_base !== newData.salario_base) changedFields.push('salário');
    
    // Contato
    if (oldData.phone !== newData.phone) changedFields.push('telefone');
    if (oldData.emergency_contact !== newData.emergency_contact) changedFields.push('contato emergência');
    
    // Endereço
    if (oldData.cep !== newData.cep) changedFields.push('CEP');
    if (oldData.address !== newData.address) changedFields.push('endereço');
    if (oldData.numero !== newData.numero) changedFields.push('número');
    if (oldData.bairro !== newData.bairro) changedFields.push('bairro');
    if (oldData.cidade !== newData.cidade) changedFields.push('cidade');
    if (oldData.estado !== newData.estado) changedFields.push('estado');
    
    return changedFields;
  };
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Payroll | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<EmployeeTab>('pessoais');
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);
  const [taxConfig, setTaxConfig] = useState<TaxConfig>(DEFAULT_TAX_CONFIG);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedConfig = await IndexedDBService.get('system_config', 'tax_config');
        if (savedConfig) {
          setTaxConfig(savedConfig);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações fiscais:', error);
      }
    };
    loadConfig();
  }, []);

  const [formData, setFormData] = useState<Partial<Payroll>>({
    employeeName: '', cpf: '', rg: '', email: '', matricula: '',
    pis: '', ctps: '', titulo_eleitor: '', reservista: '', aso_data: '',
    blood_type: 'A+', emergency_contact: '', cargo: '', funcao: '',
    departamento: '', cbo: '', data_admissao: '', birthDate: '',
    tipo_contrato: 'CLT', jornada_trabalho: '44h', regime_trabalho: 'PRESENCIAL',
    salario_base: 0, tipo_salario: 'MENSAL', status: 'ACTIVE',
    unitId: currentUnitId, month: new Date().toISOString().slice(5, 7),
    year: new Date().getFullYear().toString(),
    he50_qtd: 0, he100_qtd: 0, dsr_ativo: true, adic_noturno_qtd: 0,
    insalubridade_grau: 'NONE', periculosidade_ativo: false,
    comissoes: 0, gratificacoes: 0, premios: 0, ats_percentual: 0,
    auxilio_moradia: 0, arredondamento: 0, dependentes_qtd: 0,
    dependentes_lista: [], is_pcd: false, tipo_deficiencia: '',
    banco: '', codigo_banco: '', agencia: '', conta: '',
    tipo_conta: 'CORRENTE', titular: '', chave_pix: '',
    vt_ativo: false, vale_transporte_total: 0, va_ativo: false,
    vale_alimentacao: 0, vr_ativo: false, vale_refeicao: 0,
    ps_ativo: false, plano_saude_colaborador: 0, po_ativo: false,
    plano_saude_dependentes: 0, vale_farmacia: 0, seguro_vida: 0,
    faltas: 0, atrasos: 0, adiantamento: 0, pensao_alimenticia: 0,
    consignado: 0, outros_descontos: 0, coparticipacoes: 0,
    inss: 0, fgts_retido: 0, irrf: 0, fgts_patronal: 0,
    inss_patronal: 0, rat: 0, terceiros: 0,
    total_proventos: 0, total_descontos: 0, salario_liquido: 0,
    address: { zipCode: '', street: '', number: '', neighborhood: '', city: '', state: '' }
  });

  useEffect(() => {
    if (isModalOpen && !formData.matricula) {
      const next = getNextEmployeeMatricula();
      setFormData(prev => ({ ...prev, matricula: next }));
    }
  }, [isModalOpen, formData.matricula, employees.length]);

  useEffect(() => {
    const valorDiario = formData.vt_valor_diario || 0;
    const qtdVales = formData.vt_qtd_vales_dia || 0;
    const total = valorDiario * qtdVales;
    
    if (formData.vale_transporte_total !== total) {
      setFormData(prev => ({ ...prev, vale_transporte_total: total }));
    }
  }, [formData.vt_valor_diario, formData.vt_qtd_vales_dia]);

  const filtered = employees.filter(e => 
    e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.matricula.includes(searchTerm) ||
    e.cpf.includes(searchTerm)
  );

  const getNextEmployeeMatricula = () => {
    const currentYear = new Date().getFullYear();
    if (!employees || employees.length === 0) return `F01/${currentYear}`;
    
    const numbers = employees
      .filter(e => e.matricula && e.matricula.startsWith('F'))
      .map(e => {
        const match = e.matricula.match(/F(\d+)\//);
        return match ? parseInt(match[1]) : 0;
      });
    
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;
    const paddedNumber = nextNumber.toString().padStart(2, '0');
    
    return `F${paddedNumber}/${currentYear}`;
  };

  const handleSave = async () => {
    console.log("🚀 Iniciando salvamento do funcionário...");
    
    if (!formData.employeeName || !formData.cpf) {
      console.log("❌ Campos obrigatórios não preenchidos");
      alert("Nome e CPF são obrigatórios.");
      return;
    }

    setIsSaving(true);

    try {
      const employeeId = editingEmployee?.id || `E${Date.now()}`;
      // Gerar matrícula automática se não existir
      const generatedMatricula = formData.matricula || getNextEmployeeMatricula();

      const employeeData = {
        ...formData,
        id: employeeId,
        matricula: generatedMatricula,
        unitId: currentUnitId,
        createdAt: editingEmployee?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log("📋 Dados do funcionário preparados:", { 
        id: employeeData.id, 
        name: employeeData.employeeName,
        cpf: employeeData.cpf,
        matricula: employeeData.matricula
      });

      // Salvar no IndexedDB através do databaseService
      console.log("💾 Salvando funcionário no IndexedDB...");
      const savedId = await dbService.saveEmployee(employeeData);
      console.log("✅ Funcionário salvo com ID:", savedId);

      // Registrar auditoria
      if (editingEmployee) {
        await logAction('UPDATE', 'Employee', employeeData.id, employeeData.employeeName, { 
          action: `${user?.name || 'Usuário'} alterou o cadastro do funcionário ${employeeData.employeeName}`,
          changedFields: getChangedEmployeeFields(editingEmployee, formData)
        });
        console.log("🔍 Auditoria: Atualização de funcionário registrada");
      } else {
        await logAction('CREATE', 'Employee', employeeData.id, employeeData.employeeName, { 
          action: `${user?.name || 'Usuário'} cadastrou novo funcionário: ${employeeData.employeeName}`
        });
        console.log("🔍 Auditoria: Criação de funcionário registrada");
      }

      // Atualizar o estado local
      if (editingEmployee) {
        setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? { ...e, ...formData } as Payroll : e));
        console.log("✅ Funcionário atualizado na lista global");
      } else {
        const newEmployee: Payroll = {
          ...formData,
          id: savedId,
        } as Payroll;
        setEmployees(prev => [...prev, newEmployee]);
        console.log("✅ Funcionário adicionado na lista global");
      }

      setIsModalOpen(false);
      setEditingEmployee(null);
      alert("Funcionário salvo com sucesso!");
      
    } catch (error) {
      console.error("❌ Erro ao salvar funcionário:", error);
      alert("Falha ao salvar funcionário. " + (error.message || "Verifique o console para mais detalhes."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (emp: Payroll) => {
    const empWithMatricula = { 
      ...emp, 
      matricula: emp.matricula || getNextEmployeeMatricula(),
      vt_ativo: !!emp.vt_ativo,
      va_ativo: !!emp.va_ativo,
      vr_ativo: !!emp.vr_ativo,
      ps_ativo: !!emp.ps_ativo,
      po_ativo: !!emp.po_ativo,
      dsr_ativo: emp.dsr_ativo !== undefined ? !!emp.dsr_ativo : true,
      periculosidade_ativo: !!emp.periculosidade_ativo,
      is_pcd: !!emp.is_pcd
    };
    setEditingEmployee(empWithMatricula);
    setFormData(empWithMatricula);
    setIsModalOpen(true);
    setActiveTab('pessoais');
  };

  const handleNew = () => {
    setEditingEmployee(null);
    const generatedMatricula = getNextEmployeeMatricula();
    setFormData({
      employeeName: '', cpf: '', rg: '', email: '', matricula: generatedMatricula,
      pis: '', ctps: '', titulo_eleitor: '', reservista: '', aso_data: '',
      blood_type: 'A+', emergency_contact: '', cargo: '', funcao: '',
      departamento: '', cbo: '', data_admissao: '', birthDate: '',
      tipo_contrato: 'CLT', jornada_trabalho: '44h', regime_trabalho: 'PRESENCIAL',
      salario_base: 0, tipo_salario: 'MENSAL', status: 'ACTIVE',
      unitId: currentUnitId, month: new Date().toISOString().slice(5, 7),
      year: new Date().getFullYear().toString(),
      he50_qtd: 0, he100_qtd: 0, dsr_ativo: true, adic_noturno_qtd: 0,
      insalubridade_grau: 'NONE', periculosidade_ativo: false,
      comissoes: 0, gratificacoes: 0, premios: 0, ats_percentual: 0,
      auxilio_moradia: 0, arredondamento: 0, dependentes_qtd: 0,
      dependentes_lista: [], is_pcd: false, tipo_deficiencia: '',
      banco: '', codigo_banco: '', agencia: '', conta: '',
      tipo_conta: 'CORRENTE', titular: '', chave_pix: '',
      vt_ativo: false, vale_transporte_total: 0, va_ativo: false,
      vale_alimentacao: taxConfig.defaultVA || 0, vr_ativo: false, vale_refeicao: taxConfig.defaultVR || 0,
      ps_ativo: false, plano_saude_colaborador: 0, po_ativo: false,
      plano_saude_dependentes: 0, vale_farmacia: 0, seguro_vida: 0,
      faltas: 0, atrasos: 0, adiantamento: 0, pensao_alimenticia: 0,
      consignado: 0, outros_descontos: 0, coparticipacoes: 0,
      inss: 0, fgts_retido: 0, irrf: 0, fgts_patronal: 0,
      inss_patronal: 0, rat: 0, terceiros: 0,
      total_proventos: 0, total_descontos: 0, salario_liquido: 0,
      address: { zipCode: '', street: '', number: '', neighborhood: '', city: '', state: '' }
    });
    setIsModalOpen(true);
    setActiveTab('pessoais');
  };

  const searchCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;
    setIsSearchingCEP(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address!,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          }
        }));
      }
    } catch (e) { console.error(e); }
    finally { setIsSearchingCEP(false); }
  };

  const calculateTaxes = (base: number) => {
    if (!base || isNaN(base)) return { inss: 0, irrf: 0, net: 0, patronal: 0, fgts: 0 };
    
    // Simple estimation based on DEFAULT_TAX_CONFIG
    let inss = 0;
    let remaining = base;
    for (const bracket of DEFAULT_TAX_CONFIG.inssBrackets) {
      const prevLimit = DEFAULT_TAX_CONFIG.inssBrackets[DEFAULT_TAX_CONFIG.inssBrackets.indexOf(bracket) - 1]?.limit || 0;
      const range = Math.min(remaining, (bracket.limit || Infinity) - prevLimit);
      if (range <= 0) break;
      inss += range * bracket.rate;
      if (bracket.limit && base <= bracket.limit) break;
    }

    const irrfBase = base - inss - (formData.dependentes_qtd || 0) * 189.59;
    let irrf = 0;
    for (const bracket of DEFAULT_TAX_CONFIG.irrfBrackets) {
      if (irrfBase > (DEFAULT_TAX_CONFIG.irrfBrackets[DEFAULT_TAX_CONFIG.irrfBrackets.indexOf(bracket) - 1]?.limit || 0)) {
        irrf = (irrfBase * bracket.rate) - bracket.deduction;
      }
    }
    irrf = Math.max(0, irrf);

    const fgts = base * DEFAULT_TAX_CONFIG.fgtsRate;
    const patronal = base * DEFAULT_TAX_CONFIG.patronalRate;
    const net = base - inss - irrf;

    return { inss, irrf, net, patronal, fgts };
  };

  const maskCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
  const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, "$1-$2").substring(0, 9);

  const taxEstimates = calculateTaxes(formData.salario_base || 0);

  const getASOStatus = (date: string) => {
    if (!date) return { label: 'Não Informado', color: 'text-slate-400 bg-slate-100' };
    const asoDate = new Date(date);
    const today = new Date();
    const diffTime = asoDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Vencido', color: 'text-rose-600 bg-rose-50' };
    if (diffDays < 30) return { label: 'Vence em breve', color: 'text-amber-600 bg-amber-50' };
    return { label: 'Válido', color: 'text-emerald-600 bg-emerald-50' };
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const selectedEmployees = employees.filter(e => selectedIds.includes(e.id));
      const cardHeight = 85.6;
      const cardWidth = 112.96;
      
      let yPos = 15;

      for (let i = 0; i < selectedEmployees.length; i++) {
        if (yPos + cardHeight > 280) {
          pdf.addPage();
          yPos = 15;
        }
        const el = document.getElementById(`badge-to-print-${selectedEmployees[i].id}`);
        if (el) {
          // Escala 8 para qualidade ultra-nítida (768 DPI)
          const canvas = await html2canvas(el, { 
            scale: 8, 
            useCORS: true,
            backgroundColor: '#ffffff',
            imageTimeout: 0,
            onclone: (clonedDoc) => {
              const badge = clonedDoc.getElementById(`badge-to-print-${selectedEmployees[i].id}`);
              if (badge) {
                // Fix: Access non-standard CSS properties using type assertion
                (badge.style as any).fontSmooth = 'always';
                (badge.style as any).webkitFontSmoothing = 'antialiased';
              }
            }
          });
          const imgData = canvas.toDataURL('image/png', 1.0);
          // 'NONE' para evitar artefatos de compressão em documentos oficiais
          pdf.addImage(imgData, 'PNG', 17, yPos, cardWidth, cardHeight, undefined, 'NONE');
          yPos += cardHeight + 8;
        }
      }
      pdf.save(`Lote_Crachas_HD_${new Date().getTime()}.pdf`);
    } catch (e) { 
      console.error(e); 
      alert("Erro ao gerar PDF.");
    } finally { 
      setIsGeneratingPDF(false); 
    }
  };

  const handleDirectPrint = () => {
    window.print();
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map(e => e.id));
  };

  return (
    <div className="space-y-5 animate-in fade-in pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight italic font-serif">Gestão de Colaboradores</h1>
          <p className="text-slate-400 font-medium text-[11px] uppercase tracking-widest mt-1">Sincronização Ativa eSocial ADJPA Cloud</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => selectedIds.length > 0 && setIsIDCardOpen(true)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-md transition-all ${selectedIds.length > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            <Printer size={14} /> Imprimir Crachás ({selectedIds.length})
          </button>
          <button 
            onClick={() => selectedIds.length > 0 && handleDirectPrint()}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-md transition-all ${selectedIds.length > 0 ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            <Printer size={14} /> Imprimir cadastro ({selectedIds.length})
          </button>
          <button 
            onClick={handleNew}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
          >
            <Plus size={14} /> Novo Cadastro
          </button>
        </div>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
         <Search className="text-slate-300 ml-2" size={18}/>
         <input 
          type="text" 
          placeholder="Pesquisar por nome ou matrícula..." 
          className="flex-1 bg-transparent outline-none text-xs font-bold text-slate-700"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
         />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-4 py-4 text-center w-10">
                <div onClick={toggleSelectAll} className="cursor-pointer mx-auto">
                  {selectedIds.length === filtered.length && filtered.length > 0 ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}
                </div>
              </th>
              <th className="px-3 py-4">Matrícula</th>
              <th className="px-3 py-4">Colaborador</th>
              <th className="px-6 py-4">Cargo / Tipo</th>
              <th className="px-6 py-4">Status eSocial</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {filtered.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-4 py-3 text-center">
                  <div onClick={() => setSelectedIds(p => p.includes(emp.id) ? p.filter(id => id !== emp.id) : [...p, emp.id])} className="cursor-pointer mx-auto">
                    {selectedIds.includes(emp.id) ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-600 font-bold">
                  {emp.matricula}
                </td>
                <td className="px-3 py-3 font-bold text-slate-900 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                     {emp.avatar ? (
                       <img src={emp.avatar} alt={emp.employeeName} className="w-full h-full object-cover" />
                     ) : (
                       <User size={20} className="text-slate-400" />
                     )}
                   </div>
                   <div>
                     <p>{emp.employeeName}</p>
                   </div>
                </td>
                <td className="px-6 py-3">
                   <p className="font-bold text-slate-600">{emp.cargo}</p>
                   <p className="text-[9px] text-indigo-500 font-black uppercase">{emp.tipo_contrato}</p>
                </td>
                <td className="px-6 py-3"><span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100">Sincronizado</span></td>
                <td className="px-6 py-3 text-right text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors flex justify-end gap-2">
                   <button onClick={() => { setSelectedIds([emp.id]); setIsIDCardOpen(true); }} title="Imprimir Crachá"><QrCode size={16}/></button>
                   <button onClick={() => { /* Lógica para imprimir cadastro */ window.print(); }} title="Imprimir Cadastro"><Printer size={16}/></button>
                   <button onClick={() => handleEdit(emp)} title="Editar"><Edit2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] w-full max-w-6xl shadow-2xl relative flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-[3rem] shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
                  <Briefcase size={24}/>
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                    {editingEmployee ? 'Editar Colaborador' : 'Nova Admissão Digital'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Sincronização eSocial Ativa</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={18}/> Salvar Registro
                    </>
                  )}
                </button>
                <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all disabled:opacity-50">
                  <X size={24}/>
                </button>
              </div>
            </div>

            <div className="px-8 py-4 bg-white border-b border-slate-100 shrink-0 z-10">
              <div className="flex flex-wrap gap-2 bg-slate-50 p-1.5 rounded-[2rem] border border-slate-100">
                {(['pessoais', 'contrato', 'jornada', 'banco_horas', 'documentos', 'endereco', 'bancarios', 'beneficios', 'esocial', 'dependentes', 'folha'] as EmployeeTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      activeTab === tab 
                        ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab === 'pessoais' && 'Dados Pessoais'}
                    {tab === 'contrato' && 'Contrato'}
                    {tab === 'jornada' && 'Jornada'}
                    {tab === 'banco_horas' && 'Banco de Horas'}
                    {tab === 'documentos' && 'Documentos'}
                    {tab === 'endereco' && 'Endereço'}
                    {tab === 'bancarios' && 'Dados Bancários'}
                    {tab === 'beneficios' && 'Benefícios'}
                    {tab === 'esocial' && 'eSocial'}
                    {tab === 'dependentes' && 'Dependentes'}
                    {tab === 'folha' && 'Folha'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {activeTab === 'pessoais' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-48 space-y-4">
                      <div className="aspect-square bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group cursor-pointer">
                        {formData.avatar ? (
                          <img src={formData.avatar} className="w-full h-auto max-h-full object-contain rounded-[2rem]" alt="Avatar" />
                        ) : (
                          <>
                            <Camera size={32} className="mb-2 group-hover:scale-110 transition-transform"/>
                            <span className="text-[10px] font-black uppercase">Foto 3x4</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setFormData({...formData, avatar: reader.result as string});
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                      <button className="w-full py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all">Remover Foto</button>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      <InputField label="Nome Completo" value={formData.employeeName} onChange={(v:any) => setFormData({...formData, employeeName: v})} placeholder="Digite o nome completo..." icon={User} />
                      <InputField label="CPF" value={formData.cpf} onChange={(v:any) => setFormData({...formData, cpf: maskCPF(v)})} placeholder="000.000.000-00" icon={ShieldCheck} />
                      <InputField label="RG" value={formData.rg} onChange={(v:any) => setFormData({...formData, rg: v})} placeholder="00.000.000-0" icon={FileText} />
                      <InputField label="PIS" value={formData.pis} onChange={(v:any) => setFormData({...formData, pis: v})} placeholder="000.00000.00-0" icon={CreditCard} />
                      <InputField label="CTPS" value={formData.ctps} onChange={(v:any) => setFormData({...formData, ctps: v})} placeholder="00000/000" icon={FileText} />
                      <InputField label="Data de Nascimento" value={formData.birthDate} onChange={(v:any) => setFormData({...formData, birthDate: v})} type="date" icon={Calendar} />
                      <SelectField label="Sexo" value={formData.sexo} onChange={(v:any) => setFormData({...formData, sexo: v})} options={[
                        {label: 'Masculino', value: 'M'}, {label: 'Feminino', value: 'F'}, {label: 'Outro', value: 'O'}
                      ]} />
                      <SelectField label="Estado Civil" value={formData.estado_civil} onChange={(v:any) => setFormData({...formData, estado_civil: v})} options={[
                        {label: 'Solteiro(a)', value: 'SOLTEIRO'}, {label: 'Casado(a)', value: 'CASADO'}, {label: 'Divorciado(a)', value: 'DIVORCIADO'}, {label: 'Viúvo(a)', value: 'VIUVO'}
                      ]} />
                      <SelectField label="Tipo Sanguíneo" value={formData.blood_type} onChange={(v:any) => setFormData({...formData, blood_type: v})} options={[
                        {label: 'A+', value: 'A+'}, {label: 'A-', value: 'A-'}, {label: 'B+', value: 'B+'}, {label: 'B-', value: 'B-'},
                        {label: 'AB+', value: 'AB+'}, {label: 'AB-', value: 'AB-'}, {label: 'O+', value: 'O+'}, {label: 'O-', value: 'O-'}
                      ]} icon={Heart} />
                      <InputField label="Nacionalidade" value={formData.nacionalidade} onChange={(v:any) => setFormData({...formData, nacionalidade: v})} placeholder="Brasileiro(a)" />
                      <InputField label="Naturalidade" value={formData.naturalidade} onChange={(v:any) => setFormData({...formData, naturalidade: v})} placeholder="Cidade/UF" />
                      <InputField label="Escolaridade" value={formData.escolaridade} onChange={(v:any) => setFormData({...formData, escolaridade: v})} placeholder="Ensino Médio, Superior..." />
                      <InputField label="Raça/Cor" value={formData.raca_cor} onChange={(v:any) => setFormData({...formData, raca_cor: v})} placeholder="Branca, Parda, Preta..." />
                      <InputField label="Nome da Mãe" value={formData.nome_mae} onChange={(v:any) => setFormData({...formData, nome_mae: v})} placeholder="Nome completo da mãe" />
                      <InputField label="Nome do Pai" value={formData.nome_pai} onChange={(v:any) => setFormData({...formData, nome_pai: v})} placeholder="Nome completo do pai" />
                      <InputField label="E-mail Pessoal" value={formData.email_pessoal} onChange={(v:any) => setFormData({...formData, email_pessoal: v})} placeholder="email@pessoal.com" icon={Mail} />
                      <InputField label="E-mail Corporativo" value={formData.email} onChange={(v:any) => setFormData({...formData, email: v})} placeholder="email@empresa.com" icon={Mail} />
                      <InputField label="Telefone Fixo" value={formData.telefone} onChange={(v:any) => setFormData({...formData, telefone: v})} placeholder="(00) 0000-0000" icon={Phone} />
                      <InputField label="Celular (WhatsApp)" value={formData.celular} onChange={(v:any) => setFormData({...formData, celular: v})} placeholder="(00) 00000-0000" icon={Phone} />
                      <InputField label="Contato de Emergência" value={formData.emergency_contact} onChange={(v:any) => setFormData({...formData, emergency_contact: v})} placeholder="Nome e Telefone" icon={Phone} />
                      <InputField label="Vínculo com Membro (ID)" value={formData.membro_id} onChange={(v:any) => setFormData({...formData, membro_id: v})} placeholder="ID do Membro (se houver)" icon={Users2} />
                      <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="flex items-center gap-3 pt-6">
                          <input type="checkbox" checked={formData.is_pcd} onChange={(e) => setFormData({...formData, is_pcd: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                          <label className="text-xs font-bold text-slate-600 uppercase">É PCD (Pessoa com Deficiência)</label>
                        </div>
                        {formData.is_pcd && (
                          <SelectField label="Tipo de Deficiência" value={formData.tipo_deficiencia} onChange={(v:any) => setFormData({...formData, tipo_deficiencia: v})} options={[
                            {label: 'Física / Motora', value: 'FISICA'},
                            {label: 'Visual', value: 'VISUAL'},
                            {label: 'Auditiva', value: 'AUDITIVA'},
                            {label: 'Intelectual / Mental', value: 'INTELECTUAL'},
                            {label: 'Múltipla', value: 'MULTIPLA'},
                            {label: 'Outra', value: 'OUTRA'}
                          ]} />
                        )}
                        <div className="md:col-span-2">
                          <InputField label="Observações de Saúde" value={formData.observacoes_saude} onChange={(v:any) => setFormData({...formData, observacoes_saude: v})} placeholder="Informações adicionais relevantes..." />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'endereco' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><MapPin size={14}/> Localização & Endereço</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CEP</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={formData.address?.zipCode} 
                            onChange={(e) => {
                              const v = maskCEP(e.target.value);
                              setFormData({...formData, address: {...formData.address!, zipCode: v}});
                              if (v.length === 9) searchCEP(v.replace('-', ''));
                            }}
                            placeholder="00000-000"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          />
                          {isSearchingCEP && <Loader2 size={14} className="absolute right-4 top-3.5 animate-spin text-indigo-600"/>}
                        </div>
                      </div>
                      <div className="md:col-span-2"><InputField label="Logradouro" value={formData.address?.street} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, street: v}})} placeholder="Rua, Avenida..." /></div>
                      <InputField label="Número" value={formData.address?.number} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, number: v}})} placeholder="123" />
                      <InputField label="Bairro" value={formData.address?.neighborhood} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, neighborhood: v}})} placeholder="Centro" />
                      <InputField label="Cidade" value={formData.address?.city} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, city: v}})} placeholder="São Paulo" />
                      <InputField label="Estado" value={formData.address?.state} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, state: v}})} placeholder="SP" />
                      <InputField label="País" value={formData.address?.country} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, country: v}})} placeholder="Brasil" />
                      <InputField label="Complemento" value={formData.address?.complement} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, complement: v}})} placeholder="Apto, Bloco..." />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contrato' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  <InputField label="Matrícula" value={formData.matricula} readOnly={true} placeholder="Gerada automaticamente" icon={Tag} />
                  <InputField label="Cargo" value={formData.cargo} onChange={(v:any) => setFormData({...formData, cargo: v})} placeholder="Ex: Analista" icon={Briefcase} />
                  <InputField label="Função" value={formData.funcao} onChange={(v:any) => setFormData({...formData, funcao: v})} placeholder="Ex: Desenvolvedor" icon={Star} />
                  <InputField label="Departamento" value={formData.departamento} onChange={(v:any) => setFormData({...formData, departamento: v})} placeholder="Ex: TI" icon={Building} />
                  <InputField label="CBO" value={formData.cbo} onChange={(v:any) => setFormData({...formData, cbo: v})} placeholder="Ex: 2124-05" icon={FileText} />
                  <InputField label="Data de Admissão" value={formData.data_admissao} onChange={(v:any) => setFormData({...formData, data_admissao: v})} type="date" icon={Calendar} />
                  <InputField label="Data de Demissão" value={formData.data_demissao} onChange={(v:any) => setFormData({...formData, data_demissao: v})} type="date" icon={Calendar} />
                  <SelectField label="Tipo de Contrato" value={formData.tipo_contrato} onChange={(v:any) => setFormData({...formData, tipo_contrato: v})} options={[
                    {label: 'CLT', value: 'CLT'}, {label: 'PJ', value: 'PJ'}, {label: 'Voluntário', value: 'VOLUNTARIO'}, {label: 'Temporário', value: 'TEMPORARIO'}
                  ]} icon={FileText} />
                  <SelectField label="Regime de Trabalho" value={formData.regime_trabalho} onChange={(v:any) => setFormData({...formData, regime_trabalho: v})} options={[
                    {label: 'Presencial', value: 'PRESENCIAL'}, {label: 'Híbrido', value: 'HIBRIDO'}, {label: 'Remoto', value: 'REMOTO'}
                  ]} icon={Building} />
                  <InputField label="Sindicato" value={formData.sindicato} onChange={(v:any) => setFormData({...formData, sindicato: v})} placeholder="Nome do sindicato" icon={Users} />
                  <InputField label="Convenção Coletiva" value={formData.convencao_coletiva} onChange={(v:any) => setFormData({...formData, convencao_coletiva: v})} placeholder="Ref. da convenção" icon={FileText} />
                  <InputField label="Salário Base" value={formData.salario_base} onChange={(v:any) => setFormData({...formData, salario_base: parseFloat(v)})} type="number" icon={DollarSign} />
                  <SelectField label="Tipo de Salário" value={formData.tipo_salario} onChange={(v:any) => setFormData({...formData, tipo_salario: v})} options={[
                    {label: 'Mensal', value: 'MENSAL'}, {label: 'Horista', value: 'HORISTA'}, {label: 'Comissionado', value: 'COMISSIONADO'}
                  ]} icon={DollarSign} />
                  <SelectField label="Forma de Pagamento" value={formData.forma_pagamento} onChange={(v:any) => setFormData({...formData, forma_pagamento: v})} options={[
                    {label: 'Transferência Bancária', value: 'TRANSFERENCIA'}, {label: 'PIX', value: 'PIX'}, {label: 'Cheque', value: 'CHEQUE'}, {label: 'Dinheiro', value: 'DINHEIRO'}
                  ]} icon={DollarSign} />
                  <InputField label="Dia do Pagamento" value={formData.dia_pagamento} onChange={(v:any) => setFormData({...formData, dia_pagamento: v})} placeholder="Ex: 5º dia útil" icon={Calendar} />
                </div>
              )}

              {activeTab === 'jornada' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  <InputField label="Jornada de Trabalho" value={formData.jornada_trabalho} onChange={(v:any) => setFormData({...formData, jornada_trabalho: v})} placeholder="Ex: 44h semanais" icon={Clock} />
                  <InputField label="Horário de Trabalho" value={formData.escala_trabalho} onChange={(v:any) => setFormData({...formData, escala_trabalho: v})} placeholder="Ex: 08:00 às 18:00" />
                  <InputField label="Horário de Entrada" value={formData.horario_entrada} onChange={(v:any) => setFormData({...formData, horario_entrada: v})} type="time" />
                  <InputField label="Horário de Saída" value={formData.horario_saida} onChange={(v:any) => setFormData({...formData, horario_saida: v})} type="time" />
                  <InputField label="Início Intervalo" value={formData.inicio_intervalo} onChange={(v:any) => setFormData({...formData, inicio_intervalo: v})} type="time" />
                  <InputField label="Fim Intervalo" value={formData.fim_intervalo} onChange={(v:any) => setFormData({...formData, fim_intervalo: v})} type="time" />
                  <InputField label="Duração Intervalo" value={formData.duracao_intervalo} onChange={(v:any) => setFormData({...formData, duracao_intervalo: v})} placeholder="Ex: 01:00" />
                  <InputField label="Segunda a Sexta" value={formData.segunda_a_sexta} onChange={(v:any) => setFormData({...formData, segunda_a_sexta: v})} placeholder="Ex: 08:00 às 18:00" />
                  <InputField label="Sábado" value={formData.sabado} onChange={(v:any) => setFormData({...formData, sabado: v})} placeholder="Ex: 08:00 às 12:00" />
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" checked={formData.trabalha_feriados} onChange={(e) => setFormData({...formData, trabalha_feriados: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                    <label className="text-xs font-bold text-slate-600 uppercase">Trabalha Feriados</label>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" checked={formData.controla_intervalo} onChange={(e) => setFormData({...formData, controla_intervalo: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                    <label className="text-xs font-bold text-slate-600 uppercase">Controla Intervalo</label>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" checked={formData.horas_extras_autorizadas} onChange={(e) => setFormData({...formData, horas_extras_autorizadas: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                    <label className="text-xs font-bold text-slate-600 uppercase">Horas Extras Autorizadas</label>
                  </div>
                  <InputField label="Tipo de Registro de Ponto" value={formData.tipo_registro_ponto} onChange={(v:any) => setFormData({...formData, tipo_registro_ponto: v})} placeholder="Ex: Biometria" />
                  <InputField label="Tolerância de Ponto" value={formData.tolerancia_ponto} onChange={(v:any) => setFormData({...formData, tolerancia_ponto: v})} placeholder="Ex: 10 min" />
                  <InputField label="Código Escala de Trabalho" value={formData.codigo_horario} onChange={(v:any) => setFormData({...formData, codigo_horario: v})} placeholder="Ex: ESC-001" />
                </div>
              )}

              {activeTab === 'banco_horas' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Total Crédito" value={formData.bh_credito_total} onChange={(v:any) => setFormData({...formData, bh_credito_total: v})} placeholder="Ex: 10:00" />
                    <InputField label="Total Débito" value={formData.bh_debito_total} onChange={(v:any) => setFormData({...formData, bh_debito_total: v})} placeholder="Ex: 02:00" />
                    <InputField label="Saldo Atual" value={formData.bh_saldo_atual} onChange={(v:any) => setFormData({...formData, bh_saldo_atual: v})} placeholder="Ex: 08:00" />
                    <InputField label="Período de Apuração" value={formData.bh_periodo_apuracao} onChange={(v:any) => setFormData({...formData, bh_periodo_apuracao: v})} placeholder="Ex: Mensal" />
                    <InputField label="Data Início Acordo" value={formData.bh_data_inicio_acordo} onChange={(v:any) => setFormData({...formData, bh_data_inicio_acordo: v})} type="date" />
                    <InputField label="Data Fim Acordo" value={formData.bh_data_fim_acordo} onChange={(v:any) => setFormData({...formData, bh_data_fim_acordo: v})} type="date" />
                    <InputField label="Limite de Saldo" value={formData.bh_limite_saldo} onChange={(v:any) => setFormData({...formData, bh_limite_saldo: v})} placeholder="Ex: 40h" />
                    <InputField label="Período de Compensação" value={formData.bh_periodo_compensacao} onChange={(v:any) => setFormData({...formData, bh_periodo_compensacao: v})} placeholder="Ex: 6 meses" />
                    <InputField label="Multiplicador HE Dia" value={formData.bh_multiplicador_diurna} onChange={(v:any) => setFormData({...formData, bh_multiplicador_diurna: v})} placeholder="Ex: 1.5" />
                    <InputField label="Multiplicador HE Noite" value={formData.bh_multiplicador_noturna} onChange={(v:any) => setFormData({...formData, bh_multiplicador_noturna: v})} placeholder="Ex: 2.0" />
                  </div>
                  
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Clock size={14}/> Lançamentos e Histórico</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <input id="bh-data" type="date" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                      <select id="bh-tipo" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                        <option value="CREDITO">Crédito (+)</option>
                        <option value="DEBITO">Débito (-)</option>
                      </select>
                      <input id="bh-horas" type="time" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                      <input id="bh-motivo" placeholder="Motivo/Justificativa" className="md:col-span-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                      <button 
                        onClick={() => {
                          const d = document.getElementById('bh-data') as HTMLInputElement;
                          const t = document.getElementById('bh-tipo') as HTMLSelectElement;
                          const h = document.getElementById('bh-horas') as HTMLInputElement;
                          const m = document.getElementById('bh-motivo') as HTMLInputElement;
                          if (!d.value || !h.value) return alert("Preencha data e horas.");
                          const newLancamento = {
                            id: Math.random().toString(36).substr(2, 9),
                            data: d.value,
                            tipo: t.value,
                            horas: h.value,
                            motivo: m.value,
                            status: 'PENDENTE'
                          };
                          setFormData({...formData, bh_lancamentos: [...(formData.bh_lancamentos || []), newLancamento]});
                          d.value = ''; h.value = ''; m.value = '';
                        }}
                        className="md:col-span-5 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase hover:bg-slate-800 transition-all shadow-lg"
                      >
                        Adicionar Lançamento
                      </button>
                    </div>

                    <div className="space-y-3 mt-4">
                      {formData.bh_lancamentos && formData.bh_lancamentos.length > 0 ? (
                        <table className="w-full text-left">
                          <thead className="bg-slate-100/50 text-[10px] text-slate-500 font-black uppercase tracking-wider border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-3">Data</th>
                              <th className="px-4 py-3">Tipo</th>
                              <th className="px-4 py-3">Horas</th>
                              <th className="px-4 py-3">Motivo</th>
                              <th className="px-4 py-3 text-right">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {formData.bh_lancamentos.map((lanc: any, i: number) => (
                              <tr key={lanc.id} className="hover:bg-slate-50 transition-all bg-white">
                                <td className="px-4 py-3 font-bold text-slate-700">{new Date(lanc.data).toLocaleDateString('pt-BR')}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${lanc.tipo === 'CREDITO' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {lanc.tipo}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-700">{lanc.horas}</td>
                                <td className="px-4 py-3 text-slate-500">{lanc.motivo}</td>
                                <td className="px-4 py-3 text-right">
                                  <button 
                                    onClick={() => setFormData({...formData, bh_lancamentos: formData.bh_lancamentos?.filter((_, idx) => idx !== i)})}
                                    className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-all"
                                  >
                                    <Trash2 size={14}/>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-[10px] text-slate-400 italic font-medium text-center py-4">Nenhum lançamento registrado no período.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'bancarios' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Landmark size={14}/> Dados Bancários & PIX</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField label="Banco" value={formData.banco} onChange={(v:any) => setFormData({...formData, banco: v})} placeholder="Nome do Banco" icon={Building} />
                      <InputField label="Código do Banco" value={formData.codigo_banco} onChange={(v:any) => setFormData({...formData, codigo_banco: v})} placeholder="Ex: 001" />
                      <InputField label="Agência" value={formData.agencia} onChange={(v:any) => setFormData({...formData, agencia: v})} placeholder="0000" />
                      <InputField label="Conta" value={formData.conta} onChange={(v:any) => setFormData({...formData, conta: v})} placeholder="00000-0" />
                      <SelectField label="Tipo de Conta" value={formData.tipo_conta} onChange={(v:any) => setFormData({...formData, tipo_conta: v})} options={[
                        {label: 'Corrente', value: 'CORRENTE'}, {label: 'Poupança', value: 'POUPANCA'}
                      ]} />
                      <InputField label="Titular" value={formData.titular} onChange={(v:any) => setFormData({...formData, titular: v})} placeholder="Nome do titular" />
                      <InputField label="Chave PIX" value={formData.chave_pix} onChange={(v:any) => setFormData({...formData, chave_pix: v})} placeholder="CPF, E-mail, Celular..." icon={QrCode} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'folha' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Clock size={14}/> Horas Extras & Adicionais</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <InputField label="H.E. 50% (Qtd)" value={formData.he50_qtd} onChange={(v:any) => setFormData({...formData, he50_qtd: parseFloat(v)})} type="number" icon={Clock} />
                          <InputField label="H.E. 100% (Qtd)" value={formData.he100_qtd} onChange={(v:any) => setFormData({...formData, he100_qtd: parseFloat(v)})} type="number" icon={Clock} />
                          <InputField label="Adicional Noturno (Qtd)" value={formData.adic_noturno_qtd} onChange={(v:any) => setFormData({...formData, adic_noturno_qtd: parseFloat(v)})} type="number" icon={Clock} />
                          <div className="flex items-center gap-3 pt-6">
                            <input type="checkbox" checked={formData.dsr_ativo} onChange={(e) => setFormData({...formData, dsr_ativo: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                            <label className="text-xs font-bold text-slate-600 uppercase">DSR Ativo</label>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={14}/> Variáveis & Prêmios</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <SelectField label="Grau de Insalubridade" value={formData.insalubridade_grau} onChange={(v:any) => setFormData({...formData, insalubridade_grau: v})} options={[
                            {label: 'Nenhum', value: 'NONE'}, {label: 'Mínimo (10%)', value: 'LOW'}, {label: 'Médio (20%)', value: 'MEDIUM'}, {label: 'Máximo (40%)', value: 'HIGH'}
                          ]} icon={AlertCircle} />
                          <div className="flex items-center gap-3 pt-6">
                            <input type="checkbox" checked={formData.periculosidade_ativo} onChange={(e) => setFormData({...formData, periculosidade_ativo: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                            <label className="text-xs font-bold text-slate-600 uppercase">Periculosidade (30%)</label>
                          </div>
                          <InputField label="ATS (%)" value={formData.ats_percentual} onChange={(v:any) => setFormData({...formData, ats_percentual: parseFloat(v)})} type="number" icon={Percent} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <InputField label="Comissões" value={formData.comissoes} onChange={(v:any) => setFormData({...formData, comissoes: parseFloat(v)})} type="number" icon={DollarSign} />
                          <InputField label="Gratificações" value={formData.gratificacoes} onChange={(v:any) => setFormData({...formData, gratificacoes: parseFloat(v)})} type="number" icon={DollarSign} />
                          <InputField label="Prêmios" value={formData.premios} onChange={(v:any) => setFormData({...formData, premios: parseFloat(v)})} type="number" icon={Award} />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><History size={14}/> Histórico de Folha (Mês Atual)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <InputField label="Faltas (Dias)" value={formData.faltas} onChange={(v:any) => setFormData({...formData, faltas: parseInt(v)})} type="number" />
                          <InputField label="Atrasos (Minutos)" value={formData.atrasos} onChange={(v:any) => setFormData({...formData, atrasos: parseInt(v)})} type="number" />
                          <InputField label="Adiantamento" value={formData.adiantamento} onChange={(v:any) => setFormData({...formData, adiantamento: parseFloat(v)})} type="number" />
                          <InputField label="Pensão Alimentícia" value={formData.pensao_alimenticia} onChange={(v:any) => setFormData({...formData, pensao_alimenticia: parseFloat(v)})} type="number" />
                          <InputField label="Consignado" value={formData.consignado} onChange={(v:any) => setFormData({...formData, consignado: parseFloat(v)})} type="number" />
                          <InputField label="Coparticipações" value={formData.coparticipacoes} onChange={(v:any) => setFormData({...formData, coparticipacoes: parseFloat(v)})} type="number" />
                          <InputField label="Outros Descontos" value={formData.outros_descontos} onChange={(v:any) => setFormData({...formData, outros_descontos: parseFloat(v)})} type="number" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl">
                        <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-60"><ShieldCheck size={14}/> Encargos Patronais</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-[10px] font-bold uppercase opacity-60">INSS Patronal (20%)</span>
                            <span className="text-sm font-black">R$ {(taxEstimates.patronal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-[10px] font-bold uppercase opacity-60">FGTS (8%)</span>
                            <span className="text-sm font-black">R$ {taxEstimates.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="pt-4">
                            <p className="text-[9px] font-bold uppercase opacity-60 mb-1">Custo Total Mensal</p>
                            <p className="text-2xl font-black text-emerald-400">R$ {(formData.salario_base! + taxEstimates.patronal + taxEstimates.fgts).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <p className="text-[9px] opacity-40 mt-1">* Estimativa baseada em configurações fiscais padrão.</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Calculator size={14}/> Impostos e Retenções</h4>
                        <div className="space-y-4">
                          <InputField label="INSS" value={formData.inss} onChange={(v:any) => setFormData({...formData, inss: parseFloat(v)})} type="number" />
                          <InputField label="FGTS Retido" value={formData.fgts_retido} onChange={(v:any) => setFormData({...formData, fgts_retido: parseFloat(v)})} type="number" />
                          <InputField label="IRRF" value={formData.irrf} onChange={(v:any) => setFormData({...formData, irrf: parseFloat(v)})} type="number" />
                          <InputField label="RAT" value={formData.rat} onChange={(v:any) => setFormData({...formData, rat: parseFloat(v)})} type="number" />
                          <InputField label="Terceiros" value={formData.terceiros} onChange={(v:any) => setFormData({...formData, terceiros: parseFloat(v)})} type="number" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'esocial' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  <InputField label="Categoria do Trabalhador" value={formData.esocial_categoria} onChange={(v:any) => setFormData({...formData, esocial_categoria: v})} placeholder="Ex: 101" />
                  <InputField label="Matrícula eSocial" value={formData.esocial_matricula} onChange={(v:any) => setFormData({...formData, esocial_matricula: v})} placeholder="Ex: 0000001" />
                  <InputField label="Natureza da Atividade" value={formData.esocial_natureza_atividade} onChange={(v:any) => setFormData({...formData, esocial_natureza_atividade: v})} placeholder="Ex: Urbana" />
                  <InputField label="Tipo de Regime Previdenciário" value={formData.esocial_tipo_regime_prev} onChange={(v:any) => setFormData({...formData, esocial_tipo_regime_prev: v})} placeholder="Ex: RGPS" />
                  <InputField label="Tipo de Regime Trabalhista" value={formData.esocial_tipo_regime_trab} onChange={(v:any) => setFormData({...formData, esocial_tipo_regime_trab: v})} placeholder="Ex: CLT" />
                  <InputField label="Indicativo de Admissão" value={formData.esocial_indicativo_admissao} onChange={(v:any) => setFormData({...formData, esocial_indicativo_admissao: v})} placeholder="Ex: Normal" />
                  <InputField label="Tipo de Jornada eSocial" value={formData.esocial_tipo_jornada} onChange={(v:any) => setFormData({...formData, esocial_tipo_jornada: v})} placeholder="Ex: Submetido a Horário" />
                  <InputField label="Descrição da Jornada" value={formData.esocial_descricao_jornada} onChange={(v:any) => setFormData({...formData, esocial_descricao_jornada: v})} placeholder="Ex: Segunda a Sexta..." />
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" checked={formData.esocial_contrato_parcial} onChange={(e) => setFormData({...formData, esocial_contrato_parcial: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                    <label className="text-xs font-bold text-slate-600 uppercase">Contrato a Tempo Parcial</label>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" checked={formData.esocial_teletrabalho} onChange={(e) => setFormData({...formData, esocial_teletrabalho: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                    <label className="text-xs font-bold text-slate-600 uppercase">Teletrabalho</label>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" checked={formData.esocial_clausula_asseguratoria} onChange={(e) => setFormData({...formData, esocial_clausula_asseguratoria: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                    <label className="text-xs font-bold text-slate-600 uppercase">Cláusula Assecuratória</label>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" checked={formData.esocial_sucessao_trab} onChange={(e) => setFormData({...formData, esocial_sucessao_trab: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                    <label className="text-xs font-bold text-slate-600 uppercase">Sucessão Trabalhista</label>
                  </div>
                  <InputField label="Tipo de Admissão" value={formData.esocial_tipo_admissao} onChange={(v:any) => setFormData({...formData, esocial_tipo_admissao: v})} placeholder="Ex: Admissão" />
                  <InputField label="CNPJ Empresa Anterior" value={formData.esocial_cnpj_anterior} onChange={(v:any) => setFormData({...formData, esocial_cnpj_anterior: v})} placeholder="00.000.000/0000-00" />
                  <InputField label="Matrícula Anterior" value={formData.esocial_matricula_anterior} onChange={(v:any) => setFormData({...formData, esocial_matricula_anterior: v})} placeholder="Ex: 0000001" />
                  <InputField label="Data de Admissão Origem" value={formData.esocial_data_admissao_origem} onChange={(v:any) => setFormData({...formData, esocial_data_admissao_origem: v})} type="date" />
                </div>
              )}

              {activeTab === 'dependentes' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Users2 size={14}/> Dependentes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField label="Qtd. Dependentes" value={formData.dependentes_qtd} onChange={(v:any) => setFormData({...formData, dependentes_qtd: parseInt(v)})} type="number" icon={Users} />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lista de Dependentes</h5>
                    <div className="space-y-3">
                      {formData.dependentes_lista && formData.dependentes_lista.length > 0 ? (
                        formData.dependentes_lista.map((dep, i) => (
                          <div key={dep.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <div>
                              <p className="text-xs font-bold text-slate-800">{dep.name}</p>
                              <p className="text-[10px] text-slate-500 uppercase font-black">{dep.relationship} • {new Date(dep.birthDate).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <button 
                              onClick={() => setFormData({...formData, dependentes_lista: formData.dependentes_lista?.filter((_, idx) => idx !== i)})}
                              className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"
                            >
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-slate-400 italic font-medium">Nenhum dependente registrado.</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className="md:col-span-2">
                        <input id="emp-dep-name" placeholder="Nome do Dependente" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <select id="emp-dep-rel" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                        <option value="FILHO">Filho(a)</option>
                        <option value="CONJUGE">Cônjuge</option>
                        <option value="PAI">Pai</option>
                        <option value="MAE">Mãe</option>
                        <option value="OUTRO">Outro</option>
                      </select>
                      <input id="emp-dep-birth" type="date" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                      <button 
                        onClick={() => {
                          const n = document.getElementById('emp-dep-name') as HTMLInputElement;
                          const r = document.getElementById('emp-dep-rel') as HTMLSelectElement;
                          const b = document.getElementById('emp-dep-birth') as HTMLInputElement;
                          if (!n.value || !b.value) return alert("Preencha nome e data de nascimento.");
                          const newDep: Dependent = {
                            id: Math.random().toString(36).substr(2, 9),
                            name: n.value,
                            relationship: r.value as any,
                            birthDate: b.value
                          };
                          setFormData({...formData, dependentes_lista: [...(formData.dependentes_lista || []), newDep]});
                          n.value = ''; b.value = '';
                        }}
                        className="md:col-span-4 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase hover:bg-slate-800 transition-all shadow-lg"
                      >
                        Adicionar Dependente à Lista
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'beneficios' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={14}/> Vales & Auxílios</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.vt_ativo} onChange={(e) => setFormData({...formData, vt_ativo: e.target.checked})} className="w-4 h-4 rounded text-indigo-600" />
                            <span className="text-xs font-bold text-slate-600">Vale Transporte</span>
                          </div>
                          <div className="flex gap-2">
                            <input type="number" placeholder="Valor/Dia" value={formData.vt_valor_diario} onChange={(e) => setFormData({...formData, vt_valor_diario: parseFloat(e.target.value)})} className="w-20 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right" />
                            <input type="number" placeholder="Qtd/Dia" value={formData.vt_qtd_vales_dia} onChange={(e) => setFormData({...formData, vt_qtd_vales_dia: parseInt(e.target.value)})} className="w-16 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right" />
                            <input type="number" placeholder="Total" value={formData.vale_transporte_total} readOnly className="w-24 px-3 py-1 bg-slate-100 border-2 border-slate-900 rounded-lg text-xs font-black text-right text-slate-900" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.va_ativo} onChange={(e) => setFormData({...formData, va_ativo: e.target.checked})} className="w-4 h-4 rounded text-indigo-600" />
                            <span className="text-xs font-bold text-slate-600">Vale Alimentação</span>
                          </div>
                          <div className="flex gap-2">
                            <input type="text" placeholder="Operadora" value={formData.va_operadora} onChange={(e) => setFormData({...formData, va_operadora: e.target.value})} className="w-24 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                            <input type="number" placeholder="Total" value={formData.vale_alimentacao} onChange={(e) => setFormData({...formData, vale_alimentacao: parseFloat(e.target.value)})} className="w-24 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.vr_ativo} onChange={(e) => setFormData({...formData, vr_ativo: e.target.checked})} className="w-4 h-4 rounded text-indigo-600" />
                            <span className="text-xs font-bold text-slate-600">Vale Refeição</span>
                          </div>
                          <div className="flex gap-2">
                            <input type="text" placeholder="Operadora" value={formData.vr_operadora} onChange={(e) => setFormData({...formData, vr_operadora: e.target.value})} className="w-24 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                            <input type="number" placeholder="Total" value={formData.vale_refeicao} onChange={(e) => setFormData({...formData, vale_refeicao: parseFloat(e.target.value)})} className="w-24 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right" />
                          </div>
                        </div>
                        <InputField label="Auxílio Moradia" value={formData.auxilio_moradia} onChange={(v:any) => setFormData({...formData, auxilio_moradia: parseFloat(v)})} type="number" icon={Building} />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Heart size={14}/> Saúde & Seguros</h4>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input type="checkbox" checked={formData.ps_ativo} onChange={(e) => setFormData({...formData, ps_ativo: e.target.checked})} className="w-4 h-4 rounded text-indigo-600" />
                              <span className="text-xs font-bold text-slate-600">Plano de Saúde</span>
                            </div>
                            <input type="number" placeholder="Valor" value={formData.plano_saude_colaborador} onChange={(e) => setFormData({...formData, plano_saude_colaborador: parseFloat(e.target.value)})} className="w-24 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right" />
                          </div>
                          {formData.ps_ativo && (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <input type="text" placeholder="Operadora" value={formData.ps_operadora} onChange={(e) => setFormData({...formData, ps_operadora: e.target.value})} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                              <input type="text" placeholder="Tipo Plano" value={formData.ps_tipo_plano} onChange={(e) => setFormData({...formData, ps_tipo_plano: e.target.value})} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                              <input type="text" placeholder="Nº Carteirinha" value={formData.ps_carteirinha} onChange={(e) => setFormData({...formData, ps_carteirinha: e.target.value})} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input type="checkbox" checked={formData.po_ativo} onChange={(e) => setFormData({...formData, po_ativo: e.target.checked})} className="w-4 h-4 rounded text-indigo-600" />
                              <span className="text-xs font-bold text-slate-600">Plano Odontológico</span>
                            </div>
                            <input type="number" placeholder="Valor" value={formData.plano_odontologico} onChange={(e) => setFormData({...formData, plano_odontologico: parseFloat(e.target.value)})} className="w-24 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right" />
                          </div>
                          {formData.po_ativo && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <input type="text" placeholder="Operadora" value={formData.po_operadora} onChange={(e) => setFormData({...formData, po_operadora: e.target.value})} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                              <input type="text" placeholder="Nº Carteirinha" value={formData.po_carteirinha} onChange={(e) => setFormData({...formData, po_carteirinha: e.target.value})} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.ps_dependentes_ativo} onChange={(e) => setFormData({...formData, ps_dependentes_ativo: e.target.checked})} className="w-4 h-4 rounded text-indigo-600" />
                            <span className="text-xs font-bold text-slate-600">Plano Saúde Dependentes</span>
                          </div>
                          <input type="number" placeholder="Valor" value={formData.plano_saude_dependentes} onChange={(e) => setFormData({...formData, plano_saude_dependentes: parseFloat(e.target.value)})} className="w-24 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Vale Farmácia" value={formData.vale_farmacia} onChange={(v:any) => setFormData({...formData, vale_farmacia: parseFloat(v)})} type="number" icon={Plus} />
                          <InputField label="Seguro de Vida" value={formData.seguro_vida} onChange={(v:any) => setFormData({...formData, seguro_vida: parseFloat(v)})} type="number" icon={ShieldCheck} />
                          <InputField label="Auxílio Creche" value={formData.auxilio_creche} onChange={(v:any) => setFormData({...formData, auxilio_creche: parseFloat(v)})} type="number" icon={Building} />
                          <InputField label="Auxílio Educação" value={formData.auxilio_educacao} onChange={(v:any) => setFormData({...formData, auxilio_educacao: parseFloat(v)})} type="number" icon={Building} />
                          <InputField label="Gympass/Wellhub" value={formData.gympass_plano} onChange={(v:any) => setFormData({...formData, gympass_plano: v})} placeholder="Nome do plano" icon={Heart} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documentos' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Título de Eleitor" value={formData.titulo_eleitor} onChange={(v:any) => setFormData({...formData, titulo_eleitor: v})} placeholder="0000 0000 0000" icon={FileText} />
                    <InputField label="Certificado de Reservista" value={formData.reservista} onChange={(v:any) => setFormData({...formData, reservista: v})} placeholder="000000000000" icon={ShieldCheck} />
                    <div className="space-y-1.5">
                      <InputField label="Data do ASO" value={formData.aso_data} onChange={(v:any) => setFormData({...formData, aso_data: v})} type="date" icon={Calendar} />
                      {formData.aso_data && (
                        <div className={`text-[9px] font-black uppercase px-3 py-1 rounded-full w-fit ${getASOStatus(formData.aso_data).color}`}>
                          Status: {getASOStatus(formData.aso_data).label}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><CreditCard size={14}/> CNH (Carteira Nacional de Habilitação)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField label="Número CNH" value={formData.cnh_numero} onChange={(v:any) => setFormData({...formData, cnh_numero: v})} placeholder="00000000000" />
                      <InputField label="Categoria" value={formData.cnh_categoria} onChange={(v:any) => setFormData({...formData, cnh_categoria: v})} placeholder="Ex: AB" />
                      <InputField label="Vencimento" value={formData.cnh_vencimento} onChange={(v:any) => setFormData({...formData, cnh_vencimento: v})} type="date" placeholder="DD/MM/AAAA" />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><CreditCard size={14}/> Upload de Documentos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 bg-white hover:bg-slate-50 transition-all cursor-pointer relative">
                        <Camera size={24} className="mb-2"/>
                        <span className="text-xs font-bold text-slate-600">Documento de Identidade (RG/CNH)</span>
                        <span className="text-[10px] uppercase tracking-widest mt-1">PDF, JPG, PNG</span>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 bg-white hover:bg-slate-50 transition-all cursor-pointer relative">
                        <FileText size={24} className="mb-2"/>
                        <span className="text-xs font-bold text-slate-600">Comprovante de Residência</span>
                        <span className="text-[10px] uppercase tracking-widest mt-1">PDF, JPG, PNG</span>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 bg-white hover:bg-slate-50 transition-all cursor-pointer relative">
                        <Briefcase size={24} className="mb-2"/>
                        <span className="text-xs font-bold text-slate-600">Carteira de Trabalho (CTPS)</span>
                        <span className="text-[10px] uppercase tracking-widest mt-1">PDF, JPG, PNG</span>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 bg-white hover:bg-slate-50 transition-all cursor-pointer relative">
                        <Heart size={24} className="mb-2"/>
                        <span className="text-xs font-bold text-slate-600">ASO (Atestado de Saúde Ocupacional)</span>
                        <span className="text-[10px] uppercase tracking-widest mt-1">PDF, JPG, PNG</span>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isIDCardOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl no-print">
           <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]">
              <div className="p-6 border-b flex justify-between items-center bg-white rounded-t-[2.5rem]">
                 <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md"><Printer size={18}/></div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Prévia de Crachás Corporativos</h3>
                 </div>
                 <button onClick={() => setIsIDCardOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 bg-slate-50 flex flex-col items-center gap-8 custom-scrollbar" id="printable-area">
                {employees.filter(e => selectedIds.includes(e.id)).map(e => (
                   <TemplateCrachaFuncionario key={e.id} employee={e} id={`badge-to-print-${e.id}`} />
                ))}
              </div>
              <div className="p-6 border-t flex flex-col md:flex-row gap-4 bg-white rounded-b-[2.5rem] shadow-inner">
                <button 
                  onClick={handleDownloadPDF} 
                  disabled={isGeneratingPDF} 
                  className="flex-1 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 transition-all"
                >
                  {isGeneratingPDF ? <Loader2 size={18} className="animate-spin"/> : <Download size={18}/>}
                  {isGeneratingPDF ? 'Renderizando Ultra HD...' : `Baixar Crachás HD (${selectedIds.length})`}
                </button>
                <button 
                  onClick={handleDirectPrint}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-2 shadow-xl hover:bg-indigo-700 transition-all"
                >
                  <Printer size={18}/> Imprimir Crachás Agora
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};