/**
 * ============================================================================
 * TERMOADESAOLGPD.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para termo adesao l g p d.
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
import { X, Printer } from 'lucide-react';

interface TermoAdesaoLGPDProps {
  nome: string;
  cpf?: string;
  rg?: string;
  endereco?: string;
  telefone?: string;
  igrejaNome?: string;
  igrejaCnpj?: string;
  igrejaEndereco?: string;
  igrejaEnderecoLinha1?: string;
  igrejaEnderecoLinha2?: string;
  igrejaTelefone?: string;
  igrejaContato?: string;
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
 * Define o bloco principal deste arquivo (termo adesao l g p d).
 */

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
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const dadosInstituicaoOk = !!(igrejaNome && igrejaCnpj);

  const handlePrint = () => {
    if (!printRef.current) return;

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

        <div
          id="termo-lgpd-print-root"
          className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-y-auto max-h-[92vh] p-12"
          style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '11pt', lineHeight: 1.6, color: '#111' }}
          ref={printRef}
        >
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: '15pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
              Termo de Consentimento LGPD
            </h1>
            <p style={{ fontWeight: 'bold', marginTop: 6 }}>
              Para Tratamento de Dados Pessoais
            </p>
            <hr style={{ marginTop: 16, borderColor: '#aaa' }} />
          </div>

          <Section title="Controladora dos Dados">
            <Field label="Nome" value={igrejaNome} blank={!igrejaNome} />
            <Field label="CNPJ" value={igrejaCnpj} blank={!igrejaCnpj} />
            <Field label="Endereço" value={igrejaEndereco} blank={!igrejaEndereco} />
            <Field label="E-mail" value={igrejaContato} blank={!igrejaContato} />
          </Section>

          <Section title="Titular dos Dados">
            <Field label="Nome completo" value={nome} />
            <Field label="CPF" value={cpf} blank={!cpf} />
            <Field label="RG" value={rg} blank={!rg} />
            <Field label="Endereço" value={endereco} blank={!endereco} />
            <Field label="Telefone" value={telefone} blank={!telefone} />
          </Section>

          <Section title="Finalidade do Tratamento">
            <p>Os dados pessoais serão utilizados para:</p>
            <ul style={{ paddingLeft: 22, marginTop: 6 }}>
              <li>Cadastro do voluntário;</li>
              <li>Comunicação institucional;</li>
              <li>Organização de atividades;</li>
              <li>Cumprimento de obrigações legais.</li>
            </ul>
          </Section>

          <Section title="Base Legal">
            <p>O tratamento é realizado conforme a <strong>Lei nº 13.709/2018</strong> (LGPD).</p>
          </Section>

          <Section title="Opções de Consentimento">
            <p style={{ marginBottom: 10 }}><strong>1. Tratamento de Dados (Obrigatório):</strong></p>
            <p style={{ paddingLeft: 10 }}>( ) Autorizo o tratamento dos meus dados pessoais</p>
            
            <p style={{ marginBottom: 10, marginTop: 14 }}><strong>2. Comunicação:</strong></p>
            <div style={{ paddingLeft: 10 }}>
              <p>( ) Autorizo</p>
              <p>( ) Não autorizo</p>
            </div>
            
            <p style={{ marginBottom: 10, marginTop: 14 }}><strong>3. Marketing:</strong></p>
            <div style={{ paddingLeft: 10 }}>
              <p>( ) Autorizo</p>
              <p>( ) Não autorizo</p>
            </div>
            
            <p style={{ marginBottom: 10, marginTop: 14 }}><strong>4. Informações Financeiras:</strong></p>
            <div style={{ paddingLeft: 10 }}>
              <p>( ) Autorizo</p>
              <p>( ) Não autorizo</p>
            </div>
          </Section>

          <Section title="Direitos do Titular">
            <p>O titular poderá:</p>
            <ul style={{ paddingLeft: 22, marginTop: 6 }}>
              <li>Solicitar acesso aos dados;</li>
              <li>Corrigir ou excluir informações;</li>
              <li>Revogar consentimento a qualquer momento.</li>
            </ul>
          </Section>

          <div style={{ marginTop: 30 }}>
            <h2 style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 16 }}>
              Declaração de Consentimento
            </h2>
            <p>Declaro que li, compreendi e concordo com o tratamento dos meus dados pessoais.</p>
          </div>

          <div style={{ marginTop: 30 }}>
            <h2 style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 16 }}>
              Assinatura LGPD
            </h2>

            <p><strong>Local e Data:</strong> <BlankLine size={70} /></p>
            
            <div style={{ marginTop: 30, marginBottom: 32 }}>
              <SignatureBlock label="Assinatura do Titular" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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

const SignatureBlock: React.FC<{ label: string }> = ({ label }) => (
  <div>
    <div style={{ borderBottom: '1px solid #333', height: 44, marginBottom: 8 }} />
    <p style={{ fontSize: '10pt' }}>{label}: ________________________________</p>
  </div>
);

export default TermoAdesaoLGPD;
