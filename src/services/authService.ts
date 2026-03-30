import { createClient, isSupabaseConfigured } from '../../lib/supabase/client';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  unitId: string;
  role: 'admin' | 'manager' | 'employee' | 'member';
  employeeId?: string;
  memberId?: string;
  isActive: boolean;
  createdAt: string;
}

// Cache do perfil do usuário
let cachedProfile: UserProfile | null = null;

export class AuthService {
  // Login
  static async login(email: string, password: string): Promise<UserProfile> {
    const supabase = createClient();
    
    if (!supabase) {
      throw new Error('Supabase não configurado. Verifique suas variáveis de ambiente.');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(this.translateError(error.message));
      }

      if (!data.user) {
        throw new Error('Usuário não encontrado');
      }

      // Buscar perfil do usuário na tabela system_users
      const { data: profile, error: profileError } = await supabase
        .from('system_users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Perfil do usuário não encontrado');
      }

      const userProfile: UserProfile = {
        uid: profile.id,
        email: profile.email,
        displayName: profile.display_name,
        unitId: profile.unit_id,
        role: profile.role,
        employeeId: profile.employee_id || undefined,
        memberId: profile.member_id || undefined,
        isActive: profile.is_active,
        createdAt: profile.created_at
      };

      cachedProfile = userProfile;
      return userProfile;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  }

  // Cadastro de novo usuário
  static async signUp(
    email: string, 
    password: string, 
    displayName: string, 
    unitId: string,
    role: 'admin' | 'manager' | 'employee' | 'member' = 'member'
  ): Promise<UserProfile> {
    const supabase = createClient();
    
    if (!supabase) {
      throw new Error('Supabase não configurado.');
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            unit_id: unitId,
            role: role
          }
        }
      });

      if (error) {
        throw new Error(this.translateError(error.message));
      }

      if (!data.user) {
        throw new Error('Erro ao criar usuário');
      }

      // Criar perfil na tabela system_users
      const { error: profileError } = await supabase
        .from('system_users')
        .insert({
          id: data.user.id,
          email: email,
          display_name: displayName,
          unit_id: unitId,
          role: role,
          is_active: true
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        // Não lança erro pois o usuário foi criado - trigger pode criar o perfil
      }

      return {
        uid: data.user.id,
        email: email,
        displayName: displayName,
        unitId: unitId,
        role: role,
        isActive: true,
        createdAt: new Date().toISOString()
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  }

  // Logout
  static async logout(): Promise<void> {
    const supabase = createClient();
    
    if (!supabase) {
      cachedProfile = null;
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      cachedProfile = null;
      
      if (error) {
        throw new Error(this.translateError(error.message));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  }

  // Observar mudanças de autenticação
  static onAuthStateChange(callback: (user: UserProfile | null) => void): () => void {
    const supabase = createClient();
    
    if (!supabase) {
      callback(null);
      return () => {};
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('system_users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              const userProfile: UserProfile = {
                uid: profile.id,
                email: profile.email,
                displayName: profile.display_name,
                unitId: profile.unit_id,
                role: profile.role,
                employeeId: profile.employee_id || undefined,
                memberId: profile.member_id || undefined,
                isActive: profile.is_active,
                createdAt: profile.created_at
              };
              cachedProfile = userProfile;
              callback(userProfile);
            } else {
              callback(null);
            }
          } catch {
            callback(null);
          }
        } else {
          cachedProfile = null;
          callback(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }

  // Atualizar perfil
  static async updateProfile(data: Partial<UserProfile>): Promise<void> {
    const supabase = createClient();
    
    if (!supabase) {
      throw new Error('Supabase não configurado.');
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Atualizar perfil na tabela system_users
      const updateData: Record<string, unknown> = {};
      if (data.displayName) updateData.display_name = data.displayName;
      if (data.unitId) updateData.unit_id = data.unitId;
      if (data.role) updateData.role = data.role;
      if (data.employeeId !== undefined) updateData.employee_id = data.employeeId;
      if (data.memberId !== undefined) updateData.member_id = data.memberId;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { error } = await supabase
        .from('system_users')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        throw new Error(`Erro ao atualizar perfil: ${error.message}`);
      }

      // Atualizar cache
      if (cachedProfile) {
        cachedProfile = { ...cachedProfile, ...data };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  }

  // Resetar senha
  static async resetPassword(email: string): Promise<void> {
    const supabase = createClient();
    
    if (!supabase) {
      throw new Error('Supabase não configurado.');
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw new Error(this.translateError(error.message));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  }

  // Verificar se usuário é admin
  static isAdmin(user: UserProfile): boolean {
    return user.role === 'admin';
  }

  // Verificar permissão de unidade
  static hasUnitAccess(user: UserProfile, unitId: string): boolean {
    return user.unitId === unitId || user.role === 'admin';
  }

  // Obter usuário atual
  static async getCurrentUser(): Promise<User | null> {
    const supabase = createClient();
    
    if (!supabase) {
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Obter perfil do usuário atual
  static async getCurrentProfile(): Promise<UserProfile | null> {
    if (cachedProfile) {
      return cachedProfile;
    }

    const supabase = createClient();
    
    if (!supabase) {
      return null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data: profile } = await supabase
        .from('system_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        cachedProfile = {
          uid: profile.id,
          email: profile.email,
          displayName: profile.display_name,
          unitId: profile.unit_id,
          role: profile.role,
          employeeId: profile.employee_id || undefined,
          memberId: profile.member_id || undefined,
          isActive: profile.is_active,
          createdAt: profile.created_at
        };
        return cachedProfile;
      }

      return null;
    } catch {
      return null;
    }
  }

  // Verificar se está autenticado
  static async isAuthenticated(): Promise<boolean> {
    const supabase = createClient();
    
    if (!supabase) {
      return false;
    }

    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }

  // Verificar se Supabase está configurado
  static isConfigured(): boolean {
    return isSupabaseConfigured();
  }

  // Traduzir mensagens de erro do Supabase
  private static translateError(message: string): string {
    const translations: Record<string, string> = {
      'Invalid login credentials': 'E-mail ou senha incorretos',
      'Email not confirmed': 'E-mail não confirmado. Verifique sua caixa de entrada.',
      'User already registered': 'Este e-mail já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Invalid email': 'E-mail inválido',
      'Signups not allowed for this instance': 'Cadastros não permitidos nesta instância',
      'Email rate limit exceeded': 'Limite de e-mails excedido. Tente novamente mais tarde.',
      'For security purposes, you can only request this once every 60 seconds': 
        'Por segurança, você só pode solicitar isso uma vez a cada 60 segundos'
    };

    return translations[message] || message;
  }
}

export default AuthService;
