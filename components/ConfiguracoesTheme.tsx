/**
 * ============================================================================
 * CONFIGURACOESTHEME.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para configuracoes theme.
 *
 * ONDE É USADO?
 * -------------
 * Usado na interface React como parte do frontend.
 *
 * COMO FUNCIONA?
 * --------------
 * Controla a apresentação e interações da interface com o usuário.
 */

import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (configuracoes theme).
 */

export const ThemeSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Aparência do Sistema</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              Escolha entre tema claro ou escuro para melhor conforto visual
            </p>
          </div>
          <div className="flex items-center gap-2">
            {theme === 'light' ? (
              <Sun className="text-amber-500" size={24} />
            ) : (
              <Moon className="text-indigo-400" size={24} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`relative p-6 rounded-2xl border-2 transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'light' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
              }`}>
                <Sun size={24} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">Tema Claro</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Interface clara e vibrante</p>
              </div>
            </div>
            {theme === 'light' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>

          <button
            onClick={() => theme === 'light' && toggleTheme()}
            className={`relative p-6 rounded-2xl border-2 transition-all ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
              }`}>
                <Moon size={24} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">Tema Escuro</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Reduz fadiga visual</p>
              </div>
            </div>
            {theme === 'dark' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0">
              <Monitor className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2">Sobre os Temas</h4>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <li>• O tema escuro reduz o cansaço visual em ambientes com pouca luz</li>
                <li>• O tema claro oferece melhor legibilidade em ambientes bem iluminados</li>
                <li>• Sua preferência é salva automaticamente no navegador</li>
                <li>• Você pode alternar entre os temas a qualquer momento</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
