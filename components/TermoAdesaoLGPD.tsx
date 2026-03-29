import React, { useRef } from 'react';
import { X, Printer, FileText } from 'lucide-react';

interface TermoAdesaoLGPDProps {
  /** Dados do membro ou funcionário */
  nome: string;
  cpf?: string;
  rg?: string;
  endereco?: string;
  telefone?: string;
  /** Dados da Igreja */
  igrejaNome?: string;
  igrejaCnpj?: string;
  igrejaEndereco?: string;
  igrejaContato?: string;
  /** Consentimentos já registrados */
  consentimentos?: {
    dataProcessing?: boolean;
    communication?: boolean;
    marketing?: boolean;
    financial?: boolean;
    policyVersion?: string;
  };
  /** Callback para fechar o modal */
  onClose: () => void;
}

export const TermoAdesaoLGPD: React.FC<TermoAdesaoLGPDProps> = ({
  nome,
  cpf,
  rg,
  endereco,
  telefone,
  igrejaNome,
  igrejaCnpj,
  igrejaEndereco,
  igrejaContato,
  consentimentos,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const handlePrint = () => {
    if (!printRef.current) return;
    
    // Isolar o conteúdo numa página em branco pra impressão perfeita sem herdar o CSS do SPA
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Termo de Adesão ao Serviço Voluntário - ${nome}</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    html, body { 
      width: 100%; height: 100%; background: transparent; 
      margin: 0; padding: 0;
      font-family: 'Times New Roman', Times, serif; 
      font-size: 11pt; 
      color: #111; 
      line-height: 1.6;
    }
    .page-table { width: 100%; border-collapse: collapse; border: none; margin: 0; }
    .page-table-header, .page-table-footer { height: 2cm; padding: 0; border: none; }
    .page-table-content { padding: 0 1.8cm; vertical-align: top; border: none; }
    .watermark {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: -1;
      background-image: url('/img/fundo.png');
      background-size: 100% 100%;
      background-position: center center;
      background-repeat: no-repeat;
      opacity: 0.15;
      pointer-events: none;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    hr { border: 0; border-top: 1px solid #aaa; margin: 16px 0; }
    strong { font-weight: bold; }
    .no-print { display: none !important; }
    h1 { font-size: 14pt; }
    h2 { font-size: 12pt; }
    @media print { 
      html, body { height: 100%; } 
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
    }
  </style>
</head>
<body>
  <div class="watermark"></div>
  <table class="page-table">
    <thead>
      <tr><th class="page-table-header"></th></tr>
    </thead>
    <tbody>
      <tr>
        <td class="page-table-content">
          ${printRef.current.innerHTML}
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr><td class="page-table-footer"></td></tr>
    </tfoot>
  </table>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=1000,height=800');
    if (!win) {
      alert('Por favor, permita pop-ups para imprimir o documento.');
      return;
    }
    win.document.write(html);
    win.document.close();
    win.onload = () => { 
      win.focus(); 
      win.print(); 
    };
  };

  const versao = consentimentos?.policyVersion || '1.0';

  return (
    <>
      {/* Overlay do modal */}
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm no-print">
        {/* Botões flutuantes de controle */}
        <div className="absolute top-6 right-6 flex gap-3 no-print z-[700]">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all"
          >
            <Printer size={16} /> Imprimir
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all"
          >
            <X size={16} /> Fechar
          </button>
        </div>

        {/* Documento */}
        <div
          id="termo-lgpd-print-root"
          className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-y-auto max-h-[92vh] p-12"
          style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '11pt', lineHeight: 1.6, color: '#111' }}
          ref={printRef}
        >
          {/* Cabeçalho */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: '15pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
              Termo de Adesão ao Serviço Voluntário
            </h1>
            <p style={{ fontWeight: 'bold', marginTop: 6 }}>
              Com Autorização de Uso de Imagem, Voz e Consentimento LGPD
            </p>
            <hr style={{ marginTop: 16, borderColor: '#aaa' }} />
          </div>

          {/* INSTITUIÇÃO */}
          <Section title="Instituição Religiosa (Controladora dos Dados)">
            <Field label="Nome da Igreja" value={igrejaNome} blank={!igrejaNome} />
            <Field label="CNPJ" value={igrejaCnpj} blank={!igrejaCnpj} />
            <Field label="Endereço" value={igrejaEndereco} blank={!igrejaEndereco} />
            <Field label="E-mail / Contato (LGPD)" value={igrejaContato} blank={!igrejaContato} />
          </Section>

          {/* VOLUNTÁRIO */}
          <Section title="Voluntário(a)">
            <Field label="Nome completo" value={nome} />
            <Field label="CPF" value={cpf} blank={!cpf} />
            <Field label="RG" value={rg} blank={!rg} />
            <Field label="Endereço" value={endereco} blank={!endereco} />
            <Field label="Telefone" value={telefone} blank={!telefone} />
          </Section>

          {/* CLÁUSULAS */}
          <Clausula numero={1} titulo="Do Objeto">
            <p>
              O presente termo formaliza a prestação de serviço voluntário, nos termos da{' '}
              <strong>Lei nº 9.608/1998</strong>.
            </p>
          </Clausula>

          <Clausula numero={2} titulo="Do Serviço Voluntário">
            <p>O serviço será prestado de forma espontânea, gratuita e sem qualquer remuneração.</p>
            <br />
            <p><strong>Atividades:</strong></p>
            <BlankLines lines={2} />
            <p><strong>Local:</strong> <BlankLine size={60} /></p>
          </Clausula>

          <Clausula numero={3} titulo="Da Ausência de Vínculo Empregatício">
            <p>O(a) <strong>VOLUNTÁRIO(A)</strong> declara estar ciente de que:</p>
            <ul style={{ paddingLeft: 22, marginTop: 6 }}>
              <li>Não existe vínculo empregatício;</li>
              <li>Não há pagamento de salário ou benefícios;</li>
              <li>Pode encerrar sua participação a qualquer momento.</li>
            </ul>
          </Clausula>

          <Clausula numero={4} titulo="Da Disponibilidade">
            <p>A atuação ocorrerá conforme disponibilidade do voluntário.</p>
            <br />
            <p><strong>Dias/horários (opcional):</strong></p>
            <BlankLines lines={1} />
          </Clausula>

          <Clausula numero={5} titulo="Do Ressarcimento">
            <p>Poderá haver ressarcimento de despesas autorizadas e comprovadas.</p>
          </Clausula>

          <Clausula numero={6} titulo="Do Uso de Imagem e Voz">
            <p>
              O(a) <strong>VOLUNTÁRIO(A)</strong> autoriza, de forma gratuita, o uso de sua imagem, voz e nome,
              inclusive na internet e em plataformas digitais, sem limitação territorial, para:
            </p>
            <ul style={{ paddingLeft: 22, marginTop: 6 }}>
              <li>Fotos, vídeos e transmissões ao vivo;</li>
              <li>Redes sociais e site oficial;</li>
              <li>Materiais institucionais e evangelísticos.</li>
            </ul>
          </Clausula>

          <Clausula numero={7} titulo="Condições do Uso de Imagem">
            <ul style={{ paddingLeft: 22 }}>
              <li>Não haverá pagamento pelo uso da imagem;</li>
              <li>A utilização não será ofensiva ou indevida;</li>
              <li>A autorização é por prazo indeterminado;</li>
              <li>Pode ser revogada a qualquer momento por solicitação formal.</li>
            </ul>
          </Clausula>

          <Clausula numero={8} titulo="Proteção de Dados (LGPD)">
            <p>Os dados pessoais serão tratados para as seguintes finalidades:</p>
            <ul style={{ paddingLeft: 22, marginTop: 6 }}>
              <li>Cadastro e identificação do voluntário;</li>
              <li>Comunicação institucional;</li>
              <li>Organização de atividades da igreja;</li>
              <li>Cumprimento de obrigações legais e administrativas.</li>
            </ul>
            <br />
            <p>
              O tratamento poderá ocorrer com base no consentimento e/ou em outras bases legais previstas na{' '}
              <strong>Lei nº 13.709/2018 (LGPD)</strong>.
            </p>
          </Clausula>

          {/* BLOCO DE CONSENTIMENTO LGPD */}
          <div style={{ pageBreakBefore: 'always', margin: '24px 0', padding: '18px 22px', border: '2px solid #1a1a1a', borderRadius: 4 }}>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: '13pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
                <FileText size={14} style={{ display: 'inline', marginRight: 6 }} />
                Política de Privacidade e Consentimento LGPD
              </h2>
              <p style={{ marginTop: 4 }}><strong>Membro:</strong> {nome} &nbsp;&nbsp; <strong>Versão:</strong> {versao}</p>
            </div>
            <p style={{ marginBottom: 14 }}>
              Declaro que li e compreendi a Política de Privacidade e estou ciente de que posso revogar meu
              consentimento a qualquer momento, mediante solicitação.
            </p>

            <hr style={{ borderColor: '#ccc', marginBottom: 14 }} />
            <h3 style={{ fontWeight: 'bold', marginBottom: 10 }}>Opções de Consentimento</h3>

            {/* 1. Tratamento de Dados */}
            <ConsentBlock
              numero={1}
              titulo="Tratamento de Dados (Obrigatório)"
              opcoes={[
                {
                  label: 'Autorizo o tratamento dos meus dados pessoais para finalidades essenciais da organização (condição necessária para participação como voluntário)',
                  checked: consentimentos?.dataProcessing ?? false,
                  unica: true
                }
              ]}
            />

            {/* 2. Comunicação */}
            <ConsentBlock
              numero={2}
              titulo="Comunicação"
              opcoes={[
                { label: 'Autorizo o envio de comunicados e avisos importantes', checked: consentimentos?.communication ?? false },
                { label: 'Não autorizo', checked: !(consentimentos?.communication ?? false) },
              ]}
            />

            {/* 3. Marketing */}
            <ConsentBlock
              numero={3}
              titulo="Marketing"
              opcoes={[
                { label: 'Autorizo o envio de informações sobre eventos e campanhas', checked: consentimentos?.marketing ?? false },
                { label: 'Não autorizo', checked: !(consentimentos?.marketing ?? false) },
              ]}
            />

            {/* 4. Informações Financeiras */}
            <ConsentBlock
              numero={4}
              titulo="Informações Financeiras"
              opcoes={[
                { label: 'Autorizo o processamento de dados relacionados a contribuições', checked: consentimentos?.financial ?? false },
                { label: 'Não autorizo', checked: !(consentimentos?.financial ?? false) },
              ]}
            />
          </div>

          <Clausula numero={9} titulo="Direitos do Titular (LGPD)">
            <p>O(a) <strong>VOLUNTÁRIO(A)</strong> poderá, a qualquer momento:</p>
            <ul style={{ paddingLeft: 22, marginTop: 6 }}>
              <li>Solicitar acesso, correção ou exclusão de dados;</li>
              <li>Revogar consentimentos concedidos;</li>
              <li>Obter informações sobre o uso dos dados.</li>
            </ul>
            <p style={{ marginTop: 8 }}>Mediante contato com a instituição.</p>
          </Clausula>

          <Clausula numero={10} titulo="Vigência">
            <p>
              Este termo entra em vigor na data de sua assinatura, podendo ser encerrado a qualquer momento.
            </p>
          </Clausula>

          <Clausula numero={11} titulo="Disposições Gerais">
            <p>
              O(a) <strong>VOLUNTÁRIO(A)</strong> compromete-se a respeitar os princípios, valores e normas da instituição.
            </p>
          </Clausula>

          {/* Local e Data */}
          <div style={{ marginTop: 28, marginBottom: 32 }}>
            <p><strong>Local e Data:</strong> <BlankLine size={70} /></p>
          </div>

          {/* Assinaturas */}
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 36 }}>
              Assinaturas
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 60px', marginBottom: 48 }}>
              <SignatureBlock label={`Voluntário(a): ${nome}`} />
              <SignatureBlock label="Responsável pela Igreja" />
            </div>

            {/* Menor de idade */}
            <div style={{ border: '1px solid #aaa', borderRadius: 4, padding: '16px 20px', marginTop: 8 }}>
              <p style={{ fontWeight: 'bold', marginBottom: 12 }}>(Se for menor de idade) — Responsável Legal:</p>
              <Field label="Nome" value="" blank />
              <Field label="CPF" value="" blank />
              <br />
              <SignatureBlock label="Assinatura do Responsável Legal" />
            </div>
          </div>

          {/* Rodapé */}
          <div style={{ marginTop: 32, textAlign: 'center', fontSize: '9pt', color: '#555', borderTop: '1px solid #ccc', paddingTop: 10 }}>
            Documento gerado em {dataAtual} — Versão {versao} da Política de Privacidade
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Sub-componentes auxiliares ────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    <h2 style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #555', paddingBottom: 4, marginBottom: 10 }}>
      {title}
    </h2>
    <div style={{ paddingLeft: 8 }}>{children}</div>
  </div>
);

const Field: React.FC<{ label: string; value?: string; blank?: boolean }> = ({ label, value, blank }) => (
  <p style={{ marginBottom: 6 }}>
    <strong>{label}:</strong>{' '}
    {blank || !value
      ? <span style={{ display: 'inline-block', borderBottom: '1px solid #333', minWidth: 280, marginLeft: 4 }}>&nbsp;</span>
      : <span style={{ fontWeight: 'normal' }}>{value}</span>
    }
  </p>
);

const Clausula: React.FC<{ numero: number; titulo: string; children: React.ReactNode }> = ({ numero, titulo, children }) => (
  <div style={{ marginBottom: 16 }}>
    <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 6 }}>
      Cláusula {numero} – {titulo}
    </h2>
    <div style={{ paddingLeft: 10 }}>{children}</div>
  </div>
);

