/**
 * ============================================================================
 * FUNCIONARIOS.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para funcionarios.
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
import { 
  Briefcase, Plus, QrCode, Square, CheckSquare, Edit2, Search, Building, 
  UserCheck, Printer, X, Download, Loader2, Save, Trash2, Camera, 
  Landmark, DollarSign, MapPin, Calendar, Info, Users, ShieldCheck, 
  Heart, AlertCircle, Wand2, FileText, CreditCard, Clock, Percent,
  MessageSquare, CheckCircle2, XCircle, Calculator, Shield, Target, Lightbulb, BookOpen, Filter,
  CheckCircle, FileSignature, Mail, Phone, Users2, Tag, Star, TrendingUp, Award, History, User
} from 'lucide-react';
import { Payroll, Dependent, UserAuth, TaxConfig, LGPDConsent, LGPDPolicy, Unit } from '../types';
import { DEFAULT_TAX_CONFIG } from '../constants';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { TemplateCrachaFuncionario } from './TemplateCrachaFuncionario';
import { dbService } from '../services/databaseService';
import IndexedDBService from '../src/services/indexedDBService';
import { StorageService } from '../src/services/storageService';
import { useAudit } from '../src/hooks/useAudit';
import LGPDService from '../services/lgpdService';
import LGPDConsentModal from './LGPDConsentModal';
import { ImprimeCadFuncionario } from './ImprimeCadFuncionario';
import AvaliacaoModal from './AvaliacaoModal';
import HistoricoSalarial from './HistoricoSalarial';
import TermoAdesaoLGPD from './TermoAdesaoLGPD';
import AuthService from '../src/services/authService';
import { UnitService } from '../src/services/unitService';
import AvaliacaoService from '../services/avaliacaoService';

interface FuncionariosProps {
  employees: Payroll[];
  currentUnitId: string;
  setEmployees: React.Dispatch<React.SetStateAction<Payroll[]>>;
  user?: UserAuth;
  evaluations: Record<string, any[]>;
  setEvaluations: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
}

type EmployeeTab = 'pessoais' | 'contrato' | 'jornada' | 'banco_horas' | 'documentos' | 'endereco' | 'bancarios' | 'beneficios' | 'esocial' | 'dependentes' | 'folha' | 'lgpd' | 'avaliacao' | 'historico_salarial';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (funcionarios).
 */

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

