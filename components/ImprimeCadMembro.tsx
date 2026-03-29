import React, { useState } from 'react';
import { Printer, X } from 'lucide-react';
import { Member } from '../types';

interface ImprimeCadMembroProps {
  members: Member[];
  onClose: () => void;
  preSelected?: Member[];
}

export const ImprimeCadMembro: React.FC<ImprimeCadMembroProps> = ({ members, onClose, preSelected }) => {
  const sorted = [...members].sort((a, b) => (a.matricula || '').localeCompare(b.matricula || ''));
  const firstMat = sorted[0]?.matricula?.split('/')[0] || 'M01';
  const lastMat = sorted[sorted.length - 1]?.matricula?.split('/')[0] || firstMat;

  const [step, setStep] = useState<'range' | 'preview'>(preSelected && preSelected.length > 0 ? 'preview' : 'range');
  const [rangeStart, setRangeStart] = useState(firstMat);
  const [rangeEnd, setRangeEnd] = useState(lastMat);
  const [membersToPrint, setMembersToPrint] = useState<Member[]>(preSelected && preSelected.length > 0 ? preSelected : []);

  const parseNum = (mat: string) => {
    const m = mat.trim().toUpperCase().match(/M(\d+)/);
    return m ? parseInt(m[1]) : null;
  };

  const handleConfirm = () => {
    const start = parseNum(rangeStart);
    const end = parseNum(rangeEnd);
    if (start === null || end === null || start > end) {
      alert('Faixa inválida. Informe no formato M01 a M05, com início menor ou igual ao fim.');
      return;
    }
    const filtered = members
      .filter(m => { const n = parseNum(m.matricula || ''); return n !== null && n >= start && n <= end; })
      .sort((a, b) => (a.matricula || '').localeCompare(b.matricula || ''));
    if (filtered.length === 0) {
      alert('Nenhum membro encontrado nessa faixa de matrícula.');
      return;
    }
    setMembersToPrint(filtered);
    setStep('preview');
  };

  const handlePrint = () => {
    const fmtDate = (d?: string) => d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—';
    const maritalMap: Record<string, string> = { SINGLE: 'Solteiro(a)', MARRIED: 'Casado(a)', DIVORCED: 'Divorciado(a)', WIDOWED: 'Viúvo(a)' };
    const discipleMap: Record<string, string> = { NAO_INICIADO: 'Não iniciado', EM_ANDAMENTO: 'Em andamento', CONCLUIDO: 'Concluído' };
    const biblicalMap: Record<string, string> = { ATIVO: 'Ativo', INATIVO: 'Inativo', NAO_FREQUENTA: 'Não frequenta' };

    const field = (label: string, value?: string | null) => value ? `
      <div style="margin-bottom:11px">
        <div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px">${label}</div>
        <div style="font-size:12px;color:#1e293b;font-weight:500;line-height:1.4">${value}</div>
      </div>` : '';

    const section = (title: string) => `
      <div style="border-bottom:2px solid #3730a3;margin-bottom:12px;padding-bottom:4px">
        <span style="font-size:10px;font-weight:800;color:#3730a3;text-transform:uppercase;letter-spacing:0.12em">${title}</span>
      </div>`;

    const pages = membersToPrint.map(m => {
      const statusColor = m.status === 'ACTIVE' ? '#15803d' : '#b91c1c';
      const statusBg   = m.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2';
      const statusLabel = m.status === 'ACTIVE' ? 'Ativo' : m.status === 'PENDING' ? 'Pendente' : 'Inativo';
      const avatarUrl = m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=3730a3&color=fff&bold=true&size=80`;

      const dependentsHtml = m.dependents && m.dependents.length > 0 ? `
        <div style="margin-top:6px">
          <div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px">Dependentes</div>
          ${m.dependents.map(dep => `<div style="font-size:11px;color:#1e293b;margin-bottom:4px">${dep.name} <span style="color:#64748b">(${dep.relationship} · ${fmtDate(dep.birthDate)})</span></div>`).join('')}
        </div>` : '';

      return `
        <div style="width:100%;height:100vh;background:white;padding:14mm 16mm 10mm;box-sizing:border-box;page-break-after:always;font-family:'Segoe UI',Arial,sans-serif;display:flex;flex-direction:column;">
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2.5px solid #1e293b;padding-bottom:12px;margin-bottom:16px;flex-shrink:0">
            <div style="display:flex;align-items:center;gap:16px">
              <img src="${avatarUrl}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2.5px solid #e2e8f0" />
              <div>
                <div style="font-size:20px;font-weight:800;color:#0f172a;line-height:1.2">${m.name}</div>
                <div style="font-size:12px;color:#475569;margin-top:4px">${m.ecclesiasticalPosition || 'Membro'}${m.mainMinistry ? ' · ' + m.mainMinistry : ''}</div>
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-size:15px;font-weight:800;color:#3730a3;letter-spacing:0.05em">${m.matricula || '—'}</div>
              <div style="display:inline-block;margin-top:5px;padding:3px 12px;border-radius:5px;font-size:10px;font-weight:700;background:${statusBg};color:${statusColor}">${statusLabel}</div>
              <div style="font-size:10px;color:#94a3b8;margin-top:5px">Emitido em ${new Date().toLocaleDateString('pt-BR')}</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0 28px;flex:1;align-content:start">
            <div>
              ${section('Dados Pessoais')}
              ${field('CPF', m.cpf)}
              ${field('RG', m.rg)}
              ${field('Nascimento', fmtDate(m.birthDate))}
              ${field('Sexo', m.gender === 'M' ? 'Masculino' : m.gender === 'F' ? 'Feminino' : undefined)}
              ${field('Profissão', m.profession)}
              ${field('Telefone', m.phone)}
              ${field('WhatsApp', m.whatsapp)}
              ${field('E-mail', m.email)}
            </div>
            <div>
              ${section('Família')}
              ${field('Estado Civil', maritalMap[m.maritalStatus] || undefined)}
              ${field('Cônjuge', m.spouseName)}
              ${field('Data Casamento', m.marriageDate ? fmtDate(m.marriageDate) : undefined)}
              ${field('Nome do Pai', m.fatherName)}
              ${field('Nome da Mãe', m.motherName)}
              ${dependentsHtml}
            </div>
            <div>
              ${section('Endereço')}
              ${field('Logradouro', m.address?.street ? `${m.address.street}${m.address.number ? ', ' + m.address.number : ''}${m.address.complement ? ' — ' + m.address.complement : ''}` : undefined)}
              ${field('Bairro', m.address?.neighborhood)}
              ${field('Cidade / UF', m.address?.city ? `${m.address.city}${m.address.state ? ' / ' + m.address.state : ''}` : undefined)}
              ${field('CEP', m.address?.zipCode)}
              <div style="margin-top:20px">
                ${section('Informações de Saúde')}
                ${field('Tipo Sanguíneo', m.bloodType)}
                ${field('Contato de Emergência', m.emergencyContact)}
                ${field('Necessidades Especiais', m.specialNeeds)}
              </div>
            </div>
            <div>
              ${section('Vida Cristã')}
              ${field('Membro desde', fmtDate(m.membershipDate))}
              ${field('Igreja de Origem', m.churchOfOrigin)}
              ${field('Data de Conversão', fmtDate(m.conversionDate))}
              ${field('Local de Conversão', m.conversionPlace)}
              ${field('Data de Batismo', fmtDate(m.baptismDate))}
              ${field('Igreja do Batismo', m.baptismChurch)}
              ${field('Pastor que Batizou', m.baptizingPastor)}
              ${field('Batismo no Espírito Santo', m.holySpiritBaptism === 'SIM' ? 'Sim' : 'Não')}
              ${field('Curso de Discipulado', discipleMap[m.discipleshipCourse || ''] || undefined)}
              ${field('Escola Bíblica', biblicalMap[m.biblicalSchool || ''] || undefined)}
              ${field('Célula / Grupo', m.cellGroup)}
            </div>
          </div>

          <div style="border-top:1px solid #e2e8f0;margin-top:auto;padding-top:10px;display:flex;justify-content:space-between;align-items:flex-end;flex-shrink:0">
            <span style="font-size:10px;color:#94a3b8">ADJPA · Sistema de Gestão Ministerial</span>
            <span style="font-size:10px;color:#94a3b8">Ficha Cadastral — ${m.matricula}</span>
            <div style="border-top:1px solid #cbd5e1;width:160px;text-align:center;padding-top:4px">
              <span style="font-size:9px;color:#94a3b8">Assinatura do Membro</span>
            </div>
          </div>
        </div>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Ficha Cadastral — ${rangeStart} a ${rangeEnd}</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; background: white; font-family: 'Segoe UI', Arial, sans-serif; }
    @media print { html, body { height: 100%; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>${pages}</body>
</html>`;

    const win = window.open('', '_blank', 'width=1200,height=800');
    if (!win) { alert('Permita pop-ups para imprimir.'); return; }
    win.document.write(html);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); };
  };

  // ── Modal: seleção de faixa ──────────────────────────────────────────────
  if (step === 'range') {
    return (
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md no-print">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-slate-700 text-white rounded-xl"><Printer size={18} /></div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Imprimir Cadastro</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Selecione a faixa de matrículas</p>
            </div>
          </div>

          <div className="flex gap-3 mb-2">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">De (ex: M01)</label>
              <input
                type="text"
                value={rangeStart}
                onChange={e => setRangeStart(e.target.value.toUpperCase())}
                placeholder="M01"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 uppercase"
              />
            </div>
            <div className="flex items-end pb-2 text-slate-400 font-bold text-sm">até</div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Até (ex: M05)</label>
              <input
                type="text"
                value={rangeEnd}
                onChange={e => setRangeEnd(e.target.value.toUpperCase())}
                placeholder="M05"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 uppercase"
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mb-5">
            Serão impressos todos os membros cujas matrículas estejam nessa faixa, inclusive os extremos.
          </p>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase hover:bg-slate-50">
              Cancelar
            </button>
            <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl bg-slate-700 text-white font-bold text-xs uppercase hover:bg-slate-800 flex items-center justify-center gap-2">
              <Printer size={14} /> Visualizar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Modal: preview ───────────────────────────────────────────────────────
  const fmtDate = (d?: string) => d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—';
  const maritalMap: Record<string, string> = { SINGLE: 'Solteiro(a)', MARRIED: 'Casado(a)', DIVORCED: 'Divorciado(a)', WIDOWED: 'Viúvo(a)' };
  const discipleMap: Record<string, string> = { NAO_INICIADO: 'Não iniciado', EM_ANDAMENTO: 'Em andamento', CONCLUIDO: 'Concluído' };
  const biblicalMap: Record<string, string> = { ATIVO: 'Ativo', INATIVO: 'Inativo', NAO_FREQUENTA: 'Não frequenta' };

  const Field = ({ label, value }: { label: string; value?: string | null }) => (
    <div style={{ marginBottom: '11px' }}>
      <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '3px' }}>{label}</span>
      <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: 500, lineHeight: 1.4 }}>{value || '—'}</span>
    </div>
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <div style={{ borderBottom: '2px solid #3730a3', marginBottom: '12px', paddingBottom: '4px' }}>
      <span style={{ fontSize: '10px', fontWeight: 800, color: '#3730a3', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{title}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl no-print">
      <div className="bg-white rounded-[2rem] w-full max-w-6xl shadow-2xl flex flex-col h-[94vh] overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700 text-white rounded-xl"><Printer size={18} /></div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Prévia — Ficha Cadastral</h3>
              <p className="text-[10px] text-slate-400">
                {membersToPrint.length} membro(s) · Faixa {rangeStart} a {rangeEnd} · A4 Paisagem
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={22} /></button>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto bg-slate-200 custom-scrollbar p-6">
          {membersToPrint.map(m => (
            <div key={m.id} style={{
              width: '277mm', minHeight: '190mm', background: 'white', margin: '0 auto 24px',
              padding: '14mm 16mm 10mm', fontFamily: "'Segoe UI', Arial, sans-serif",
              boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
              boxShadow: '0 2px 16px rgba(0,0,0,0.12)'
            }}>
              {/* Cabeçalho */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2.5px solid #1e293b', paddingBottom: '12px', marginBottom: '16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=3730a3&color=fff&bold=true&size=80`}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #e2e8f0' }}
                    alt=""
                  />
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{m.name}</div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                      {m.ecclesiasticalPosition || 'Membro'}{m.mainMinistry ? ` · ${m.mainMinistry}` : ''}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#3730a3' }}>{m.matricula || '—'}</div>
                  <div style={{ display: 'inline-block', marginTop: '5px', padding: '3px 12px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: m.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2', color: m.status === 'ACTIVE' ? '#15803d' : '#b91c1c' }}>
                    {m.status === 'ACTIVE' ? 'Ativo' : m.status === 'PENDING' ? 'Pendente' : 'Inativo'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '5px' }}>Emitido em {new Date().toLocaleDateString('pt-BR')}</div>
                </div>
              </div>

              {/* Corpo 4 colunas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0 28px', flex: 1, alignContent: 'start' }}>
                <div>
                  <SectionTitle title="Dados Pessoais" />
                  <Field label="CPF" value={m.cpf} />
                  <Field label="RG" value={m.rg} />
                  <Field label="Nascimento" value={fmtDate(m.birthDate)} />
                  <Field label="Sexo" value={m.gender === 'M' ? 'Masculino' : m.gender === 'F' ? 'Feminino' : '—'} />
                  <Field label="Profissão" value={m.profession} />
                  <Field label="Telefone" value={m.phone} />
                  <Field label="WhatsApp" value={m.whatsapp} />
                  <Field label="E-mail" value={m.email} />
                </div>
                <div>
                  <SectionTitle title="Família" />
                  <Field label="Estado Civil" value={maritalMap[m.maritalStatus] || '—'} />
                  <Field label="Cônjuge" value={m.spouseName} />
                  <Field label="Data Casamento" value={m.marriageDate ? fmtDate(m.marriageDate) : undefined} />
                  <Field label="Nome do Pai" value={m.fatherName} />
                  <Field label="Nome da Mãe" value={m.motherName} />
                  {m.dependents && m.dependents.length > 0 && (
                    <div style={{ marginTop: '6px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '5px' }}>Dependentes</span>
                      {m.dependents.map(dep => (
                        <div key={dep.id} style={{ fontSize: '11px', color: '#1e293b', marginBottom: '4px' }}>
                          {dep.name} <span style={{ color: '#64748b' }}>({dep.relationship} · {fmtDate(dep.birthDate)})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <SectionTitle title="Endereço" />
                  <Field label="Logradouro" value={m.address?.street ? `${m.address.street}${m.address.number ? ', ' + m.address.number : ''}${m.address.complement ? ' — ' + m.address.complement : ''}` : undefined} />
                  <Field label="Bairro" value={m.address?.neighborhood} />
                  <Field label="Cidade / UF" value={m.address?.city ? `${m.address.city}${m.address.state ? ' / ' + m.address.state : ''}` : undefined} />
                  <Field label="CEP" value={m.address?.zipCode} />
                  <div style={{ marginTop: '20px' }}>
                    <SectionTitle title="Informações de Saúde" />
                    <Field label="Tipo Sanguíneo" value={m.bloodType} />
                    <Field label="Contato de Emergência" value={m.emergencyContact} />
                    <Field label="Necessidades Especiais" value={m.specialNeeds} />
                  </div>
                </div>
                <div>
                  <SectionTitle title="Vida Cristã" />
                  <Field label="Membro desde" value={fmtDate(m.membershipDate)} />
                  <Field label="Igreja de Origem" value={m.churchOfOrigin} />
                  <Field label="Data de Conversão" value={fmtDate(m.conversionDate)} />
                  <Field label="Local de Conversão" value={m.conversionPlace} />
                  <Field label="Data de Batismo" value={fmtDate(m.baptismDate)} />
                  <Field label="Igreja do Batismo" value={m.baptismChurch} />
                  <Field label="Pastor que Batizou" value={m.baptizingPastor} />
                  <Field label="Batismo no Espírito Santo" value={m.holySpiritBaptism === 'SIM' ? 'Sim' : 'Não'} />
                  <Field label="Curso de Discipulado" value={discipleMap[m.discipleshipCourse || ''] || '—'} />
                  <Field label="Escola Bíblica" value={biblicalMap[m.biblicalSchool || ''] || '—'} />
                  <Field label="Célula / Grupo" value={m.cellGroup} />
                </div>
              </div>

              {/* Rodapé */}
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 }}>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>ADJPA · Sistema de Gestão Ministerial</span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Ficha Cadastral — {m.matricula}</span>
                <div style={{ borderTop: '1px solid #cbd5e1', width: '160px', textAlign: 'center', paddingTop: '4px' }}>
                  <span style={{ fontSize: '9px', color: '#94a3b8' }}>Assinatura do Membro</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 border-t bg-white shrink-0 flex gap-4">
          <button onClick={() => setStep('range')} className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-600 font-black text-xs uppercase hover:bg-slate-50">
            Voltar
          </button>
          <button onClick={handlePrint} className="flex-1 py-4 bg-slate-700 text-white rounded-2xl font-black text-xs uppercase hover:bg-slate-800 flex items-center justify-center gap-2">
            <Printer size={18} /> Imprimir na Impressora
          </button>
        </div>
      </div>
    </div>
  );
};
