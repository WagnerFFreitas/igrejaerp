import React, { useState, useEffect } from 'react';
import { X, Shield, Eye, Mail, Megaphone, CreditCard, Check, AlertCircle } from 'lucide-react';
import { LGPDConsent, LGPDPolicy } from '../types';

interface LGPDConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (consent: LGPDConsent) => void;
  userType: 'MEMBER' | 'EMPLOYEE';
  userId: string;
  userName: string;
  currentConsent?: LGPDConsent;
  currentPolicy?: LGPDPolicy;
}

export default function LGPDConsentModal({
  isOpen,
  onClose,
  onConsent,
  userType,
  userId,
  userName,
  currentConsent,
  currentPolicy
}: LGPDConsentModalProps) {
  const [consents, setConsents] = useState({
    dataProcessing: currentConsent?.dataProcessing || false,
    communication: currentConsent?.communication || false,
    marketing: currentConsent?.marketing || false,
    financial: currentConsent?.financial || false
  });

  const [hasReadPolicy, setHasReadPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConsents({
        dataProcessing: currentConsent?.dataProcessing || false,
        communication: currentConsent?.communication || false,
        marketing: currentConsent?.marketing || false,
        financial: currentConsent?.financial || false
      });
      setHasReadPolicy(false);
      setShowPolicyDetails(false);
    }
  }, [isOpen, currentConsent]);

  const handleConsentChange = (type: keyof typeof consents, value: boolean) => {
    setConsents(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = async () => {
    if (!hasReadPolicy) {
      alert('É necessário ler a política de privacidade para continuar.');
      return;
    }

    if (!consents.dataProcessing) {
      alert('O consentimento para tratamento de dados é obrigatório.');
      return;
    }

    setIsSubmitting(true);

    try {
      const consentData: LGPDConsent = {
        id: currentConsent?.id || `LGPD_${Date.now()}`,
        userId,
        userType,
        consentType: 'DATA_PROCESSING',
        granted: consents.dataProcessing,
        consentDate: new Date().toISOString(),
        ipAddress: await getClientIP(),
        userAgent: navigator.userAgent,
        policyVersion: currentPolicy?.version || '1.0',
        unitId: 'default', // Virá do contexto
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Criar consentimentos separados para cada tipo
      const communicationConsent: LGPDConsent = {
        ...consentData,
        id: `LGPD_COMM_${Date.now()}`,
        consentType: 'COMMUNICATION',
        granted: consents.communication
      };

      const marketingConsent: LGPDConsent = {
        ...consentData,
        id: `LGPD_MKT_${Date.now()}`,
        consentType: 'MARKETING',
        granted: consents.marketing
      };

      const financialConsent: LGPDConsent = {
        ...consentData,
        id: `LGPD_FIN_${Date.now()}`,
        consentType: 'FINANCIAL',
        granted: consents.financial
      };

      // Enviar todos os consentimentos
      onConsent(consentData);
      if (consents.communication) onConsent(communicationConsent);
      if (consents.marketing) onConsent(marketingConsent);
      if (consents.financial) onConsent(financialConsent);

      onClose();
    } catch (error) {
      console.error('Erro ao salvar consentimento:', error);
      alert('Erro ao salvar consentimento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '0.0.0.0';
    }
  };

  const consentOptions = [
    {
      key: 'dataProcessing',
      title: 'Tratamento de Dados',
      description: 'Autorizo o tratamento de meus dados pessoais para as finalidades essenciais da organização.',
      icon: Shield,
      required: true,
      color: 'text-blue-600'
    },
    {
      key: 'communication',
      title: 'Comunicação',
      description: 'Autorizo o envio de comunicados, avisos importantes e informações sobre a igreja.',
      icon: Mail,
      required: false,
      color: 'text-green-600'
    },
    {
      key: 'marketing',
      title: 'Marketing',
      description: 'Autorizo o envio de informações sobre eventos, campanhas e atividades promocionais.',
      icon: Megaphone,
      required: false,
      color: 'text-purple-600'
    },
    {
      key: 'financial',
      title: 'Informações Financeiras',
      description: 'Autorizo o processamento de dados relacionados a contribuições, dízimos e ofertas.',
      icon: CreditCard,
      required: false,
      color: 'text-orange-600'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Política de Privacidade e Consentimento LGPD
              </h2>
              <p className="text-sm text-slate-600">
                {userType === 'MEMBER' ? 'Membro' : 'Funcionário'}: {userName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Informações sobre a Política */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Política de Privacidade - Versão {currentPolicy?.version || '1.0'}
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  Leia atentamente nossa política de privacidade antes de conceder seu consentimento.
                </p>
                <button
                  onClick={() => setShowPolicyDetails(!showPolicyDetails)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                >
                  {showPolicyDetails ? 'Ocultar' : 'Ver'} política completa
                </button>
              </div>
            </div>
          </div>

          {/* Política Detalhada */}
          {showPolicyDetails && (
            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 max-h-60 overflow-y-auto">
              <h4 className="font-semibold text-slate-900 mb-3">
                {currentPolicy?.title || 'Política de Privacidade da Organização'}
              </h4>
              <div className="text-sm text-slate-700 whitespace-pre-wrap">
                {currentPolicy?.content || `POLÍTICA DE PRIVACIDADE

1. COLETA DE DADOS
Coletamos e processamos seus dados pessoais para as seguintes finalidades:
- Gestão administrativa e eclesiástica
- Comunicação institucional
- Processamento de contribuições e ofertas
- Organização de eventos e atividades

2. ARMAZENAMENTO E SEGURANÇA
Seus dados são armazenados com segurança e acessados apenas por pessoal autorizado.
Utilizamos criptografia e medidas de segurança para proteger suas informações.

3. COMPARTILHAMENTO DE DADOS
Seus dados não são vendidos nem compartilhados com terceiros, exceto quando:
- Exigido por lei
- Para prestação de serviços essenciais
- Com seu consentimento explícito

4. SEUS DIREITOS
Você tem direito a:
- Acessar seus dados
- Corrigir informações incorretas
- Solicitar exclusão de dados
- Revogar consentimentos a qualquer momento
- Portabilidade de dados

5. CONTATO
Para exercer seus direitos, entre em contato com:
Email: privacidade@igreja.com
Telefone: (00) 0000-0000

Esta política está em vigor desde ${currentPolicy?.effectiveDate || new Date().toLocaleDateString('pt-BR')}.`}
              </div>
            </div>
          )}

          {/* Opções de Consentimento */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Opções de Consentimento
            </h3>
            
            {consentOptions.map((option) => {
              const Icon = option.icon;
              const isChecked = consents[option.key as keyof typeof consents];
              
              return (
                <div
                  key={option.key}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isChecked
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => !option.required && handleConsentChange(option.key as keyof typeof consents, !isChecked)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isChecked ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${isChecked ? option.color : 'text-slate-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900">
                          {option.title}
                        </h4>
                        {option.required && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            Obrigatório
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        {option.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConsentChange(option.key as keyof typeof consents, !isChecked);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            isChecked
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {isChecked ? (
                            <>
                              <Check className="w-4 h-4" />
                              Concordo
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4" />
                              Não concordo
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkbox de Leitura */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasReadPolicy}
                onChange={(e) => setHasReadPolicy(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div className="text-sm text-slate-700">
                <span className="font-medium">
                  Declaro que li e compreendi a Política de Privacidade acima.
                </span>
                <br />
                <span className="text-slate-600">
                  Entendo que posso revogar meu consentimento a qualquer momento.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-3 text-slate-700 hover:text-slate-900 font-medium transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!hasReadPolicy || !consents.dataProcessing || isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Salvar Consentimentos
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
