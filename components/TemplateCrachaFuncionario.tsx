import React from 'react';
import { Payroll } from '../types';

interface TemplateCrachaFuncionarioProps {
  employee: Payroll;
  id?: string;
}

export const TemplateCrachaFuncionario: React.FC<TemplateCrachaFuncionarioProps> = ({ employee, id }) => (
  <div 
    id={id} 
    className="flex flex-row items-start justify-center print:mb-0 mb-8 bg-transparent flex-shrink-0 gap-[5mm]" 
    style={{ 
      width: '112.96mm', // 53.98 * 2 + 5mm gap
      height: '85.6mm', 
      minWidth: '112.96mm', 
      minHeight: '85.6mm',
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
      position: 'relative'
    }}
  >
    {/* FRENTE */}
    <div 
      className="relative flex flex-col p-3 shrink-0 bg-white overflow-hidden shadow-xl rounded-[1rem] border border-slate-200"
      style={{ width: '53.98mm', height: '85.6mm' }}
    >
      {/* Camada de Fundo Branco Base */}
      <div className="absolute inset-0 bg-white z-0" />

      {/* Marca d'água Fundo */}
      <img 
        src="img/fundo.png" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-10" 
        style={{ filter: 'sepia(1) hue-rotate(40deg) saturate(5) brightness(1.1)' }}
        alt=""
        onError={(e) => (e.target as HTMLElement).style.display = 'none'}
      />

      {/* HEADER */}
      <div className="relative z-20 flex flex-col items-center w-full mb-3 gap-0">
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          <img 
            src="img/logo.png" 
            className="w-full h-full object-contain" 
            alt="Logo ADJPA" 
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div className="text-center flex flex-col gap-[0.2mm] w-full -mt-2">
          <p className="text-[7.5px] font-black text-[#003399] leading-normal uppercase tracking-tighter whitespace-nowrap">ASSEMBLEIA DE DEUS JESUS QUE ALIMENTA</p>
          <p className="text-[5.5px] font-bold text-slate-500 uppercase leading-none">CNPJ 09.432.897/0001-05</p>
          <p className="text-[5.5px] font-black text-[#003399] uppercase leading-none">TEL.: (21) 2675-7036</p>
          <p className="text-[5.5px] font-black text-[#003399] uppercase leading-none text-slate-500">RECURSOS HUMANOS</p>
        </div>
      </div>

      <div className="relative z-20 flex flex-col flex-1 items-center gap-2 px-1">
        <div 
          className="rounded-lg border-2 border-[#003399] p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-md bg-white"
          style={{ width: '25mm', height: '32mm', minWidth: '25mm', minHeight: '32mm' }}
        >
          <div className="w-full h-full rounded-[0.4rem] bg-slate-50 overflow-hidden">
            <img 
              src={`https://picsum.photos/seed/${employee.id}/200`} 
              className="w-full h-full object-cover" 
              crossOrigin="anonymous" 
            />
          </div>
        </div>

        <div className="w-10 h-10 bg-white p-0.5 border border-slate-200 rounded shadow-sm shrink-0">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(employee.id)}`}
            alt="QR Code"
            className="w-full h-full"
            crossOrigin="anonymous"
          />
        </div>

        <div className="flex flex-col items-center justify-start text-center w-full -mt-2">
           <h4 className="text-[12px] font-black text-slate-900 uppercase leading-tight mb-0.5 w-full">{employee.employeeName}</h4>
           <p className="text-[10px] font-bold text-[#003399] uppercase leading-none mb-0.5">{employee.cargo}</p>
           <p className="text-[8px] font-medium text-[#003399] uppercase leading-none w-full">{employee.departamento}</p>
        </div>
      </div>
    </div>
    
    {/* VERSO */}
    <div 
      className="relative flex flex-col p-5 shrink-0 bg-white overflow-hidden shadow-xl rounded-[1rem] border border-slate-200"
      style={{ width: '53.98mm', height: '85.6mm' }}
    >
      {/* Marca d'água Fundo Verso */}
      <img 
        src="img/fundo.png" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-10" 
        style={{ filter: 'sepia(1) hue-rotate(40deg) saturate(5) brightness(1.1)' }}
        alt=""
        onError={(e) => (e.target as HTMLElement).style.display = 'none'}
      />

      <div className="relative z-10 space-y-1.5 mb-2">
        <div className="flex justify-between pb-0.5">
          <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">MATRÍCULA</p>
          <p className="text-[8px] font-bold text-slate-800">{employee.matricula}</p>
        </div>
        <div className="flex justify-between pb-0.5">
          <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">ADMISSÃO</p>
          <p className="text-[8px] font-bold text-slate-800">{new Date(employee.data_admissao).toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="flex justify-between pb-0.5">
          <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">VALIDADE</p>
          <p className="text-[8px] font-bold text-slate-800 italic">12/2026</p>
        </div>
      </div>

      <div className="relative z-10 space-y-3 mt-4">
        <div className="flex items-center gap-2">
          <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">TIPO SANGUÍNEO:</p>
          <p className="text-[8px] font-bold text-slate-800 bg-rose-50 px-1 rounded">{employee.blood_type || '---'}</p>
        </div>
        <div>
          <p className="text-[6px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">EMERGÊNCIA:</p>
          <p className="text-[8px] font-bold text-slate-800">{employee.emergency_contact || '( ) _____-_____'}</p>
        </div>
      </div>

      <div className="relative z-10 mt-auto text-center flex flex-col items-center w-full">
        <p className="text-[5px] text-slate-500 font-bold uppercase tracking-tighter mb-3 leading-tight">
          ESTE CRACHÁ É DE USO PESSOAL E INTRANSFERÍVEL.<br/>EM CASO DE PERDA, COMUNICAR AO RH.
        </p>
        <div className="w-full border-t border-black mb-1"></div>
        <p className="text-[6px] text-black font-bold uppercase tracking-widest">ASSINATURA DIGITAL / ESOCIAL</p>
      </div>
    </div>
  </div>
);