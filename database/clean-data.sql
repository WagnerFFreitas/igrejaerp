-- ============================================================================
-- IGREJAERP - Script de Limpeza de Dados
-- Remove dados de teste mantendo schema intacto
-- ============================================================================

-- Desabilitar verificações de integridade temporariamente
SET CONSTRAINTS ALL DEFERRED;

-- Limpar em ordem de dependência (respeitar foreign keys)

-- Logs de consentimento LGPD
TRUNCATE TABLE public.logs_consentimento_lgpd CASCADE;

-- Escalas de voluntários
TRUNCATE TABLE public.escalas_voluntarios CASCADE;

-- Eventos da igreja
TRUNCATE TABLE public.eventos_igreja CASCADE;

-- Ajustes de inventário
TRUNCATE TABLE public.ajustes_inventario CASCADE;

-- Itens de inventário
TRUNCATE TABLE public.itens_inventario CASCADE;

-- Contagens de inventário
TRUNCATE TABLE public.contagens_inventario CASCADE;

-- Patrimônios
TRUNCATE TABLE public.patrimonios CASCADE;

-- Afastamentos de funcionários
TRUNCATE TABLE public.afastamentos_funcionarios CASCADE;

-- Períodos de folha
TRUNCATE TABLE public.periodos_folha CASCADE;

-- Folha de pagamento
TRUNCATE TABLE public.folha_pagamento CASCADE;

-- Lançamentos contábeis
TRUNCATE TABLE public.lancamentos_contabeis CASCADE;

-- Transações
TRUNCATE TABLE public.transacoes CASCADE;

-- Permissões de usuário
TRUNCATE TABLE public.app_user_permissions CASCADE;

-- Permissões por role
TRUNCATE TABLE public.app_role_permissions CASCADE;

-- Módulos de permissão
TRUNCATE TABLE public.app_permission_modules CASCADE;

-- Auditoria
TRUNCATE TABLE public.app_audit_logs CASCADE;

-- Fornecedores
TRUNCATE TABLE public.fornecedores CASCADE;

-- Plano de contas
TRUNCATE TABLE public.plano_contas CASCADE;

-- Contas bancárias
TRUNCATE TABLE public.contas_bancarias CASCADE;

-- Contas financeiras
TRUNCATE TABLE public.contas_financeiras CASCADE;

-- Dados bancários de pessoas
TRUNCATE TABLE public.dados_bancarios_pessoa CASCADE;

-- Usuários
TRUNCATE TABLE public.usuarios CASCADE;

-- Funcionários
TRUNCATE TABLE public.funcionarios CASCADE;

-- Membros
TRUNCATE TABLE public.membros CASCADE;

-- Pessoas
TRUNCATE TABLE public.pessoas CASCADE;

-- Contatos
TRUNCATE TABLE public.contatos CASCADE;

-- Endereços
TRUNCATE TABLE public.enderecos CASCADE;

-- Políticas LGPD
TRUNCATE TABLE public.politicas_lgpd CASCADE;

-- Unidades
TRUNCATE TABLE public.unidades CASCADE;

-- Resetar sequências (se houver)
ALTER SEQUENCE IF EXISTS public.afastamentos_funcionarios_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.patrimonios_id_seq RESTART WITH 1;

-- Reabilitar constraints
SET CONSTRAINTS ALL IMMEDIATE;

-- Confirmação
DO $$ BEGIN
  RAISE NOTICE 'Todos os dados fictícios foram removidos com sucesso!';
  RAISE NOTICE 'Schema mantido intacto - pronto para novo seed.';
END $$;
