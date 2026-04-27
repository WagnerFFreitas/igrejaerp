/**
 * ============================================================================
 * APISERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para api service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// =====================================================
// CONFIGURAÇÃO DO CLIENTE HTTP
// =====================================================
// Usa VITE_API_URL do .env em produção.
// Em desenvolvimento, o proxy do Vite redireciona /api → localhost:3000/api,
// portanto a URL relativa '/api' funciona sem CORS.
/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (api service).
 */

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL ||
  (typeof process !== 'undefined' && process.env?.VITE_API_URL) ||
  '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor de requisição: injeta token JWT automaticamente
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de resposta: trata erros globais
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expirado ou inválido → limpa sessão e redireciona
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/';
        }

        if (error.response?.status === 503) {
          console.error('[API] Serviço indisponível — banco de dados pode estar offline.');
        }

        if (!error.response) {
          console.error('[API] Sem resposta do servidor. Verifique se a API está rodando em', API_BASE_URL);
        }

        return Promise.reject(error);
      }
    );
  }

  // =====================================================
  // MÉTODOS HTTP GENÉRICOS
  // =====================================================
  async get<T>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url);
    return response.data;
  }

  // =====================================================
  // MÉTODOS DE AUTENTICAÇÃO
  // =====================================================
  async login(identifier: string, password: string) {
    const response = await this.client.post('/auth/login', {
      email: identifier,
      username: identifier,
      password
    });
    return response.data;
  }

  async register(userData: any) {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async verifyToken() {
    const response = await this.client.get('/auth/verify');
    return response.data;
  }

  async logout() {
    const response = await this.client.post('/auth/logout');
    return response.data;
  }

  async getAuditLogs(params?: { unitId?: string; action?: string; entity?: string; limit?: number }) {
    const response = await this.client.get('/audit', { params });
    return response.data;
  }

  async createAuditLog(data: any) {
    const response = await this.client.post('/audit', data);
    return response.data;
  }

  // =====================================================
  // HEALTH CHECK
  // =====================================================
  async healthCheck() {
    const useRelativeHealth =
      API_BASE_URL === '/api' ||
      API_BASE_URL.startsWith('/api?') ||
      API_BASE_URL.startsWith('/api/');

    const healthUrl = useRelativeHealth
      ? '/health'
      : `${API_BASE_URL.replace(/\/api$/, '')}/health`;

    const response = await axios.get(healthUrl, { timeout: 5000 });
    return response.data;
  }
}

// Exportar instância única (singleton)
const apiClient = new ApiClient();
export default apiClient;

export type { ApiClient };
