/**
 * ============================================================================
 * SERVIÇO DE COMUNICAÇÃO E NOTIFICAÇÕES
 * ============================================================================
 * 
 * Serviço completo para gerenciar comunicação com membros da igreja
 */

import {
  Notification,
  EmailCampaign,
  SMSMessage,
  CommunicationTemplate,
  CommunicationGroup,
  CommunicationStats,
  CommunicationSettings,
  CommunicationHistory,
  MemberCommunicationPreferences,
  NotificationType,
  NotificationStatus,
  NotificationPriority
} from '../types/communication';

class CommunicationService {
  private static readonly STORAGE_KEYS = {
    NOTIFICATIONS: 'communications_notifications',
    EMAIL_CAMPAIGNS: 'communications_email_campaigns',
    SMS_MESSAGES: 'communications_sms_messages',
    TEMPLATES: 'communications_templates',
    GROUPS: 'communications_groups',
    SETTINGS: 'communications_settings',
    HISTORY: 'communications_history',
    PREFERENCES: 'communications_preferences'
  };

  /**
   * Salvar notificação
   */
  static async saveNotification(notification: Partial<Notification>): Promise<void> {
    try {
      const notifications = await this.getNotifications(notification.unitId!);
      const existingIndex = notifications.findIndex(n => n.id === notification.id);
      
      if (existingIndex >= 0) {
        notifications[existingIndex] = {
          ...notifications[existingIndex],
          ...notification,
          updatedAt: new Date().toISOString()
        };
      } else {
        notifications.push({
          ...notification,
          id: notification.id || crypto.randomUUID(),
          status: notification.status || 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Notification);
      }

      await this.saveToStorage(this.STORAGE_KEYS.NOTIFICATIONS, notifications);
      console.log('✅ Notificação salva com sucesso:', notification.id);
    } catch (error) {
      console.error('❌ Erro ao salvar notificação:', error);
      throw error;
    }
  }

  /**
   * Obter notificações
   */
  static async getNotifications(unitId: string): Promise<Notification[]> {
    try {
      const notifications = await this.getFromStorage(this.STORAGE_KEYS.NOTIFICATIONS) || [];
      return notifications.filter((n: Notification) => n.unitId === unitId)
                        .sort((a: Notification, b: Notification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter notificações:', error);
      return [];
    }
  }

  /**
   * Salvar campanha de email
   */
  static async saveEmailCampaign(campaign: Partial<EmailCampaign>): Promise<void> {
    try {
      const campaigns = await this.getEmailCampaigns(campaign.unitId!);
      const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
      
      if (existingIndex >= 0) {
        campaigns[existingIndex] = {
          ...campaigns[existingIndex],
          ...campaign,
          updatedAt: new Date().toISOString()
        };
      } else {
        campaigns.push({
          ...campaign,
          id: campaign.id || crypto.randomUUID(),
          status: campaign.status || 'DRAFT',
          totalRecipients: campaign.totalRecipients || 0,
          sentCount: campaign.sentCount || 0,
          deliveredCount: campaign.deliveredCount || 0,
          failedCount: campaign.failedCount || 0,
          openedCount: campaign.openedCount || 0,
          clickedCount: campaign.clickedCount || 0,
          unsubscribedCount: campaign.unsubscribedCount || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as EmailCampaign);
      }

      await this.saveToStorage(this.STORAGE_KEYS.EMAIL_CAMPAIGNS, campaigns);
      console.log('✅ Campanha de email salva com sucesso:', campaign.id);
    } catch (error) {
      console.error('❌ Erro ao salvar campanha de email:', error);
      throw error;
    }
  }

  /**
   * Obter campanhas de email
   */
  static async getEmailCampaigns(unitId: string): Promise<EmailCampaign[]> {
    try {
      const campaigns = await this.getFromStorage(this.STORAGE_KEYS.EMAIL_CAMPAIGNS) || [];
      
      return campaigns.filter((c: EmailCampaign) => c.unitId === unitId)
                      .sort((a: EmailCampaign, b: EmailCampaign) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter campanhas de email:', error);
      return [];
    }
  }

  /**
   * Salvar mensagem SMS
   */
  static async saveSMSMessage(message: Partial<SMSMessage>): Promise<void> {
    try {
      const messages = await this.getSMSMessages(message.unitId!);
      const existingIndex = messages.findIndex(m => m.id === message.id);
      
      if (existingIndex >= 0) {
        messages[existingIndex] = {
          ...messages[existingIndex],
          ...message,
          updatedAt: new Date().toISOString()
        };
      } else {
        messages.push({
          ...message,
          id: message.id || crypto.randomUUID(),
          status: message.status || 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as SMSMessage);
      }

      await this.saveToStorage(this.STORAGE_KEYS.SMS_MESSAGES, messages);
      console.log('✅ Mensagem SMS salva com sucesso:', message.id);
    } catch (error) {
      console.error('❌ Erro ao salvar mensagem SMS:', error);
      throw error;
    }
  }

  /**
   * Obter mensagens SMS
   */
  static async getSMSMessages(unitId: string): Promise<SMSMessage[]> {
    try {
      const messages = await this.getFromStorage(this.STORAGE_KEYS.SMS_MESSAGES) || [];
      
      return messages.filter((m: SMSMessage) => m.unitId === unitId)
                      .sort((a: SMSMessage, b: SMSMessage) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter mensagens SMS:', error);
      return [];
    }
  }

  /**
   * Salvar template
   */
  static async saveTemplate(template: Partial<CommunicationTemplate>): Promise<void> {
    try {
      const templates = await this.getTemplates(template.unitId!);
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = {
          ...templates[existingIndex],
          ...template,
          updatedAt: new Date().toISOString()
        };
      } else {
        templates.push({
          ...template,
          id: template.id || crypto.randomUUID(),
          isActive: template.isActive !== undefined ? template.isActive : true,
          usageCount: template.usageCount || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as CommunicationTemplate);
      }

      await this.saveToStorage(this.STORAGE_KEYS.TEMPLATES, templates);
      console.log('✅ Template salvo com sucesso:', template.id);
    } catch (error) {
      console.error('❌ Erro ao salvar template:', error);
      throw error;
    }
  }

  /**
   * Obter templates
   */
  static async getTemplates(unitId: string): Promise<CommunicationTemplate[]> {
    try {
      const templates = await this.getFromStorage(this.STORAGE_KEYS.TEMPLATES) || [];
      
      return templates.filter((t: CommunicationTemplate) => t.unitId === unitId)
                      .sort((a: CommunicationTemplate, b: CommunicationTemplate) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('❌ Erro ao obter templates:', error);
      return [];
    }
  }

  /**
   * Salvar grupo
   */
  static async saveGroup(group: Partial<CommunicationGroup>): Promise<void> {
    try {
      const groups = await this.getGroups(group.unitId!);
      const existingIndex = groups.findIndex(g => g.id === group.id);
      
      if (existingIndex >= 0) {
        groups[existingIndex] = {
          ...groups[existingIndex],
          ...group,
          updatedAt: new Date().toISOString()
        };
      } else {
        groups.push({
          ...group,
          id: group.id || crypto.randomUUID(),
          memberCount: group.memberCount || 0,
          isActive: group.isActive !== undefined ? group.isActive : true,
          usageCount: group.usageCount || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as CommunicationGroup);
      }

      await this.saveToStorage(this.STORAGE_KEYS.GROUPS, groups);
      console.log('✅ Grupo salvo com sucesso:', group.id);
    } catch (error) {
      console.error('❌ Erro ao salvar grupo:', error);
      throw error;
    }
  }

  /**
   * Obter grupos
   */
  static async getGroups(unitId: string): Promise<CommunicationGroup[]> {
    try {
      const groups = await this.getFromStorage(this.STORAGE_KEYS.GROUPS) || [];
      
      return groups.filter((g: CommunicationGroup) => g.unitId === unitId)
                      .sort((a: CommunicationGroup, b: CommunicationGroup) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('❌ Erro ao obter grupos:', error);
      return [];
    }
  }

  /**
   * Enviar notificação individual
   */
  static async sendNotification(notification: Partial<Notification>): Promise<void> {
    try {
      // Atualizar status para ENVIANDO
      await this.saveNotification({
        ...notification,
        status: 'PENDING'
      });

      // Simular envio (em produção, integrar com provedor real)
      setTimeout(async () => {
        const success = Math.random() > 0.1; // 90% de sucesso
        
        if (success) {
          await this.saveNotification({
            ...notification,
            status: 'SENT',
            sentAt: new Date().toISOString()
          });

          // Simular entrega após 2 segundos
          setTimeout(async () => {
            await this.saveNotification({
              ...notification,
              status: 'DELIVERED',
              deliveredAt: new Date().toISOString()
            });
          }, 2000);
        } else {
          await this.saveNotification({
            ...notification,
            status: 'FAILED',
            error: 'Falha no envio - servidor indisponível'
          });
        }
      }, 1000);

      console.log('📤 Notificação enviada com sucesso:', notification.id);
    } catch (error) {
      console.error('❌ Erro ao enviar notificação:', error);
      throw error;
    }
  }

  /**
   * Enviar campanha de email
   */
  static async sendEmailCampaign(campaignId: string, unitId: string): Promise<void> {
    try {
      const campaign = await this.getEmailCampaignById(campaignId, unitId);
      if (!campaign) {
        throw new Error('Campanha não encontrada');
      }

      // Atualizar status para ENVIANDO
      await this.saveEmailCampaign({
        ...campaign,
        status: 'SENDING',
        sentAt: new Date().toISOString()
      });

      // Simular envio para cada destinatário
      let sentCount = 0;
      let deliveredCount = 0;
      let failedCount = 0;

      for (let i = 0; i < campaign.totalRecipients; i++) {
        setTimeout(async () => {
          const success = Math.random() > 0.05; // 95% de sucesso
          
          if (success) {
            sentCount++;
            deliveredCount++;
          } else {
            failedCount++;
          }

          await this.saveEmailCampaign({
            ...campaign,
            sentCount,
            deliveredCount,
            failedCount,
            status: i === campaign.totalRecipients - 1 ? 'SENT' : 'SENDING'
          });

          if (i === campaign.totalRecipients - 1) {
            await this.saveEmailCampaign({
              ...campaign,
              status: 'SENT',
              completedAt: new Date().toISOString(),
              sentCount,
              deliveredCount,
              failedCount
            });
          }
        }, i * 100); // 100ms entre cada envio
      }

      console.log('📧 Campanha de email enviada com sucesso:', campaignId);
    } catch (error) {
      console.error('❌ Erro ao enviar campanha de email:', error);
      throw error;
    }
  }

  /**
   * Obter campanha por ID
   */
  static async getEmailCampaignById(id: string, unitId: string): Promise<EmailCampaign | null> {
    try {
      const campaigns = await this.getEmailCampaigns(unitId);
      return campaigns.find(c => c.id === id) || null;
    } catch (error) {
      console.error('❌ Erro ao obter campanha por ID:', error);
      return null;
    }
  }

  /**
   * Gerar estatísticas
   */
  static async generateStats(unitId: string, period: 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR' = 'MONTH'): Promise<CommunicationStats> {
    try {
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'TODAY':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'WEEK':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'MONTH':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'YEAR':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      const notifications = await this.getNotifications(unitId);
      const campaigns = await this.getEmailCampaigns(unitId);
      const messages = await this.getSMSMessages(unitId);

      const filteredNotifications = notifications.filter(n => 
        new Date(n.createdAt) >= startDate
      );
      const filteredCampaigns = campaigns.filter(c => 
        c.sentAt && new Date(c.sentAt) >= startDate
      );
      const filteredMessages = messages.filter(m => 
        new Date(m.createdAt) >= startDate
      );

      const totalSent = filteredNotifications.length + filteredCampaigns.reduce((sum, c) => sum + c.sentCount, 0) + filteredMessages.length;
      const totalDelivered = filteredNotifications.filter(n => n.status === 'DELIVERED').length + 
                           filteredCampaigns.reduce((sum, c) => sum + c.deliveredCount, 0) + 
                           filteredMessages.filter(m => m.status === 'DELIVERED').length;

      return {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totalSent,
        totalDelivered,
        totalOpened: filteredCampaigns.reduce((sum, c) => sum + c.openedCount, 0),
        totalClicked: filteredCampaigns.reduce((sum, c) => sum + c.clickedCount, 0),
        totalFailed: filteredNotifications.filter(n => n.status === 'FAILED').length + 
                     filteredCampaigns.reduce((sum, c) => sum + c.failedCount, 0) + 
                     filteredMessages.filter(m => m.status === 'FAILED').length,
        deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
        openRate: filteredCampaigns.reduce((sum, c) => sum + c.sentCount, 0) > 0 ? 
                 (filteredCampaigns.reduce((sum, c) => sum + c.openedCount, 0) / 
                  filteredCampaigns.reduce((sum, c) => sum + c.sentCount, 0)) * 100 : 0,
        clickRate: filteredCampaigns.reduce((sum, c) => sum + c.openedCount, 0) > 0 ? 
                 (filteredCampaigns.reduce((sum, c) => sum + c.clickedCount, 0) / 
                  filteredCampaigns.reduce((sum, c) => sum + c.openedCount, 0)) * 100 : 0,
        cost: filteredMessages.reduce((sum, m) => sum + (m.cost || 0), 0),
        byType: {
          email: {
            sent: filteredCampaigns.reduce((sum, c) => sum + c.sentCount, 0),
            delivered: filteredCampaigns.reduce((sum, c) => sum + c.deliveredCount, 0),
            opened: filteredCampaigns.reduce((sum, c) => sum + c.openedCount, 0),
            clicked: filteredCampaigns.reduce((sum, c) => sum + c.clickedCount, 0),
            failed: filteredCampaigns.reduce((sum, c) => sum + c.failedCount, 0)
          },
          sms: {
            sent: filteredMessages.length,
            delivered: filteredMessages.filter(m => m.status === 'DELIVERED').length,
            failed: filteredMessages.filter(m => m.status === 'FAILED').length,
            cost: filteredMessages.reduce((sum, m) => sum + (m.cost || 0), 0)
          }
        },
        byCampaign: filteredCampaigns.map(c => ({
          campaignId: c.id,
          campaignName: c.name,
          sent: c.sentCount,
          delivered: c.deliveredCount,
          opened: c.openedCount,
          clicked: c.clickedCount
        }))
      };
    } catch (error) {
      console.error('❌ Erro ao gerar estatísticas:', error);
      throw error;
    }
  }

  /**
   * Métodos de storage
   */
  private static async saveToStorage(key: string, data: any): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('❌ Erro ao salvar no storage:', error);
      throw error;
    }
  }

  private static async getFromStorage(key: string): Promise<any> {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Erro ao obter do storage:', error);
      return [];
    }
  }
}

export default CommunicationService;
