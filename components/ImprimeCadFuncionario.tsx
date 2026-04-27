/**
 * ============================================================================
 * IMPRIMECADFUNCIONARIO.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para imprime cad funcionario.
 *
 * ONDE É USADO?
 * -------------
 * Usado na interface React como parte do frontend.
 *
 * COMO FUNCIONA?
 * --------------
 * Controla a apresentação e interações da interface com o usuário.
 */

import React, { useState } from 'react';
import { Printer, X } from 'lucide-react';
import { Payroll } from '../types';

interface ImprimeCadFuncionarioProps {
  employees: Payroll[];
  onClose: () => void;
  preSelected?: Payroll[];
}

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (imprime cad funcionario).
 */

export const ImprimeCadFuncionario: React.FC<ImprimeCadFuncionarioProps> = ({ employees, onClose, preSelected }) => {
  const sorted = [...employees].sort((a, b) => (a.matricula || '').localeCompare(b.matricula || ''));
  const firstMat = sorted[0]?.matricula?.match(/F(\d+)/)?.[0] || 'F01';
  const lastMat  = sorted[sorted.length - 1]?.matricula?.match(/F(\d+)/)?.[0] || firstMat;

  const [step, setStep]             = useState<'range' | 'preview'>(preSelected && preSelected.length > 0 ? 'preview' : 'range');
  const [rangeStart, setRangeStart] = useState(firstMat);
  const [rangeEnd,   setRangeEnd]   = useState(lastMat);
  const [toPrint, setToPrint]       = useState<Payroll[]>(preSelected && preSelected.length > 0 ? preSelected : []);

  const parseNum = (mat: string) => {
    const m = mat.trim().toUpperCase().match(/F(\d+)/);
    return m ? parseInt(m[1]) : null;
  };

  const handleConfirm = () => {
    const start = parseNum(rangeStart);
    const end   = parseNum(rangeEnd);
    if (start === null || end === null || start > end) {
      alert('Faixa inválida. Informe no formato F01 a F05, com início menor ou igual ao fim.');
      return;
    }
    const filtered = employees
      .filter(e => { const n = parseNum(e.matricula || ''); return n !== null && n >= start && n <= end; })
      .sort((a, b) => (a.matricula || '').localeCompare(b.matricula || ''));
    if (filtered.length === 0) {
      alert('Nenhum funcionário encontrado nessa faixa de matrícula.');
      return;
    }
    setToPrint(filtered);
    setStep('preview');
  };

  // ── Helpers de formatação ────────────────────────────────────────────────
  const fmtDate = (d?: string) => {
    if (!d) return '—';
    const dt = new Date(d + (d.includes('T') ? '' : 'T00:00:00'));
    return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('pt-BR');
  };
  const fmtCurrency = (v?: number) =>
    v != null ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';
  const contratoMap: Record<string, string> = {
    CLT: 'CLT', PJ: 'PJ', VOLUNTARIO: 'Voluntário', TEMPORARIO: 'Temporário',
  };
  const regimeMap: Record<string, string> = {
    PRESENCIAL: 'Presencial', HIBRIDO: 'Híbrido', REMOTO: 'Remoto',
  };
  const sexoMap: Record<string, string> = { M: 'Masculino', F: 'Feminino', O: 'Outro' };
  const ecivMap: Record<string, string> = {
    SOLTEIRO: 'Solteiro(a)', CASADO: 'Casado(a)', DIVORCIADO: 'Divorciado(a)', VIUVO: 'Viúvo(a)',
  };

  // ── Geração do HTML para impressão ──────────────────────────────────────
  const handlePrint = () => {
    const field = (label: string, value?: string | null) => value ? `
      <div style="margin-bottom:11px">
        <div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px">${label}</div>
        <div style="font-size:12px;color:#1e293b;font-weight:500;line-height:1.4">${value}</div>
      </div>` : '';

    const section = (title: string) => `
      <div style="border-bottom:2px solid #1d4ed8;margin-bottom:12px;padding-bottom:4px">
        <span style="font-size:10px;font-weight:800;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.12em">${title}</span>
      </div>`;

    const pages = toPrint.map(e => {
      const statusColor = e.status === 'ACTIVE' ? '#15803d' : '#b91c1c';
      const statusBg    = e.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2';
      const statusLabel = e.status === 'ACTIVE' ? 'Ativo' : e.status === 'INACTIVE' ? 'Inativo' : e.status === 'PAID' ? 'Pago' : 'Pendente';
      const avatarUrl   = e.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(e.employeeName)}&background=1d4ed8&color=fff&bold=true&size=80`;

      const depsHtml = e.dependentes_lista && e.dependentes_lista.length > 0 ? `
        <div style="margin-top:6px">
          <div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px">Dependentes (${e.dependentes_lista.length})</div>
          ${e.dependentes_lista.map((dep: any) => `
            <div style="font-size:11px;color:#1e293b;margin-bottom:4px">
              ${dep.name} <span style="color:#64748b">(${dep.relationship} · ${fmtDate(dep.birthDate)})</span>
            </div>`).join('')}
        </div>` : field('Qtd. Dependentes', e.dependentes_qtd > 0 ? String(e.dependentes_qtd) : undefined);

      return `
        <div style="width:100%;height:100vh;background:white;padding:14mm 16mm 10mm;box-sizing:border-box;page-break-after:always;font-family:'Segoe UI',Arial,sans-serif;display:flex;flex-direction:column;">

          <!-- Cabeçalho -->
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2.5px solid #0f172a;padding-bottom:12px;margin-bottom:16px;flex-shrink:0">
            <div style="display:flex;align-items:center;gap:16px">
              <img src="${avatarUrl}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2.5px solid #e2e8f0" />
              <div>
                <div style="font-size:20px;font-weight:800;color:#0f172a;line-height:1.2">${e.employeeName}</div>
                <div style="font-size:12px;color:#475569;margin-top:4px">${e.cargo || '—'}${e.departamento ? ' · ' + e.departamento : ''}</div>
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-size:15px;font-weight:800;color:#1d4ed8;letter-spacing:0.05em">${e.matricula || '—'}</div>
              <div style="display:inline-block;margin-top:5px;padding:3px 12px;border-radius:5px;font-size:10px;font-weight:700;background:${statusBg};color:${statusColor}">${statusLabel}</div>
              <div style="font-size:10px;color:#94a3b8;margin-top:5px">Emitido em ${new Date().toLocaleDateString('pt-BR')}</div>
            </div>
          </div>

          <!-- Corpo 4 colunas -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0 28px;flex:1;align-content:start">

            <!-- Dados Pessoais -->
            <div>
              ${section('Dados Pessoais')}
              ${field('CPF', e.cpf)}
              ${field('RG', e.rg)}
              ${field('Nascimento', fmtDate(e.birthDate))}
              ${field('Sexo', sexoMap[e.sexo || ''] || e.sexo)}
              ${field('Estado Civil', ecivMap[e.estado_civil || ''] || e.estado_civil)}
              ${field('Nacionalidade', e.nacionalidade)}
              ${field('Naturalidade', e.naturalidade)}
              ${field('Escolaridade', e.escolaridade)}
              ${field('Telefone', e.telefone)}
              ${field('Celular', e.celular)}
              ${field('E-mail', e.email || e.email_pessoal)}
              ${field('Contato Emergência', e.emergency_contact)}
              ${e.is_pcd ? field('PCD', e.tipo_deficiencia || 'Sim') : ''}
            </div>

            <!-- Contrato -->
            <div>
              ${section('Contrato')}
              ${field('Cargo', e.cargo)}
              ${field('Função', e.funcao)}
              ${field('Departamento', e.departamento)}
              ${field('CBO', e.cbo)}
              ${field('Tipo de Contrato', contratoMap[e.tipo_contrato] || e.tipo_contrato)}
              ${field('Regime', regimeMap[e.regime_trabalho] || e.regime_trabalho)}
              ${field('Admissão', fmtDate(e.data_admissao))}
              ${e.data_demissao ? field('Demissão', fmtDate(e.data_demissao)) : ''}
              ${field('Salário Base', fmtCurrency(e.salario_base))}
              ${field('Jornada', e.jornada_trabalho)}
              ${field('Sindicato', e.sindicato)}
            </div>

            <!-- Documentos + Endereço -->
            <div>
              ${section('Documentos')}
              ${field('PIS', e.pis)}
              ${field('CTPS', e.ctps)}
              ${field('Título de Eleitor', e.titulo_eleitor)}
              ${field('Reservista', e.reservista)}
              ${field('ASO', fmtDate(e.aso_data))}
              ${field('CNH Nº', e.cnh_numero)}
              ${field('CNH Categoria', e.cnh_categoria)}
              ${field('CNH Vencimento', fmtDate(e.cnh_vencimento))}
              <div style="margin-top:16px">
                ${section('Endereço')}
                ${field('Logradouro', (e as any).logradouro ? `${(e as any).logradouro}${e.numero ? ', ' + e.numero : ''}` : undefined)}
                ${field('Bairro', e.bairro)}
                ${field('Cidade / UF', e.cidade ? `${e.cidade}${e.estado ? ' / ' + e.estado : ''}` : undefined)}
                ${field('CEP', e.cep)}
              </div>
            </div>

            <!-- Dependentes -->
            <div>
              ${section('Dependentes')}
              ${depsHtml || '<div style="font-size:11px;color:#94a3b8;font-style:italic">Nenhum dependente cadastrado.</div>'}
            </div>

          </div>

          <!-- Rodapé -->
          <div style="border-top:1px solid #e2e8f0;margin-top:auto;padding-top:10px;display:flex;justify-content:space-between;align-items:flex-end;flex-shrink:0">
            <span style="font-size:10px;color:#94a3b8">ADJPA · Sistema de Gestão Ministerial</span>
            <span style="font-size:10px;color:#94a3b8">Ficha Cadastral — ${e.matricula}</span>
            <div style="border-top:1px solid #cbd5e1;width:160px;text-align:center;padding-top:4px">
              <span style="font-size:9px;color:#94a3b8">Assinatura do Funcionário</span>
            </div>
          </div>
        </div>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Ficha Cadastral Funcionários — ${rangeStart} a ${rangeEnd}</title>
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
            <div className="p-2 bg-blue-700 text-white rounded-xl"><Printer size={18} /></div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Imprimir Cadastro</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Selecione a faixa de matrículas</p>
            </div>
          </div>

          <div className="flex gap-3 mb-2">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">De (ex: F01)</label>
              <input
                type="text"
                value={rangeStart}
                onChange={e => setRangeStart(e.target.value.toUpperCase())}
                placeholder="F01"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
              />
            </div>
            <div className="flex items-end pb-2 text-slate-400 font-bold text-sm">até</div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Até (ex: F05)</label>
              <input
                type="text"
                value={rangeEnd}
                onChange={e => setRangeEnd(e.target.value.toUpperCase())}
                placeholder="F05"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mb-5">
            Serão impressos todos os funcionários cujas matrículas estejam nessa faixa, inclusive os extremos.
          </p>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase hover:bg-slate-50">
              Cancelar
            </button>
            <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white font-bold text-xs uppercase hover:bg-blue-800 flex items-center justify-center gap-2">
              <Printer size={14} /> Visualizar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Modal: preview ───────────────────────────────────────────────────────
  const Field = ({ label, value }: { label: string; value?: string | null }) => (
    <div style={{ marginBottom: '11px' }}>
      <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '3px' }}>{label}</span>
      <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: 500, lineHeight: 1.4 }}>{value || '—'}</span>
    </div>
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <div style={{ borderBottom: '2px solid #1d4ed8', marginBottom: '12px', paddingBottom: '4px' }}>
      <span style={{ fontSize: '10px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{title}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl no-print">
      <div className="bg-white rounded-[2rem] w-full max-w-6xl shadow-2xl flex flex-col h-[94vh] overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-700 text-white rounded-xl"><Printer size={18} /></div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Prévia — Ficha Cadastral de Funcionários</h3>
              <p className="text-[10px] text-slate-400">
                {toPrint.length} funcionário(s) · Faixa {rangeStart} a {rangeEnd} · A4 Paisagem
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={22} /></button>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto bg-slate-200 custom-scrollbar p-6">
          {toPrint.map(e => (
            <div key={e.id} style={{
              width: '277mm', minHeight: '190mm', background: 'white', margin: '0 auto 24px',
              padding: '14mm 16mm 10mm', fontFamily: "'Segoe UI', Arial, sans-serif",
              boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
              boxShadow: '0 2px 16px rgba(0,0,0,0.12)'
            }}>
              {/* Cabeçalho */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2.5px solid #0f172a', paddingBottom: '12px', marginBottom: '16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={e.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(e.employeeName)}&background=1d4ed8&color=fff&bold=true&size=80`}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #e2e8f0' }}
                    alt=""
                  />
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{e.employeeName}</div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                      {e.cargo || '—'}{e.departamento ? ` · ${e.departamento}` : ''}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#1d4ed8' }}>{e.matricula || '—'}</div>
                  <div style={{ display: 'inline-block', marginTop: '5px', padding: '3px 12px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: e.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2', color: e.status === 'ACTIVE' ? '#15803d' : '#b91c1c' }}>
                    {e.status === 'ACTIVE' ? 'Ativo' : e.status === 'INACTIVE' ? 'Inativo' : e.status === 'PAID' ? 'Pago' : 'Pendente'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '5px' }}>Emitido em {new Date().toLocaleDateString('pt-BR')}</div>
                </div>
              </div>

              {/* Corpo 4 colunas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0 28px', flex: 1, alignContent: 'start' }}>

                {/* Dados Pessoais */}
                <div>
                  <SectionTitle title="Dados Pessoais" />
                  <Field label="CPF" value={e.cpf} />
                  <Field label="RG" value={e.rg} />
                  <Field label="Nascimento" value={fmtDate(e.birthDate)} />
                  <Field label="Sexo" value={sexoMap[e.sexo || ''] || e.sexo} />
                  <Field label="Estado Civil" value={ecivMap[e.estado_civil || ''] || e.estado_civil} />
                  <Field label="Nacionalidade" value={e.nacionalidade} />
                  <Field label="Naturalidade" value={e.naturalidade} />
                  <Field label="Escolaridade" value={e.escolaridade} />
                  <Field label="Telefone" value={e.telefone} />
                  <Field label="Celular" value={e.celular} />
                  <Field label="E-mail" value={e.email || e.email_pessoal} />
                  <Field label="Contato Emergência" value={e.emergency_contact} />
                  {e.is_pcd && <Field label="PCD" value={e.tipo_deficiencia || 'Sim'} />}
                </div>

                {/* Contrato */}
                <div>
                  <SectionTitle title="Contrato" />
                  <Field label="Cargo" value={e.cargo} />
                  <Field label="Função" value={e.funcao} />
                  <Field label="Departamento" value={e.departamento} />
                  <Field label="CBO" value={e.cbo} />
                  <Field label="Tipo de Contrato" value={contratoMap[e.tipo_contrato] || e.tipo_contrato} />
                  <Field label="Regime" value={regimeMap[e.regime_trabalho] || e.regime_trabalho} />
                  <Field label="Admissão" value={fmtDate(e.data_admissao)} />
                  {e.data_demissao && <Field label="Demissão" value={fmtDate(e.data_demissao)} />}
                  <Field label="Salário Base" value={fmtCurrency(e.salario_base)} />
                  <Field label="Jornada" value={e.jornada_trabalho} />
                  <Field label="Sindicato" value={e.sindicato} />
                </div>

                {/* Documentos + Endereço */}
                <div>
                  <SectionTitle title="Documentos" />
                  <Field label="PIS" value={e.pis} />
                  <Field label="CTPS" value={e.ctps} />
                  <Field label="Título de Eleitor" value={e.titulo_eleitor} />
                  <Field label="Reservista" value={e.reservista} />
                  <Field label="ASO" value={fmtDate(e.aso_data)} />
                  <Field label="CNH Nº" value={e.cnh_numero} />
                  <Field label="CNH Categoria" value={e.cnh_categoria} />
                  <Field label="CNH Vencimento" value={fmtDate(e.cnh_vencimento)} />
                  <div style={{ marginTop: '16px' }}>
                    <SectionTitle title="Endereço" />
                    <Field label="Logradouro" value={(e as any).logradouro ? `${(e as any).logradouro}${e.numero ? ', ' + e.numero : ''}` : undefined} />
                    <Field label="Bairro" value={e.bairro} />
                    <Field label="Cidade / UF" value={e.cidade ? `${e.cidade}${e.estado ? ' / ' + e.estado : ''}` : undefined} />
                    <Field label="CEP" value={e.cep} />
                  </div>
                </div>

                {/* Dependentes */}
                <div>
                  <SectionTitle title="Dependentes" />
                  {e.dependentes_lista && e.dependentes_lista.length > 0 ? (
                    <>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Total: {e.dependentes_lista.length}
                        </span>
                      </div>
                      {e.dependentes_lista.map((dep: any, i: number) => (
                        <div key={i} style={{ marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>{dep.name}</div>
                          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                            {dep.relationship}{dep.birthDate ? ` · ${fmtDate(dep.birthDate)}` : ''}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : e.dependentes_qtd > 0 ? (
                    <Field label="Qtd. Dependentes" value={String(e.dependentes_qtd)} />
                  ) : (
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>Nenhum dependente cadastrado.</div>
                  )}
                </div>

              </div>

              {/* Rodapé */}
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 }}>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>ADJPA · Sistema de Gestão Ministerial</span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Ficha Cadastral — {e.matricula}</span>
                <div style={{ borderTop: '1px solid #cbd5e1', width: '160px', textAlign: 'center', paddingTop: '4px' }}>
                  <span style={{ fontSize: '9px', color: '#94a3b8' }}>Assinatura do Funcionário</span>
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
          <button onClick={handlePrint} className="flex-1 py-4 bg-blue-700 text-white rounded-2xl font-black text-xs uppercase hover:bg-blue-800 flex items-center justify-center gap-2">
            <Printer size={18} /> Imprimir na Impressora
          </button>
        </div>
      </div>
    </div>
  );
};
