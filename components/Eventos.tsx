import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, X, Users, UserPlus, UserCheck, UserX, 
  Clock, MapPin, Phone, Mail, Edit2, Trash2, AlertCircle,
  Repeat, CalendarDays, CalendarPlus
} from 'lucide-react';
import { ChurchEvent, VolunteerSchedule, Member } from '../types';
import { dbService } from '../services/databaseService';

interface EventosProps {
  currentUnitId: string;
  members: Member[];
}

const MINISTRIES = [
  'Louvor', 'Ensino', 'Ação Social', 'Intercessão', 'Recepção', 
  'Mídia', 'Som', 'Infantil', 'Adolescentes', 'Jovens', 'Casais'
];

const ROLES = {
  'Louvor': ['Líder de Louvor', 'Violão', 'Teclado', 'Bateria', 'Violino', 'Canto', 'Back Vocal'],
  'Ensino': ['Professor', 'Assistente', 'Coordenador', 'Secretário(a)'],
  'Ação Social': ['Coordenador', 'Voluntário', 'Motorista', 'Assistente'],
  'Intercessão': ['Intercessor', 'Líder'],
  'Recepção': ['Recepcionista', 'Porteiro(a)', 'Usher'],
  'Mídia': ['Operador de Câmera', 'Editor', 'Designer', 'Social Media'],
  'Som': ['Técnico de Som', 'Operador de Mesa', 'Assistente'],
  'Infantil': ['Professor', 'Assistente', 'Coordenador'],
  'Adolescentes': ['Líder', 'Assistente', 'Professor'],
  'Jovens': ['Líder', 'Assistente', 'Professor'],
  'Casais': ['Líder', 'Assistente', 'Coordenador']
};