export const Funcionarios: React.FC<FuncionariosProps> = ({ employees, currentUnitId, setEmployees, user, evaluations, setEvaluations }) => {
  const canWriteEmployees = AuthService.hasPermission(user as any, 'employees', 'write');
  const canWriteHR = AuthService.hasPermission(user as any, 'hr', 'write');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCargo, setFilterCargo] = useState('');
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);
  const [showPrintCadModal, setShowPrintCadModal] = useState(false);

  // Hook de auditoria
  const { logAction } = useAudit(user || null);

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
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  
  // Estados LGPD
  const [showLGPDModal, setShowLGPDModal] = useState(false);
  const [showTermoLGPD, setShowTermoLGPD] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState<LGPDPolicy | null>(null);
  const [employeeConsents, setEmployeeConsents] = useState<LGPDConsent[]>([]);
  const [lgpdReport, setLgpdReport] = useState<any>(null);

  // useEffect do visualizador foi removido daqui e movido para após formData

  // Estado da Unidade
  const [currentUnitData, setCurrentUnitData] = useState<Unit | null>(null);

  // Estados Avaliação
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
  const [editingAvaliacao, setEditingAvaliacao] = useState<any>(null);

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

  useEffect(() => {
    const loadLGPDData = async () => {
      if (currentUnitId) {
        try {
          const policy = await LGPDService.getCurrentPolicy(currentUnitId);
          setCurrentPolicy(policy);
        } catch (error) {
          console.error('Erro ao carregar política LGPD:', error);
        }
      }
    };
    
    loadLGPDData();
  }, [currentUnitId]);

  // Carregar dados da Unidade
  useEffect(() => {
    const loadUnitData = async () => {
      try {
        const unitIdMap: Record<string, string> = {
          'u-sede': '00000000-0000-0000-0000-000000000001',
          'u-matriz': '00000000-0000-0000-0000-000000000001',
        };
        const apiUnitId = unitIdMap[currentUnitId] || currentUnitId;
        const unit = await UnitService.getUnitById(apiUnitId);
        if (unit) {
          setCurrentUnitData(unit);
        }
      } catch (error) {
        console.error('Erro ao carregar unidade:', error);
      }
    };
    if (currentUnitId) loadUnitData();
  }, [currentUnitId]);

  // Carregar consentimentos do funcionário selecionado
  useEffect(() => {
    const loadEmployeeConsents = async () => {
      if (editingEmployee?.id) {
        try {
          const consents = await LGPDService.getUserConsents(editingEmployee.id, currentUnitId);
          setEmployeeConsents(consents);
          
          // Atualizar formData com consentimentos existentes, preservando o anexo se houver
          setFormData(prev => ({ 
            ...prev, 
            lgpdConsent: {
              ...(prev.lgpdConsent || {}),
              dataProcessing: consents.find(c => c.consentType === 'DATA_PROCESSING')?.granted || false,
              communication: consents.find(c => c.consentType === 'COMMUNICATION')?.granted || false,
              marketing: consents.find(c => c.consentType === 'MARKETING')?.granted || false,
              financial: consents.find(c => c.consentType === 'FINANCIAL')?.granted || false,
              consentDate: consents[0]?.consentDate,
              policyVersion: consents[0]?.policyVersion,
              // O documentUrl já está no prev.lgpdConsent se foi carregado do banco ou anexado
            }
          }));
        } catch (error) {
          console.error('Erro ao carregar consentimentos do funcionário:', error);
        }
      }
    };
    
    loadEmployeeConsents();
  }, [editingEmployee?.id, currentUnitId]);

  // Carregar avaliações do funcionário selecionado
  useEffect(() => {
    const loadEmployeeEvaluations = async () => {
      if (editingEmployee?.id) {
        try {
          if (!evaluations[editingEmployee.id]) {
            setEvaluations(prev => ({ ...prev, [editingEmployee.id]: [] }));
          }
        } catch (error) {
          console.error('Erro ao carregar avaliações do funcionário:', error);
        }
      }
    };
    
    loadEmployeeEvaluations();
  }, [editingEmployee?.id, evaluations, setEvaluations]);

  const handleEditAvaliacao = (evaluation: any) => {
    setEditingAvaliacao(evaluation);
    setShowAvaliacaoModal(true);
  };

  const handleNewAvaliacao = () => {
    setEditingAvaliacao(null);
    setShowAvaliacaoModal(true);
  };

  const openDocumentInNewTab = (dataUrl: string, fileName: string) => {
    if (!dataUrl) return;
    
    // Identificar base64 e content type
    const parts = dataUrl.split(';base64,');
    if (parts.length !== 2) {
      window.open(dataUrl, '_blank');
      return;
    }
    
    let contentType = parts[0].split(':')[1];
    if (contentType.includes(';')) contentType = contentType.split(';')[0];
    
    // Validar se é PDF pela assinatura dos dados (JVBER = %PDF-)
    const base64Data = parts[1];
    const isPDFSignature = base64Data.substring(0, 5) === 'JVBER';
    const isPDF = isPDFSignature || contentType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
    
    // Reconstruir o dataUrl com o tipo correto se for PDF
    // Isso é crucial porque se o original for application/octet-stream, o navegador disparará download.
    const viewUrl = isPDF ? `data:application/pdf;base64,${base64Data}` : dataUrl;
    const finalFileName = isPDF && !fileName.toLowerCase().endsWith('.pdf') ? `${fileName}.pdf` : fileName;

    // Criar o HTML da página de visualização
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${finalFileName}</title>
          <style>
            body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background: ${isPDF ? '#525659' : '#000'}; }
            .container { display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; }
            img { max-width: 100%; max-height: 100%; object-fit: contain; }
            object, embed { border: none; width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          <div class="container">
            ${isPDF 
              ? `<object data="${viewUrl}" type="application/pdf" width="100%" height="100%">
                  <embed src="${viewUrl}" type="application/pdf" width="100%" height="100%" />
                 </object>`
              : `<img src="${viewUrl}" alt="${finalFileName}" />`
            }
          </div>
        </body>
      </html>
    `;

    // Abrir em nova aba com document.write (técnica fallback robusta)
    const newWin = window.open('', '_blank');
    if (newWin) {
      newWin.document.write(html);
      newWin.document.close();
    } else {
      alert('O bloqueador de pop-ups impediu a visualização. Por favor, autorize pop-ups para este site.');
    }
  };

  const getInitialFormData = (): Partial<Payroll> => ({
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

  const [formData, setFormData] = useState<Partial<Payroll>>(getInitialFormData());

  // useEffect anterior removido pois agora abrimos em nova aba diretamente

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

  const formatMatricula = (m: string) => {
    if (!m) return '-';
    // Já está no formato correto F01/2026
    if (/^F\d{2,}\/\d{4}$/.test(m)) return m;
    // Formato antigo F001, F002, etc — converte para F01/ano
    const match = m.match(/^F(\d+)$/);
    if (match) {
      const num = parseInt(match[1]).toString().padStart(2, '0');
      return `F${num}/${new Date().getFullYear()}`;
    }
    // Formato legado 2024002 => F02/2024
    const legacyMatch = m.match(/^(\d{4})(\d+)$/);
    if (legacyMatch) {
      const year = legacyMatch[1];
      const num = parseInt(legacyMatch[2], 10).toString().padStart(2, '0');
      return `F${num}/${year}`;
    }
    return m;
  };

  const filtered = employees.filter(e => {
    const searchLower = (searchTerm || '').toLowerCase();
    const normalizeDigits = (val: string) => (val || '').replace(/\D/g, '');
    const searchDigits = normalizeDigits(searchTerm);
    const matriculaFormatada = formatMatricula(e.matricula).toLowerCase();

    const matchesSearch = 
      (e.employeeName || '').toLowerCase().includes(searchLower) ||
      (e.matricula || '').toLowerCase().includes(searchLower) ||
      matriculaFormatada.includes(searchLower) ||
      (e.cpf || '').toLowerCase().includes(searchLower) ||
      (e.email || '').toLowerCase().includes(searchLower) ||
      (e.email_pessoal || '').toLowerCase().includes(searchLower) ||
      (e.telefone || '').toLowerCase().includes(searchLower) ||
      (e.celular || '').toLowerCase().includes(searchLower) ||
      (e.phone || '').toLowerCase().includes(searchLower) ||
      (searchDigits !== '' && normalizeDigits(e.matricula || '').includes(searchDigits)) ||
      (searchDigits !== '' && normalizeDigits(matriculaFormatada || '').includes(searchDigits)) ||
      (searchDigits !== '' && normalizeDigits(e.cpf || '').includes(searchDigits));

    const matchesStatus = !filterStatus || e.status === filterStatus;
    const matchesType = !filterType || e.tipo_contrato === filterType;
    const matchesCargo = !filterCargo || e.cargo === filterCargo;
    
    return matchesSearch && matchesStatus && matchesType && matchesCargo;
  }).sort((a, b) => {
    const parseMatricula = (m: string) => {
      if (!m) return { num: 9999999, ano: 9999 };
      // Formato F01/2026 ou F01/2024
      const withYear = m.match(/^F(\d+)\/(\d+)$/);
      if (withYear) return { num: parseInt(withYear[1]), ano: parseInt(withYear[2]) };
      // Formato F01 (sem ano)
      const noYear = m.match(/^F(\d+)$/);
      if (noYear) return { num: parseInt(noYear[1]), ano: 0 };
      // Formato legado 2024003 → ano=2024, num=3
      const legacy = m.match(/^(\d{4})(\d+)$/);
      if (legacy) return { num: parseInt(legacy[2]), ano: parseInt(legacy[1]) };
      // Qualquer número puro
      const pure = m.match(/^(\d+)$/);
      if (pure) return { num: parseInt(pure[1]), ano: 0 };
      return { num: 9999999, ano: 9999 };
    };

    const matA = parseMatricula(a.matricula || '');
    const matB = parseMatricula(b.matricula || '');

    if (matA.ano !== matB.ano) return matA.ano - matB.ano;
    return matA.num - matB.num;
  });


  const getNextEmployeeMatricula = () => {
    const currentYear = new Date().getFullYear();
    
    const numbers = employees
      .filter(e => e.matricula && e.matricula.startsWith('F'))
      .map(e => {
        const withYear = e.matricula.match(/F(\d+)\/(\d+)/);
        if (withYear) return { num: parseInt(withYear[1]), ano: parseInt(withYear[2]) };
        const noYear = e.matricula.match(/F(\d+)/);
        return noYear ? { num: parseInt(noYear[1]), ano: currentYear } : { num: 0, ano: 0 };
      })
      .filter(m => m.ano === currentYear)
      .map(m => m.num);
    
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;
    const paddedNumber = nextNumber.toString().padStart(2, '0');
    
    return `F${paddedNumber}/${currentYear}`;
  };

  const handleDocumentUpload = async (file: File, docType: string) => {
    if (!file) return;
    if (!StorageService.validateFileSize(file, 10)) {
      alert('Arquivo muito grande. Máximo 10MB.');
      return;
    }
    const employeeId = editingEmployee?.id || `E${Date.now()}`;
    setUploadingDoc(docType);
    try {
      const url = await StorageService.uploadEmployeeDocument(currentUnitId, employeeId, docType, file);
      const field = `doc_${docType}` as any;
      setFormData(prev => ({ ...prev, [field]: url, documentos_upload: url }));
      alert(`Documento "${docType}" enviado com sucesso.`);
    } catch (e) {
      alert('Erro ao enviar documento.');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleLGPDConsent = async (consent: LGPDConsent) => {
    try {
      await LGPDService.saveConsent(consent);
      
      setFormData(prev => ({
        ...prev,
        lgpdConsent: {
          ...(prev.lgpdConsent || {}),
          dataProcessing: consent.consentType === 'DATA_PROCESSING' ? consent.granted : (prev.lgpdConsent?.dataProcessing || false),
          communication: consent.consentType === 'COMMUNICATION' ? consent.granted : (prev.lgpdConsent?.communication || false),
          marketing: consent.consentType === 'MARKETING' ? consent.granted : (prev.lgpdConsent?.marketing || false),
          financial: consent.consentType === 'FINANCIAL' ? consent.granted : (prev.lgpdConsent?.financial || false),
          consentDate: consent.consentDate,
          policyVersion: consent.policyVersion
          // documentUrl é preservado pelo spread
        }
      }));

      // Registrar auditoria
      await logAction('CREATE', 'LGPDConsent', consent.id, `Consentimento LGPD registrado para ${formData.employeeName}`, {
        consentType: consent.consentType,
        granted: consent.granted,
        policyVersion: consent.policyVersion
      });

      console.log('✅ Consentimento LGPD salvo com sucesso');
      alert('Consentimento LGPD salvo com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar consentimento LGPD:', error);
      alert('Erro ao salvar consentimento LGPD. Tente novamente.');
    }
  };

  const handleSaveAvaliacao = async (avaliacao: any) => {
    if (!canWriteHR) {
      alert('Você não tem permissão para alterar avaliações de RH.');
      return;
    }

    try {
      console.log('💾 Salvando avaliação no banco:', avaliacao);

      // Normalizar unitId
      const unitIdMap: Record<string, string> = {
        'u-sede':  '00000000-0000-0000-0000-000000000001',
        'u-matriz':'00000000-0000-0000-0000-000000000001',
      };
      const apiUnitId = unitIdMap[currentUnitId] || currentUnitId;

      const payload = {
        ...avaliacao,
        unitId: apiUnitId,
        employeeId: editingEmployee?.id,
        employeeName: editingEmployee?.employeeName || formData.employeeName,
        evaluationDate: avaliacao.evaluationDate || new Date().toISOString().split('T')[0],
        evaluationType: avaliacao.evaluationType || 'ANNUAL',
        overallScore: avaliacao.overallScore || 0,
        overallRating: avaliacao.overallRating || 'SATISFACTORY',
        competencies: avaliacao.competencies || [],
        goals: avaliacao.goals || [],
        strengths: Array.isArray(avaliacao.strengths) ? avaliacao.strengths.join('; ') : (avaliacao.strengths || null),
        improvements: Array.isArray(avaliacao.improvementAreas) ? avaliacao.improvementAreas.join('; ') : (avaliacao.improvementAreas || null),
        actionPlan: avaliacao.comments || null,
        status: avaliacao.status || 'COMPLETED',
        evaluatedBy: avaliacao.evaluatorName || null,
      };

      // Salvar no banco via AvaliacaoService
      await AvaliacaoService.saveEvaluation(payload);

      // Atualizar estado local para refletir imediatamente
      if (editingEmployee?.id) {
        const currentEvals = evaluations[editingEmployee.id] || [];
        const existingIndex = currentEvals.findIndex(e => e.id === avaliacao.id);
        if (existingIndex >= 0) {
          const updated = [...currentEvals];
          updated[existingIndex] = { ...avaliacao, overallScore: payload.overallScore };
          setEvaluations(prev => ({ ...prev, [editingEmployee.id]: updated }));
        } else {
          setEvaluations(prev => ({ ...prev, [editingEmployee.id]: [...currentEvals, { ...avaliacao, overallScore: payload.overallScore }] }));
        }
      }

      await logAction('CREATE', 'AvaliacaoDesempenho', avaliacao.id, `Avaliação registrada para ${formData.employeeName}`, {
        evaluationType: avaliacao.evaluationType,
        overallScore: avaliacao.overallScore,
        status: avaliacao.status
      });

      console.log('✅ Avaliação salva no banco com sucesso');
      alert('Avaliação salva com sucesso!');
    } catch (error: any) {
      console.error('❌ Erro ao salvar avaliação:', error);
      alert('Erro ao salvar avaliação: ' + (error.message || 'Verifique o console.'));
    }
  };

  const handleGenerateLGPDReport = async () => {
    try {
      const report = await LGPDService.generateConsentReport(currentUnitId);
      setLgpdReport(report);
      
      // Exportar relatório em JSON
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-lgpd-funcionarios-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ Relatório LGPD de funcionários gerado com sucesso');
      alert('Relatório LGPD de funcionários gerado e baixado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar relatório LGPD:', error);
      alert('Erro ao gerar relatório LGPD. Tente novamente.');
    }
  };

  const handleSave = async () => {
    if (!canWriteEmployees) {
      alert('Você não tem permissão para criar ou editar funcionários.');
      return;
    }

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
      const generatedMatricula = formData.matricula
        ? formatMatricula(formData.matricula)
        : getNextEmployeeMatricula();

      const employeeData = {
        ...formData,
        id: employeeId,
        matricula: generatedMatricula,
        unitId: currentUnitId,
        criadoEm: editingEmployee?.criadoEm || editingEmployee?.createdAt || new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
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
          action: `${user?.nome || 'Usuário'} alterou o cadastro do funcionário ${employeeData.employeeName}`,
          changedFields: getChangedEmployeeFields(editingEmployee, formData)
        });
        console.log("🔍 Auditoria: Atualização de funcionário registrada");
      } else {
        await logAction('CREATE', 'Employee', employeeData.id, employeeData.employeeName, { 
          action: `${user?.nome || 'Usuário'} cadastrou novo funcionário: ${employeeData.employeeName}`
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
          matricula: generatedMatricula,
          employeeName: employeeData.employeeName,
          unitId: currentUnitId,
        } as Payroll;
        setEmployees(prev => [...prev, newEmployee]);
        console.log("✅ Funcionário adicionado na lista global");
      }

      setIsModalOpen(false);
      setEditingEmployee(null);
      alert("Funcionário salvo com sucesso!");
      
    } catch (error: any) {
      console.error("❌ Erro ao salvar funcionário:", error);
      alert("Falha ao salvar funcionário. " + (error.message || "Verifique o console para mais detalhes."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (emp: Payroll) => {
    const baseForm = getInitialFormData();
    const empWithMatricula: Partial<Payroll> = {
      ...baseForm,
      ...emp,
      matricula: emp.matricula ? formatMatricula(emp.matricula) : getNextEmployeeMatricula(),
      employeeName: emp.employeeName || (emp as any).employee_name || '',
      email: emp.email || (emp as any).email_pessoal || '',
      phone: emp.phone || (emp as any).telefone || '',
      telefone: (emp as any).telefone || emp.phone || '',
      celular: (emp as any).celular || emp.phone || '',
      departamento: emp.departamento || (emp as any).department || '',
      funcao: emp.funcao || emp.cargo || '',
      data_admissao: emp.data_admissao || (emp as any).admissionDate || '',
      salario_base: emp.salario_base ?? (emp as any).salary ?? 0,
      unitId: emp.unitId || currentUnitId,
      status: emp.status || 'ACTIVE',
      tipo_contrato: emp.tipo_contrato || 'CLT',
      tipo_salario: (emp as any).tipo_salario || 'MENSAL',
      regime_trabalho: (emp as any).regime_trabalho || 'PRESENCIAL',
      jornada_trabalho: (emp as any).jornada_trabalho || '44h',
      address: {
        ...baseForm.address!,
        ...(emp.address || {}),
        zipCode: emp.address?.zipCode || (emp as any).cep || '',
        street: emp.address?.street || (emp as any).address || '',
        number: emp.address?.number || (emp as any).numero || '',
        neighborhood: emp.address?.neighborhood || (emp as any).bairro || '',
        city: emp.address?.city || (emp as any).cidade || '',
        state: emp.address?.state || (emp as any).estado || '',
        country: (emp as any).address?.country || 'Brasil',
        complement: emp.address?.complement || (emp as any).complemento || '',
      } as any,
      vt_ativo: !!emp.vt_ativo,
      va_ativo: !!emp.va_ativo,
      vr_ativo: !!emp.vr_ativo,
      ps_ativo: !!emp.ps_ativo,
      po_ativo: !!emp.po_ativo,
      dsr_ativo: emp.dsr_ativo !== undefined ? !!emp.dsr_ativo : true,
      periculosidade_ativo: !!emp.periculosidade_ativo,
      is_pcd: !!emp.is_pcd,
      dependentes_lista: Array.isArray((emp as any).dependentes_lista) ? (emp as any).dependentes_lista : [],
      bh_lancamentos: Array.isArray((emp as any).bh_lancamentos) ? (emp as any).bh_lancamentos : [],
      otherMinistries: Array.isArray((emp as any).otherMinistries) ? (emp as any).otherMinistries : []
    };

    setEditingEmployee(empWithMatricula as Payroll);
    setFormData(empWithMatricula);
    setIsModalOpen(true);
    setActiveTab('pessoais');
  };

  const handleNew = () => {
    setEditingEmployee(null);
    const generatedMatricula = getNextEmployeeMatricula();
    setFormData({
      ...getInitialFormData(),
      matricula: generatedMatricula,
      unitId: currentUnitId,
      vale_alimentacao: taxConfig.defaultVA || 0,
      vale_refeicao: taxConfig.defaultVR || 0,
    });
    setIsModalOpen(true);
    setActiveTab('pessoais');
  };

  const searchCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;
    setIsSearchingCEP(true);
    try {
      // Tenta via proxy do backend (evita CORS)
      let data: any = null;
      try {
        const res = await fetch(`/api/cep/${cleanCEP}`);
        if (res.ok) data = await res.json();
      } catch { /* fallback para ViaCEP direto */ }

      // Fallback: ViaCEP direto
      if (!data) {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        if (res.ok) data = await res.json();
      }

      if (data && !data.erro && !data.error) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address!,
            zipCode: data.cep || cep,
            street: data.logradouro || data.street || '',
            complement: prev.address?.complement || '',
            neighborhood: data.bairro || data.neighborhood || '',
            city: data.localidade || data.city || '',
            state: data.uf || data.state || '',
            country: prev.address?.country || 'Brasil'
          }
        }));
      } else {
        alert('CEP não encontrado. Verifique e tente novamente.');
      }
    } catch (e) { console.error(e); }
    finally { setIsSearchingCEP(false); }
  };

  const getResolvedTaxConfig = () => {
    const source: any = taxConfig || DEFAULT_TAX_CONFIG || {};

    return {
      inssBrackets: Array.isArray(source.inssBrackets)
        ? source.inssBrackets
        : Array.isArray(source.inss)
          ? source.inss
          : [],
      irrfBrackets: Array.isArray(source.irrfBrackets)
        ? source.irrfBrackets
        : Array.isArray(source.irrf)
          ? source.irrf
          : [],
      fgtsRate: source.fgtsRate ?? source.fgts?.rate ?? 0.08,
      patronalRate: source.patronalRate ?? source.patronal?.rate ?? 0,
    };
  };

  const calculateTaxes = (base: number) => {
    if (!base || isNaN(base)) return { inss: 0, irrf: 0, net: 0, patronal: 0, fgts: 0 };

    const resolvedTaxConfig = getResolvedTaxConfig();

    let inss = 0;
    let remaining = base;

    for (const bracket of resolvedTaxConfig.inssBrackets) {
      const prevLimit = resolvedTaxConfig.inssBrackets[resolvedTaxConfig.inssBrackets.indexOf(bracket) - 1]?.limit || 0;
      const range = Math.min(remaining, (bracket.limit || Infinity) - prevLimit);
      if (range <= 0) break;
      inss += range * bracket.rate;
      if (bracket.limit && base <= bracket.limit) break;
      remaining -= range;
    }

    const irrfBase = base - inss - (formData.dependentes_qtd || 0) * 189.59;
    let irrf = 0;

    for (const bracket of resolvedTaxConfig.irrfBrackets) {
      if (irrfBase > (resolvedTaxConfig.irrfBrackets[resolvedTaxConfig.irrfBrackets.indexOf(bracket) - 1]?.limit || 0)) {
        irrf = (irrfBase * bracket.rate) - bracket.deduction;
      }
    }
    irrf = Math.max(0, irrf);

    const fgts = base * resolvedTaxConfig.fgtsRate;
    const patronal = base * resolvedTaxConfig.patronalRate;
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

  const handleDirectPrint = async () => {
    const selectedEmployees = employees.filter(e => selectedIds.includes(e.id));
    if (selectedEmployees.length === 0) return;

    setIsGeneratingPDF(true);
    try {
      const images: { dataUrl: string; widthPx: number; heightPx: number }[] = [];

      for (const emp of selectedEmployees) {
        const el = document.getElementById(`badge-to-print-${emp.id}`);
        if (!el) continue;
        const canvas = await html2canvas(el, {
          scale: 4,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          imageTimeout: 0,
        });
        images.push({
          dataUrl: canvas.toDataURL('image/png', 1.0),
          widthPx: canvas.width,
          heightPx: canvas.height,
        });
      }

      if (images.length === 0) {
        alert('Nenhum crachá encontrado para imprimir.');
        return;
      }

      // Converte px → mm e monta HTML com imagens (sem depender de CSS externo)
      const imgsHtml = images.map(img => {
        const widthMm  = (img.widthPx  / 4 / 96) * 25.4;
        const heightMm = (img.heightPx / 4 / 96) * 25.4;
        return `<img src="${img.dataUrl}" style="display:block;width:${widthMm}mm;height:${heightMm}mm;margin:0 auto;" />`;
      }).join('\n');

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Crachás de Funcionários</title>
  <style>
    @page { size: A4; margin: 35mm 12mm 15mm 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    html, body { margin: 0; padding: 0; background: white; }
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8mm;
      padding: 12mm 0 0 0;
    }
    img {
      display: block;
      page-break-inside: avoid;
      break-inside: avoid;
    }
  </style>
</head>
<body>
  ${imgsHtml}
</body>
</html>`;

      const win = window.open('', '_blank', 'width=900,height=700');
      if (!win) {
        alert('Habilite pop-ups para imprimir.');
        return;
      }
      win.document.write(html);
      win.document.close();
      win.onload = () => {
        win.focus();
        setTimeout(() => win.print(), 600);
      };
    } catch (e) {
      console.error('Erro ao preparar impressão:', e);
      alert('Erro ao preparar impressão. Tente usar o botão "Baixar PDF".');
    } finally {
      setIsGeneratingPDF(false);
    }
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
            onClick={() => setShowPrintCadModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-md transition-all bg-slate-600 text-white hover:bg-slate-700"
          >
            <Printer size={14} /> Imprimir Cadastro
            {selectedIds.length > 0 && <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-[9px]">{selectedIds.length} sel.</span>}
          </button>
          <button 
            onClick={handleNew}
            disabled={!canWriteEmployees}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={14} /> Novo Cadastro
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, matrícula, e-mail ou CPF..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(p => !p)}
          className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-xl font-bold text-xs transition-all whitespace-nowrap ${showFilters ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
        >
          <Filter size={18} /> Filtros Avançados
          {(filterStatus || filterType || filterCargo) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block ml-1"/>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1 ml-1">Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Todos os Status</option>
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
              <option value="SUSPENDED">Afastado</option>
              <option value="TERMINATED">Desligado</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1 ml-1">Tipo de Contrato</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Todos os Tipos</option>
              <option value="CLT">CLT</option>
              <option value="ESTAGIO">Estágio</option>
              <option value="AUTONOMO">Autônomo</option>
              <option value="PJ">PJ</option>
              <option value="TEMPORARIO">Temporário</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1 ml-1">Cargo</label>
            <select value={filterCargo} onChange={e => setFilterCargo(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Todos os Cargos</option>
              {[...new Set(employees.map(e => e.cargo).filter(Boolean))].sort().map(cargo => (
                <option key={cargo} value={cargo}>{cargo}</option>
              ))}
            </select>
          </div>
          {(filterStatus || filterType || filterCargo) && (
            <button 
              onClick={() => { setFilterStatus(''); setFilterType(''); setFilterCargo(''); }} 
              className="md:col-span-3 text-[10px] font-black uppercase text-rose-500 hover:text-rose-700 transition-colors flex items-center justify-center gap-1 py-1"
            >
              <X size={12} /> Limpar filtros aplicados
            </button>
          )}
        </div>
      )}

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
                  {formatMatricula(emp.matricula)}
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
                   <button onClick={() => { setSelectedIds([emp.id]); setShowPrintCadModal(true); }} title="Imprimir Cadastro"><Printer size={16}/></button>
                   <button onClick={() => handleEdit(emp)} disabled={!canWriteEmployees} title="Editar"><Edit2 size={16}/></button>
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
                  onClick={() => setIsModalOpen(false)} 
                  disabled={isSaving} 
                  className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all disabled:opacity-50"
                >
                  <X size={24}/>
                </button>
              </div>
            </div>

            <div className="px-8 py-4 bg-white border-b border-slate-100 shrink-0 z-10">
              <div className="flex flex-wrap gap-2 bg-slate-50 p-1.5 rounded-[2rem] border border-slate-100">
                {(['pessoais', 'contrato', 'jornada', 'banco_horas', 'documentos', 'endereco', 'bancarios', 'beneficios', 'esocial', 'dependentes', 'folha', 'lgpd', 'avaliacao', 'historico_salarial'] as EmployeeTab[]).map((tab) => (
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
                    {tab === 'lgpd' && 'LGPD'}
                    {tab === 'avaliacao' && 'Avaliação'}
                    {tab === 'historico_salarial' && 'Histórico Salarial'}
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
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" checked={!!formData.primeiro_emprego} onChange={(e) => setFormData({...formData, primeiro_emprego: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                    <label className="text-xs font-bold text-slate-600 uppercase">Primeiro Emprego</label>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" checked={!!formData.optante_fgts} onChange={(e) => setFormData({...formData, optante_fgts: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                    <label className="text-xs font-bold text-slate-600 uppercase">Optante FGTS</label>
                  </div>
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
                      <InputField label="Dígito Agência" value={formData.banco_digito_agencia} onChange={(v:any) => setFormData({...formData, banco_digito_agencia: v})} placeholder="0" />
                      <InputField label="Conta" value={formData.conta} onChange={(v:any) => setFormData({...formData, conta: v})} placeholder="00000-0" />
                      <InputField label="Dígito Conta" value={formData.banco_digito_conta} onChange={(v:any) => setFormData({...formData, banco_digito_conta: v})} placeholder="0" />
                      <SelectField label="Tipo de Conta" value={formData.tipo_conta} onChange={(v:any) => setFormData({...formData, tipo_conta: v})} options={[
                        {label: 'Corrente', value: 'CORRENTE'}, {label: 'Poupança', value: 'POUPANCA'}
                      ]} />
                      <InputField label="Titular" value={formData.titular} onChange={(v:any) => setFormData({...formData, titular: v})} placeholder="Nome do titular" />
                      <SelectField label="Tipo Chave PIX" value={formData.banco_tipo_chave_pix} onChange={(v:any) => setFormData({...formData, banco_tipo_chave_pix: v})} options={[
                        {label: 'CPF', value: 'CPF'}, {label: 'CNPJ', value: 'CNPJ'}, {label: 'E-mail', value: 'EMAIL'}, {label: 'Telefone', value: 'TELEFONE'}, {label: 'Aleatória', value: 'ALEATORIA'}
                      ]} icon={QrCode} />
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

              {activeTab === 'lgpd' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  {/* Resumo de Consentimentos Atuais */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-6 flex items-center gap-2">
                      <Shield size={14} />
                      Consentimentos LGPD Atuais
                    </h4>
                    
                    {employeeConsents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {employeeConsents.map((consent, index) => (
                          <div key={index} className="bg-white p-4 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold text-slate-900">
                                {consent.consentType === 'DATA_PROCESSING' && 'Tratamento de Dados'}
                                {consent.consentType === 'COMMUNICATION' && 'Comunicação'}
                                {consent.consentType === 'MARKETING' && 'Marketing'}
                                {consent.consentType === 'FINANCIAL' && 'Financeiro'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                consent.granted 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {consent.granted ? 'Concedido' : 'Revogado'}
                              </span>
                            </div>
                            
                            <div className="space-y-2 text-sm text-slate-600">
                              <div>Data: {new Date(consent.consentDate).toLocaleDateString('pt-BR')}</div>
                              <div>Versão: {consent.policyVersion}</div>
                              {consent.revokedDate && (
                                <div>Revogado em: {new Date(consent.revokedDate).toLocaleDateString('pt-BR')}</div>
                              )}
                              {consent.revokedReason && (
                                <div>Motivo: {consent.revokedReason}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : formData.lgpdConsent?.documentUrl ? (
                      <div className="text-center py-6 bg-white rounded-xl border border-green-200">
                        <Shield className="w-12 h-12 mx-auto mb-3 text-green-500" />
                        <p className="font-bold text-green-700 mb-1">Termo Assinado Anexado</p>
                        <p className="text-xs text-slate-500 mb-4 px-4">O documento de consentimento físico foi digitalizado e arquivado com sucesso.</p>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            if (formData.lgpdConsent?.documentUrl) {
                              openDocumentInNewTab(
                                formData.lgpdConsent.documentUrl, 
                                `Termo-LGPD-${formData.employeeName || 'Funcionario'}`
                              );
                            }
                          }}
                          className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold uppercase hover:bg-green-100 transition-all inline-flex items-center gap-2 transform active:scale-95"
                        >
                          <Search size={14} /> Visualizar Termo em Nova Aba
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <Shield className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Nenhum consentimento LGPD registrado no sistema digital.</p>
                        <p className="text-[11px] px-6 mt-2">Clique no botão "LGPD" abaixo para registrar digitalmente, ou anexe o documento impresso e assinado no botão lateral correspondente.</p>
                      </div>
                    )}
                  </div>

                  {/* Ações de Gestão */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase mb-4 flex items-center gap-2">
                        <Download size={14} />
                        Relatórios
                      </h4>
                      
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            if (!currentUnitData?.nome || !currentUnitData?.cnpj) {
                              alert('Aguarde o carregamento dos dados da instituição ou verifique a conexão com o servidor.');
                              return;
                            }
                            setShowTermoLGPD(true);
                          }}
                          className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <FileText size={16} />
                          {currentUnitData ? 'Imprimir Termo LGPD' : 'Carregando dados da Instituição...'}
                        </button>
                        
                        <div className="relative mt-3">
                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData(prev => ({
                                    ...prev,
                                    lgpdConsent: {
                                      ...(prev.lgpdConsent || {
                                        dataProcessing: true, communication: true, marketing: true, financial: true, policyVersion: currentPolicy?.version || '1.0'
                                      }),
                                      documentUrl: reader.result as string
                                    }
                                  }));
                                  alert('O Termo foi lido pelo navegador! Não esqueça de Salvar o Registro de RH para enviar ao banco de dados.');
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title="Anexar documento impresso/assinado"
                          />
                          <button
                            type="button"
                            className="w-full py-3 bg-slate-600 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 pointer-events-none"
                          >
                            <FileSignature size={16} />
                            Anexar Termo Assinado
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <h4 className="text-[10px] font-black text-red-600 uppercase mb-4 flex items-center gap-2">
                        <AlertCircle size={14} />
                        Direitos LGPD
                      </h4>
                      
                      <div className="space-y-3 text-sm text-slate-600">
                        <p>• <strong>Acesso:</strong> Você pode solicitar todos os seus dados pessoais.</p>
                        <p>• <strong>Correção:</strong> Solicitar correção de dados incorretos.</p>
                        <p>• <strong>Portabilidade:</strong> Exportar seus dados em formato estruturado.</p>
                        <p>• <strong>Esquecimento:</strong> Solicitar exclusão de seus dados.</p>
                        <p>• <strong>Revogação:</strong> Retirar consentimentos a qualquer momento.</p>
                      </div>
                    </div>
                  </div>

                  {/* Informações da Política Atual */}
                  {currentPolicy && (
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase mb-4 flex items-center gap-2">
                        <BookOpen size={14} />
                        Política de Privacidade Atual
                      </h4>
                      
                      <div className="space-y-2 text-sm">
                        <div><strong>Versão:</strong> {currentPolicy.version}</div>
                        <div><strong>Vigência:</strong> {new Date(currentPolicy.effectiveDate).toLocaleDateString('pt-BR')}</div>
                        <div><strong>Status:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            currentPolicy.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {currentPolicy.isActive ? 'Ativa' : 'Inativa'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'avaliacao' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  {/* Histórico de Avaliações */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2">
                        <Award size={14} />
                        Histórico de Avaliações
                      </h4>
                      <button
                        onClick={handleNewAvaliacao}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                      >
                        <Plus size={16} />
                        Nova Avaliação
                      </button>
                    </div>
                    
                    {evaluations[editingEmployee?.id || ''] && evaluations[editingEmployee?.id || ''].length > 0 ? (
                      <div className="space-y-4">
                        {evaluations[editingEmployee?.id || ''].map((evaluation, index) => (
                          <div key={index} className="bg-white p-4 rounded-xl border border-slate-200">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h5 className="font-semibold text-slate-900">{evaluation.evaluationPeriod || 'Período não definido'}</h5>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    evaluation.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                    evaluation.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-700'
                                  }`}>
                                    {evaluation.status === 'APPROVED' && 'Aprovado'}
                                    {evaluation.status === 'SUBMITTED' && 'Enviado'}
                                    {evaluation.status === 'DRAFT' && 'Rascunho'}
                                    {!evaluation.status && 'Sem status'}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    evaluation.overallRating === 'EXCELLENT' ? 'bg-emerald-100 text-emerald-700' :
                                    evaluation.overallRating === 'GOOD' ? 'bg-blue-100 text-blue-700' :
                                    evaluation.overallRating === 'SATISFACTORY' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-orange-100 text-orange-700'
                                  }`}>
                                    {evaluation.overallRating === 'EXCELLENT' && 'Excelente'}
                                    {evaluation.overallRating === 'GOOD' && 'Bom'}
                                    {evaluation.overallRating === 'SATISFACTORY' && 'Satisfatório'}
                                    {evaluation.overallRating === 'NEEDS_IMPROVEMENT' && 'Precisa Melhorar'}
                                    {!evaluation.overallRating && 'Sem classificação'}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{evaluation.evaluationDate ? new Date(evaluation.evaluationDate).toLocaleDateString('pt-BR') : 'Data não definida'}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User size={14} />
                                    <span>{evaluation.evaluatorName || 'Avaliador não definido'}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <TrendingUp size={14} />
                                    <span>Score: {evaluation.overallScore || 0}</span>
                                  </div>
                                </div>
                                
                                {/* Score Visual */}
                                <div className="mb-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-600">Desempenho:</span>
                                    <div className="flex-1 max-w-xs">
                                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                                          style={{ width: `${evaluation.overallScore || 0}%` }}
                                        />
                                      </div>
                                    </div>
                                    <span className="text-sm font-bold text-indigo-600">{evaluation.overallScore || 0}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleEditAvaliacao(evaluation)}
                                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                  <Download size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <Award className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Nenhuma avaliação encontrada</p>
                        <p className="text-sm">Clique em "Nova Avaliação" para começar.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'historico_salarial' && (
                <HistoricoSalarial 
                  employees={employees}
                  currentUnitId={currentUnitId}
                  user={user}
                  selectedEmployee={editingEmployee || undefined}
                />
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
                            nome: n.value,
                            name: n.value,
                            parentesco: r.value as any,
                            relationship: r.value as any,
                            dataNascimento: b.value,
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
                    <p className="text-[10px] text-slate-400">Os documentos são convertidos para base64 e salvos no banco de dados junto com o cadastro do funcionário. Clique em "Salvar Registro" após anexar.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: 'rg_cnh', label: 'Documento de Identidade (RG/CNH)', icon: <Camera size={24} className="mb-2"/> },
                        { key: 'comprovante_residencia', label: 'Comprovante de Residência', icon: <FileText size={24} className="mb-2"/> },
                        { key: 'ctps', label: 'Carteira de Trabalho (CTPS)', icon: <Briefcase size={24} className="mb-2"/> },
                        { key: 'aso', label: 'ASO (Atestado de Saúde Ocupacional)', icon: <Heart size={24} className="mb-2"/> },
                      ].map(doc => {
                        const docUrl = (formData as any)[`doc_${doc.key}`];
                        return (
                          <div key={doc.key} className="space-y-2">
                            <label className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 bg-white hover:bg-slate-50 transition-all cursor-pointer relative ${docUrl ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200'}`}>
                              {uploadingDoc === doc.key ? (
                                <Loader2 size={24} className="mb-2 animate-spin text-indigo-500"/>
                              ) : docUrl ? (
                                <CheckCircle2 size={24} className="mb-2 text-emerald-500"/>
                              ) : doc.icon}
                              <span className="text-xs font-bold text-slate-600 text-center">{doc.label}</span>
                              <span className="text-[10px] uppercase tracking-widest mt-1">
                                {docUrl ? 'Anexado ✓ — clique para substituir' : 'PDF, JPG, PNG — máx 10MB'}
                              </span>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleDocumentUpload(f, doc.key); }}
                              />
                            </label>
                            {docUrl && (
                              <button
                                type="button"
                                onClick={() => openDocumentInNewTab(docUrl, `${doc.label} — ${formData.employeeName || 'Funcionário'}`)}
                                className="w-full py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5"
                              >
                                <FileText size={12}/> Visualizar Documento
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-[3rem]">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-8 py-3 font-bold uppercase text-[11px] bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              
              <button 
                onClick={handleSave} 
                disabled={isSaving || !canWriteEmployees} 
                className="px-10 py-3 font-black uppercase text-[11px] bg-indigo-600 text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-indigo-400 transition-all"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16}/> Salvar Registro
                  </>
                )}
              </button>
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
                   <TemplateCrachaFuncionario key={e.id} employee={e} unit={currentUnitData} id={`badge-to-print-${e.id}`} />
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
                  disabled={isGeneratingPDF}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-2 shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-60"
                >
                  {isGeneratingPDF ? <Loader2 size={18} className="animate-spin"/> : <Printer size={18}/>}
                  {isGeneratingPDF ? 'Preparando impressão...' : 'Imprimir Crachás Agora'}
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Impressão de cadastro — componente dedicado */}
      {showPrintCadModal && (
        <ImprimeCadFuncionario
          employees={employees}
          onClose={() => setShowPrintCadModal(false)}
          preSelected={selectedIds.length > 0 ? employees.filter(e => selectedIds.includes(e.id)) : undefined}
        />
      )}

      {/* Modal LGPD */}
      {showLGPDModal && (
        <LGPDConsentModal
          isOpen={showLGPDModal}
          onClose={() => setShowLGPDModal(false)}
          onConsent={handleLGPDConsent}
          userType="EMPLOYEE"
          userId={formData.id || ''}
          userName={formData.employeeName || ''}
          currentConsent={employeeConsents.find(c => c.userId === formData.id)}
          currentPolicy={currentPolicy || undefined}
        />
      )}

      {/* Modal Avaliação */}
      {showAvaliacaoModal && (
        <AvaliacaoModal
          isOpen={showAvaliacaoModal}
          onClose={() => setShowAvaliacaoModal(false)}
          onSave={handleSaveAvaliacao}
          employeeId={editingEmployee?.id || undefined}
          employeeName={editingEmployee?.employeeName || undefined}
          editingAvaliacao={editingAvaliacao}
        />
      )}

      {/* Termo LGPD imprimível */}
      {showTermoLGPD && editingEmployee && (
        <TermoAdesaoLGPD
          nome={formData.employeeName || editingEmployee.employeeName || ''}
          cpf={formData.cpf || editingEmployee.cpf}
          rg={formData.rg || editingEmployee.rg || (formData as any).identidade || (editingEmployee as any).identidade || ''}
          endereco={
            (() => {
              const address = formData.address || editingEmployee.address;
              if (address?.street) {
                const cityState = [address.city, address.state].filter(Boolean).join('/');
                return [
                  `${address.street}, ${address.number || formData.numero || editingEmployee.numero || 's/n'}`,
                  address.complement,
                  address.neighborhood || formData.bairro || editingEmployee.bairro,
                  cityState,
                ].filter(Boolean).join(' - ');
              }

                const legacyCityState = [formData.cidade || editingEmployee.cidade, formData.estado || editingEmployee.estado].filter(Boolean).join('/');
                const legacyAddress =
                  typeof (formData as any).address === 'string'
                    ? (formData as any).address
                    : typeof (editingEmployee as any).address === 'string'
                      ? (editingEmployee as any).address
                      : '';
                return [
                  legacyAddress,
                  formData.numero || editingEmployee.numero,
                  formData.bairro || editingEmployee.bairro,
                  legacyCityState,
              ].filter(Boolean).join(' - ') || undefined;
            })()
          }
          telefone={formData.phone || editingEmployee.phone || (formData as any).telefone || (editingEmployee as any).telefone || (formData as any).celular || (editingEmployee as any).celular}
          igrejaNome={currentUnitData?.nome || ''}
          igrejaCnpj={currentUnitData?.cnpj || ''}
          igrejaEndereco={
            (() => {
              const baseAddress = currentUnitData?.enderecoLinha1 || currentUnitData?.endereco || '';
              const city = currentUnitData?.cidade || '';
              const state = currentUnitData?.estado || '';
              const cityState = [city, state].filter(Boolean).join('/');
              return [baseAddress, cityState].filter(Boolean).join(' - ') || '';
            })()
          }
          igrejaEnderecoLinha1={currentUnitData?.enderecoLinha1 || ''}
          igrejaEnderecoLinha2={currentUnitData?.enderecoLinha2 || ''}
          igrejaTelefone={currentUnitData?.telefone || ''}
          igrejaContato={
            (currentUnitData as any)?.email ||
            (currentUnitData as any)?.lgpdEmail ||
            (currentUnitData as any)?.contatoEmail ||
            (currentUnitData as any)?.responsavelEmail ||
            user?.email ||
            ''
          }
          consentimentos={{
            dataProcessing: formData.lgpdConsent?.dataProcessing,
            communication: formData.lgpdConsent?.communication,
            marketing: formData.lgpdConsent?.marketing,
            financial: formData.lgpdConsent?.financial,
            policyVersion: formData.lgpdConsent?.policyVersion || currentPolicy?.version,
          }}
          onClose={() => setShowTermoLGPD(false)}
        />
      )}

      {/* VisualizadorLGPD removido em favor da abertura em nova aba */}
    </div>
  );
};
