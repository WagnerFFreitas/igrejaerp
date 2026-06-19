/**
 * ============================================================================
 * PERMISSOES-SERVICO.TS (REATORADO PARA FIRESTORE)
 * ============================================================================
 *
 * Serviço para calcular e gerenciar permissões de usuário usando Firestore.
 */

import { db } from '../database';

// Interface para uma permissão efetiva
export interface EffectivePermission {
    moduleCode: string;
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canManage: boolean;
}

// Definição estática dos módulos de permissão da aplicação
export const APP_PERMISSION_MODULES = [
    { code: 'dashboard', name: 'Dashboard', categoria: 'general', description: 'Acesso ao painel geral' },
    { code: 'members', name: 'Membros', categoria: 'people', description: 'Cadastro e gestão de membros' },
    { code: 'finance', name: 'Financeiro', categoria: 'finance', description: 'Lançamentos financeiros e tesouraria' },
    { code: 'patrimonios', name: 'Patrimônio', categoria: 'patrimonios', description: 'Cadastro e controle de bens' },
    { code: 'hr', name: 'Recursos Humanos', categoria: 'hr', description: 'Avaliações, RH e desenvolvimento' },
    { code: 'funcionarios', name: 'Funcionários', categoria: 'hr', description: 'Cadastro de colaboradores' },
    { code: 'eventos_igreja', name: 'Eventos', categoria: 'operations', description: 'Agenda e eventos da igreja' },
    { code: 'reports', name: 'Relatórios', categoria: 'reports', description: 'Exportações e relatórios' },
    { code: 'settings', name: 'Configurações', categoria: 'admin', description: 'Parâmetros globais da aplicação' },
    { code: 'usuarios', name: 'Usuários', categoria: 'admin', description: 'Cadastro de usuários do sistema' },
    { code: 'permissions', name: 'Permissões', categoria: 'admin', description: 'Configuração de perfis e acessos' }
] as const;

// Matriz de permissões padrão baseada no papel (role)
const DEFAULT_ROLE_MATRIX: Record<string, { canRead: boolean; canWrite: boolean; canDelete: boolean; canManage: boolean }> = {
    DEVELOPER: { canRead: true, canWrite: true, canDelete: true, canManage: true },
    ADMIN: { canRead: true, canWrite: true, canDelete: true, canManage: true },
    TREASURER: { canRead: true, canWrite: true, canDelete: false, canManage: false },
    SECRETARY: { canRead: true, canWrite: true, canDelete: false, canManage: false },
    PASTOR: { canRead: true, canWrite: true, canDelete: false, canManage: false },
    RH: { canRead: true, canWrite: true, canDelete: false, canManage: false },
    FINANCEIRO: { canRead: true, canWrite: true, canDelete: false, canManage: false },
};

/**
 * Retorna a permissão base para um papel (role) em um determinado módulo.
 * Esta função contém a lógica de negócio de quais papéis podem acessar quais módulos.
 */
function resolveRolePermissions(role: string, moduleCode: string) {
    let permission = DEFAULT_ROLE_MATRIX[role] || { canRead: false, canWrite: false, canDelete: false, canManage: false };

    if (role === 'TREASURER' && !['dashboard', 'finance', 'reports'].includes(moduleCode)) {
        permission = { canRead: false, canWrite: false, canDelete: false, canManage: false };
    }
    if (role === 'SECRETARY' && !['dashboard', 'members', 'eventos_igreja', 'reports'].includes(moduleCode)) {
        permission = { canRead: false, canWrite: false, canDelete: false, canManage: false };
    }
    // Adicionar outras regras de negócio aqui...

    return permission;
}

/**
 * Calcula as permissões efetivas para um usuário, mesclando permissões de papel com permissões individuais.
 */
export async function getEffectivePermissions(userId: string, role: string): Promise<EffectivePermission[]> {
    // Desenvolvedores têm acesso total e irrestrito.
    if (role === 'DEVELOPER') {
        return APP_PERMISSION_MODULES.map(module => ({
            moduleCode: module.code,
            canRead: true, canWrite: true, canDelete: true, canManage: true
        }));
    }

    // Busca as permissões personalizadas do usuário no Firestore.
    const userPermissionsDoc = await db.collection('user_permissions').doc(userId).get();
    const userSpecificPermissions = userPermissionsDoc.data() as Record<string, Partial<EffectivePermission>> || {};

    const effectivePermissions: EffectivePermission[] = [];

    for (const module of APP_PERMISSION_MODULES) {
        // 1. Começa com a permissão base do papel (role).
        const rolePermission = resolveRolePermissions(role, module.code);
        
        // 2. Busca a permissão específica do usuário para este módulo.
        const userPermission = userSpecificPermissions[module.code];

        // 3. Mescla, com a permissão do usuário tendo precedência (lógica do COALESCE).
        effectivePermissions.push({
            moduleCode: module.code,
            canRead: userPermission?.canRead ?? rolePermission.canRead,
            canWrite: userPermission?.canWrite ?? rolePermission.canWrite,
            canDelete: userPermission?.canDelete ?? rolePermission.canDelete,
            canManage: userPermission?.canManage ?? rolePermission.canManage,
        });
    }

    return effectivePermissions;
}

/**
 * Substitui todas as permissões personalizadas de um usuário no Firestore.
 */
export async function replaceUserPermissions(
    userId: string,
    permissions: Array<{ moduleCode: string; canRead?: boolean; canWrite?: boolean; canDelete?: boolean; canManage?: boolean; }>
): Promise<void> {
    const userPermissionsRef = db.collection('user_permissions').doc(userId);

    // Transforma o array de permissões em um mapa para salvar no Firestore.
    const permissionsMap = permissions.reduce((acc, p) => {
        acc[p.moduleCode] = {
            canRead: p.canRead ?? false,
            canWrite: p.canWrite ?? false,
            canDelete: p.canDelete ?? false,
            canManage: p.canManage ?? false,
        };
        return acc;
    }, {} as Record<string, any>);

    // Substitui o documento inteiro com as novas permissões.
    await userPermissionsRef.set(permissionsMap);
}
