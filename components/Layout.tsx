/**
 * ============================================================================
 * LAYOUT.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para layout.
 *
 * ONDE É USADO?
 * -------------
 * Usado na interface React como parte do frontend.
 *
 * COMO FUNCIONA?
 * --------------
 * Controla a apresentação e interações da interface com o usuário.
 */


import React, { useState, useEffect } from 'react';
import { 
  Users, LayoutDashboard, DollarSign, Calendar, MessageSquare, Settings, 
  Menu, Church, Briefcase, LogOut, ChevronRight, ClipboardList, 
  BarChart3, UserCircle, UserCheck, Calculator, Box, 
  PlaneTakeoff, Building2, ChevronDown
} from 'lucide-react';
import { UserAuth, Unit } from '../types';
import { dbService } from '../services/databaseService';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (layout).
 */

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, isCollapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-indigo-600 text-white shadow-sm' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    <div className={`transition-transform duration-200 ${active ? 'scale-105' : 'group-hover:scale-105'}`}>
      {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 16 })}
    </div>
    {!isCollapsed && <span className="font-semibold whitespace-nowrap text-[12px]">{label}</span>}
    {!isCollapsed && active && <ChevronRight className="ml-auto w-3 h-3" />}
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserAuth;
  onLogout: () => void;
  currentUnitId: string;
  onUnitChange: (unitId: string) => void;
  allowedTabs?: string[];
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, setActiveTab, user, onLogout, currentUnitId, onUnitChange, allowedTabs = []
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isUnitSelectorOpen, setIsUnitSelectorOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    dbService.getUnits().then(setUnits).catch(console.error);
  }, []);

  const currentUnit = units.find(u => u.id === currentUnitId);

  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard /> },
    { id: 'members', label: 'Membros', icon: <Users /> },
    { id: 'finance', label: 'Financeiro (ERP)', icon: <DollarSign /> },
    { id: 'assets', label: 'Patrimônio', icon: <Box /> },
    { id: 'rh', label: 'Recursos Humanos', icon: <UserCheck /> },
    { id: 'dp', label: 'Funcionários', icon: <Briefcase /> },
    { id: 'leaves', label: 'Afastamentos', icon: <PlaneTakeoff /> },
    { id: 'payroll', label: 'Folha de Pagamento', icon: <Calculator /> },
    { id: 'events', label: 'Agenda & Eventos', icon: <Calendar /> },
    { id: 'reports', label: 'Relatórios', icon: <BarChart3 /> },
    { id: 'messages', label: 'Comunicação', icon: <MessageSquare /> },
    { id: 'audit', label: 'Auditoria Logs', icon: <ClipboardList /> },
    { id: 'portal', label: 'Portal do Membro', icon: <UserCircle /> },
    { id: 'settings', label: 'Configurações', icon: <Settings /> },
  ];
  const visibleMenuItems = allowedTabs.length > 0
    ? menuItems.filter(item => allowedTabs.includes(item.id))
    : menuItems;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${isCollapsed ? 'w-14' : 'w-48'}`}>
        <div className="h-full flex flex-col p-2">
          <div className="flex items-center gap-2 px-2 mb-4">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Church size={18} />
            </div>
            {!isCollapsed && <span className="text-md font-black text-slate-900 dark:text-white uppercase tracking-tighter">ADJPA</span>}
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto pr-1 scrollbar-hide">
            {visibleMenuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                isCollapsed={isCollapsed}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              />
            ))}
          </nav>

          <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              {!isCollapsed && <span className="font-bold text-[12px]">Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1 text-slate-500 dark:text-slate-400" onClick={() => setIsSidebarOpen(true)}><Menu size={18} /></button>
            <button 
              onClick={() => setIsUnitSelectorOpen(!isUnitSelectorOpen)}
              className="flex items-center gap-2 px-2 py-0.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md"
            >
              <Building2 size={12} className="text-indigo-600 dark:text-indigo-400" />
              <p className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase">{currentUnit?.name || 'Unidade'}</p>
              <ChevronDown size={10} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            {visibleMenuItems.some(item => item.id === 'settings') && (
              <button 
                onClick={() => setActiveTab('settings')}
                className={`p-1.5 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300'}`}
                title="Configurações"
              >
                <Settings size={16} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-900 dark:text-white leading-none">{user.name}</p>
                <p className="text-[8px] text-indigo-600 dark:text-indigo-400 font-black uppercase">{user.role}</p>
              </div>
              <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 overflow-hidden">
                <img src={user.avatar} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};
