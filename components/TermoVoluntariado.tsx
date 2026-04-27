/**
 * ============================================================================
 * TERMOVOLUNTARIADO.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para termo voluntariado.
 *
 * ONDE É USADO?
 * -------------
 * Usado na interface React como parte do frontend.
 *
 * COMO FUNCIONA?
 * --------------
 * Controla a apresentação e interações da interface com o usuário.
 */

import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, Printer } from 'lucide-react';



interface TermoVoluntariadoProps {
  nome: string;
  cpf?: string;
  rg?: string;
  endereco?: string;
  telefone?: string;
  igrejaNome: string;
  igrejaCnpj: string;
  igrejaEndereco?: string;
  igrejaEnderecoLinha1?: string;
  igrejaEnderecoLinha2?: string;
  igrejaContato?: string;
  igrejaTelefone?: string;
  consentimentos?: {
    dataProcessing?: boolean;
    communication?: boolean;
    marketing?: boolean;
    financial?: boolean;
    policyVersion?: string;
  };
  onClose: () => void;
}

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (termo voluntariado).
 */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 25, position: 'relative' }}>
    <h2 style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #000', paddingBottom: 5, marginBottom: 12 }}>
      {title}
    </h2>
    <div style={{ paddingLeft: 4 }}>{children}</div>
  </div>
);

const Field: React.FC<{ label: string; value?: string; blank?: boolean }> = ({ label, value, blank }) => (
  <p style={{ marginBottom: 6 }}>
    <strong>{label}:</strong>{' '}
    {blank || !value
      ? <span style={{ borderBottom: '1.2px solid #555', minWidth: 240, display: 'inline-block' }}>&nbsp;</span>
      : value
    }
  </p>
);