const BlankLine: React.FC<{ size?: number }> = ({ size = 50 }) => (
  <span style={{ display: 'inline-block', borderBottom: '1px solid #333', minWidth: size * 4, marginLeft: 4 }}>&nbsp;</span>
);

const BlankLines: React.FC<{ lines?: number }> = ({ lines = 2 }) => (
  <div style={{ marginTop: 8 }}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} style={{ borderBottom: '1px solid #ddd', height: 22, marginBottom: 4 }} />
    ))}
  </div>
);

interface OpcaoConsent {
  label: string;
  checked: boolean;
  unica?: boolean;
}

const ConsentBlock: React.FC<{ numero: number; titulo: string; opcoes: OpcaoConsent[] }> = ({ numero, titulo, opcoes }) => (
  <div style={{ marginBottom: 14 }}>
    <p style={{ fontWeight: 'bold', marginBottom: 6 }}>{numero}. {titulo}</p>
    {opcoes.map((op, i) => (
      <p key={i} style={{ paddingLeft: 10, marginBottom: 4, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <span style={{
          display: 'inline-block',
          width: 16, height: 16, border: '1.5px solid #333',
          borderRadius: op.unica ? 2 : 2,
          background: op.checked ? '#1a1a1a' : 'white',
          flexShrink: 0, marginTop: 2,
          position: 'relative'
        }}>
          {op.checked && (
            <span style={{ position: 'absolute', top: -1, left: 2, color: 'white', fontSize: '12px', fontWeight: 'bold', lineHeight: 1 }}>✓</span>
          )}
        </span>
        <span>{op.label}</span>
      </p>
    ))}
    <hr style={{ borderColor: '#eee', marginTop: 10 }} />
  </div>
);

const SignatureBlock: React.FC<{ label: string }> = ({ label }) => (
  <div>
    <div style={{ borderBottom: '1px solid #333', height: 44, marginBottom: 8 }} />
    <p style={{ fontSize: '10pt', textAlign: 'center' }}>{label}</p>
  </div>
);

export default TermoAdesaoLGPD;
