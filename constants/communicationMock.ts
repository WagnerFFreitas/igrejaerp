/**
 * ============================================================================
 * DADOS MOCK PARA COMUNICAÇÃO E NOTIFICAÇÕES
 * ============================================================================
 * 
 * Dados de demonstração para o sistema de comunicação
 */

import { 
  EmailCampaign, 
  SMSMessage, 
  CommunicationTemplate, 
  CommunicationGroup, 
  CommunicationStats,
  Notification,
  NotificationType,
  NotificationStatus
} from '../types/communication';

// Mock de Campanhas de Email
export const MOCK_EMAIL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: 'campaign1',
    name: 'Boas Vindas - Novos Membros',
    subject: 'Bem-vindo à nossa família!',
    template: '<h1>Olá {{nome}}!</h1><p>Seja bem-vindo à nossa igreja.</p>',
    senderName: 'Igreja ADJPA',
    senderEmail: 'comunicacao@adjpa.com.br',
    replyTo: 'contato@adjpa.com.br',
    status: 'SENT',
    sentAt: '2026-03-20T10:00:00Z',
    completedAt: '2026-03-20T11:30:00Z',
    totalRecipients: 150,
    sentCount: 150,
    deliveredCount: 145,
    failedCount: 5,
    openedCount: 120,
    clickedCount: 45,
    unsubscribedCount: 2,
    metadata: {
      category: 'WELCOME',
      tags: ['boas_vindas', 'novos_membros'],
      campaignType: 'GENERAL' as const
    },
    unitId: 'u-sede',
    createdBy: 'admin',
    createdAt: '2026-03-19T15:00:00Z',
    updatedAt: '2026-03-20T11:30:00Z'
  },
  {
    id: 'campaign2',
    name: 'Evento de Páscoa',
    subject: 'Celebre a Páscoa conosco!',
    template: '<h1>Evento Especial de Páscoa</h1><p>Participe da nossa celebração.</p>',
    senderName: 'Igreja ADJPA',
    senderEmail: 'eventos@adjpa.com.br',
    status: 'SENT',
    sentAt: '2026-03-25T09:00:00Z',
    completedAt: '2026-03-25T10:45:00Z',
    totalRecipients: 500,
    sentCount: 500,
    deliveredCount: 485,
    failedCount: 15,
    openedCount: 320,
    clickedCount: 180,
    unsubscribedCount: 3,
    metadata: {
      category: 'EVENT',
      tags: ['pascoa', 'evento', 'celebracao'],
      campaignType: 'EVENT' as const
    },
    unitId: 'u-sede',
    createdBy: 'admin',
    createdAt: '2026-03-24T14:00:00Z',
    updatedAt: '2026-03-25T10:45:00Z'
  },
  {
    id: 'campaign3',
    name: 'Campanha de Dízimo',
    subject: 'Sua contribuição faz a diferença',
    template: '<h1>Obrigado pelo seu dízimo!</h1><p>Sua generosidade abençoa muitas vidas.</p>',
    senderName: 'Tesouraria ADJPA',
    senderEmail: 'tesouraria@adjpa.com.br',
    status: 'SENDING',
    totalRecipients: 300,
    sentCount: 180,
    deliveredCount: 175,
    failedCount: 5,
    openedCount: 85,
    clickedCount: 25,
    unsubscribedCount: 1,
    metadata: {
      category: 'DONATION',
      tags: ['dizimo', 'oferta', 'contribuicao'],
      campaignType: 'DONATION' as const
    },
    unitId: 'u-sede',
    createdBy: 'tesoureiro',
    createdAt: '2026-03-26T08:00:00Z',
    updatedAt: '2026-03-26T12:00:00Z'
  },
  {
    id: 'campaign4',
    name: 'Newsletter Mensal',
    subject: 'Notícias e Eventos deste Mês',
    template: '<h1>Newsletter ADJPA</h1><p>Fique por dentro de tudo que acontece.</p>',
    senderName: 'Comunicação ADJPA',
    senderEmail: 'newsletter@adjpa.com.br',
    status: 'DRAFT',
    totalRecipients: 800,
    sentCount: 0,
    deliveredCount: 0,
    failedCount: 0,
    openedCount: 0,
    clickedCount: 0,
    unsubscribedCount: 0,
    metadata: {
      category: 'NEWSLETTER',
      tags: ['newsletter', 'noticias', 'mensal'],
      campaignType: 'NEWSLETTER' as const
    },
    unitId: 'u-sede',
    createdBy: 'admin',
    createdAt: '2026-03-26T10:00:00Z',
    updatedAt: '2026-03-26T10:00:00Z'
  },
  {
    id: 'campaign5',
    name: 'Lembrete de Culto',
    subject: 'Não perca nosso culto deste domingo!',
    template: '<h1>Te esperamos no culto!</h1><p>Domingo às 19h.</p>',
    senderName: 'Igreja ADJPA',
    senderEmail: 'cultos@adjpa.com.br',
    status: 'SCHEDULED',
    scheduledAt: '2026-03-27T18:00:00Z',
    totalRecipients: 200,
    sentCount: 0,
    deliveredCount: 0,
    failedCount: 0,
    openedCount: 0,
    clickedCount: 0,
    unsubscribedCount: 0,
    metadata: {
      category: 'ANNOUNCEMENT',
      tags: ['culto', 'domingo', 'lembrete'],
      campaignType: 'ANNOUNCEMENT' as const
    },
    unitId: 'u-sede',
    createdBy: 'secretaria',
    createdAt: '2026-03-26T11:00:00Z',
    updatedAt: '2026-03-26T11:00:00Z'
  }
];

