/**
 * ============================================================================
 * TIPOS PARA SISTEMA DE COMUNICAÇÃO E NOTIFICAÇÕES
 * ============================================================================
 * 
 * Interfaces para gerenciar comunicação com membros da igreja
 */

// Tipos base de notificação
export type NotificationType = 'EMAIL' | 'SMS' | 'PUSH' | 'SYSTEM';
export type NotificationStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

/**
 * Notificação individual
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  scheduledAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  error?: string;
  metadata?: Record<string, any>;
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Campanha de Email
 */
export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template: string;
  senderName: string;
  senderEmail: string;
  replyTo?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'PAUSED' | 'CANCELLED';
  scheduledAt?: string;
  sentAt?: string;
  completedAt?: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  openedCount: number;
  clickedCount: number;
  unsubscribedCount: number;
  attachments?: string[];
  metadata?: {
    category?: string;
    tags?: string[];
    campaignType?: 'NEWSLETTER' | 'ANNOUNCEMENT' | 'EVENT' | 'DONATION' | 'GENERAL';
  };
  unitId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mensagem SMS
 */
export interface SMSMessage {
  id: string;
  message: string;
  recipientId: string;
  recipientPhone: string;
  status: NotificationStatus;
  scheduledAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  cost?: number;
  segments?: number;
  error?: string;
  metadata?: {
    campaignId?: string;
    templateId?: string;
    variables?: Record<string, string>;
  };
  unitId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Template de Comunicação
 */
export interface CommunicationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  category: 'WELCOME' | 'BIRTHDAY' | 'ANNIVERSARY' | 'EVENT' | 'DONATION' | 'NEWSLETTER' | 'CUSTOM';
  subject?: string;
  content: string;
  variables: TemplateVariable[];
  isActive: boolean;
  usageCount: number;
  lastUsed?: string;
  metadata?: {
    description?: string;
    tags?: string[];
    previewText?: string;
  };
  unitId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Variável de Template
 */
export interface TemplateVariable {
  name: string;
  type: 'TEXT' | 'DATE' | 'NUMBER' | 'BOOLEAN' | 'CUSTOM';
  defaultValue?: string;
  required: boolean;
  description?: string;
}

/**
 * Grupo de Comunicação
 */
export interface CommunicationGroup {
  id: string;
  name: string;
  description?: string;
  type: 'MANUAL' | 'DYNAMIC' | 'SMART';
  criteria?: GroupCriteria;
  memberIds: string[];
  memberCount: number;
  isActive: boolean;
  lastUsed?: string;
  usageCount: number;
  metadata?: {
    tags?: string[];
    color?: string;
  };
  unitId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Critérios de Grupo
 */
export interface GroupCriteria {
  conditions: GroupCondition[];
  operator: 'AND' | 'OR';
}

/**
 * Condição de Grupo
 */
export interface GroupCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'NOT_CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN';
  value: any;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'SELECT';
}

/**
 * Estatísticas de Comunicação
 */
export interface CommunicationStats {
  period: 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'CUSTOM';
  startDate: string;
  endDate: string;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalFailed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  cost: number;
  byType: {
    email: {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      failed: number;
    };
    sms: {
      sent: number;
      delivered: number;
      failed: number;
      cost: number;
    };
  };
  byCampaign: Array<{
    campaignId: string;
    campaignName: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }>;
}

/**
 * Configurações de Comunicação
 */
export interface CommunicationSettings {
  id: string;
  unitId: string;
  email: {
    provider: 'SMTP' | 'SENDGRID' | 'MAILGUN' | 'AWS_SES';
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPassword?: string;
    smtpSecure?: boolean;
    sendGridApiKey?: string;
    mailgunApiKey?: string;
    mailgunDomain?: string;
    awsAccessKey?: string;
    awsSecretKey?: string;
    awsRegion?: string;
    fromName: string;
    fromEmail: string;
    replyTo?: string;
    dailyLimit: number;
    hourlyLimit: number;
  };
  sms: {
    provider: 'TWILIO' | 'CLICKATELL' | 'MESSAGEBIRD' | 'LOCAL';
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    twilioPhoneNumber?: string;
    clickatellApiKey?: string;
    messagebirdApiKey?: string;
    localGatewayUrl?: string;
    dailyLimit: number;
    hourlyLimit: number;
  };
  push: {
    enabled: boolean;
    vapidPublicKey?: string;
    vapidPrivateKey?: string;
    serviceWorkerUrl?: string;
  };
  preferences: {
    enableEmailNotifications: boolean;
    enableSmsNotifications: boolean;
    enablePushNotifications: boolean;
    defaultTimeZone: string;
    defaultLanguage: string;
    enableTracking: boolean;
    enableUnsubscribe: boolean;
    enableSpamProtection: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Histórico de Comunicação
 */
export interface CommunicationHistory {
  id: string;
  memberId: string;
  type: NotificationType;
  campaignId?: string;
  templateId?: string;
  title: string;
  content: string;
  status: NotificationStatus;
  sentAt: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  unsubscribedAt?: string;
  error?: string;
  metadata?: Record<string, any>;
  unitId: string;
}

/**
 * Preferências de Comunicação do Membro
 */
export interface MemberCommunicationPreferences {
  id: string;
  memberId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  preferredLanguage: string;
  timeZone: string;
  categories: {
    general: boolean;
    events: boolean;
    donations: boolean;
    newsletters: boolean;
    prayerRequests: boolean;
    announcements: boolean;
    birthdays: boolean;
    reminders: boolean;
  };
  unsubscribeReason?: string;
  unsubscribedAt?: string;
  unitId: string;
  createdAt: string;
  updatedAt: string;
}
