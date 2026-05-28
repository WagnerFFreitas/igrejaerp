/**
 * ============================================================================
 * MEMBROS.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para membros.
 *
 * ONDE É USADO?
 * -------------
 * Usado na interface React como parte do frontend.
 *
 * COMO FUNCIONA?
 * --------------
 * Controla a apresentação e interações da interface com o usuário.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Edit2, X, User, Plus, Printer, QrCode, Square, CheckSquare, 
  Loader2, Save, Trash2, Camera, Heart, Baby, Flame, Award, Map, AlertCircle, 
  DollarSign, Star, Users, TrendingUp, Download, Phone, Mail, Briefcase, 
  Info, Sparkles, BookOpen, MapPin, Calendar, History, Tag, Landmark, Users2,
  MessageSquare, CheckCircle2, CheckCircle, XCircle, Filter, Shield, FileText, FileSignature, UserPlus
} from 'lucide-react';
import TermoVoluntariado from './TermoVoluntariado';
import { TermoAdesaoLGPD } from './TermoAdesaoLGPD';
import { Membro, Transacao, FinancialAccount, MemberContribution, Dependent, Usuario, LGPDConsent, LGPDPolicy, Unidade } from '../tipos';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { dbService } from '../services/bancoDadosService';
import { ArmazenamentoService } from '../src/services/armazenamentoService';
import { TemplateCarteiraMembro } from './TemplateCarteiraMembro';
import { useAudit } from '../src/hooks/useAuditoria';
import LGPDService from '../services/lgpdService';
import LGPDConsentModal from './modalConsentimentoLgpd';
import { ImprimeCadMembro } from './ImprimeCadMembro';
import AutenticacaoService from '../src/services/autenticacaoService';
import { UnidadeService } from '../src/services/unidadeService';

type MemberTab = 'pessoais' | 'familia' | 'endereco' | 'vida_crista' | 'ministerios' | 'financeiro' | 'rh' | 'outros' | 'lgpd';

interface MembrosProps {
  members: Membro[];
  currentUnitId?: string;
  currentIdUnidade?: string; // Para compatibilidade
  setMembers: React.Dispatch<React.SetStateAction<Membro[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transacao[]>>;
  contas_bancarias: FinancialAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<FinancialAccount[]>>;
  user?: Usuario;
}

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (membros).
 */