// Mock de Mensagens SMS
export const MOCK_SMS_MESSAGES: SMSMessage[] = [
  {
    id: 'sms1',
    message: 'Olá João! Bem-vindo à nossa igreja. Estamos felizes em tê-lo conosco! 🙏',
    recipientId: 'm1',
    recipientPhone: '+5511987654321',
    status: 'DELIVERED',
    sentAt: '2026-03-26T10:30:00Z',
    deliveredAt: '2026-03-26T10:31:00Z',
    cost: 0.15,
    segments: 1,
    metadata: {
      campaignId: 'campaign1',
      templateId: 'welcome_sms'
    },
    unitId: 'u-sede',
    createdBy: 'admin',
    createdAt: '2026-03-26T10:30:00Z',
    updatedAt: '2026-03-26T10:31:00Z'
  },
  {
    id: 'sms2',
    message: 'Maria, não se esqueça do culto especial de Páscoa amanhã às 19h! 🐰🙏',
    recipientId: 'm2',
    recipientPhone: '+5511912345678',
    status: 'DELIVERED',
    sentAt: '2026-03-26T14:00:00Z',
    deliveredAt: '2026-03-26T14:01:00Z',
    cost: 0.18,
    segments: 1,
    metadata: {
      campaignId: 'campaign2',
      templateId: 'event_reminder'
    },
    unitId: 'u-sede',
    createdBy: 'admin',
    createdAt: '2026-03-26T14:00:00Z',
    updatedAt: '2026-03-26T14:01:00Z'
  },
  {
    id: 'sms3',
    message: 'Pedro, sua presença é importante no culto de oração desta quarta às 20h. 🙏',
    recipientId: 'm3',
    recipientPhone: '+551199887766',
    status: 'SENT',
    sentAt: '2026-03-26T16:00:00Z',
    cost: 0.16,
    segments: 1,
    metadata: {
      campaignId: 'campaign3',
      templateId: 'prayer_reminder'
    },
    unitId: 'u-sede',
    createdBy: 'admin',
    createdAt: '2026-03-26T16:00:00Z',
    updatedAt: '2026-03-26T16:00:00Z'
  },
  {
    id: 'sms4',
    message: 'Ana, obrigado por sua oferta de hoje! Deus abençoe generosamente! 💰🙏',
    recipientId: 'm4',
    recipientPhone: '+5511977665544',
    status: 'DELIVERED',
    sentAt: '2026-03-26T11:30:00Z',
    deliveredAt: '2026-03-26T11:32:00Z',
    cost: 0.15,
    segments: 1,
    metadata: {
      campaignId: 'campaign1',
      templateId: 'thank_you'
    },
    unitId: 'u-sede',
    createdBy: 'tesoureiro',
    createdAt: '2026-03-26T11:30:00Z',
    updatedAt: '2026-03-26T11:32:00Z'
  },
  {
    id: 'sms5',
    message: 'Lucas, seu aniversário está chegando! Preparamos uma bênção especial para você! 🎂🎉',
    recipientId: 'm5',
    recipientPhone: '+5511966554433',
    status: 'PENDING',
    scheduledAt: '2026-03-27T09:00:00Z',
    cost: 0.20,
    segments: 2,
    metadata: {
      campaignId: 'campaign4',
      templateId: 'birthday_wish'
    },
    unitId: 'u-sede',
    createdBy: 'admin',
    createdAt: '2026-03-26T12:00:00Z',
    updatedAt: '2026-03-26T12:00:00Z'
  },
  {
    id: 'sms6',
    message: 'Juliana, convite especial para o grupo de jovens neste sábado às 15h! 🎉',
    recipientId: 'm6',
    recipientPhone: '+5511955443322',
    status: 'FAILED',
    sentAt: '2026-03-26T13:00:00Z',
    error: 'Número não encontrado',
    cost: 0,
    segments: 1,
    metadata: {
      campaignId: 'campaign2',
      templateId: 'youth_invite'
    },
    unitId: 'u-sede',
    createdBy: 'lider_jovens',
    createdAt: '2026-03-26T13:00:00Z',
    updatedAt: '2026-03-26T13:05:00Z'
  }
];

