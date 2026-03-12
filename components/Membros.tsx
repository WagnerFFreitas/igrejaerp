import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Edit2, X, User, Plus, Printer, QrCode, Square, CheckSquare, 
  Loader2, Save, Trash2, Camera, Heart, Baby, Flame, Award, Map, AlertCircle, 
  DollarSign, Star, Users, TrendingUp, Download, Phone, Mail, Briefcase, 
  Info, Sparkles, BookOpen, MapPin, Calendar, History, Tag, Landmark, Users2,
  MessageSquare, CheckCircle2, XCircle, Filter
} from 'lucide-react';
import { Member, Transaction, FinancialAccount, MemberContribution, Dependent, UserAuth } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { dbService } from '../services/databaseService';
import { StorageService } from '../src/services/storageService';
import { TemplateCarteiraMembro } from './TemplateCarteiraMembro';
import { useAudit } from '../src/hooks/useAudit';

type MemberTab = 'pessoais' | 'familia' | 'endereco' | 'vida_crista' | 'ministerios' | 'financeiro' | 'rh' | 'outros';

interface MembrosProps {
  members: Member[];
  currentUnitId: string;
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  accounts: FinancialAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<FinancialAccount[]>>;
  user?: UserAuth;
}

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

export const Membros: React.FC<MembrosProps> = ({ members, currentUnitId, setMembers, setTransactions, accounts, setAccounts, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);

  // Hook de auditoria
  const { logAction } = useAudit(user);

  // Função para identificar campos alterados
  const getChangedFields = (oldData: Member, newData: Member): string[] => {
    const changedFields: string[] = [];
    
    // Campos principais
    if (oldData.name !== newData.name) changedFields.push('nome');
    if (oldData.email !== newData.email) changedFields.push('email');
    if (oldData.phone !== newData.phone) changedFields.push('telefone');
    if (oldData.cpf !== newData.cpf) changedFields.push('cpf');
    if (oldData.profession !== newData.profession) changedFields.push('profissão');
    if (oldData.status !== newData.status) changedFields.push('status');
    if (oldData.role !== newData.role) changedFields.push('função');
    
    // Endereço
    if (oldData.address?.zipCode !== newData.address?.zipCode) changedFields.push('CEP');
    if (oldData.address?.street !== newData.address?.street) changedFields.push('rua');
    if (oldData.address?.number !== newData.address?.number) changedFields.push('número');
    if (oldData.address?.city !== newData.address?.city) changedFields.push('cidade');
    if (oldData.address?.state !== newData.address?.state) changedFields.push('estado');
    
    return changedFields;
  };
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState<MemberTab>('pessoais');
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const stats = useMemo(() => ({
    active: members.filter(m => m.status === 'ACTIVE').length,
    leaders: members.filter(m => m.role === 'LEADER').length,
    visitors: members.filter(m => m.role === 'VISITOR').length,
    total: members.length
  }), [members]);

  const getNextMemberMatricula = () => {
    const currentYear = new Date().getFullYear();
    if (!members || members.length === 0) return `M01/${currentYear}`;
    
    const numbers = members
      .filter(m => m.matricula && m.matricula.startsWith('M'))
      .map(m => {
        const match = m.matricula.match(/M(\d+)\//);
        return match ? parseInt(match[1]) : 0;
      });
    
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;
    const paddedNumber = nextNumber.toString().padStart(2, '0');
    
    return `M${paddedNumber}/${currentYear}`;
  };

  const [formData, setFormData] = useState<Partial<Member>>({
    name: '', matricula: '', cpf: '', rg: '', email: '', phone: '', whatsapp: '', profession: '',
    status: 'ACTIVE', role: 'MEMBER', gender: 'M', maritalStatus: 'SINGLE',
    address: { zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
    unitId: currentUnitId, contributions: [], otherMinistries: [],
    holySpiritBaptism: 'NAO', discipleshipCourse: 'NAO_INICIADO', biblicalSchool: 'NAO_FREQUENTA',
    isTithable: false, isRegularGiver: false, participatesCampaigns: false,
    dependents: [], bloodType: 'A+', emergencyContact: '', tags: [], familyId: ''
  });

  useEffect(() => {
    if (isModalOpen && !formData.matricula) {
      const next = getNextMemberMatricula();
      setFormData(prev => ({ ...prev, matricula: next }));
    }
  }, [isModalOpen, formData.matricula, members.length]);

  const titheMap = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = d.toISOString().slice(0, 7);
      const hasTithe = formData.contributions?.some(c => 
        c.type === 'TITHE' && c.date.startsWith(monthYear)
      );
      months.push({
        label: d.toLocaleDateString('pt-BR', { month: 'short' }),
        year: d.getFullYear(),
        hasTithe,
        monthYear
      });
    }
    return months;
  }, [formData.contributions]);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.cpf && m.cpf.includes(searchTerm)) ||
    (m.tags && m.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

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
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address!,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
            zipCode: data.cep
          }
        }));
      }
    } catch (e) { console.error(e); } finally { setIsSearchingCEP(false); }
  };

  const handleSave = async () => {
    console.log("🚀 Iniciando salvamento do membro...");
    
    if (!formData.name) {
      console.log("❌ Nome obrigatório não preenchido");
      return alert("O nome é obrigatório.");
    }
    
    console.log("⏳ Setando isLoading para true...");
    setIsSaving(true);
    
    try {
      console.log("📝 Gerando ID do membro...");
      const memberId = editingMember?.id || `M${Date.now()}`;
      const matricula = formData.matricula || getNextMemberMatricula();
      let memberData = { ...formData, id: memberId, matricula } as Member;
      
      console.log("👤 Dados do membro preparados:", { id: memberData.id, name: memberData.name, matricula: memberData.matricula });

      if (avatarFile) {
        console.log("📷 Fazendo upload da foto...");
        try {
          const downloadURL = await StorageService.uploadProfilePhoto(currentUnitId, memberId, avatarFile);
          memberData.avatar = downloadURL;
          console.log("✅ Foto uploaded com sucesso");
        } catch (error) {
          console.warn("⚠️ Erro ao fazer upload da foto:", error);
          memberData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'M')}&background=003399&color=fff&bold=true`;
        }
      } else if (!memberData.avatar) {
        console.log("🎨 Usando avatar padrão");
        memberData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'M')}&background=003399&color=fff&bold=true`;
      }

      console.log("💾 Salvando membro no database...");
      const savedId = await dbService.saveMember(memberData);
      console.log("✅ Membro salvo com ID:", savedId);
      
      // Registrar auditoria
      if (editingMember) {
        await logAction('UPDATE', 'Member', memberData.id, memberData.name, { 
          action: `${user?.name || 'Usuário'} alterou o cadastro do membro ${memberData.name}`,
          changedFields: getChangedFields(editingMember, memberData)
        });
        console.log("🔍 Auditoria: Atualização de membro registrada");
      } else {
        await logAction('CREATE', 'Member', memberData.id, memberData.name, { 
          action: `${user?.name || 'Usuário'} cadastrou novo membro: ${memberData.name}`
        });
        console.log("🔍 Auditoria: Criação de membro registrada");
      }
      
      // Atualizar o ID retornado pelo Firebase se for novo membro
      if (!editingMember) {
        memberData.id = savedId;
        console.log("🔄 ID atualizado para:", savedId);
      }

      console.log("📋 Atualizando lista de membros...");
      if (editingMember) {
        setMembers(prev => prev.map(m => m.id === editingMember.id ? memberData : m));
        console.log("✅ Membro atualizado na lista global");
      } else {
        setMembers(prev => [memberData, ...prev]);
        console.log("✅ Membro adicionado à lista global");
      }
      
      console.log("🔚 Fechando modal e limpando estado...");
      setIsModalOpen(false);
      setEditingMember(null);
      setAvatarFile(null);
      
      console.log("🎉 Salvamento concluído com sucesso!");
      alert("Membro salvo com sucesso!");
      
    } catch (error) {
      console.error("❌ Erro ao salvar membro:", error);
      alert("Falha ao salvar. " + (error.message || "Verifique o console para mais detalhes."));
    } finally {
      console.log("🔄 Setando isLoading para false...");
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const selectedMembers = members.filter(m => selectedMemberIds.includes(m.id));
      const cardHeight = 53.98;
      const cardWidth = 176.2; 
      let currentY = 15;

      for (let i = 0; i < selectedMembers.length; i++) {
        if (currentY + cardHeight > 280) {
          pdf.addPage();
          currentY = 15;
        }
        const el = document.getElementById(`card-to-print-${selectedMembers[i].id}`);
        if (el) {
          const canvas = await html2canvas(el, { 
            scale: 8, 
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0,
            onclone: (clonedDoc) => {
              const card = clonedDoc.getElementById(`card-to-print-${selectedMembers[i].id}`);
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

  const handleDirectPrint = () => { window.print(); };

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
            <Printer size={14} /> Imprimir ({selectedMemberIds.length})
          </button>
          <button onClick={() => { 
            setEditingMember(null); 
            const generatedMatricula = getNextMemberMatricula();
            setFormData({
              name: '', matricula: generatedMatricula, unitId: currentUnitId, status: 'ACTIVE', role: 'MEMBER',
              address: {zipCode:'', street:'', number:'', complement: '', neighborhood:'', city:'', state:''},
              isTithable: false, isRegularGiver: false, participatesCampaigns: false, contributions: [], otherMinistries: [], dependents: [], bloodType: 'A+', emergencyContact: '', tags: [], familyId: ''
            }); 
            setIsModalOpen(true); 
          }} className="flex items-center gap-1.5 px-5 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-slate-800 transition-all">
            <Plus size={14} /> Novo Cadastro
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
            placeholder="Buscar por nome, e-mail ou CPF..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all whitespace-nowrap">
          <Filter size={18} /> Filtros Avançados
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 w-10 text-center">
                <div onClick={() => setSelectedMemberIds(selectedMemberIds.length === filteredMembers.length ? [] : filteredMembers.map(m => m.id))} className="cursor-pointer mx-auto">
                  {selectedMemberIds.length === filteredMembers.length && filteredMembers.length > 0 ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}
                </div>
              </th>
              <th className="px-4 py-4">Identificação</th>
              <th className="px-4 py-4">Cargo / Ministério</th>
              <th className="px-4 py-4">Vínculos</th>
              <th className="px-4 py-4">Status Financeiro</th>
              <th className="px-4 py-4">Situação</th>
              <th className="px-6 py-4 text-right">Ações</th>
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
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={member.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-100" alt="" />
                      {member.isTithable && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                          $
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{member.name}</p>
                      <p className="text-[10px] text-slate-500">{member.phone || member.whatsapp || 'Sem telefone'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-bold text-slate-800 text-xs">{member.ecclesiasticalPosition || 'Membro'}</p>
                  <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider">{member.mainMinistry || 'Geral'}</p>
                </td>
                <td className="px-4 py-4">
                  <button className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-600 rounded-lg text-[9px] font-bold uppercase hover:bg-slate-100 transition-all">
                    <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px]">F</div>
                    Ver Vínculos
                  </button>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                    member.isTithable ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {member.isTithable ? 'Dizimista' : (member.role === 'VISITOR' ? 'Visitante' : 'Membro')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                    member.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {member.status === 'ACTIVE' ? 'Regular' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3 text-slate-400">
                    <button onClick={() => { setEditingMember(member); setSelectedMemberIds([member.id]); setIsIDCardOpen(true); }} className="hover:text-slate-900"><QrCode size={16} /></button>
                    <button onClick={() => { 
                      const memberWithMatricula = { ...member, matricula: member.matricula || getNextMemberMatricula() };
                      setEditingMember(memberWithMatricula); 
                      setFormData(memberWithMatricula); 
                      setIsModalOpen(true); 
                    }} className="hover:text-slate-900"><Edit2 size={16} /></button>
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
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
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
                        <img src={formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'M')}&background=003399&color=fff&bold=true`} className="w-full h-full object-cover" />
                      </div>
                      <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                        <Camera className="text-white mb-1" size={24} />
                        <span className="text-[8px] text-white font-black uppercase tracking-tighter">Trocar Foto</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                      </label>
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-4">
                       <InputField label="Matrícula" value={formData.matricula} readOnly={true} className="col-span-1" />
                       <InputField label="Nome Completo" value={formData.name} onChange={(v:any) => setFormData({...formData, name: v})} className="col-span-3" />
                       <InputField label="CPF" value={formData.cpf} onChange={(v:any) => setFormData({...formData, cpf: v})} className="col-span-2" />
                       <InputField label="RG" value={formData.rg} onChange={(v:any) => setFormData({...formData, rg: v})} className="col-span-2" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="E-mail" value={formData.email} onChange={(v:any) => setFormData({...formData, email: v})} />
                    <InputField label="Telefone" value={formData.phone} onChange={(v:any) => setFormData({...formData, phone: v})} />
                    <InputField label="WhatsApp" value={formData.whatsapp} onChange={(v:any) => setFormData({...formData, whatsapp: v})} />
                    <InputField label="Nascimento" type="date" value={formData.birthDate} onChange={(v:any) => setFormData({...formData, birthDate: v})} />
                    <SelectField label="Sexo" value={formData.gender} onChange={(v:any) => setFormData({...formData, gender: v})} options={[{value:'M', label:'Masculino'}, {value:'F', label:'Feminino'}]} />
                    <InputField label="Profissão" value={formData.profession} onChange={(v:any) => setFormData({...formData, profession: v})} />
                    <SelectField label="Status" value={formData.status} onChange={(v:any) => setFormData({...formData, status: v})} options={[{value:'ACTIVE', label:'Ativo'}, {value:'INACTIVE', label:'Inativo'}, {value:'PENDING', label:'Pendente'}]} />
                    <SelectField label="Cargo/Função" value={formData.role} onChange={(v:any) => setFormData({...formData, role: v})} options={[{value:'MEMBER', label:'Membro'}, {value:'VISITOR', label:'Visitante'}, {value:'VOLUNTEER', label:'Voluntário'}, {value:'STAFF', label:'Staff'}, {value:'LEADER', label:'Líder'}]} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <InputField label="Nome do Pai" value={formData.fatherName} onChange={(v:any) => setFormData({...formData, fatherName: v})} />
                    <InputField label="Nome da Mãe" value={formData.motherName} onChange={(v:any) => setFormData({...formData, motherName: v})} />
                    <InputField label="Observações" value={formData.observations} onChange={(v:any) => setFormData({...formData, observations: v})} className="col-span-2" />
                  </div>
                </div>
              )}

              {activeTab === 'familia' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                         <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Heart size={14}/> Estado Civil</h4>
                         <SelectField label="Estado Civil" value={formData.maritalStatus} onChange={(v:any) => setFormData({...formData, maritalStatus: v})} options={[{value:'SINGLE', label:'Solteiro(a)'}, {value:'MARRIED', label:'Casado(a)'}, {value:'DIVORCED', label:'Divorciado(a)'}, {value:'WIDOWED', label:'Viúvo(a)'}]} />
                         {formData.maritalStatus === 'MARRIED' && (
                           <>
                             <InputField label="Nome do Cônjuge" value={formData.spouseName} onChange={(v:any) => setFormData({...formData, spouseName: v})} />
                             <InputField label="Data de Casamento" type="date" value={formData.marriageDate} onChange={(v:any) => setFormData({...formData, marriageDate: v})} />
                           </>
                         )}
                      </div>

                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                         <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Users2 size={14}/> Vínculo Familiar</h4>
                         <p className="text-[10px] text-slate-500 font-medium italic">Agrupe membros da mesma família para gestão unificada.</p>
                         <InputField label="ID da Família" value={formData.familyId} onChange={(v:any) => setFormData({...formData, familyId: v})} placeholder="Ex: FAM-001" />
                      </div>

                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4 md:col-span-2">
                         <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Users2 size={14}/> Dependentes / Composição Familiar</h4>
                         <div className="space-y-3">
                            {formData.dependents && formData.dependents.length > 0 ? (
                              formData.dependents.map((dep, i) => (
                                 <div key={dep.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                                    <div>
                                       <p className="text-xs font-bold text-slate-800">{dep.name}</p>
                                       <p className="text-[10px] text-slate-500 uppercase font-bold">{dep.relationship} • {new Date(dep.birthDate).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <button onClick={() => setFormData({...formData, dependents: formData.dependents?.filter((_, idx) => idx !== i)})} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-all"><Trash2 size={14}/></button>
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
                                        name: n.value,
                                        relationship: r.value as any,
                                        birthDate: b.value
                                     };
                                     setFormData({...formData, dependents: [...(formData.dependents || []), newDep]});
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
                            <SelectField label="Tipo Sanguíneo" value={formData.bloodType} onChange={(v:any) => setFormData({...formData, bloodType: v})} options={[{value:'A+', label:'A+'}, {value:'A-', label:'A-'}, {value:'B+', label:'B+'}, {value:'B-', label:'B-'}, {value:'O+', label:'O+'}, {value:'O-', label:'O-'}, {value:'AB+', label:'AB+'}, {value:'AB-', label:'AB-'}]} />
                            <InputField label="Contato Emergência" value={formData.emergencyContact} onChange={(v:any) => setFormData({...formData, emergencyContact: v})} placeholder="(00) 00000-0000" />
                            <InputField label="Necessidades Especiais" value={formData.specialNeeds} onChange={(v:any) => setFormData({...formData, specialNeeds: v})} className="col-span-2" />
                         </div>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                         <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Landmark size={14}/> Dados Bancários</h4>
                         <div className="grid grid-cols-2 gap-4">
                            <InputField label="Banco" value={formData.bank} onChange={(v:any) => setFormData({...formData, bank: v})} />
                            <InputField label="Agência" value={formData.bankAgency} onChange={(v:any) => setFormData({...formData, bankAgency: v})} />
                            <InputField label="Conta" value={formData.bankAccount} onChange={(v:any) => setFormData({...formData, bankAccount: v})} />
                            <InputField label="Chave PIX" value={formData.pixKey} onChange={(v:any) => setFormData({...formData, pixKey: v})} />
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'endereco' && (
                <div className="grid grid-cols-12 gap-4">
                   <InputField 
                     label="CEP" 
                     value={formData.address?.zipCode} 
                     onChange={(v:any) => {
                       const masked = v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, "$1-$2").substring(0, 9);
                       setFormData({...formData, address: {...formData.address!, zipCode: masked}});
                       if (masked.length === 9) handleCEPLookup(masked);
                     }} 
                     className="col-span-4" 
                   />
                   <InputField label="Cidade" value={formData.address?.city} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, city: v}})} className="col-span-8" />
                   <InputField label="Rua" value={formData.address?.street} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, street: v}})} className="col-span-9" />
                   <InputField label="Nº" value={formData.address?.number} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, number: v}})} className="col-span-3" />
                   <InputField label="Complemento" value={formData.address?.complement} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, complement: v}})} className="col-span-4" />
                   <InputField label="Bairro" value={formData.address?.neighborhood} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, neighborhood: v}})} className="col-span-4" />
                   <InputField label="Estado" value={formData.address?.state} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, state: v}})} className="col-span-4" />
                </div>
              )}

              {activeTab === 'vida_crista' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputField label="Data de Conversão" type="date" value={formData.conversionDate} onChange={(v:any) => setFormData({...formData, conversionDate: v})} />
                   <InputField label="Local de Conversão" value={formData.conversionPlace} onChange={(v:any) => setFormData({...formData, conversionPlace: v})} />
                   <InputField label="Data de Batismo" type="date" value={formData.baptismDate} onChange={(v:any) => setFormData({...formData, baptismDate: v})} />
                   <InputField label="Igreja do Batismo" value={formData.baptismChurch} onChange={(v:any) => setFormData({...formData, baptismChurch: v})} />
                   <InputField label="Pastor que Batizou" value={formData.baptizingPastor} onChange={(v:any) => setFormData({...formData, baptizingPastor: v})} />
                   <SelectField label="Batismo no Espírito Santo" value={formData.holySpiritBaptism} onChange={(v:any) => setFormData({...formData, holySpiritBaptism: v})} options={[{value:'SIM', label:'Sim'}, {value:'NAO', label:'Não'}]} />
                   <InputField label="Igreja de Origem" value={formData.churchOfOrigin} onChange={(v:any) => setFormData({...formData, churchOfOrigin: v})} />
                   <SelectField label="Curso de Discipulado" value={formData.discipleshipCourse} onChange={(v:any) => setFormData({...formData, discipleshipCourse: v})} options={[{value:'NAO_INICIADO', label:'Não Iniciado'}, {value:'EM_ANDAMENTO', label:'Em Andamento'}, {value:'CONCLUIDO', label:'Concluído'}]} />
                   <SelectField label="Escola Bíblica" value={formData.biblicalSchool} onChange={(v:any) => setFormData({...formData, biblicalSchool: v})} options={[{value:'ATIVO', label:'Ativo'}, {value:'INATIVO', label:'Inativo'}, {value:'NAO_FREQUENTA', label:'Não Frequenta'}]} />
                </div>
              )}

              {activeTab === 'ministerios' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputField label="Cargo Eclesiástico" value={formData.ecclesiasticalPosition} onChange={(v:any) => setFormData({...formData, ecclesiasticalPosition: v})} />
                   <InputField label="Data Consagração" type="date" value={formData.consecrationDate} onChange={(v:any) => setFormData({...formData, consecrationDate: v})} />
                   <InputField label="Ministério Principal" value={formData.mainMinistry} onChange={(v:any) => setFormData({...formData, mainMinistry: v})} />
                   <InputField label="Função no Ministério" value={formData.ministryRole} onChange={(v:any) => setFormData({...formData, ministryRole: v})} />
                   <InputField label="Outros Ministérios" value={formData.otherMinistries?.join(', ')} onChange={(v:any) => setFormData({...formData, otherMinistries: v.split(',').map((s:string) => s.trim())})} placeholder="Separados por vírgula" />
                   <InputField label="Data Membresia" type="date" value={formData.membershipDate} onChange={(v:any) => setFormData({...formData, membershipDate: v})} />
                   <InputField label="Talentos" value={formData.talents} onChange={(v:any) => setFormData({...formData, talents: v})} />
                   <InputField label="Dons Espirituais" value={formData.spiritualGifts} onChange={(v:any) => setFormData({...formData, spiritualGifts: v})} />
                   <InputField label="Célula/Grupo" value={formData.cellGroup} onChange={(v:any) => setFormData({...formData, cellGroup: v})} />
                </div>
              )}

              {activeTab === 'financeiro' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <SelectField label="É Dizimista?" value={formData.isTithable ? 'SIM' : 'NAO'} onChange={(v:any) => setFormData({...formData, isTithable: v === 'SIM'})} options={[{value:'SIM', label:'Sim'}, {value:'NAO', label:'Não'}]} />
                      <SelectField label="É Ofertante Regular?" value={formData.isRegularGiver ? 'SIM' : 'NAO'} onChange={(v:any) => setFormData({...formData, isRegularGiver: v === 'SIM'})} options={[{value:'SIM', label:'Sim'}, {value:'NAO', label:'Não'}]} />
                      <SelectField label="Participa de Campanhas?" value={formData.participatesCampaigns ? 'SIM' : 'NAO'} onChange={(v:any) => setFormData({...formData, participatesCampaigns: v === 'SIM'})} options={[{value:'SIM', label:'Sim'}, {value:'NAO', label:'Não'}]} />
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
                               <option value="TITHE">Dízimo</option>
                               <option value="OFFERING">Oferta</option>
                               <option value="CAMPAIGN">Campanha</option>
                            </select>
                         </div>
                         <div className="md:col-span-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Data</label>
                            <input id="quick-tithe-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500" />
                         </div>
                         <button 
                           onClick={() => {
                             const valInput = document.getElementById('quick-tithe-value') as HTMLInputElement;
                             const typeInput = document.getElementById('quick-tithe-type') as HTMLSelectElement;
                             const dateInput = document.getElementById('quick-tithe-date') as HTMLInputElement;
                             
                             const val = Number(valInput.value);
                             if (!val) return alert("Informe um valor válido.");
                             
                             const newContribution = {
                               id: Math.random().toString(36).substr(2, 9),
                               value: val,
                               date: dateInput.value,
                               type: typeInput.value as any,
                               description: typeInput.value === 'TITHE' ? `Dízimo: ${formData.name}` : `${typeInput.options[typeInput.selectedIndex].text}: ${formData.name}`
                             };

                             // Update member contributions
                             const updatedContributions = [...(formData.contributions || []), newContribution];
                             setFormData({...formData, contributions: updatedContributions});
                             
                             valInput.value = '';
                             alert("Contribuição registrada com sucesso!");
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
                      {formData.contributions && formData.contributions.length > 0 ? (
                        <div className="space-y-2">
                          {formData.contributions.map((c, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                              <div>
                                <p className="text-xs font-bold text-slate-800">{c.type}</p>
                                <p className="text-[10px] text-slate-500">{new Date(c.date).toLocaleDateString('pt-BR')} {c.description && `- ${c.description}`}</p>
                              </div>
                              <p className="text-sm font-black text-emerald-600">R$ {c.value.toFixed(2)}</p>
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
                            { label: 'Conversão', date: formData.conversionDate, icon: <Flame size={12}/>, color: 'bg-orange-500' },
                            { label: 'Batismo', date: formData.baptismDate, icon: <Baby size={12}/>, color: 'bg-blue-500' },
                            { label: 'Membresia', date: formData.membershipDate, icon: <Users size={12}/>, color: 'bg-indigo-500' },
                            { label: 'Consagração', date: formData.consecrationDate, icon: <Award size={12}/>, color: 'bg-purple-500' },
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
                        value={formData.observations} 
                        onChange={(e) => setFormData({...formData, observations: e.target.value})} 
                      />
                   </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-slate-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold uppercase text-[11px] bg-white border border-slate-200 rounded-2xl">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-2 py-3 font-black uppercase text-[11px] bg-indigo-600 text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-indigo-400">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16}/>}
                {isSaving ? 'Salvando...' : 'Salvar Registro Ministerial'}
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
                {members.filter(m => selectedMemberIds.includes(m.id)).map(m => (
                   <TemplateCarteiraMembro key={m.id} member={m} id={`card-to-print-${m.id}`} />
                ))}
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
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl"
                >
                  <Printer size={20}/> Imprimir na Impressora
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};