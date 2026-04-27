/**
 * ============================================================================
 * PORTALMEMBRO.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para portal membro.
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
import { User, Award, History, CreditCard, Calendar, MapPin, Phone, Mail, Edit, Save, X, Download, Church, Users, BookOpen } from 'lucide-react';
import { Member, MemberContribution } from '../types';
import { dbService } from '../services/databaseService';

interface PortalMembroProps {
  // Props futuras para autenticação de membro
  memberId?: string;
}

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (portal membro).
 */

export const PortalMembro: React.FC<PortalMembroProps> = ({ memberId }) => {
  const [member, setMember] = useState<Member | null>(null);
  const [contributions, setContributions] = useState<MemberContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('dados');
  const [formData, setFormData] = useState<Partial<Member>>({});

  const normalizeMember = (rawMember: any): Member => {
    const endereco = typeof rawMember?.endereco === 'object' && rawMember.endereco !== null
      ? rawMember.endereco
      : {
          cep: rawMember?.cep || rawMember?.address?.cep || '',
          logradouro: rawMember?.endereco || rawMember?.address?.street || '',
          numero: rawMember?.numero || rawMember?.address?.number || '',
          complemento: rawMember?.complemento || rawMember?.address?.complement || '',
          bairro: rawMember?.bairro || rawMember?.address?.neighborhood || '',
          cidade: rawMember?.cidade || rawMember?.address?.city || '',
          estado: rawMember?.estado || rawMember?.address?.state || ''
        };

    return {
      ...rawMember,
      unidadeId: rawMember?.unidadeId || rawMember?.unit_id || rawMember?.unitId || 'u-sede',
      matricula: rawMember?.matricula || `M-${String(rawMember?.id || '000').slice(0, 8)}`,
      nome: rawMember?.nome || rawMember?.name || '',
      telefone: rawMember?.telefone || rawMember?.phone || rawMember?.celular || '',
      whatsapp: rawMember?.whatsapp || rawMember?.celular || rawMember?.telefone || rawMember?.phone || '',
      funcao: rawMember?.funcao || rawMember?.role || rawMember?.cargo_igreja || 'MEMBER',
      status: rawMember?.status || (rawMember?.situacao === 'INATIVO' ? 'INACTIVE' : 'ACTIVE'),
      situacao: rawMember?.situacao || (rawMember?.status === 'INACTIVE' ? 'INATIVO' : 'ATIVO'),
      contribuicoes: Array.isArray(rawMember?.contribuicoes) ? rawMember.contribuicoes : (Array.isArray(rawMember?.contributions) ? rawMember.contributions : []),
      outrosMinisterios: Array.isArray(rawMember?.outrosMinisterios) ? rawMember.outrosMinisterios : (Array.isArray(rawMember?.otherMinistries) ? rawMember.otherMinistries : []),
      dependentes: Array.isArray(rawMember?.dependentes) ? rawMember.dependentes : (Array.isArray(rawMember?.dependents) ? rawMember.dependents : []),
      dataMembro: rawMember?.dataMembro || rawMember?.membershipDate || rawMember?.data_membro || undefined,
      ministerioPrincipal: rawMember?.ministerioPrincipal || rawMember?.mainMinistry || rawMember?.ministerio || undefined,
      avatar: rawMember?.avatar || `https://ui-avatars.com/api/?nome=${encodeURIComponent(rawMember?.nome || rawMember?.nome || 'Membro')}&background=003399&color=fff&bold=true`,
      endereco,
      email: rawMember?.email || '',
      dataNascimento: rawMember?.dataNascimento || rawMember?.birthDate || rawMember?.data_nascimento || new Date().toISOString(),
      cpf: rawMember?.cpf || '',
      rg: rawMember?.rg || '',
      sexo: rawMember?.sexo || rawMember?.gender || 'OTHER',
      estadoCivil: rawMember?.estadoCivil || rawMember?.maritalStatus || 'SINGLE',
      ehDizimista: Boolean(rawMember?.ehDizimista || rawMember?.isTithable),
      ehOfertanteRegular: Boolean(rawMember?.ehOfertanteRegular || rawMember?.isRegularGiver),
      participaCampanhas: Boolean(rawMember?.participaCampanhas || rawMember?.participatesCampaigns)
    } as Member;
  };

  useEffect(() => {
    loadMemberData();
  }, [memberId]);

  const loadMemberData = async () => {
    try {
      setLoading(true);
      // Para demonstração, usar primeiro membro. Futuramente usar memberId
      const members = await dbService.getMembers('u-sede');
      if (members.length > 0) {
        const selectedMember = normalizeMember(members[0]); // Substituir por busca real quando implementado login
        setMember(selectedMember);
        setContributions(selectedMember.contributions || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do membro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (member) {
      setFormData(member);
      setEditing(true);
    }
  };

  const handleSave = async () => {
    if (member && formData) {
      try {
        const updatedMember = normalizeMember({ ...member, ...formData });
        // Implementar atualização no banco
        // await dbService.updateMember(updatedMember);
        setMember(updatedMember);
        setEditing(false);
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({});
  };

  const generateMemberCard = () => {
    if (!member) return;
    
    // Implementar geração de carteirinha digital
    const cardData = {
      nome: member.nome,
      matricula: member.matricula,
      funcao: member.funcao,
      situacao: member.situacao,
      avatar: member.avatar
    };
    
    console.log('Gerando carteirinha:', cardData);
    // Futuramente implementar geração de PDF/imagem
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
          <p className="text-slate-500">Dados do membro não encontrados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
      {/* Cabeçalho com informações básicas */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex gap-8 items-center justify-between">
          <div className="flex gap-8 items-center">
            <div className="w-32 h-32 rounded-[2rem] bg-indigo-100 overflow-hidden">
              <img 
                src={member.avatar || 'https://i.pravatar.cc/150?u=' + member.id} 
                className="w-full h-full object-cover" 
                alt={member.nome}
              />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">{member.nome}</h1>
              <p className="text-slate-500 font-medium">
Membro desde {member.dataMembro ? new Date(member.dataMembro).toLocaleDateString('pt-BR') : 'não informado'}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {member.funcao}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors"
            >
              <Edit size={16} /> Editar
            </button>
            <button
              onClick={generateMemberCard}
              className="px-4 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <Download size={16} /> Carteirinha
            </button>
          </div>
        </div>
      </div>

      {/* Abas de navegação */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-2">
        <div className="flex gap-2">
          {[
            { id: 'dados', label: 'Dados Pessoais', icon: <User size={16} /> },
            { id: 'contribuicoes', label: 'Contribuições', icon: <CreditCard size={16} /> },
            { id: 'ministerios', label: 'Ministérios', icon: <Church size={16} /> },
            { id: 'grupos', label: 'Grupos', icon: <Users size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === 'dados' && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Dados Pessoais</h2>
          
          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={formData.telefone || ''}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.whatsapp || ''}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Profissão</label>
                  <input
                    type="text"
                    value={formData.profissao || ''}
                    onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <X size={16} /> Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Save size={16} /> Salvar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-slate-400" size={20} />
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-slate-400" size={20} />
                  <div>
                    <p className="text-sm text-slate-500">Telefone</p>
                    <p className="font-medium">{member.telefone}</p>
                  </div>
                </div>
                {member.whatsapp && (
                  <div className="flex items-center gap-3">
                    <Phone className="text-slate-400" size={20} />
                    <div>
                      <p className="text-sm text-slate-500">WhatsApp</p>
                      <p className="font-medium">{member.whatsapp}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="text-slate-400" size={20} />
                  <div>
                    <p className="text-sm text-slate-500">Endereço</p>
                    <p className="font-medium">{member.endereco?.logradouro || 'Não informado'}{member.endereco?.numero ? `, ${member.endereco.numero}` : ''}</p>
                    <p className="text-sm text-slate-600">
                      {member.endereco?.bairro || 'Sem bairro'}{member.endereco?.cidade ? `, ${member.endereco.cidade}` : ''}{member.endereco?.estado ? ` - ${member.endereco.estado}` : ''}
                    </p>
                  </div>
                </div>
                {member.profissao && (
                  <div className="flex items-center gap-3">
                    <User className="text-slate-400" size={20} />
                    <div>
                      <p className="text-sm text-slate-500">Profissão</p>
                      <p className="font-medium">{member.profissao}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'contribuicoes' && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Histórico de Contribuições</h2>
          
          {contributions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500">Nenhuma contribuição registrada.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contributions.map((contribution) => (
                <div key={contribution.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-900">{contribution.tipo}</p>
                    <p className="text-sm text-slate-500">{new Date(contribution.data).toLocaleDateString('pt-BR')}</p>
                    {contribution.descricao && (
                      <p className="text-sm text-slate-600">{contribution.descricao}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">R$ {contribution.valor.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ministerios' && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Ministérios</h2>
          
          <div className="space-y-4">
            {member.ministerioPrincipal && (
              <div className="p-4 bg-indigo-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Church className="text-indigo-600" size={24} />
                  <div>
                    <p className="font-semibold text-indigo-900">Ministério Principal</p>
                    <p className="text-indigo-700">{member.ministerioPrincipal}</p>
                    {member.funcaoMinisterio && (
                      <p className="text-sm text-indigo-600">Função: {member.funcaoMinisterio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {member.outrosMinisterios && member.outrosMinisterios.length > 0 && (
              <div>
                <p className="font-semibold text-slate-900 mb-3">Outros Ministérios</p>
                <div className="grid grid-cols-2 gap-3">
                  {member.outrosMinisterios.map((ministry, index) => (
                    <div key={index} className="p-3 border border-slate-200 rounded-lg">
                      <p className="font-medium">{ministry}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {(!member.ministerioPrincipal && (!member.outrosMinisterios || member.outrosMinisterios.length === 0)) && (
              <div className="text-center py-12">
                <Church className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500">Você não participa de nenhum ministério ainda.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'grupos' && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Grupos e Células</h2>
          
          {member.cellGroup ? (
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="text-green-600" size={24} />
                <div>
                  <p className="font-semibold text-green-900">Grupo/Célula</p>
                  <p className="text-green-700">{member.cellGroup}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500">Você não está em nenhum grupo ou célula.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
