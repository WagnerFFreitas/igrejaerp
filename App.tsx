
/**********************************************************************
*                               APP.TSX                               *
***********************************************************************
* Interface inicial do React e componente raiz da aplicação.          *
* O projeto usada em runtime ou build.                                *
* Controla a apresentação e interações da interface com o usuário.    *
***********************************************************************/

import React, { useState, useEffect } from 'react';
import { Layout } from './componentes/Layout'; 
import { PainelGeral } from './componentes/PainelGeral';
import { Membros } from './componentes/Membros';
import { Financeiro } from './componentes/Financeiro';
import { RecursosHumanos } from './componentes/RecursosHumanos';
import { Funcionarios } from './componentes/Funcionarios';
import { Afastamentos } from './componentes/Afastamentos';
import { Patrimonio } from './componentes/Patrimonio';
import { ProcessamentoFolha } from './componentes/ProcessamentoFolha';
import { Eventos } from './componentes/Eventos';
import { Comunicacao } from './componentes/Comunicacao';
import { Relatorios } from './componentes/Relatorios';
import { Auditoria } from './componentes/Auditoria';
import { PortalMembro } from './componentes/PortalMembro';
import { Configuracoes } from './componentes/Configuracoes';

// Importações de tipos padronizados
import { Usuario, Funcionario, Membro, Transacao, ContaBancaria, Patrimonio as PatrimonioTipo, AfastamentoFuncionario, PerfilUsuario, Unidade } from './tipos';

import { ThemeProvider } from './contexts/temaContext';

// Importações de serviços atualizadas
import { MembroService } from './servicos/membroService';
import { FuncionarioService, TransacaoService } from './servicos/funcionarioService';
import { accountService } from './servicos/contasService';
import AutenticacaoService from './servicos/autenticacaoService';
import AuditoriaService from './servicos/auditoria-servico';
import apiClient from './servicos/apiService';
import { useAudit } from './hooks/useAuditoria';
import { dbService } from './servicos/bancoDadosService';

import { 
  User as UserIcon, Key, LogIn, Church, AlertCircle, Loader2, Cloud, ShieldCheck, Lock
} from 'lucide-react';

