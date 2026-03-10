
import React from 'react';
import { User, Award, History, CreditCard } from 'lucide-react';

export const PortalMembro: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-8 items-center">
        <div className="w-32 h-32 rounded-[2rem] bg-indigo-100 overflow-hidden">
          <img src="https://i.pravatar.cc/150?u=1" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-black text-slate-900">João Silva</h1>
          <p className="text-slate-500 font-medium">Membro ativo desde 2010</p>
        </div>
      </div>
    </div>
  );
};