export const Eventos: React.FC<EventosProps> = ({ currentUnitId, members }) => {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    date: '', 
    time: '', 
    location: '', 
    type: 'SERVICE' as ChurchEvent['type'],
    isRecurring: false,
    recurrencePattern: 'NONE' as ChurchEvent['recurrencePattern'],
    recurrenceEndDate: ''
  });
  
  // Estado para gerenciar a escala de voluntários
  const [scheduleForm, setScheduleForm] = useState<VolunteerSchedule>({
    id: '',
    ministry: '',
    role: '',
    volunteerId: '',
    volunteerName: '',
    volunteerPhone: '',
    volunteerEmail: '',
    confirmed: false,
    notes: '',
    requiredCount: 1,
    assignedCount: 0
  });

  // Carregar eventos do banco
  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Aqui você usaria o dbService.getEvents() quando implementado
        // const eventsData = await dbService.getEvents(currentUnitId);
        // Por enquanto, usando dados mock
        setEvents([]);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    };
    loadEvents();
  }, [currentUnitId]);

  // Função para gerar eventos recorrentes
  const generateRecurringEvents = (baseEvent: ChurchEvent): ChurchEvent[] => {
    if (!baseEvent.isRecurring || baseEvent.recurrencePattern === 'NONE') {
      return [baseEvent];
    }

    const events: ChurchEvent[] = [];
    const startDate = new Date(baseEvent.date);
    const endDate = baseEvent.recurrenceEndDate ? new Date(baseEvent.recurrenceEndDate) : new Date();
    endDate.setHours(23, 59, 59, 999); // Fim do dia

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const eventDate = new Date(currentDate);
      
      // Pular o primeiro evento (já existe como base)
      if (eventDate.getTime() === startDate.getTime()) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      const newEvent: ChurchEvent = {
        ...baseEvent,
        id: `${baseEvent.id}-rec-${eventDate.getTime()}`,
        date: eventDate.toISOString().split('T')[0],
        parentEventId: baseEvent.id,
        isGeneratedEvent: true
      };

      events.push(newEvent);

      // Avançar para próxima ocorrência
      if (baseEvent.recurrencePattern === 'WEEKLY') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (baseEvent.recurrencePattern === 'MONTHLY') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    return events;
  };

  const handleSaveEvent = () => {
    if (!form.title || !form.date) {
      alert('Título e data são obrigatórios.');
      return;
    }
    
    const baseEvent: ChurchEvent = {
      id: `evt-${Date.now()}`,
      unitId: currentUnitId,
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      location: form.location,
      attendeesCount: 0,
      type: form.type,
      isRecurring: form.isRecurring,
      recurrencePattern: form.recurrencePattern,
      recurrenceEndDate: form.recurrenceEndDate,
      volunteerSchedule: []
    };
    
    // Gerar eventos recorrentes se necessário
    const allEvents = generateRecurringEvents(baseEvent);
    
    setEvents(prev => [...prev, ...allEvents]);
    setForm({ 
      title: '', 
      description: '', 
      date: '', 
      time: '', 
      location: '', 
      type: 'SERVICE',
      isRecurring: false,
      recurrencePattern: 'NONE',
      recurrenceEndDate: ''
    });
    setIsModalOpen(false);
  };

  const handleAddToSchedule = () => {
    if (!selectedEvent || !scheduleForm.ministry || !scheduleForm.role) {
      alert('Ministério e função são obrigatórios.');
      return;
    }

    const newScheduleItem: VolunteerSchedule = {
      ...scheduleForm,
      id: `schedule-${Date.now()}`,
      assignedCount: scheduleForm.volunteerId ? 1 : 0
    };

    const updatedEvent = {
      ...selectedEvent,
      volunteerSchedule: [...(selectedEvent.volunteerSchedule || []), newScheduleItem]
    };

    setEvents(prev => prev.map(e => e.id === selectedEvent.id ? updatedEvent : e));
    setSelectedEvent(updatedEvent);
    
    // Reset form
    setScheduleForm({
      id: '',
      ministry: '',
      role: '',
      volunteerId: '',
      volunteerName: '',
      volunteerPhone: '',
      volunteerEmail: '',
      confirmed: false,
      notes: '',
      requiredCount: 1,
      assignedCount: 0
    });
  };

  const handleRemoveFromSchedule = (scheduleId: string) => {
    if (!selectedEvent) return;

    const updatedEvent = {
      ...selectedEvent,
      volunteerSchedule: selectedEvent.volunteerSchedule?.filter(s => s.id !== scheduleId) || []
    };

    setEvents(prev => prev.map(e => e.id === selectedEvent.id ? updatedEvent : e));
    setSelectedEvent(updatedEvent);
  };

  const handleVolunteerSelect = (member: Member) => {
    setScheduleForm(prev => ({
      ...prev,
      volunteerId: member.id,
      volunteerName: member.name,
      volunteerPhone: member.phone || member.whatsapp,
      volunteerEmail: member.email
    }));
  };

  const getAvailableVolunteers = () => {
    return members.filter(m => m.status === 'ACTIVE');
  };

  const getScheduleStats = (event: ChurchEvent) => {
    const schedule = event.volunteerSchedule || [];
    const totalRequired = schedule.reduce((sum, s) => sum + s.requiredCount, 0);
    const totalAssigned = schedule.reduce((sum, s) => sum + s.assignedCount, 0);
    const totalConfirmed = schedule.filter(s => s.confirmed).length;
    
    return { totalRequired, totalAssigned, totalConfirmed };
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agenda & Eventos</h1>
          <p className="text-slate-500">Gestão de cultos e eventos com escala de voluntários.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> Novo Evento
        </button>
      </div>

      {/* Lista de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const stats = getScheduleStats(event);
          return (
            <div key={event.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                      <p className="text-sm text-slate-500">{event.type === 'SERVICE' ? 'Culto' : event.type === 'MEETING' ? 'Reunião' : 'Evento'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    event.type === 'SERVICE' ? 'bg-emerald-50 text-emerald-600' :
                    event.type === 'MEETING' ? 'bg-blue-50 text-blue-600' :
                    'bg-purple-50 text-purple-600'
                  }`}>
                    {event.type === 'SERVICE' ? 'CULTO' : event.type === 'MEETING' ? 'REUNIÃO' : 'EVENTO'}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock size={16} className="text-slate-400" />
                    <span>{new Date(event.date).toLocaleDateString('pt-BR')} {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} className="text-slate-400" />
                    <span>{event.location || 'Não definido'}</span>
                  </div>
                  {event.description && (
                    <p className="text-slate-600 text-sm line-clamp-2">{event.description}</p>
                  )}
                  
                  {/* Informações de Recorrência */}
                  {event.isRecurring && (
                    <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 rounded-lg p-2">
                      <Repeat size={14} />
                      <span className="text-xs font-bold">
                        {event.recurrencePattern === 'WEEKLY' ? 'Repete toda semana' : 
                         event.recurrencePattern === 'MONTHLY' ? 'Repete todo mês' : 'Repete'}
                        {event.recurrenceEndDate && ` até ${new Date(event.recurrenceEndDate).toLocaleDateString('pt-BR')}`}
                      </span>
                    </div>
                  )}
                  
                  {event.isGeneratedEvent && (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-lg p-2">
                      <CalendarPlus size={14} />
                      <span className="text-xs font-bold">Evento gerado automaticamente</span>
                    </div>
                  )}
                </div>

                {/* Estatísticas da Escala */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-indigo-600" />
                      <span className="text-sm font-bold text-slate-900">Escala de Voluntários</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {stats.totalAssigned}/{stats.totalRequired} escalados
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-slate-900">{stats.totalRequired}</div>
                      <div className="text-xs text-slate-500">Necessários</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-blue-600">{stats.totalAssigned}</div>
                      <div className="text-xs text-blue-500">Escalados</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-emerald-600">{stats.totalConfirmed}</div>
                      <div className="text-xs text-emerald-500">Confirmados</div>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsScheduleModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                  >
                    <UserPlus size={14} /> Gerenciar Escala
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {events.length === 0 && (
          <div className="col-span-full">
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhum evento cadastrado</h3>
              <p className="text-slate-500 mb-6">Comece criando seu primeiro evento para gerenciar a escala de voluntários.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mx-auto flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                <Plus size={18} /> Criar Primeiro Evento
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Novo Evento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" /> Novo Evento
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título *</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Ex: Culto de Domingo"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value as ChurchEvent['type'] }))}
                >
                  <option value="SERVICE">Culto</option>
                  <option value="MEETING">Reunião</option>
                  <option value="EVENT">Evento</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data *</label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Horário</label>
                  <input
                    type="time"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={form.time}
                    onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Local</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="Ex: Templo Central"
                />
              </div>
              
              {/* Campos de Recorrência */}
              <div className="border-t border-slate-100 pt-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    checked={form.isRecurring}
                    onChange={e => setForm(p => ({ ...p, isRecurring: e.target.checked }))}
                  />
                  <label htmlFor="isRecurring" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Repeat size={16} className="text-indigo-600" />
                    Evento Recorrente
                  </label>
                </div>
                
                {form.isRecurring && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Padrão de Recorrência</label>
                      <select
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        value={form.recurrencePattern}
                        onChange={e => setForm(p => ({ ...p, recurrencePattern: e.target.value as ChurchEvent['recurrencePattern'] }))}
                      >
                        <option value="NONE">Não repetir</option>
                        <option value="WEEKLY">Semanal</option>
                        <option value="MONTHLY">Mensal</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data Final da Recorrência</label>
                      <input
                        type="date"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        value={form.recurrenceEndDate}
                        onChange={e => setForm(p => ({ ...p, recurrenceEndDate: e.target.value }))}
                        placeholder="Deixe em branco para repetir indefinidamente"
                      />
                      <p className="text-xs text-slate-500 mt-1">Se não definido, o evento se repetirá indefinidamente</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição</label>
                <textarea
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Detalhes do evento..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEvent}
                className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gerenciamento de Escala */}
      {isScheduleModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users size={20} className="text-indigo-600" /> 
                  Escala de Voluntários
                </h2>
                <p className="text-sm text-slate-500 mt-1">{selectedEvent.title}</p>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Formulário para adicionar à escala */}
              <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Adicionar Voluntário à Escala</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ministério *</label>
                    <select
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      value={scheduleForm.ministry}
                      onChange={e => {
                        const ministry = e.target.value;
                        setScheduleForm(prev => ({ 
                          ...prev, 
                          ministry, 
                          role: ROLES[ministry as keyof typeof ROLES]?.[0] || ''
                        }));
                      }}
                    >
                      <option value="">Selecione...</option>
                      {MINISTRIES.map(ministry => (
                        <option key={ministry} value={ministry}>{ministry}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Função *</label>
                    <select
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      value={scheduleForm.role}
                      onChange={e => setScheduleForm(prev => ({ ...prev, role: e.target.value }))}
                      disabled={!scheduleForm.ministry}
                    >
                      <option value="">Selecione...</option>
                      {scheduleForm.ministry && ROLES[scheduleForm.ministry as keyof typeof ROLES]?.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      value={scheduleForm.requiredCount}
                      onChange={e => setScheduleForm(prev => ({ ...prev, requiredCount: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Voluntário</label>
                    <select
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      value={scheduleForm.volunteerId}
                      onChange={e => {
                        const volunteerId = e.target.value;
                        if (volunteerId) {
                          const volunteer = getAvailableVolunteers().find(m => m.id === volunteerId);
                          if (volunteer) {
                            handleVolunteerSelect(volunteer);
                          }
                        } else {
                          setScheduleForm(prev => ({
                            ...prev,
                            volunteerId: '',
                            volunteerName: '',
                            volunteerPhone: '',
                            volunteerEmail: ''
                          }));
                        }
                      }}
                    >
                      <option value="">Selecione um voluntário...</option>
                      {getAvailableVolunteers().map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name} ({member.profession || 'Membro'})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Observações</label>
                    <input
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      value={scheduleForm.notes}
                      onChange={e => setScheduleForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações sobre a escala..."
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddToSchedule}
                  className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                  <UserPlus size={16} className="inline mr-2" />
                  Adicionar à Escala
                </button>
              </div>

              {/* Lista de voluntários escalados */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Voluntários Escalados</h3>
                {selectedEvent.volunteerSchedule && selectedEvent.volunteerSchedule.length > 0 ? (
                  <div className="space-y-3">
                    {selectedEvent.volunteerSchedule.map(schedule => (
                      <div key={schedule.id} className="bg-white border border-slate-200 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">
                                {schedule.ministry}
                              </span>
                              <span className="text-sm font-bold text-slate-900">
                                {schedule.role}
                              </span>
                              {schedule.confirmed && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">
                                  <UserCheck size={12} /> Confirmado
                                </span>
                              )}
                            </div>
                            
                            {schedule.volunteerName && (
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                  <Users size={14} className="text-slate-400" />
                                  <span>{schedule.volunteerName}</span>
                                </div>
                                {schedule.volunteerPhone && (
                                  <div className="flex items-center gap-1">
                                    <Phone size={14} className="text-slate-400" />
                                    <span>{schedule.volunteerPhone}</span>
                                  </div>
                                )}
                                {schedule.volunteerEmail && (
                                  <div className="flex items-center gap-1">
                                    <Mail size={14} className="text-slate-400" />
                                    <span>{schedule.volunteerEmail}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {schedule.notes && (
                              <p className="text-sm text-slate-500 mt-2">{schedule.notes}</p>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleRemoveFromSchedule(schedule.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-8 text-center">
                    <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Nenhum voluntário escalado</h4>
                    <p className="text-slate-500">Adicione voluntários à escala usando o formulário acima.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