const Login: React.FC<{ aoLogar: (usuario: Usuario) => void }> = ({ aoLogar }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [usuariosInicializados, setUsuariosInicializados] = useState(false);
  const [erroInicializacao, setErroInicializacao] = useState('');
  
  const estilos = {
    // ... (estilos mantidos) ...
  };

  useEffect(() => {
    const verificarUsuarios = async () => {
      try {
        await apiClient.healthCheck();
        console.log('🔍 Status: Sistema pronto para login');
        setUsuariosInicializados(true);
        setErroInicializacao('');
      } catch (error) {
        console.error('❌ Erro ao verificar usuários:', error);
        setUsuariosInicializados(false);
        setErroInicializacao('API ou PostgreSQL indisponível. Verifique se o backend está rodando.');
      }
    };

    verificarUsuarios();
  }, []);

  const realizarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    console.log('🔐 Iniciando processo de login...');

    try {
      const resposta = await AutenticacaoService.login(login, senha);
      const usuarioAutenticado = resposta.user;
      
      console.log('✅ Usuário autenticado:', usuarioAutenticado.nome, usuarioAutenticado.role);
      
      aoLogar(usuarioAutenticado);
      console.log('✅ Login bem-sucedido!', usuarioAutenticado.nome);
      
    } catch (error) {
      console.error('❌ Erro no processo de login:', error);
      const mensagem = error instanceof Error ? error.message : 'Erro no sistema. Tente novamente mais tarde.';
      setErro(mensagem);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ padding: '40px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', width: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Church size={48} color="#2563eb" />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '16px' }}>IgrejaERP</h1>
          <p style={{ color: '#64748b' }}>Acesso ao sistema</p>
        </div>

        {erroInicializacao && (
          <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
            <AlertCircle size={20} style={{ marginRight: '8px' }} />
            {erroInicializacao}
          </div>
        )}

        {!usuariosInicializados && !erroInicializacao && (
          <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#f0f9ff', color: '#0284c7', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={20} className="animate-spin" style={{ marginRight: '8px' }} />
            Inicializando sistema...
          </div>
        )}

        <form onSubmit={realizarLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="login" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Login</label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Seu login de usuário"
                style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                disabled={!usuariosInicializados}
              />
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="senha" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <Key size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
                style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                disabled={!usuariosInicializados}
              />
            </div>
          </div>
          
          {erro && (
            <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
              <AlertCircle size={20} style={{ marginRight: '8px' }} />
              {erro}
            </div>
          )}

          <button 
            type="submit" 
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            disabled={!usuariosInicializados}
          >
            <LogIn size={18} style={{ marginRight: '8px' }} />
            Entrar
          </button>
        </form>
         <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <ShieldCheck size={14} /> Segurança e Auditoria Ativas
            </p>
          </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [idUnidadeAtual, setIdUnidadeAtual] = useState<string>(() => {
    const salvo = localStorage.getItem('idUnidadeAtual');
    return salvo && salvo !== 'undefined' ? salvo : 'u-sede';
  });
  const [usuario, setUsuario] = useState<Usuario | null>(AutenticacaoService.getCurrentUser());
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const [membros, setMembros] = useState<Membro[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [idUnidadeSelecionada, setIdUnidadeSelecionada] = useState<string>('u-sede');
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [contasBancarias, setContasBancarias] = useState<ContaBancaria[]>([]);
  const [patrimonios, setPatrimonios] = useState<PatrimonioTipo[]>([]);
  const [afastamentos, setAfastamentos] = useState<AfastamentoFuncionario[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Record<string, any[]>>({});
  const [carregando, setCarregando] = useState(false);
  
  const TODAS_AS_ABAS = ['dashboard', 'members', 'finance', 'patrimonios', 'rh', 'dp', 'leaves', 'folha_pagamento', 'eventos_igreja', 'reports', 'messages', 'audit', 'portal', 'settings'];
  // ... (Lógica de abas acessíveis mantida) ...

  useEffect(() => {
    const inicializarSistema = async () => {
      // ... (Lógica de inicialização mantida) ...
    };
    inicializarSistema();
  }, []);

  useEffect(() => {
    const buscarDados = async (isPolling = false) => {
      if (!usuario) return;
      
      if (!isPolling) setCarregando(true);

      try {
        const unitIdMap: Record<string, string> = {
          'u-sede': '00000000-0000-0000-0000-000000000001',
          'u-matriz': '00000000-0000-0000-0000-000000000001',
        };
        const idUnidadeApi = unitIdMap[idUnidadeAtual] || idUnidadeAtual;

        const respostaMembros = await MembroService.getMembros({ id_unidade: idUnidadeApi });
        const membrosDaApi = (respostaMembros.membros || []) as Membro[];

        const [respostaFuncionarios, respostaTransacoes, dadosContas, dadosAfastamentos] = await Promise.all([
          FuncionarioService.getEmployees({ id_unidade: idUnidadeApi }),
          TransacaoService.getTransactions({ id_unidade: idUnidadeApi }),
          accountService.getAccounts(idUnidadeApi),
          dbService.getLeaves(idUnidadeApi),
        ]);
        
        setMembros(membrosDaApi);
        setFuncionarios((respostaFuncionarios.funcionarios || []) as Funcionario[]);
        setTransacoes((respostaTransacoes.transacoes || []) as Transacao[]);
        setContasBancarias((dadosContas || []) as ContaBancaria[]);
        setAfastamentos((dadosAfastamentos || []) as AfastamentoFuncionario[]);

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        if (!isPolling) setCarregando(false);
      }
    };
    
    buscarDados();

    const intervalId = setInterval(() => buscarDados(true), 120000);
    return () => clearInterval(intervalId);
  }, [usuario, idUnidadeAtual]);

  const { logMenuAccess } = useAudit(usuario);

  useEffect(() => {
    if (usuario && abaAtiva) {
      // ... (Lógica de log de menu mantida) ...
    }
  }, [abaAtiva, usuario]);

  if (!usuario) {
    return <Login aoLogar={u => { 
      setUsuario(u);
      setIdUnidadeAtual(u.id_unidade);
      localStorage.setItem('currentUser', JSON.stringify(u));
    }} />;
  }

  // ... (Lógica de filtragem de dados por unidade) ...

  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case 'dashboard': return <PainelGeral usuario={usuario} membros={membros} funcionarios={funcionarios} transacoes={transacoes} contas_bancarias={contasBancarias} />;
      case 'members': return <Membros membros={membros} currentUnitId={idUnidadeAtual} setMembros={setMembros} setTransactions={setTransacoes} contas_bancarias={contasBancarias} setAccounts={setContasBancarias} user={usuario} />;
      // ... (outros cases atualizados de forma similar) ...
      default: return <PainelGeral usuario={usuario} membros={membros} funcionarios={funcionarios} transacoes={transacoes} contas_bancarias={contasBancarias} />;
    }
  };

  return (
    <ThemeProvider>
        <Layout 
          activeTab={abaAtiva} 
          setActiveTab={setAbaAtiva} 
          user={usuario}
          allowedTabs={TODAS_AS_ABAS} // Simplificado por enquanto
          onLogout={() => {
            AuditoriaService.logLogout(usuario.id_usuario, usuario.nome, usuario.id_unidade).catch(console.error);
            AutenticacaoService.logout().catch(console.error);
            localStorage.removeItem('currentUser');
            setUsuario(null);
          }}
          currentUnitId={idUnidadeAtual}
          onUnitChange={setIdUnidadeAtual}
        >
        <div className="max-w-[1600px] mx-auto">
          {renderizarConteudo()}
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
