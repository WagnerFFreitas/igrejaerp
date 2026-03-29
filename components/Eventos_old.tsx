import React, { useState } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';
import { ChurchEvent } from '../types';

export const Eventos: React.FC = () => {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', location: '', type: 'SERVICE' as ChurchEvent['type'] });

  const handleSave = () => {
    if (!form.title || !form.date) {
      alert('Título e data são obrigatórios.');
      return;
    }
    const newEvent: ChurchEvent = {
      id: `evt-${Date.now()}`,
      unitId: '',
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      location: form.location,
      attendeesCount: 0,
      type: form.type,
    };
    setEvents(prev => [...prev, newEvent]);
    setForm({ title: '', description: '', date: '', time: '', location: '', type: 'SERVICE' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agenda & Eventos</h1>
          <p className="text-slate-500">Gestão de cultos e reuniões.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {events.map(event => (
          <div key={event.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6">
            <div className="flex flex-col items-center justify-center bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl min-w-[80px]">
              <span className="text-2xl font-black">{new Date(event.date).getDate()}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
              <p className="text-slate-500 text-sm mt-1">{event.description}</p>
            </div>
          </div>
        ))}
      </div>

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
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data *</label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                />
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
                onClick={handleSave}
                className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