// Mock de Templates
export const MOCK_TEMPLATES: CommunicationTemplate[] = [
  {
    id: 'template1',
    name: 'Boas Vindas - Email',
    type: 'EMAIL',
    category: 'WELCOME',
    subject: 'Bem-vindo à Igreja ADJPA!',
    content: '<h1>Olá {{nome}}!</h1><p>Seja muito bem-vindo à família ADJPA!</p><p>Estamos felizes em tê-lo conosco.</p>',
    variables: [
      { name: 'nome', type: 'TEXT', required: true, description: 'Nome do membro' },
      { name: 'data', type: 'DATE', required: false, description: 'Data de boas-vindas' }
    ],
    isActive: true,
    usageCount: 150,
    lastUsed: '2026-03-20T10:00:00Z',
    metadata: {
      description: 'Template de boas-vindas para novos membros',
      tags: ['boas_vindas', 'novo_membro'],
      previewText: 'Olá João! Seja bem-vindo...'
    },
    unitId: 'u-sede',
    createdBy: 'admin',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z'
  },
  {
    id: 'template2',
    name: 'Aniversário - SMS',
    type: 'SMS',
    category: 'BIRTHDAY',
    content: 'Feliz aniversário, {{nome}}! Que Deus abençoe ricamente sua vida! 🎂🎉',
    variables: [
      { name: 'nome', type: 'TEXT', required: true, description: 'Nome do aniversariante' },
      { name: 'idade', type: 'NUMBER', required: false, description: 'Idade do aniversariante' }
    ],
    isActive: true,
    usageCount: 45,
    lastUsed: '2026-03-25T09:00:00Z',
    metadata: {
      description: 'Mensagem de aniversário por SMS',
      tags: ['aniversario', 'celebracao'],
      previewText: 'Feliz aniversário, João!'
    },
    unitId: 'u-sede',
    createdBy: 'admin',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-25T09:00:00Z'
  },
  {
    id: 'template3',
    name: 'Lembrete de Culto',
    type: 'EMAIL',
    category: 'EVENT',
    subject: 'Não perca nosso culto!',
    content: '<h1>Nos vemos no culto!</h1><p>Data: {{data}}</p><p>Horário: {{horario}}</p>',
    variables: [
      { name: 'nome', type: 'TEXT', required: true, description: 'Nome do membro' },
      { name: 'data', type: 'DATE', required: true, description: 'Data do culto' },
      { name: 'horario', type: 'TEXT', required: true, description: 'Horário do culto' },
      { name: 'tema', type: 'TEXT', required: false, description: 'Tema do culto' }
    ],
    isActive: true,
    usageCount: 200,
    lastUsed: '2026-03-26T08:00:00Z',
    metadata: {
      description: 'Lembrete de culto semanal',
      tags: ['culto', 'semanal', 'lembrete'],
      previewText: 'Nos vemos no culto!'
    },
    unitId: 'u-sede',
    createdBy: 'secretaria',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-26T08:00:00Z'
  },
  {
    id: 'template4',
    name: 'Agradecimento - Dízimo',
    type: 'EMAIL',
    category: 'DONATION',
    subject: 'Obrigado pela sua contribuição!',
    content: '<h1>Deus abençoe sua generosidade!</h1><p>Obrigado, {{nome}}, pelo seu dízimo de {{valor}}.</p>',
    variables: [
      { name: 'nome', type: 'TEXT', required: true, description: 'Nome do contribuinte' },
      { name: 'valor', type: 'TEXT', required: true, description: 'Valor da contribuição' },
      { name: 'data', type: 'DATE', required: false, description: 'Data da contribuição' }
    ],
    isActive: true,
    usageCount: 320,
    lastUsed: '2026-03-26T11:00:00Z',
    metadata: {
      description: 'Agradecimento por contribuição',
      tags: ['dizimo', 'oferta', 'agradecimento'],
      previewText: 'Deus abençoe sua generosidade!'
    },
    unitId: 'u-sede',
    createdBy: 'tesoureiro',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-26T11:00:00Z'
  }
];

