
import React from 'react';
import { Calendar, Plus, MapPin, Users, Clock } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';

export const Eventos: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agenda & Eventos</h1>
          <p className="text-slate-500">Gestão de cultos e reuniões.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100">
          <Plus size={18} /> Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {MOCK_EVENTS.map(event => (
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
    </div>
  );
};