const InputField = ({ label, value, onChange, placeholder = "", type = "text", className = "", readOnly = false }: any) => (
  <div className={className}>
    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-wider">{label}</label>
    <input 
      type={type}
      readOnly={readOnly}
      className={`w-full px-4 py-2 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${readOnly ? 'bg-slate-100 text-slate-700 cursor-not-allowed' : 'bg-slate-50'}`} 
      value={value || ''} 
      onChange={e => !readOnly && onChange(e.target.value)} 
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, className = "" }: any) => (
  <div className={className}>
    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-wider">{label}</label>
    <select 
      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const Membros: React.FC<MembrosProps> = ({ members, currentUnitId, currentIdUnidade, setMembers, setTransactions, contas_bancarias, setAccounts, user }) => {
  // Debug: verificar props recebidas
  console.log('🔍 Membros props:', { currentUnitId, currentIdUnidade, membersCount: members.length });
  
  // Usa currentUnitId se disponível, senão usa currentIdUnidade para compatibilidade
  const effectiveUnitId = currentUnitId || currentIdUnidade || 'u-sede';
  const canWriteMembers = AutenticacaoService.hasPermission(user as any, 'members', 'write');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);

  // Hook de auditoria
  const { logAction } = useAudit(user || null);

  // Função para identificar campos alterados
  const getChangedFields = (original: Membro, current: any) => {
    const changes: any = {};
    const simpleFields: (keyof Membro)[] = [
      'nome', 'cpf', 'rg', 'email', 'telefone', 'celular',
      'situacao', 'data_conversao', 'data_batismo', 'data_ingresso',
      'endereco', 'numero', 'bairro', 'cidade', 'estado', 'cep',
      'observacoes', 'avatar'
    ];

    simpleFields.forEach(field => {
      if (current[field] !== original[field]) {
        changes[field] = current[field];
      }
    });

    return changes;
  };

  const initialMemberForm: Partial<Membro> = {
    nome: '',
    id_unidade: '',
    situacao: 'ACTIVE',
    matricula: '',
    cpf: '',
    rg: '',
    email: '',
    telefone: '',
    celular: '',
    data_conversao: '',
    data_batismo: '',
    data_ingresso: '',
    dizimista: false,
    ofertante: false,
    data_nascimento: '',
    sexo: 'M',
    estado_civil: 'SINGLE',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    observacoes: '',
    avatar: ''
  };

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [editingMember, setEditingMember] = useState<Membro | null>(null);
  const [activeTab, setActiveTab] = useState<MemberTab>('pessoais');
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const [filterRole, setFilterRole] = useState('');
  const [filterMinistry, setFilterMinistry] = useState('');
  const [filterTithable, setFilterTithable] = useState('');

  // Estados impressão cadastro
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Estados LGPD
  const [showLGPDModal, setShowLGPDModal] = useState(false);
  const [showTermoLGPD, setShowTermoLGPD] = useState(false);
  const [showTermoVoluntariado, setShowTermoVoluntariado] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState<LGPDPolicy | null>(null);
  const [memberConsents, setMemberConsents] = useState<LGPDConsent[]>([]);
  const [lgpdReport, setLgpdReport] = useState<any>(null);

  // Estado da Unidade
  const [currentUnitData, setCurrentUnitData] = useState<Unidade | null>(null);
  const [isLoadingUnit, setIsLoadingUnit] = useState(true);

  const stats = useMemo(() => ({
    active: members.filter(m => m.situacao === 'ACTIVE').length,
    leaders: members.filter(m => m.funcao === 'LEADER').length,
    visitors: members.filter(m => m.funcao === 'VISITOR').length,
    total: members.length
  }), [members]);

  const getNextMemberMatricula = () => {
    const currentYear = new Date().getFullYear();
    if (!members || members.length === 0) return `M01/${currentYear}`;
    
    const numbers = members
      .filter(m => m.matricula && (m.matricula.startsWith('M') || m.matricula.startsWith('MB')))
      .map(m => {
        // Tenta capturar formato M01/2026 ou MB229456
        const matchWithYear = m.matricula.match(/M(\d+)\//);
        if (matchWithYear) return parseInt(matchWithYear[1]);
        const matchNumeric = m.matricula.match(/MB?(\d+)/);
        if (matchNumeric) return parseInt(matchNumeric[1]);
        return 0;
      });
    
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;
    const paddedNumber = nextNumber.toString().padStart(2, '0');
    
    return `M${paddedNumber}/${currentYear}`;
  };

  // Carregar dados da unidade e política LGPD
  useEffect(() => {
    const fetchUnitAndPolicy = async () => {
      try {
        setIsLoadingUnit(true);
        const idUnidadeMap: Record<string, string> = {
          'u-sede': '00000000-0000-0000-0000-000000000001',
          'u-matriz': '00000000-0000-0000-0000-000000000001',
        };
        const apiIdUnidade = idUnidadeMap[effectiveUnitId] || effectiveUnitId;
        
        console.log('🔍 Iniciando busca de unidade:', { effectiveUnitId, apiIdUnidade });
        
        // Verificar se o ID é um UUID válido (formato básico)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!apiIdUnidade || apiIdUnidade === 'undefined' || !uuidRegex.test(apiIdUnidade)) {
          console.warn('⚠️ ID de unidade inválido:', apiIdUnidade);
          setCurrentUnitData(null);
          setIsLoadingUnit(false);
          return;
        }
        
        console.log('🔍 Buscando unidade com ID:', apiIdUnidade);
        
        const [unitData, policyData] = await Promise.all([
          UnidadeService.getUnitById(apiIdUnidade),
          LGPDService.getCurrentPolicy(apiIdUnidade).catch(err => {
            console.warn('⚠️ Erro ao carregar política LGPD, usando padrão:', err);
            return { version: '1.0', title: 'Política Padrão', isActive: true };
          })
        ]);
        
        console.log('✅ Dados da unidade recebidos:', unitData);
        setCurrentUnitData(unitData);
        setCurrentPolicy(policyData);
        console.log('✅ Dados da unidade e política carregados:', { unit: unitData?.nome || unitData?.name, policy: policyData.version });
        console.log('🎯 currentUnitData definido como:', unitData);
      } catch (error) {
        console.error('❌ Erro ao carregar dados da unidade:', error);
        setCurrentUnitData(null);
      } finally {
        setIsLoadingUnit(false);
      }
    };

    if (effectiveUnitId && effectiveUnitId !== 'undefined') {
      fetchUnitAndPolicy();
    } else {
      console.warn('⚠️ effectiveUnitId não definido, pulando busca de unidade');
      setIsLoadingUnit(false);
    }
  }, [effectiveUnitId]);

  const openDocumentInNewTab = (dataUrl: string, fileName: string) => {
    if (!dataUrl) return;
    
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
    const isPDF = isPDFSignature || contentType === 'application/pdf' || contentType === 'image/pdf' || fileName.toLowerCase().endsWith('.pdf');
    
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
    
    // Nota: O URL.revokeObjectURL(url) não pode ser feito imediatamente aqui,
    // mas o navegador limpa ao fechar a aba/janela original.
  };

  // Normaliza timestamps ISO para o formato yyyy-MM-dd exigido pelo input type="date"
  const toDateValue = (val?: string | null): string => {
    if (!val) return '';
    // Se já estiver no formato correto, retorna como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    // Extrai apenas a parte da data de qualquer formato ISO
    const date = new Date(val);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<Partial<Membro>>(initialMemberForm);

  // Só gera matrícula automaticamente para NOVOS membros (quando editingMember é null)
  // Durante edição, a matrícula deve ser preservada
  useEffect(() => {
    if (isModalOpen && !editingMember && !formData.matricula) {
      const next = getNextMemberMatricula();
      setFormData(prev => ({ ...prev, matricula: next }));
    }
  }, [isModalOpen, editingMember, formData.matricula, members.length]);

  // Carregar política LGPD atual
  useEffect(() => {
    const loadLGPDData = async () => {
      try {
        const policy = await LGPDService.getCurrentPolicy(effectiveUnitId);
        setCurrentPolicy(policy);
      } catch (error) {
        console.error('Erro ao carregar política LGPD:', error);
      }
    };
    
    loadLGPDData();
  }, [currentIdUnidade]);

  // Carregar consentimentos do membro selecionado
  useEffect(() => {
    const loadMemberConsents = async () => {
      if (editingMember?.id_membro) {
        try {
          const consents = await LGPDService.getUserConsents(editingMember.id_membro, effectiveUnitId);
          setMemberConsents(consents);
          
          // Atualizar formData com consentimentos existentes, preservando o anexo que já está no estado
          setFormData(prev => {
            // Garante que lgpd_consent exista em prev antes de tentar espalhar
            const existingLgpdConsent = (prev.lgpd_consent || {}) as Partial<NonNullable<Membro['lgpd_consent']>>;
            
            return { 
              ...prev, 
              lgpd_consent: {
                ...existingLgpdConsent, // Preserva o documentUrl e outros campos
                dataProcessing: consents.find(c => c.consentType === 'DATA_PROCESSING')?.concedido || false,
                communication: consents.find(c => c.consentType === 'COMMUNICATION')?.concedido || false,
                marketing: consents.find(c => c.consentType === 'MARKETING')?.concedido || false,
                financial: consents.find(c => c.consentType === 'FINANCIAL')?.concedido || false,
                consentDate: consents[0]?.consentDate || existingLgpdConsent.consentDate,
                policyVersion: consents[0]?.policyVersion || existingLgpdConsent.policyVersion,
              }
            };
          });
        } catch (error) {
          console.error('Erro ao carregar consentimentos do membro:', error);
        }
      }
    };
    
    loadMemberConsents();
  }, [editingMember?.id_membro, currentIdUnidade]);

  const titheMap = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = d.toISOString().slice(0, 7);
      const hasTithe = formData.contribuicoes?.some(c => {
        // Suporte a campos em PT (tipo/data) e EN (type/date)
        const tipo = (c as any).tipo || (c as any).type || '';
        const data = (c as any).data || (c as any).date || '';
        return tipo === 'Dizimo' && data.startsWith(monthYear);
      });
      months.push({
        label: d.toLocaleDateString('pt-BR', { month: 'short' }),
        year: d.getFullYear(),
        hasTithe,
        monthYear
      });
    }
    return months;
  }, [formData.contribuicoes]);

  const filteredMembers = members.filter(m => {
    const searchLower = (searchTerm || '').toLowerCase();
    const normalizeDigits = (val: string) => (val || '').replace(/\D/g, '');
    const searchDigits = normalizeDigits(searchTerm);

    const matchesSearch = 
      (m.nome || '').toLowerCase().includes(searchLower) ||
      (m.matricula || '').toLowerCase().includes(searchLower) ||
      (m.cpf || '').toLowerCase().includes(searchLower) ||
      (m.email || '').toLowerCase().includes(searchLower) ||
      (m.telefone || '').toLowerCase().includes(searchLower) ||
      (m.whatsapp || '').toLowerCase().includes(searchLower) ||
      (m.tags || []).some(tag => tag.toLowerCase().includes(searchLower)) ||
      (searchDigits !== '' && normalizeDigits(m.matricula || '').includes(searchDigits)) ||
      (searchDigits !== '' && normalizeDigits(m.cpf || '').includes(searchDigits));

    const matchesStatus = !filterStatus || m.situacao === filterStatus;
    const matchesRole = !filterRole || m.funcao === filterRole;
    const matchesMinistry = !filterMinistry || m.ministerio_principal === filterMinistry;
    const matchesTithable = !filterTithable || (filterTithable === 'SIM' ? m.dizimista : !m.dizimista);

    // Se searchTerm estiver vazio, matchesSearch deve ser sempre true
    const finalSearchMatch = searchTerm === '' ? true : matchesSearch;

    return finalSearchMatch && matchesStatus && matchesRole && matchesMinistry && matchesTithable;
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCEPLookup = async (cep: string) => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;
    setIsSearchingCEP(true);
    try {
      // Tenta via proxy do backend (evita CORS)
      let data: any = null;
      try {
        const res = await fetch(`/api/cep/${clean}`);
        if (res.ok) data = await res.json();
      } catch { /* fallback para ViaCEP direto */ }

      // Fallback: ViaCEP direto
      if (!data) {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        if (res.ok) data = await res.json();
      }
      if (data && !data.erro && !data.error) {
        console.log('📍 Dados do CEP recebidos:', data);
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro || data.street || '',
          bairro: data.bairro || data.neighborhood || '',
          cidade: data.localidade || data.city || '',
          estado: data.uf || data.state || '',
          cep: data.cep || cep
        }));
      } else {
        console.error('❌ CEP não encontrado');
        alert('CEP não encontrado. Verifique e tente novamente.');
      }
    } catch (e) {
      console.error('Erro ao buscar CEP:', e);
    } finally {
      setIsSearchingCEP(false);
    }
  };

  const handleLGPDConsent = async (consent: LGPDConsent) => {
    try {
      await LGPDService.saveConsent(consent);
      
      // Atualizar formData com os consentimentos
      setFormData(prev => ({
        ...prev,
        lgpd_consent: {
          ...(prev.lgpd_consent || {}),
          dataProcessing: consent.consentType === 'DATA_PROCESSING' ? consent.concedido : (prev.lgpd_consent?.dataProcessing || false),
          communication: consent.consentType === 'COMMUNICATION' ? consent.concedido : (prev.lgpd_consent?.communication || false),
          marketing: consent.consentType === 'MARKETING' ? consent.concedido : (prev.lgpd_consent?.marketing || false),
          financial: consent.consentType === 'FINANCIAL' ? consent.concedido : (prev.lgpd_consent?.financial || false),
          consentDate: consent.consentDate,
          policyVersion: consent.policyVersion
          // documentUrl é preservado pelo spread
        }
      }));

      // Registrar auditoria
      await logAction('CREATE', 'LGPDConsent', consent.id, `Consentimento LGPD registrado para ${formData.nome}`, {
        consentType: consent.consentType,
        concedido: consent.concedido,
        policyVersion: consent.policyVersion
      });

      console.log('✅ Consentimento LGPD salvo com sucesso');
      alert('Consentimento LGPD salvo com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar consentimento LGPD:', error);
      alert('Erro ao salvar consentimento LGPD. Tente novamente.');
    }
  };



  const handleGenerateLGPDReport = async () => {
    try {
      const report = await LGPDService.generateConsentReport(effectiveUnitId);
      setLgpdReport(report);
      
      // Exportar relatório em JSON
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-lgpd-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ Relatório LGPD gerado com sucesso');
      alert('Relatório LGPD gerado e baixado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar relatório LGPD:', error);
      alert('Erro ao gerar relatório LGPD. Tente novamente.');
    }
  };

  const closeMemberModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setSearchTerm('');
  };

  const handleSave = async () => {
    if (!canWriteMembers) {
      alert('Você não tem permissão para criar ou editar membros.');
      return;
    }

    console.log("🚀 Iniciando salvamento do membro...");
    
    if (!formData.nome) {
      console.log("❌ Nome obrigatório não preenchido");
      return alert("O nome é obrigatório.");
    }
    
    console.log("⏳ Setando isLoading para true...");
    setIsSaving(true);
    
    try {
      console.log("📝 Gerando ID do membro...");
      const memberId = editingMember?.id_membro || `tmp-member-${Date.now()}`;
      
      // Só gera nova matrícula se for um NOVO membro (editingMember === null)
      // Se estiver editando, mantém a matrícula original
      const matricula = editingMember 
        ? (formData.matricula || editingMember.matricula) // Edição: mantém a original
        : (formData.matricula || getNextMemberMatricula()); // Novo: gera uma
      
      let memberData = { ...formData, id_membro: memberId, matricula } as Membro;
      
      console.log("👤 Dados do membro preparados:", { id: memberData.id_membro, name: memberData.nome, matricula: memberData.matricula });

      if (avatarFile) {
        console.log("📷 Fazendo upload da foto...");
        try {
          const downloadURL = await ArmazenamentoService.uploadProfilePhoto(currentIdUnidade, memberId, avatarFile);
          memberData.avatar = downloadURL;
          console.log("✅ Foto uploaded com sucesso");
        } catch (error) {
          console.warn("⚠️ Erro ao fazer upload da foto:", error);
          memberData.avatar = memberData.avatar; // Mantém apenas foto real
        }
      } else if (!memberData.avatar) {
        console.log("🎨 Usando avatar padrão");
        // Não gera avatar automático - usa apenas foto real
      }

      console.log("💾 Salvando membro no database...");
      const savedMember = await dbService.saveMember(memberData) as Membro;
      console.log("✅ Membro salvo:", savedMember);
      console.log("🔍 Matrícula no membro salvo:", savedMember.matricula);
      
      // Registrar auditoria
      if (editingMember) {
        await logAction('UPDATE', 'Member', memberData.id_membro, memberData.nome, { 
          action: `${user?.nome || 'Usuário'} alterou o cadastro do membro ${memberData.nome}`,
          changedFields: getChangedFields(editingMember, memberData)
        });
        console.log("🔍 Auditoria: Atualização de membro registrada");
      } else {
        await logAction('CREATE', 'Member', savedMember.id, memberData.nome, { 
          action: `${user?.nome || 'Usuário'} cadastrou novo membro: ${memberData.nome}`
        });
        console.log("🔍 Auditoria: Criação de membro registrada");
      }
      
      // Atualiza a lista de membros com os dados retornados pelo backend (que contém a nova versão)
      if (editingMember) {
        setMembers(prev => prev.map(m => m.id_membro === editingMember.id_membro ? savedMember : m));
        console.log("✅ Membro atualizado na lista global com nova versão:", (savedMember as any).version);
      } else {
        setMembers(prev => [savedMember, ...prev]);
        console.log("✅ Membro adicionado à lista global");
      }
      
      console.log("🔚 Fechando modal e limpando estado...");
      closeMemberModal();
      setAvatarFile(null);
      
      console.log("🎉 Salvamento concluído com sucesso!");
      alert("Membro salvo com sucesso!");
      
    } catch (error: any) {
      console.error("❌ Erro ao salvar membro:", error);
      // Tratamento específico para erro de conflito (409)
      if (error.response && error.response.status === 409) {
        alert("Falha ao salvar: Este registro foi modificado por outro usuário. Por favor, feche o formulário para ver as atualizações e tente novamente.");
      } else {
        const message = error.message || "Verifique o console para mais detalhes.";
        alert(`Falha ao salvar. ${message}`);
      }
    } finally {
      console.log("🔄 Setando isLoading para false...");
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const selectedMembers = members.filter(m => selectedMemberIds.includes(m.id_membro));
      const cardHeight = 53.98;
      const cardWidth = 176.2; 
      let currentY = 15;

      for (let i = 0; i < selectedMembers.length; i++) {
        if (currentY + cardHeight > 280) {
          pdf.addPage();
          currentY = 15;
        }
        const el = document.getElementById(`card-to-print-${selectedMembers[i].id_membro}`);
        if (el) {
          const canvas = await html2canvas(el, { 
            scale: 8, 
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0,
            onclone: (clonedDoc) => {
              const card = clonedDoc.getElementById(`card-to-print-${selectedMembers[i].id_membro}`);
              if (card) {
                (card.style as any).fontSmooth = 'always';
                (card.style as any).webkitFontSmoothing = 'antialiased';
              }
            }
          });
          
          const imgData = canvas.toDataURL('image/png', 1.0);
          pdf.addImage(imgData, 'PNG', 17, currentY, cardWidth, cardHeight, undefined, 'NONE');
          currentY += cardHeight + 8;
        }
      }
      pdf.save(`Lote_Carteirinhas_UltraHD_${new Date().getTime()}.pdf`);
    } catch (e) { 
      console.error("Erro ao gerar PDF:", e);
      alert("Houve um erro ao gerar o PDF. Tente imprimir direto.");
    } finally { 
      setIsGeneratingPDF(false); 
    }
  };

  const handleDirectPrint = async () => {
    const selectedMembers = members.filter(m => selectedMemberIds.includes(m.id));
    if (selectedMembers.length === 0) return;

    setIsGeneratingPDF(true);
    try {
      // Converte cada carteirinha em imagem via html2canvas
      const images: { dataUrl: string; widthPx: number; heightPx: number }[] = [];

      for (const m of selectedMembers) {
        const el = document.getElementById(`card-to-print-${m.id_membro}`);
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
        alert('Nenhuma carteirinha encontrada para imprimir.');
        return;
      }

      // Monta HTML com as imagens — sem depender de CSS externo
      const imgsHtml = images.map(img => {
        // Converte px para mm mantendo proporção (96dpi → 25.4mm/inch)
        const widthMm  = (img.widthPx  / 4 / 96) * 25.4;
        const heightMm = (img.heightPx / 4 / 96) * 25.4;
        return `<img src="${img.dataUrl}" style="display:block;width:${widthMm}mm;height:${heightMm}mm;margin:0 auto;" />`;
      }).join('\n');

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Carteirinhas de Membros</title>
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

  return (
    <div className="space-y-4 pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight italic font-serif">Gestão de Membresia</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-widest mt-1">Prontuário Ministerial ADJPA Cloud</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => selectedMemberIds.length > 0 && setIsIDCardOpen(true)} 
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-md transition-all ${selectedMemberIds.length > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            <Printer size={14} /> Imprimir carteirinha ({selectedMemberIds.length})
          </button>
          <button 
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-md transition-all bg-slate-600 text-white hover:bg-slate-700"
          >
            <Printer size={14} /> Imprimir Cadastro
            {selectedMemberIds.length > 0 && <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-[9px]">{selectedMemberIds.length} sel.</span>}
          </button>
          <button 
            onClick={() => {
              if (!canWriteMembers) return;
              // Busca a próxima matrícula de membro
              const currentYear = new Date().getFullYear();
              const allNumbers = members
                .filter(m => m.matricula && (m.matricula.startsWith('M') || m.matricula.startsWith('MB')))
                .map(m => {
                  const matchWithYear = m.matricula.match(/M(\d+)\//);
                  if (matchWithYear) return parseInt(matchWithYear[1]);
                  const matchNumeric = m.matricula.match(/MB?(\d+)/);
                  if (matchNumeric) return parseInt(matchNumeric[1]);
                  return 0;
                });
              const maxNumber = allNumbers.length > 0 ? Math.max(...allNumbers) : 0;
              const nextNumber = maxNumber + 1;
              const paddedNumber = nextNumber.toString().padStart(2, '0');
              const generatedMatricula = `M${paddedNumber}/${currentYear}`;
              setFormData({
                ...initialMemberForm,
                nome: '',
                matricula: generatedMatricula,
                idUnidade: currentIdUnidade,
                status: 'ACTIVE',
                funcao: 'MEMBER',
                endereco: {
                  cep: '',
                  logradouro: '',
                  numero: '',
                  complemento: '',
                  bairro: '',
                  cidade: '',
                  estado: ''
                }
              });
              setEditingMember(null);
              setIsModalOpen(true);
            }}
            disabled={!canWriteMembers}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus size={18} /> Novo Registro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <User size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Membros Ativos</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">{stats.active}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Star size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Líderes Ativos</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">{stats.leaders}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Visitantes / Transição</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">{stats.visitors}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Registrados</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, matrícula, e-mail ou CPF..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(p => !p)}
          className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-xl font-bold text-sm transition-all whitespace-nowrap ${showFilters ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
        >
          <Filter size={18} /> Filtros Avançados
          {(filterStatus || filterRole || filterMinistry || filterTithable) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"/>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Todos</option>
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
              <option value="PENDING">Pendente</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Cargo/Função</label>
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Todos</option>
              <option value="MEMBER">Membro</option>
              <option value="LEADER">Líder</option>
              <option value="VOLUNTEER">Voluntário</option>
              <option value="VISITOR">Visitante</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Ministério</label>
            <select value={filterMinistry} onChange={e => setFilterMinistry(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Todos</option>
              {[...new Set(members.map(m => m.ministerioPrincipal).filter(Boolean))].map(min => (
                <option key={min} value={min}>{min}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Dizimista</label>
            <select value={filterTithable} onChange={e => setFilterTithable(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Todos</option>
              <option value="SIM">Sim</option>
              <option value="NAO">Não</option>
            </select>
          </div>
          {(filterStatus || filterRole || filterMinistry || filterTithable) && (
            <button onClick={() => { setFilterStatus(''); setFilterRole(''); setFilterMinistry(''); setFilterTithable(''); }} className="col-span-2 md:col-span-4 text-xs font-bold text-rose-500 hover:text-rose-700 text-center py-1">
              Limpar filtros
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 w-10 text-center">
                <div onClick={() => setSelectedMemberIds(selectedMemberIds.length === filteredMembers.length ? [] : filteredMembers.map(m => m.id))} className="cursor-pointer mx-auto">
                  {selectedMemberIds.length === filteredMembers.length && filteredMembers.length > 0 ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}
                </div>
              </th>
              <th className="px-1 py-4">Matrícula</th>
              <th className="px-8 py-4">Identificação</th>
              <th className="px-0 py-4">Cargo / Ministério</th>
              <th className="px-1 py-4">Vínculos</th>
              <th className="px-1 py-4">Status Financeiro</th>
              <th className="px-0 py-4">Situação</th>
              <th className="px-2 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[11px]">
            {filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-center">
                  <div onClick={() => setSelectedMemberIds(p => p.includes(member.id) ? p.filter(id => id !== member.id) : [...p, member.id])} className="cursor-pointer mx-auto">
                    {selectedMemberIds.includes(member.id) ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}
                  </div>
                </td>
                <td className="px-1 py-4 font-bold text-slate-800 text-xs">
                  {member.matricula || '-'}
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={member.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-100" alt="" />
                      {member.dizimista && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                          $
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{member.nome}</p>
                      <p className="text-[10px] text-slate-500">{member.telefone || member.whatsapp || 'Sem telefone'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-0 py-4">
                  <p className="font-bold text-slate-800 text-xs">{member.cargo_eclesiastico || 'Membro'}</p>
                  <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider">{member.ministerio_principal || 'Geral'}</p>
                </td>
                <td className="px-1 py-4">
                  <button className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-600 rounded-lg text-[9px] font-bold uppercase hover:bg-slate-100 transition-all">
                    <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px]">F</div>
                    Ver Vínculos
                  </button>
                </td>
                <td className="px-1 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                    member.dizimista ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {member.dizimista ? 'Dizimista' : (member.funcao === 'VISITOR' ? 'Visitante' : 'Membro')}
                  </span>
                </td>
                <td className="px-0 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                    member.situacao === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 
                    member.situacao === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                    'bg-rose-50 text-rose-600'
                  }`}>
                    {member.situacao === 'ACTIVE' ? 'Ativo' : 
                     member.situacao === 'PENDING' ? 'Pendente' : 
                     'Inativo'}
                  </span>
                </td>
                <td className="px-2 py-4 text-right">
                  <div className="flex justify-end gap-3 text-slate-400">
                    <button onClick={() => { setEditingMember(member); setSelectedMemberIds([member.id_membro]); setIsIDCardOpen(true); }} className="hover:text-slate-900"><QrCode size={16} /></button>
                    <button onClick={() => { setSelectedMemberIds([member.id_membro]); setShowPrintModal(true); }} className="hover:text-slate-900" title="Imprimir Cadastro"><Printer size={16} /></button>
                    <button onClick={() => { 
                        if (!canWriteMembers) return;
                        
                        // Prepara os dados do membro para edição
                        // IMPORTANTE: Nunca alterar a matrícula durante edição!
                        const memberWithMatricula = { 
                          ...member, 
                          matricula: member.matricula || '', // Mantém a original ou string vazia
                          situacao: member.situacao || 'ACTIVE'
                        };

                        const initialFormData = {
                          ...memberWithMatricula,
                          ...(memberWithMatricula.dados_perfil || {}),
                          version: (memberWithMatricula as any).version || 0,
                          id_unidade: memberWithMatricula.id_unidade || currentIdUnidade || ''
                        };

                        setEditingMember(memberWithMatricula); 
                        setFormData(initialFormData); 
                        setIsModalOpen(true); 
                      }} disabled={!canWriteMembers} className="hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"><Edit2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-full max-h-[95vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md"><User size={18}/></div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-tight">{editingMember ? 'Editar' : 'Novo'} Registro</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={closeMemberModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
              </div>
            </div>

            <div className="flex border-b bg-slate-50/30 px-6 gap-6 overflow-x-auto scrollbar-hide shrink-0">
              {[
                { id: 'pessoais', label: 'Dados Pessoais', icon: <User size={14}/> },
                { id: 'familia', label: 'Família', icon: <Users2 size={14}/> },
                { id: 'endereco', label: 'Endereço', icon: <Map size={14}/> },
                { id: 'vida_crista', label: 'Vida Cristã', icon: <Flame size={14}/> },
                { id: 'ministerios', label: 'Ministérios', icon: <Award size={14}/> },
                { id: 'financeiro', label: 'Financeiro', icon: <DollarSign size={14}/> },
                { id: 'rh', label: 'Gestão de RH', icon: <Briefcase size={14}/> },
                { id: 'outros', label: 'Observações', icon: <Info size={14}/> },
                { id: 'lgpd', label: 'Voluntariado', icon: <Shield size={14}/> },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as MemberTab)} className={`flex items-center gap-2 py-3 px-1 text-[10px] font-black uppercase tracking-tight transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                  {tab.icon} {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 bg-white">
              {activeTab === 'pessoais' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                        <img src={formData.avatar} className="w-full h-full object-cover" />
                      </div>
                      <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                        <Camera className="text-white mb-1" size={24} />
                        <span className="text-[8px] text-white font-black uppercase tracking-tighter">Trocar Foto</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                      </label>
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-4">
                       <InputField label="Matrícula" value={formData.matricula} readOnly={true} className="col-span-1" />
                       <InputField label="Nome Completo" value={formData.nome} onChange={(v:any) => setFormData({...formData, nome: v})} className="col-span-3" />
                       <InputField label="CPF" value={formData.cpf} onChange={(v:any) => setFormData({...formData, cpf: v})} className="col-span-2" />
                       <InputField label="RG" value={formData.rg} onChange={(v:any) => setFormData({...formData, rg: v})} className="col-span-2" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="E-mail" value={formData.email} onChange={(v:any) => setFormData({...formData, email: v})} />
                    <InputField label="Telefone Fixo" value={formData.telefone} onChange={(v:any) => setFormData({...formData, telefone: v})} />
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-wider">Celular / WhatsApp</label>
                      <div className="flex gap-2">
                        <input className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.celular || ''} onChange={e => {
                          const newCelular = e.target.value;
                          const wasWhatsapp = formData.whatsapp && formData.whatsapp === formData.celular;
                          setFormData({...formData, celular: newCelular, whatsapp: wasWhatsapp ? newCelular : formData.whatsapp});
                        }} placeholder="(00) 00000-0000" />
                        <label className="flex items-center gap-1.5 px-3 py-2 border border-emerald-200 bg-emerald-50 rounded-xl text-[10px] font-bold text-emerald-700 cursor-pointer hover:bg-emerald-100 transition-colors whitespace-nowrap">
                          <input type="checkbox" checked={!!formData.whatsapp && formData.whatsapp === formData.celular && !!formData.celular} onChange={e => setFormData({...formData, whatsapp: e.target.checked ? formData.celular : ''})} className="w-3.5 h-3.5 accent-emerald-600" /> Tem WhatsApp
                        </label>
                      </div>
                    </div>
                    <InputField label="Nascimento" type="date" value={toDateValue(formData.data_nascimento)} onChange={(v:any) => setFormData({...formData, data_nascimento: v})} />
                    <SelectField label="Sexo" value={formData.sexo} onChange={(v:any) => setFormData({...formData, sexo: v})} options={[{value:'M', label:'Masculino'}, {value:'F', label:'Feminino'}]} />
                    <InputField label="Profissão" value={formData.profissao} onChange={(v:any) => setFormData({...formData, profissao: v})} />
                    <SelectField label="Status" value={formData.situacao || 'ACTIVE'} onChange={(v:any) => setFormData({...formData, situacao: v})} options={[{value:'ACTIVE', label:'Ativo'}, {value:'INACTIVE', label:'Inativo'}, {value:'PENDING', label:'Pendente'}]} />
                    <SelectField label="Cargo/Função" value={formData.funcao} onChange={(v:any) => setFormData({...formData, funcao: v})} options={[{value:'MEMBER', label:'Membro'}, {value:'VISITOR', label:'Visitante'}, {value:'VOLUNTEER', label:'Voluntário'}, {value:'STAFF', label:'Staff'}, {value:'LEADER', label:'Líder'}]} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <InputField label="Nome do Pai" value={formData.nome_pai} onChange={(v:any) => setFormData({...formData, nome_pai: v})} />
                    <InputField label="Nome da Mãe" value={formData.nome_mae} onChange={(v:any) => setFormData({...formData, nome_mae: v})} />
                    <InputField label="Escolaridade" value={formData.escolaridade} onChange={(v:any) => setFormData({...formData, escolaridade: v})} placeholder="Ex: Ensino Superior" />
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-wider">É PCD?</label>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                          <input type="checkbox" checked={!!formData.is_pcd} onChange={e => setFormData({...formData, is_pcd: e.target.checked})} className="w-4 h-4 accent-indigo-600" /> Sim
                        </label>
                        {formData.is_pcd && (
                          <input className="flex-1 px-3 py-1 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Tipo de deficiência" value={formData.tipo_deficiencia || ''} onChange={e => setFormData({...formData, tipo_deficiencia: e.target.value})} />
                        )}
                      </div>
                    </div>
                    <InputField label="Observações" value={formData.observacoes} onChange={(v:any) => setFormData({...formData, observacoes: v})} className="col-span-2" />
                  </div>
                </div>
              )}

              {activeTab === 'familia' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                         <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Heart size={14}/> Estado Civil</h4>
                         <SelectField label="Estado Civil" value={formData.estado_civil} onChange={(v:any) => setFormData({...formData, estado_civil: v})} options={[{value:'SINGLE', label:'Solteiro(a)'}, {value:'MARRIED', label:'Casado(a)'}, {value:'DIVORCED', label:'Divorciado(a)'}, {value:'WIDOWED', label:'Viúvo(a)'}]} />
                         {formData.estado_civil === 'MARRIED' && (
                           <>
                             <InputField label="Nome do Cônjuge" value={formData.nome_conjuge} onChange={(v:any) => setFormData({...formData, nome_conjuge: v})} />
                             <InputField label="Data de Casamento" type="date" value={formData.data_casamento} onChange={(v:any) => setFormData({...formData, data_casamento: v})} />
                           </>
                         )}
                      </div>

                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                         <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Users2 size={14}/> Vínculo Familiar</h4>
                         <p className="text-[10px] text-slate-500 font-medium italic">Agrupe membros da mesma família para gestão unificada.</p>
                         <InputField label="ID da Família" value={formData.id_familia} onChange={(v:any) => setFormData({...formData, id_familia: v})} placeholder="Ex: FAM-001" />
                      </div>

                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4 md:col-span-2">
                         <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Users2 size={14}/> Dependentes / Composição Familiar</h4>
                         <div className="space-y-3">
                            {formData.dependentes && formData.dependentes.length > 0 ? (
                              formData.dependentes.map((dep, i) => (
                                 <div key={dep.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                                    <div>
                                       <p className="text-xs font-bold text-slate-800">{dep.nome}</p>
                                       <p className="text-[10px] text-slate-500 uppercase font-bold">{dep.parentesco} • {new Date(dep.dataNascimento).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <button onClick={() => setFormData({...formData, dependentes: formData.dependentes?.filter((_, idx) => idx !== i)})} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-all"><Trash2 size={14}/></button>
                                 </div>
                              ))
                            ) : (
                              <p className="text-[10px] text-slate-400 italic">Nenhum dependente cadastrado.</p>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 pt-4 border-t border-slate-200">
                               <div className="md:col-span-4"><InputField label="Nome" id="dep-name" /></div>
                               <div className="md:col-span-3"><SelectField label="Vínculo" id="dep-rel" options={[{value:'FILHO', label:'Filho(a)'}, {value:'CONJUGE', label:'Cônjuge'}, {value:'PAI', label:'Pai'}, {value:'MAE', label:'Mãe'}, {value:'OUTRO', label:'Outro'}]} /></div>
                               <div className="md:col-span-3"><InputField label="Nascimento" type="date" id="dep-birth" /></div>
                               <button 
                                  onClick={() => {
                                     const n = document.getElementById('dep-name') as HTMLInputElement;
                                     const r = document.getElementById('dep-rel') as HTMLSelectElement;
                                     const b = document.getElementById('dep-birth') as HTMLInputElement;
                                     if (!n.value || !b.value) return alert("Preencha nome e nascimento do dependente.");
                                     const newDep: Dependent = {
                                        id: Math.random().toString(36).substr(2, 9),
                                        nome: n.value,
                                        parentesco: r.value as any,
                                        dataNascimento: b.value
                                     };
                                     setFormData({...formData, dependentes: [...(formData.dependentes || []), newDep]});
                                     n.value = ''; b.value = '';
                                  }}
                                  className="md:col-span-2 py-2 bg-indigo-600 text-white rounded-lg font-black text-[9px] uppercase hover:bg-indigo-700 transition-all shadow-sm"
                               >Adicionar</button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'rh' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                         <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Heart size={14}/> Informações de Saúde</h4>
                         <div className="grid grid-cols-2 gap-4">
                            <SelectField label="Tipo Sanguíneo" value={formData.tipo_sanguineo} onChange={(v:any) => setFormData({...formData, tipo_sanguineo: v})} options={[{value:'A+', label:'A+'}, {value:'A-', label:'A-'}, {value:'B+', label:'B+'}, {value:'B-', label:'B-'}, {value:'O+', label:'O+'}, {value:'O-', label:'O-'}, {value:'AB+', label:'AB+'}, {value:'AB-', label:'AB-'}]} />
                            <InputField label="Contato Emergência" value={formData.contato_emergencia} onChange={(v:any) => setFormData({...formData, contato_emergencia: v})} placeholder="(00) 00000-0000" />
                            <InputField label="Necessidades Especiais" value={formData.necessidades_especiais} onChange={(v:any) => setFormData({...formData, necessidades_especiais: v})} className="col-span-2" />
                         </div>
                      </div>


                   </div>
                </div>
              )}

              {activeTab === 'endereco' && (
                <div className="grid grid-cols-12 gap-4">
                   <InputField 
                     label="CEP" 
                     value={formData.cep} 
                     onChange={(v:any) => {
                       const masked = v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, "$1-$2").substring(0, 9);
                       setFormData({...formData, cep: masked});
                       if (masked.length === 9) handleCEPLookup(masked);
                     }} 
                     className="col-span-4" 
                   />
                   <InputField label="Cidade" value={formData.cidade} onChange={(v:any) => setFormData({...formData, cidade: v})} className="col-span-8" />
                   <InputField label="Rua" value={formData.endereco} onChange={(v:any) => setFormData({...formData, endereco: v})} className="col-span-9" />
                   <InputField label="Nº" value={formData.numero} onChange={(v:any) => setFormData({...formData, numero: v})} className="col-span-3" />
                   <InputField label="Complemento" value={formData.complemento} onChange={(v:any) => setFormData({...formData, complemento: v})} className="col-span-4" />
                   <InputField label="Bairro" value={formData.bairro} onChange={(v:any) => setFormData({...formData, bairro: v})} className="col-span-4" />
                   <InputField label="Estado" value={formData.estado} onChange={(v:any) => setFormData({...formData, estado: v})} className="col-span-4" />
                </div>
              )}

              {activeTab === 'vida_crista' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputField label="Data de Conversão" type="date" value={toDateValue(formData.data_conversao)} onChange={(v:any) => setFormData({...formData, data_conversao: v})} />
                   <InputField label="Local de Conversão" value={formData.local_conversao} onChange={(v:any) => setFormData({...formData, local_conversao: v})} />
                   <InputField label="Data de Batismo" type="date" value={toDateValue(formData.data_batismo)} onChange={(v:any) => setFormData({...formData, data_batismo: v})} />
                   <InputField label="Igreja do Batismo" value={formData.igreja_batismo} onChange={(v:any) => setFormData({...formData, igreja_batismo: v})} />
                   <InputField label="Pastor que Batizou" value={formData.pastor_batizador} onChange={(v:any) => setFormData({...formData, pastor_batizador: v})} />
                   <SelectField label="Batismo no Espírito Santo" value={formData.batismo_espirito_santo} onChange={(v:any) => setFormData({...formData, batismo_espirito_santo: v})} options={[{value:'SIM', label:'Sim'}, {value:'NAO', label:'Não'}]} />
                   <InputField label="Igreja de Origem" value={formData.igreja_origem} onChange={(v:any) => setFormData({...formData, igreja_origem: v})} />
                   <SelectField label="Curso de Discipulado" value={formData.curso_discipulado} onChange={(v:any) => setFormData({...formData, curso_discipulado: v})} options={[{value:'NAO_INICIADO', label:'Não Iniciado'}, {value:'EM_ANDAMENTO', label:'Em Andamento'}, {value:'CONCLUIDO', label:'Concluído'}]} />
                   <SelectField label="Escola Bíblica" value={formData.escola_biblica} onChange={(v:any) => setFormData({...formData, escola_biblica: v})} options={[{value:'ATIVO', label:'Ativo'}, {value:'INATIVO', label:'Inativo'}, {value:'NAO_FREQUENTA', label:'Não Frequenta'}]} />
                </div>
              )}

              {activeTab === 'ministerios' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputField label="Cargo Eclesiástico" value={formData.cargo_eclesiastico} onChange={(v:any) => setFormData({...formData, cargo_eclesiastico: v})} />
                   <InputField label="Data Consagração" type="date" value={toDateValue(formData.data_consagracao)} onChange={(v:any) => setFormData({...formData, data_consagracao: v})} />
                   <InputField label="Ministério Principal" value={formData.ministerio_principal} onChange={(v:any) => setFormData({...formData, ministerio_principal: v})} />
                   <InputField label="Função no Ministério" value={formData.funcao_ministerio} onChange={(v:any) => setFormData({...formData, funcao_ministerio: v})} />
                   <InputField label="Outros Ministérios" value={formData.outros_ministerios?.join(', ')} onChange={(v:any) => setFormData({...formData, outros_ministerios: v.split(',').map((s:string) => s.trim())})} placeholder="Separados por vírgula" />
                   <InputField label="Data Membresia" type="date" value={toDateValue(formData.data_ingresso)} onChange={(v:any) => setFormData({...formData, data_ingresso: v})} />
                   <InputField label="Talentos" value={formData.talentos} onChange={(v:any) => setFormData({...formData, talentos: v})} />
                   <InputField label="Dons Espirituais" value={formData.dons_espirituais} onChange={(v:any) => setFormData({...formData, dons_espirituais: v})} />
                   <InputField label="Célula/Grupo" value={formData.cell_group} onChange={(v:any) => setFormData({...formData, cell_group: v})} />
                </div>
              )}

              {activeTab === 'financeiro' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <SelectField label="É Dizimista?" value={formData.dizimista ? 'SIM' : 'NAO'} onChange={(v:any) => setFormData({...formData, dizimista: v === 'SIM'})} options={[{value:'SIM', label:'Sim'}, {value:'NAO', label:'Não'}]} />
                      <SelectField label="É Ofertante Regular?" value={formData.eh_ofertante_regular ? 'SIM' : 'NAO'} onChange={(v:any) => setFormData({...formData, eh_ofertante_regular: v === 'SIM'})} options={[{value:'SIM', label:'Sim'}, {value:'NAO', label:'Não'}]} />
                      <SelectField label="Participa de Campanhas?" value={formData.participa_campanhas ? 'SIM' : 'NAO'} onChange={(v:any) => setFormData({...formData, participa_campanhas: v === 'SIM'})} options={[{value:'SIM', label:'Sim'}, {value:'NAO', label:'Não'}]} />
                   </div>

                   <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 space-y-4">
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><DollarSign size={14}/> Registrar Nova Contribuição</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                         <div className="md:col-span-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Valor (R$)</label>
                            <input id="quick-tithe-value" type="number" placeholder="0.00" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl font-black text-xs text-indigo-700 outline-none focus:ring-2 focus:ring-indigo-500" />
                         </div>
                         <div className="md:col-span-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Tipo</label>
                            <select id="quick-tithe-type" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500">
                               <option value="Dizimo">Dízimo</option>
                               <option value="OFFERING">Oferta</option>
                               <option value="CAMPAIGN">Campanha</option>
                            </select>
                         </div>
                         <div className="md:col-span-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Data</label>
                            <input id="quick-tithe-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500" />
                         </div>
                         <button 
                           onClick={async () => {
                             const valInput = document.getElementById('quick-tithe-value') as HTMLInputElement;
                             const typeInput = document.getElementById('quick-tithe-type') as HTMLSelectElement;
                             const dateInput = document.getElementById('quick-tithe-date') as HTMLInputElement;
                             
                             const val = Number(valInput.value);
                             if (!val) return alert("Informe um valor válido.");
                             
                             const newContribution = {
                               id: Math.random().toString(36).substr(2, 9),
                               valor: val,
                               data: dateInput.value,
                               tipo: typeInput.value as any,
                               descricao: typeInput.value === 'Dizimo' ? `Dízimo: ${formData.nome}` : `${typeInput.options[typeInput.selectedIndex].text}: ${formData.nome}`
                             };

                             // Update member contributions
                             const updatedContributions = [...(formData.contribuicoes || []), newContribution];
                             const updatedMember = {...formData, contribuicoes: updatedContributions};
                             setFormData(updatedMember);
                             
                             // Create Transaction in Financeiro
                             const transactionData: Partial<Transacao> = {
                                descricao: newContribution.descricao,
                                valor: val,
                                data_transacao: dateInput.value,
                                tipo: 'ENTRADA',
                                categoria: typeInput.value,
                                id_conta: contas_bancarias[0]?.id || '',
                                situacao: 'REALIZADO',
                                id_unidade: currentIdUnidade,
                                forma_pagamento: 'PIX',
                                id_membro: formData.id_membro,
                              };

                              try {
                                // Save member first
                                await dbService.saveMember(updatedMember);
                                setMembers(prev => prev.map(m => m.id_membro === updatedMember.id_membro ? updatedMember as Membro : m));

                                const savedId = await dbService.saveTransaction(transactionData);
                                setTransactions(prev => [...prev, { ...transactionData, id_transacao: savedId } as Transacao]);
                                
                                valInput.value = '';
                                alert("Contribuição registrada com sucesso no perfil e no financeiro!");
                             } catch (error) {
                               console.error("Erro ao salvar:", error);
                               alert("Houve um erro ao registrar a contribuição. Verifique o console.");
                             }
                           }}
                           className="h-[38px] bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase px-4 hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2"
                         >
                            <Plus size={14}/> Lançar
                         </button>
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center">
                         <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Calendar size={14}/> Mapa de Fidelidade (Dízimos - Últimos 12 Meses)</h4>
                         <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
                               <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Pago
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
                               <div className="w-2 h-2 rounded-full bg-rose-500"></div> Pendente
                            </div>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
                         {titheMap.map((m, i) => (
                            <div key={i} className={`flex flex-col items-center p-2 rounded-xl border transition-all ${m.hasTithe ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                               <p className={`text-[9px] font-black uppercase leading-none mb-1 ${m.hasTithe ? 'text-emerald-700' : 'text-rose-700'}`}>{m.label}</p>
                               <p className="text-[8px] font-bold text-slate-400 mb-2">{m.year}</p>
                               {m.hasTithe ? (
                                  <CheckCircle2 size={16} className="text-emerald-600" />
                               ) : (
                                  <XCircle size={16} className="text-rose-600" />
                               )}
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-4">Histórico de Contribuições</h4>
                      {formData.contribuicoes && formData.contribuicoes.length > 0 ? (
                        <div className="space-y-2">
                          {formData.contribuicoes.map((c, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                              <div>
                                <p className="text-xs font-bold text-slate-800">{c.tipo}</p>
                                <p className="text-[10px] text-slate-500">{new Date(c.data).toLocaleDateString('pt-BR')} {c.descricao && `- ${c.descricao}`}</p>
                              </div>
                              <p className="text-sm font-black text-emerald-600">R$ {c.valor.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">Nenhuma contribuição registrada.</p>
                      )}
                   </div>
                </div>
              )}

              {activeTab === 'outros' && (
                <div className="space-y-8">
                   <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-6 flex items-center gap-2"><History size={14}/> Jornada do Membro (Timeline)</h4>
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                        <div className="space-y-8 relative">
                          {[
                            { label: 'Conversão', date: formData.data_conversao, icon: <Flame size={12}/>, color: 'bg-orange-500' },
                            { label: 'Batismo', date: formData.data_batismo, icon: <Baby size={12}/>, color: 'bg-blue-500' },
                            { label: 'Membresia', date: formData.data_ingresso, icon: <Users size={12}/>, color: 'bg-indigo-500' },
                            { label: 'Consagração', date: formData.data_consagracao, icon: <Award size={12}/>, color: 'bg-purple-500' },
                          ].map((step, i) => (
                            <div key={i} className="flex items-center gap-6 ml-2">
                              <div className={`w-5 h-5 rounded-full ${step.date ? step.color : 'bg-slate-200'} z-10 flex items-center justify-center text-white shadow-sm`}>
                                {step.icon}
                              </div>
                              <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">{step.label}</p>
                                <p className="text-xs text-slate-500 font-medium">{step.date ? new Date(step.date).toLocaleDateString('pt-BR') : 'Pendente'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                         <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Tag size={14}/> Etiquetas / Tags</h4>
                         <div className="flex flex-wrap gap-2 mb-4">
                            {formData.tags?.map((tag, i) => (
                              <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                                {tag}
                                <button onClick={() => setFormData({...formData, tags: formData.tags?.filter((_, idx) => idx !== i)})}><X size={10}/></button>
                              </span>
                            ))}
                         </div>
                         <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Nova tag..." 
                              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = (e.target as HTMLInputElement).value.trim();
                                  if (val && !formData.tags?.includes(val)) {
                                    setFormData({...formData, tags: [...(formData.tags || []), val]});
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }
                              }}
                            />
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Info size={14}/> Observações Gerais</h4>
                      <textarea 
                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm" 
                        placeholder="Histórico pastoral, observações relevantes..." 
                        value={formData.observacoes} 
                        onChange={(e) => setFormData({...formData, observacoes: e.target.value})} 
                      />
                   </div>
                </div>
              )}

              {activeTab === 'lgpd' && (
                <div className="space-y-8">
                  {/* Resumo de Consentimentos Atuais */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-6 flex items-center gap-2">
                      <Shield size={14} />
                      Consentimentos LGPD Atuais
                    </h4>
                    
                    {memberConsents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {memberConsents.map((consent, index) => (
                          <div key={index} className="bg-white p-4 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold text-slate-900">
                                {consent.consentType === 'DATA_PROCESSING' && 'Tratamento de Dados'}
                                {consent.consentType === 'COMMUNICATION' && 'Comunicação'}
                                {consent.consentType === 'MARKETING' && 'Marketing'}
                                {consent.consentType === 'FINANCIAL' && 'Financeiro'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                consent.concedido 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {consent.concedido ? 'Concedido' : 'Revogado'}
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
                    ) : formData.lgpd_consent?.documentUrl && formData.lgpd_consent.documentUrl.length > 10 ? (
                      <div className="text-center py-6 bg-white rounded-xl border border-green-200">
                        <Shield className="w-12 h-12 mx-auto mb-3 text-green-500" />
                        <p className="font-bold text-green-700 mb-1">Termo Assinado Anexado</p>
                        <p className="text-xs text-slate-500 mb-4 px-4">O documento de consentimento físico foi digitalizado e arquivado com sucesso.</p>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            if (formData.lgpd_consent?.documentUrl) {
                              openDocumentInNewTab(
                                formData.lgpd_consent.documentUrl, 
                                `Termo-LGPD-${formData.nome || 'Membro'}`
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
                            setShowTermoVoluntariado(true);
                          }}
                          className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <FileText size={16} />
                          {currentUnitData ? 'Imprimir Termo Voluntariado' : 'Carregando dados da Instituição...'}
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
                                    lgpd_consent: {
                                      ...(prev.lgpd_consent || {
                                        dataProcessing: true, communication: true, marketing: true, financial: true, policyVersion: currentPolicy?.version || '1.0'
                                      }),
                                      documentUrl: reader.result as string
                                    }
                                  }));
                                  alert('O Termo foi lido pelo navegador! Não esqueça de Salvar o Registro Ministerial para enviar ao banco de dados.');
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title="Anexar documento impresso/assinado"
                          />
                          <button
                            type="button"
                            className="w-full py-3 bg-slate-600 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 pointer-eventos_igreja-none"
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
                  {currentPolicy && currentPolicy.version && (
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase mb-4 flex items-center gap-2">
                        <BookOpen size={14} />
                        Política de Privacidade Atual
                      </h4>
                      
                      <div className="space-y-2 text-sm">
                        <div><strong>Versão:</strong> {currentPolicy.version}</div>
                        {(currentPolicy.effectiveDate || (currentPolicy as any).criado_em) && (
                          <div><strong>Vigência:</strong> {new Date(currentPolicy.effectiveDate || (currentPolicy as any).criado_em).toLocaleDateString('pt-BR')}</div>
                        )}
                        <div><strong>Status:</strong>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            (currentPolicy.isActive ?? (currentPolicy as any).esta_ativo)
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {(currentPolicy.isActive ?? (currentPolicy as any).esta_ativo) ? 'Ativa' : 'Inativa'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={closeMemberModal} 
                className="px-8 py-3 font-bold uppercase text-[11px] bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              
              <button 
                onClick={handleSave} 
                disabled={isSaving || !canWriteMembers} 
                className="px-10 py-3 font-black uppercase text-[11px] bg-indigo-600 text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-indigo-400 transition-all"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16}/>}
                {isSaving ? 'Salvando...' : 'Salvar Registro'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isIDCardOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl no-print">
           <div className="bg-white rounded-[2.5rem] w-full max-w-5xl shadow-2xl relative flex flex-col h-[90vh] overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-white shrink-0">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md"><Printer size={20}/></div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 leading-none">Prévia de Credenciais</h3>
                    </div>
                 </div>
                 <button onClick={() => setIsIDCardOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={24}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 bg-slate-50 flex flex-col items-center gap-8 custom-scrollbar" id="printable-area">
                {isLoadingUnit ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 size={48} className="animate-spin text-indigo-600" />
                    <span className="ml-4 text-lg font-bold text-slate-600">Carregando dados da instituição...</span>
                  </div>
                ) : (
                  <>
                    {console.log('🎴 Renderizando cartões:', { 
                      selectedCount: selectedMemberIds.length, 
                      selectedIds: selectedMemberIds,
                      currentUnitData: currentUnitData?.nome || 'Sem dados',
                      membersCount: members.length 
                    })}
                    {selectedMemberIds.length === 0 ? (
                      <div className="flex items-center justify-center h-64 text-slate-400">
                        <p className="text-lg font-bold">Selecione pelo menos um membro para imprimir carteirinhas</p>
                      </div>
                    ) : (
                      <>
                        {console.log('🎴 Renderizando cartões. selectedMemberIds:', selectedMemberIds)}
                        {members.filter(m => selectedMemberIds.includes(m.id_membro)).map(m => {
                          console.log('🎴 Chamando TemplateCarteiraMembro para:', m.nome);
                          return <TemplateCarteiraMembro key={m.id_membro} member={m} unit={currentUnitData} id={`card-to-print-${m.id_membro}`} />
                        })}
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="p-6 border-t flex flex-col md:flex-row gap-4 bg-white shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
                <button 
                  onClick={handleDownloadPDF} 
                  disabled={isGeneratingPDF} 
                  className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl"
                >
                  {isGeneratingPDF ? <Loader2 size={20} className="animate-spin"/> : <Download size={20}/>}
                  {isGeneratingPDF ? 'Renderizando PDF Ultra HD...' : 'Baixar PDF de Alta Fidelidade (Gráfica)'}
                </button>
                <button 
                  onClick={handleDirectPrint}
                  disabled={isGeneratingPDF}
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl disabled:opacity-60"
                >
                  {isGeneratingPDF ? <Loader2 size={20} className="animate-spin"/> : <Printer size={20}/>}
                  {isGeneratingPDF ? 'Preparando impressão...' : 'Imprimir na Impressora'}
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Impressão de cadastro — componente dedicado */}
      {showPrintModal && (
        <ImprimeCadMembro
          members={members}
          onClose={() => setShowPrintModal(false)}
          preSelected={selectedMemberIds.length > 0 ? members.filter(m => selectedMemberIds.includes(m.id)) : undefined}
        />
      )}

      {/* Modal LGPD */}
      {showLGPDModal && (
        <LGPDConsentModal
          isOpen={showLGPDModal}
          onClose={() => setShowLGPDModal(false)}
          onConsent={handleLGPDConsent}
          userType="MEMBER"
          userId={formData.id_membro || ''}
          userName={formData.nome || ''}
          currentConsent={memberConsents.find(c => c.userId === formData.id_membro)}
          currentPolicy={currentPolicy || undefined}
        />
      )}

      {/* Termo de Voluntariado imprimível */}
      {showTermoVoluntariado && editingMember && (
        <TermoVoluntariado
          nome={formData.nome || editingMember.nome || ''}
          cpf={formData.cpf || editingMember.cpf}
          rg={formData.rg || editingMember.rg || (formData as any).identidade || (editingMember as any).identidade || ''}
          endereco={
            (() => {
              const parts = [
                formData.endereco || editingMember.endereco,
                formData.numero || editingMember.numero,
                formData.complemento || (editingMember as any).complemento,
                formData.bairro || editingMember.bairro,
                [formData.cidade || editingMember.cidade, formData.estado || editingMember.estado].filter(Boolean).join('/')
              ].filter(Boolean);
              return parts.length > 0 ? parts.join(' - ') : undefined;
            })()
          }
          telefone={formData.telefone || formData.whatsapp || editingMember.telefone || editingMember.whatsapp || (formData as any).celular || (editingMember as any).celular}
          igrejaNome={currentUnitData?.nome || ''}
          igrejaCnpj={currentUnitData?.cnpj || ''}
          igrejaEndereco={
            (() => {
              const city = currentUnitData?.cidade || currentUnitData?.city || '';
              const state = currentUnitData?.estado || currentUnitData?.state || '';
              return [currentUnitData?.enderecoLinha1 || currentUnitData?.endereco || '', [city, state].filter(Boolean).join('/')].filter(Boolean).join(' - ') || '';
            })()
          }
          igrejaContato={(currentUnitData as any)?.email || user?.email || 'contato@adjpa.com.br'}
          onClose={() => setShowTermoVoluntariado(false)}
        />
      )}

      {/* Termo de Adesão LGPD imprimível */}
      {showTermoLGPD && editingMember && (
        <TermoAdesaoLGPD
          nome={formData.nome || editingMember.nome || ''}
          cpf={formData.cpf || editingMember.cpf}
          rg={formData.rg || editingMember.rg || (formData as any).identidade || (editingMember as any).identidade || ''}
          endereco={
            (() => {
              const parts = [
                formData.endereco || editingMember.endereco,
                formData.numero || editingMember.numero,
                formData.complemento || (editingMember as any).complemento,
                formData.bairro || editingMember.bairro,
                [formData.cidade || editingMember.cidade, formData.estado || editingMember.estado].filter(Boolean).join('/')
              ].filter(Boolean);
              return parts.length > 0 ? parts.join(' - ') : undefined;
            })()
          }
          telefone={formData.telefone || formData.whatsapp || editingMember.telefone || editingMember.whatsapp || ''}
          igrejaNome={currentUnitData?.nome || ''}
          igrejaCnpj={currentUnitData?.cnpj || ''}
          igrejaEndereco={
            (() => {
              const city = currentUnitData?.cidade || currentUnitData?.city || '';
              const state = currentUnitData?.estado || currentUnitData?.state || '';
              return [currentUnitData?.enderecoLinha1 || currentUnitData?.endereco || '', [city, state].filter(Boolean).join('/')].filter(Boolean).join(' - ') || '';
            })()
          }
          igrejaContato={(currentUnitData as any)?.email || user?.email || 'contato@adjpa.com.br'}
          onClose={() => setShowTermoLGPD(false)}
        />
      )}

      {/* VisualizadorLGPD removido em favor da abertura em nova aba */}
    </div>
  );
};