// Mock de Grupos
export const MOCK_GROUPS: CommunicationGroup[] = [
  {
    id: 'group1',
    name: 'Todos os Membros',
    description: 'Grupo com todos os membros ativos da igreja',
    type: 'DYNAMIC',
    memberIds: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'],
    memberCount: 6,
    isActive: true,
    lastUsed: '2026-03-26T10:00:00Z',
    usageCount: 50,
    metadata: {
      tags: ['todos', 'geral'],
      color: '#3B82F6'
    },
    unitId: 'u-sede',
    createdBy: 'admin',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-26T10:00:00Z'
  },
  {
    id: 'group2',
    name: 'Líderes',
    description: 'Grupo com todos os líderes e coordenadores',
    type: 'MANUAL',
    memberIds: ['m2'],
    memberCount: 1,
    isActive: true,
    lastUsed: '2026-03-25T14:00:00Z',
    usageCount: 15,
    metadata: {
      tags: ['lideres', 'coordenadores'],
      color: '#10B981'
    },
    unitId: 'u-sede',
    createdBy: 'admin',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-25T14:00:00Z'
  },
  {
    id: 'group3',
    name: 'Jovens',
    description: 'Grupo com todos os membros jovens (18-30 anos)',
    type: 'SMART',
    criteria: {
      conditions: [
        {
          field: 'age',
          operator: 'GREATER_THAN',
          value: 17,
          type: 'NUMBER'
        },
        {
          field: 'age',
          operator: 'LESS_THAN',
          value: 31,
          type: 'NUMBER'
        }
      ],
      operator: 'AND'
    },
    memberIds: ['m5', 'm6'],
    memberCount: 2,
    isActive: true,
    lastUsed: '2026-03-24T20:00:00Z',
    usageCount: 8,
    metadata: {
      tags: ['jovens', 'juventude'],
      color: '#F59E0B'
    },
    unitId: 'u-sede',
    createdBy: 'lider_jovens',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-24T20:00:00Z'
  },
  {
    id: 'group4',
    name: 'Voluntários',
    description: 'Grupo com todos os membros voluntários ativos',
    type: 'DYNAMIC',
    memberIds: ['m1', 'm3', 'm6'],
    memberCount: 3,
    isActive: true,
    lastUsed: '2026-03-23T19:00:00Z',
    usageCount: 12,
    metadata: {
      tags: ['voluntarios', 'servico'],
      color: '#8B5CF6'
    },
    unitId: 'u-sede',
    createdBy: 'admin',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-23T19:00:00Z'
  }
];

// Mock de Estatísticas
export const MOCK_COMMUNICATION_STATS: CommunicationStats = {
  period: 'MONTH',
  startDate: '2026-03-01T00:00:00Z',
  endDate: '2026-03-26T23:59:59Z',
  totalSent: 1950,
  totalDelivered: 1850,
  totalOpened: 1200,
  totalClicked: 450,
  totalFailed: 100,
  deliveryRate: 94.9,
  openRate: 64.9,
  clickRate: 37.5,
  cost: 25.50,
  byType: {
    email: {
      sent: 1800,
      delivered: 1720,
      opened: 1150,
      clicked: 425,
      failed: 80
    },
    sms: {
      sent: 150,
      delivered: 130,
      failed: 20,
      cost: 25.50
    }
  },
  byCampaign: [
    {
      campaignId: 'campaign1',
      campaignName: 'Boas Vindas - Novos Membros',
      sent: 150,
      delivered: 145,
      opened: 120,
      clicked: 45
    },
    {
      campaignId: 'campaign2',
      campaignName: 'Evento de Páscoa',
      sent: 500,
      delivered: 485,
      opened: 320,
      clicked: 180
    },
    {
      campaignId: 'campaign3',
      campaignName: 'Campanha de Dízimo',
      sent: 180,
      delivered: 175,
      opened: 85,
      clicked: 25
    }
  ]
};
