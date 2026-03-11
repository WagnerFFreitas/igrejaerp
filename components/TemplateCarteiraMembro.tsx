import React from 'react';
import { Member } from '../types';

interface TemplateCarteiraMembroProps {
  member: Member;
  id?: string;
}

export const TemplateCarteiraMembro: React.FC<TemplateCarteiraMembroProps> = ({ member, id }) => {
  // Lógica para formatar a matrícula como 0001/ANO
  const getMatriculaDisplay = () => {
    const numPart = member.id.replace(/\D/g, '').padStart(4, '0') || '0001';
    const yearPart = member.membershipDate 
      ? new Date(member.membershipDate).getFullYear() 
      : new Date().getFullYear();
    return `${numPart}/${yearPart}`;
  };

  const avatarUrl = member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'M')}&background=003399&color=fff&bold=true`;

  return (
    <div 
      id={id} 
      className="flex flex-row items-start justify-center print:mb-0 mb-4 bg-transparent flex-shrink-0 gap-[5mm]" 
      style={{ 
        width: '176.2mm', 
        height: '53.98mm', 
        minWidth: '176.2mm', 
        minHeight: '53.98mm',
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
        position: 'relative',
        backgroundColor: 'transparent'
      }}
    >
      {/* FRENTE - 85.6mm x 53.98mm */}
      <div 
        className="relative shrink-0 overflow-hidden shadow-xl rounded-[1rem] border border-slate-200 bg-white"
        style={{ width: '85.6mm', height: '53.98mm' }}
      >
        {/* Background Base */}
        <div className="absolute inset-0 bg-white z-0" />
        <img 
          src="img/fundo.png" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-10" 
          style={{ filter: 'sepia(1) hue-rotate(40deg) saturate(5) brightness(1.1)' }}
          alt=""
          crossOrigin="anonymous"
          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
        />

        {/* HEADER CONTAINER - Alinhado ao topo */}
        <div 
          className="absolute z-50 flex items-start gap-[2.5mm]" 
          style={{ top: '1.5mm', left: '4mm', right: '2mm' }}
        >
          {/* LOGO */}
          <div 
            className="flex items-center justify-center bg-white overflow-hidden shrink-0 shadow-sm rounded-sm"
            style={{ width: '10.5mm', height: '10.5mm' }}
          >
            <img 
              src="img/logo.png" 
              className="w-full h-full object-contain" 
              alt="Logo ADJPA" 
              crossOrigin="anonymous"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* TEXTOS SUPERIORES */}
          <div className="flex-1 flex flex-col min-w-0" style={{ marginTop: '-1.4mm' }}>
            <p className="text-[7.4px] font-black text-[#003399] leading-normal uppercase tracking-tighter whitespace-nowrap overflow-visible" style={{ margin: 0 }}>
              ASSEMBLEIA DE DEUS JESUS QUE ALIMENTA
            </p>
            <div className="flex flex-col -mt-[0.1mm]">
              <p className="text-[5.4px] font-bold text-slate-500 uppercase leading-none mt-[0.8mm]" style={{ margin: 0 }}>
                RUA GERICINÓ, QD04 LT22 - STA CRUZ DA SERRA
              </p>
              <p className="text-[5.4px] font-bold text-slate-500 uppercase leading-none mt-[0.8mm]" style={{ margin: 0 }}>
                DUQUE DE CAXIAS - RJ - CEP 25240-170
              </p>
              <p className="text-[5.4px] font-bold text-slate-500 uppercase leading-none mt-[0.8mm]" style={{ margin: 0 }}>
                CNPJ 09.432.897/0001-05
              </p>
              <p className="text-[5.4px] font-black text-[#003399] uppercase leading-none mt-[0.8mm]" style={{ margin: 0 }}>
                TEL.: (21) 2675-7036
              </p>
            </div>
          </div>
        </div>

        {/* FOTO DO MEMBRO - Lateral Esquerda */}
        <div 
          className="absolute z-50 rounded-lg border-2 border-[#003399] p-[0.5mm] bg-white shadow-sm overflow-hidden"
          style={{ top: '13.5mm', left: '4mm', width: '19mm', height: '24mm' }}
        >
          <img 
            src={avatarUrl} 
            className="w-full h-full object-cover rounded-[0.4rem]" 
            crossOrigin="anonymous" 
            alt={member.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'M')}&background=003399&color=fff&bold=true`;
            }}
          />
        </div>

        {/* NOME E CARGO */}
        <div 
          className="absolute z-40" 
          style={{ top: '14.5mm', left: '26mm', width: '56mm' }}
        >
          <h4 className="text-[9.2px] font-black text-slate-900 uppercase leading-none" style={{ margin: 0 }}>
            {member.name}
          </h4>
          <p className="text-[8.2px] font-bold text-[#003399] uppercase leading-none" style={{ marginTop: '0.3mm' }}>
            {member.ecclesiasticalPosition || 'Membro'}
          </p>
        </div>

        {/* VALIDADE E QR CODE - Mantido em 25.5mm de topo */}
        <div 
          className="absolute z-40 flex items-center justify-between" 
          style={{ top: '25.5mm', left: '26mm', width: '55.5mm' }}
        >
          {/* Box de Validade */}
          <div 
            className="flex flex-col justify-center items-start" 
            style={{ width: '15mm', height: '6mm' }}
          >
            <p className="text-[4.5px] font-black uppercase tracking-widest leading-none text-slate-400">Validade</p>
            <p className="text-[8.5px] font-black leading-none mt-[0.8mm] text-rose-600">12/2026</p>
          </div>
          
          {/* QR CODE */}
          <div 
            className="bg-white p-[0.5mm] border border-slate-100 rounded shadow-sm" 
            style={{ width: '9mm', height: '9mm' }}
          >
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(member.id)}`}
              alt="QR"
              crossOrigin="anonymous"
              className="w-full h-full"
            />
          </div>
        </div>
        
        {/* FOOTER */}
        <div 
          className="absolute bottom-0 left-0 w-full text-center flex items-center justify-center bg-transparent" 
          style={{ height: '3.5mm' }}
        >
          <p className="text-[5.5px] font-black text-[#003399] uppercase tracking-[0.2em] leading-none opacity-30" style={{ margin: 0 }}>
            CREDENTIAL CARD • SEDE MUNDIAL
          </p>
        </div>
      </div>
      
      {/* VERSO */}
      <div 
        className="relative flex flex-col p-3 shrink-0 bg-white overflow-hidden shadow-xl rounded-[1rem] border border-slate-200"
        style={{ width: '85.6mm', height: '53.98mm' }}
      >
        <div className="absolute inset-0 bg-white z-0" />
        <img 
          src="img/fundo.png" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-10" 
          style={{ filter: 'sepia(1) hue-rotate(40deg) saturate(5) brightness(1.1)' }}
          alt=""
          crossOrigin="anonymous"
          onError={(e) => (e.target as HTMLElement).style.display = 'none'}
        />

        <div className="relative z-20 space-y-1.5">
          <div className="flex gap-4">
            <div className="flex-1 pb-0.5">
              <p className="text-[5px] font-black text-slate-400 uppercase leading-none mb-0.5">Matrícula</p>
              <p className="text-[7px] font-black text-slate-800 leading-none">{getMatriculaDisplay()}</p>
            </div>
            <div className="flex-1 pb-0.5">
              <p className="text-[5px] font-black text-slate-400 uppercase leading-none mb-0.5">Nascimento</p>
              <p className="text-[7px] font-black text-slate-800 leading-none">{member.birthDate ? new Date(member.birthDate).toLocaleDateString('pt-BR') : '---'}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 pb-0.5">
              <p className="text-[5px] font-black text-slate-400 uppercase leading-none mb-0.5">RG</p>
              <p className="text-[7px] font-black text-slate-800 leading-none">{member.rg || '---'}</p>
            </div>
            <div className="flex-1 pb-0.5">
              <p className="text-[5px] font-black text-slate-400 uppercase leading-none mb-0.5">CPF</p>
              <p className="text-[7px] font-black text-slate-800 leading-none">{member.cpf || '---'}</p>
            </div>
          </div>

          <div className="pb-1 flex flex-col">
            <p className="text-[5px] font-black text-slate-400 uppercase leading-none mb-1.5">Filiação</p>
            <div className="flex flex-col gap-0.5">
              <p className="text-[5px] font-bold text-slate-800 uppercase leading-none">
                {member.fatherName || '---'}
              </p>
              <p className="text-[5px] font-bold text-slate-800 uppercase leading-none mt-0.5">
                {member.motherName || '---'}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-3 bg-rose-50/50 p-1.5 rounded-lg border border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div 
              className="bg-white border border-rose-200 rounded shadow-sm flex flex-col items-center justify-center min-w-[14mm]"
              style={{ height: '8.5mm' }}
             >
               <p className="text-[4px] font-black text-rose-500 uppercase leading-none mb-1">Tipo Sang.</p>
               <p className="text-[8.5px] font-black text-rose-700 leading-none">{member.bloodType || 'A+'}</p>
             </div>
             
             <div className="h-6 w-px bg-rose-200 mx-1" />
             
             <div>
                <p className="text-[4.5px] font-black text-rose-500 uppercase leading-none">Emergência</p>
                <p className="text-[6.5px] font-black text-rose-700 mt-1">{member.emergencyContact || member.phone || '(21) 00000-0000'}</p>
             </div>
          </div>
        </div>

        <div className="relative z-20 mt-auto flex flex-col items-center">
          <div className="w-full flex flex-col items-center">
             <div className="w-36 border-b border-slate-300 h-3 relative flex items-center justify-center">
             </div>
             <p className="text-[4.5px] font-black text-slate-900 uppercase mt-1 tracking-tighter">PASTOR(AS) PRESIDENTE</p>
          </div>
          
          <p className="text-[4.2px] text-slate-400 font-bold uppercase leading-tight tracking-tighter mt-1 text-center px-4">
            Documento oficial de uso interno ministerial. Apresentação obrigatória para acesso aos eventos da sede.
          </p>
        </div>
      </div>
    </div>
  );
};