const Clausula: React.FC<{ numero: number; titulo: string; children: React.ReactNode }> = ({ numero, titulo, children }) => (
  <div style={{ marginBottom: 22, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
    <h3 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>
      Cláusula {numero} – {titulo}
    </h3>
    <div style={{ textAlign: 'justify', fontSize: '10.5pt', lineHeight: 1.45 }}>{children}</div>
  </div>
);

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul style={{ listStyleType: 'disc', margin: '6px 0 6px 25px', padding: 0 }}>
    {items.map((item, idx) => (
      <li key={idx} style={{ marginBottom: 3 }}>{item}</li>
    ))}
  </ul>
);

const BlankLine: React.FC<{ size?: number }> = ({ size = 50 }) => (
  <span style={{ borderBottom: '1px solid #111', minWidth: size * 4, display: 'inline-block' }}>&nbsp;</span>
);

export const TermoVoluntariado: React.FC<TermoVoluntariadoProps> = ({
  nome,
  cpf,
  rg,
  endereco,
  telefone,
  igrejaNome,
  igrejaCnpj,
  igrejaEndereco,
  igrejaEnderecoLinha1,
  igrejaEnderecoLinha2,
  igrejaContato,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Termo de Voluntariado - ${nome}</title>
  <style>
    @page { 
      size: A4; 
      margin: 0; 
    }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: white;
      font-family: 'Times New Roman', Times, serif;
      color: #000;
      overflow: visible;
    }

    .print-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    /* Marca d'água fixa e independente */
    .bg-layer {
      position: fixed;
      top: 0;
      left: 0;
      width: 210mm;
      height: 297mm;
      z-index: -100;
      pointer-events: none;
    }
    
    .bg-layer img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.16;
    }

    .print-wrapper {
      width: 100%;
      padding: 0 2.2cm 1.8cm 2.2cm;
      position: relative;
      z-index: 10;
    }
    
    .no-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    hr { border: 0; border-top: 1.8px solid #000; margin: 15px 0; }
    h1 { font-size: 17pt; margin: 0; padding: 0; line-height: 1.2; text-align: center; font-weight: bold; }
    p { margin: 0 0 8px 0; line-height: 1.45; }

    @media print {
      body { background: transparent; }
    }
  </style>
</head>
<body>
  <table class="print-table">
    <thead>
      <tr>
        <th style="padding: 0; border: none; font-weight: normal;">
          <div class="bg-layer">
            <img src="/img/timbrado.png" alt="" />
          </div>
          <!-- ESPAÇADOR REPETITIVO: Garante a mesma margem superior em TODAS as páginas -->
          <div style="height: 1.8cm; width: 100%;"></div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 0; border: none;">
          <div class="print-wrapper">
            ${printRef.current.innerHTML}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=1000,height=800');
    if (!win) {
      alert('Habilite pop-ups para imprimir.');
      return;
    }
    win.document.write(html);
    win.document.close();
    
    win.onload = () => {
      win.focus();
      setTimeout(() => {
        win.print();
      }, 750);
    };
  };
  
  const dadosInstituicaoOk = !!(igrejaNome && igrejaCnpj);

  const displayNome = igrejaNome || '';
  const displayCnpj = igrejaCnpj || '';
  const displayContato = igrejaContato || '';
  
  const displayEndereco = igrejaEndereco || '';
  const displayEnderecoL1 = igrejaEnderecoLinha1 || '';
  const displayEnderecoL2 = igrejaEnderecoLinha2 || '';

  return (
    <>
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm no-print">
        <div className="absolute top-6 right-6 flex gap-3 no-print z-[700]">
          <button
            onClick={() => {
              if (!dadosInstituicaoOk) {
                alert('Não foi possível carregar os dados da instituição. Verifique a conexão com o servidor e tente novamente.');
                return;
              }
              handlePrint();
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-indigo-700 transition-all transform hover:scale-105"
          >
            <Printer size={16} /> Imprimir Termo
          </button>
          


          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all font-sans"
          >
            <X size={16} /> Fechar
          </button>
        </div>

        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-y-auto max-h-[92vh] pb-24 relative">
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
             <img src="/img/timbrado.png" className="w-full h-full object-cover opacity-[0.1]" alt="" />
          </div>

          <div ref={printRef} className="relative px-20 pt-10" style={{ zIndex: 1, fontFamily: "'Times New Roman', Times, serif", color: '#000' }}>
            <div style={{ textAlign: 'center', marginBottom: 35 }}>
              <h1 style={{ fontSize: '17pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                TERMO DE ADESÃO AO SERVIÇO VOLUNTÁRIO
              </h1>
              <p style={{ fontWeight: 'bold', fontSize: '11.5pt', marginTop: 6 }}>
                Com Autorização de Uso de Imagem e Voz
              </p>
              <hr style={{ borderColor: '#000' }} />
            </div>

            <Section title="1. Instituição Religiosa">
              <Field label="Nome" value={displayNome} />
              <Field label="CNPJ" value={displayCnpj} />
              
              <div style={{ display: 'flex', marginBottom: 6, lineHeight: 1.4 }}>
                <strong style={{ minWidth: '78px', flexShrink: 0 }}>Endereço:</strong>
                <div>
                  {(displayEnderecoL1 || displayEnderecoL2) ? (
                    <>
                      {displayEnderecoL1}
                      <div>{displayEnderecoL2}</div>
                    </>
                  ) : (
                    displayEndereco
                  )}
                </div>
              </div>

              <Field label="E-mail" value={displayContato} />
            </Section>

            <Section title="2. Voluntário(a)">
              <Field label="Nome completo" value={nome} />
              <Field label="CPF" value={cpf} blank={!cpf} />
              <Field label="RG" value={rg} blank={!rg} />
              <Field label="Endereço" value={endereco} blank={!endereco} />
              <Field label="Telefone" value={telefone} blank={!telefone} />
            </Section>

            <Clausula numero={1} titulo="Do Objeto">
              <p>O presente termo formaliza a prestação de serviço voluntário, nos termos da Lei nº 9.608/1998.</p>
            </Clausula>

            <Clausula numero={2} titulo="Do Serviço Voluntário">
              <p>O serviço será prestado de forma espontânea, gratuita e sem qualquer remuneração.</p>
            </Clausula>

            <Clausula numero={3} titulo="Da Ausência de Vínculo Empregatício">
              <p>O(a) VOLUNTÁRIO(A) declara que:</p>
              <BulletList items={[
                "Não existe vínculo empregatício",
                "Não há pagamento de salário ou benefícios",
                "Pode encerrar a qualquer momento"
              ]} />
            </Clausula>

            <Clausula numero={4} titulo="Das Atividades">
              <p style={{ marginTop: 2 }}><strong>Atividades:</strong> <BlankLine size={80} /></p>
              <p style={{ marginTop: 8 }}><strong>Local:</strong> <BlankLine size={86} /></p>
            </Clausula>

            <Clausula numero={5} titulo="Da Disponibilidade">
              <p>A atuação ocorrerá conforme disponibilidade do voluntário.</p>
              <p style={{ marginTop: 8 }}><strong>Dias/horários:</strong> <BlankLine size={82} /></p>
            </Clausula>

            <Clausula numero={6} titulo="Do Ressarcimento">
              <p>Poderá haver ressarcimento de despesas autorizadas e comprovadas.</p>
            </Clausula>

            <Clausula numero={7} titulo="Do Uso de Imagem e Voz">
              <p>O(a) VOLUNTÁRIO(A) autoriza, de forma gratuita, o uso de sua imagem, voz e nome para:</p>
              <BulletList items={[
                "Fotos e vídeos",
                "Redes sociais",
                "Materiais institucionais"
              ]} />
              <p style={{ marginTop: 6 }}>Sem limitação territorial, sem remuneração e por prazo indeterminado.</p>
            </Clausula>

            <Clausula numero={8} titulo="Condições do Uso de Imagem">
              <BulletList items={[
                "Não haverá pagamento",
                "Uso não será ofensivo",
                "Pode ser revogado mediante solicitação"
              ]} />
            </Clausula>

            <Clausula numero={9} titulo="Vigência">
              <p>Este termo entra em vigor na data da assinatura.</p>
            </Clausula>

            <Clausula numero={10} titulo="Disposições Gerais">
              <p>O voluntário compromete-se a respeitar as normas e valores da instituição.</p>
            </Clausula>

            {/* Início da área de assinaturas protegida contra quebra */}
            <div className="no-break" style={{ marginTop: 45 }}>
              <h1 style={{ fontSize: '14pt', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 20, textAlign: 'left' }}>
                <span style={{ marginRight: 10 }}>✅</span> ASSINATURAS
              </h1>
              
              <p style={{ marginBottom: 35 }}><strong>Local e Data:</strong> <BlankLine size={55} /></p>
              
              <p style={{ fontWeight: 'bold', marginBottom: 45, fontSize: '11pt' }}>Declaro que li e concordo com este termo.</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 50, marginTop: 55 }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: 8, fontSize: '10.5pt' }}>
                    Assinatura do Voluntário
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: 8, fontSize: '10.5pt' }}>
                    Responsável pela Igreja
                  </div>
                </div>
              </div>

              <div style={{ border: '1.2px solid #555', borderRadius: 6, padding: '22px 25px', marginTop: 50 }}>
                <p style={{ fontWeight: 'bold', marginBottom: 15, fontSize: '11pt' }}>(Se menor de idade) Responsável Legal</p>
                <p style={{ marginBottom: 12 }}><strong>Nome:</strong> <BlankLine size={72} /></p>
                <p style={{ marginBottom: 12 }}><strong>CPF:</strong> <BlankLine size={74} /></p>
                <p><strong>Assinatura:</strong> <BlankLine size={68} /></p>
              </div>

              <div style={{ textAlign: 'center', fontSize: '9pt', color: '#444', marginTop: 40 }}>
                Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermoVoluntariado;
