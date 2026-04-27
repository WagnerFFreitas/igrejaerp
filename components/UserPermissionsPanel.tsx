/**
 * ============================================================================
 * USERPERMISSIONSPANEL.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para user permissions panel.
 *
 * ONDE É USADO?
 * -------------
 * Usado na interface React como parte do frontend.
 *
 * COMO FUNCIONA?
 * --------------
 * Controla a apresentação e interações da interface com o usuário.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { KeyRound, Plus, Save, Shield, UserCog, UserPlus } from 'lucide-react';
import { UserAuth } from '../types';
import { dbService } from '../services/databaseService';
import UsersService, { AppPermission, AppUser, PermissionModule } from '../src/services/usersService';

interface UserPermissionsPanelProps {
  currentUser: UserAuth;
}

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (user permissions panel).
 */

const ROLE_OPTIONS = ['ADMIN', 'SECRETARY', 'TREASURER', 'PASTOR', 'RH', 'DP', 'FINANCEIRO'];

export const UserPermissionsPanel: React.FC<UserPermissionsPanelProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [modules, setModules] = useState<PermissionModule[]>([]);
  const [units, setUnits] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [editablePermissions, setEditablePermissions] = useState<AppPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SECRETARY',
    unitId: currentUser.unitId
  });

  const canManage = currentUser.role === 'ADMIN' || currentUser.role === 'DEVELOPER';

  const selectedUser = useMemo(
    () => users.find(user => user.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  useEffect(() => {
    const loadData = async () => {
      if (!canManage) return;

      setIsLoading(true);
      try {
        const [usersData, modulesData, unitsData] = await Promise.all([
          UsersService.getUsers(),
          UsersService.getPermissionModules(),
          dbService.getUnits()
        ]);

        setUsers(usersData);
        setModules(modulesData);
        setUnits(unitsData);

        const preferredUser = usersData.find(user => user.role !== 'DEVELOPER') || usersData[0];
        if (preferredUser) {
          setSelectedUserId(preferredUser.id);
          setEditablePermissions(preferredUser.permissions || []);
        }
      } catch (error) {
        console.error('Erro ao carregar usuários e permissões:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [canManage, currentUser.unitId]);

  useEffect(() => {
    if (selectedUser) {
      setEditablePermissions(selectedUser.permissions || []);
    }
  }, [selectedUser]);

  const updatePermission = (moduleCode: string, field: keyof AppPermission, value: boolean) => {
    setEditablePermissions(prev =>
      prev.map(permission =>
        permission.moduleCode === moduleCode
          ? { ...permission, [field]: value }
          : permission
      )
    );
  };

  const handleCreateUser = async () => {
    if (!createForm.name || !createForm.email || !createForm.password || !createForm.unitId) {
      alert('Preencha nome, email, senha e unidade.');
      return;
    }

    try {
      setIsCreating(true);
      const newUser = await UsersService.createUser(createForm);
      setUsers(prev => [...prev, newUser].sort((a, b) => a.name.localeCompare(b.name)));
      setSelectedUserId(newUser.id);
      setCreateForm({
        name: '',
        email: '',
        password: '',
        role: 'SECRETARY',
        unitId: currentUser.unitId
      });
    } catch (error: any) {
      alert(error?.response?.data?.error?.message || 'Erro ao criar usuário.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser || selectedUser.role === 'DEVELOPER') return;

    try {
      setIsSaving(true);
      const updatedPermissions = await UsersService.updatePermissions(selectedUser.id, editablePermissions);
      setUsers(prev =>
        prev.map(user =>
          user.id === selectedUser.id
            ? { ...user, permissions: updatedPermissions }
            : user
        )
      );
      alert('Permissões atualizadas com sucesso.');
    } catch (error: any) {
      alert(error?.response?.data?.error?.message || 'Erro ao salvar permissões.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateUser = async (partial: { role?: string; isActive?: boolean; unitId?: string }) => {
    if (!selectedUser) return;

    try {
      const updated = await UsersService.updateUser(selectedUser.id, partial);
      setUsers(prev => prev.map(user => (user.id === updated.id ? updated : user)));
    } catch (error: any) {
      alert(error?.response?.data?.error?.message || 'Erro ao atualizar usuário.');
    }
  };

  if (!canManage) {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
        <Shield className="mx-auto text-slate-300 mb-3" size={28} />
        <p className="font-bold text-slate-700">Apenas `ADMIN` ou `DEVELOPER` podem gerenciar permissões.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
        <p className="text-slate-500">Carregando usuários e permissões...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-[360px,1fr] gap-6">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <UserCog size={18} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 uppercase text-sm tracking-[0.15em]">Usuários do Sistema</h3>
              <p className="text-slate-400 text-xs font-bold">Gerencie acesso e perfis</p>
            </div>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`w-full text-left p-3 rounded-2xl border transition-colors ${
                  selectedUserId === user.id
                    ? 'border-indigo-200 bg-indigo-50'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-900 text-sm">{user.name}</p>
                    <p className="text-slate-500 text-xs">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                    user.role === 'DEVELOPER' ? 'bg-emerald-100 text-emerald-700' :
                    user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <UserPlus size={16} />
              <span className="font-black text-xs uppercase tracking-[0.15em]">Novo Usuário</span>
            </div>

            <input
              value={createForm.name}
              onChange={e => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"
            />
            <input
              value={createForm.email}
              onChange={e => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"
            />
            <input
              type="password"
              value={createForm.password}
              onChange={e => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Senha"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"
            />
            <select
              value={createForm.role}
              onChange={e => setCreateForm(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"
            >
              {ROLE_OPTIONS.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <select
              value={createForm.unitId}
              onChange={e => setCreateForm(prev => ({ ...prev, unitId: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"
            >
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>

            <button
              onClick={handleCreateUser}
              disabled={isCreating}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-black text-xs uppercase"
            >
              <Plus size={14} />
              {isCreating ? 'Criando...' : 'Criar Usuário'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5">
          {!selectedUser ? (
            <p className="text-slate-500">Selecione um usuário para editar permissões.</p>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">{selectedUser.name}</h3>
                  <p className="text-slate-500 text-sm">{selectedUser.email}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={selectedUser.role}
                    onChange={e => handleUpdateUser({ role: e.target.value })}
                    disabled={selectedUser.role === 'DEVELOPER'}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  >
                    {selectedUser.role === 'DEVELOPER' && <option value="DEVELOPER">DEVELOPER</option>}
                    {ROLE_OPTIONS.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>

                  <select
                    value={selectedUser.unitId}
                    onChange={e => handleUpdateUser({ unitId: e.target.value })}
                    disabled={selectedUser.role === 'DEVELOPER'}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  >
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>{unit.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleUpdateUser({ isActive: selectedUser.status !== 'ACTIVE' })}
                    disabled={selectedUser.role === 'DEVELOPER'}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold"
                  >
                    {selectedUser.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>

              <div className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                selectedUser.role === 'DEVELOPER'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {selectedUser.role === 'DEVELOPER'
                  ? 'Desenvolvedor possui acesso total e irrestrito a todos os módulos.'
                  : 'As permissões abaixo podem ser ajustadas individualmente para este usuário.'}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-[0.15em] text-slate-400">
                      <th className="pb-3">Módulo</th>
                      <th className="pb-3">Ler</th>
                      <th className="pb-3">Criar/Editar</th>
                      <th className="pb-3">Excluir</th>
                      <th className="pb-3">Gerenciar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map(module => {
                      const permission = editablePermissions.find(item => item.moduleCode === module.code) || {
                        moduleCode: module.code,
                        canRead: false,
                        canWrite: false,
                        canDelete: false,
                        canManage: false
                      };

                      return (
                        <tr key={module.code} className="border-t border-slate-100">
                          <td className="py-3">
                            <div>
                              <p className="font-bold text-slate-900">{module.name}</p>
                              <p className="text-xs text-slate-400">{module.description}</p>
                            </div>
                          </td>
                          {([
                            ['canRead', permission.canRead],
                            ['canWrite', permission.canWrite],
                            ['canDelete', permission.canDelete],
                            ['canManage', permission.canManage]
                          ] as Array<[keyof AppPermission, boolean]>).map(([field, checked]) => (
                            <td key={field} className="py-3">
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={selectedUser.role === 'DEVELOPER'}
                                onChange={e => updatePermission(module.code, field, e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300"
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSavePermissions}
                  disabled={isSaving || selectedUser.role === 'DEVELOPER'}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase disabled:opacity-50"
                >
                  <Save size={14} />
                  {isSaving ? 'Salvando...' : 'Salvar Permissões'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPermissionsPanel;
