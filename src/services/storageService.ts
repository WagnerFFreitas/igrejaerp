import { createClient, isSupabaseConfigured } from '../../lib/supabase/client';

export class StorageService {
  // Verificar se Storage esta disponivel
  private static isStorageAvailable(): boolean {
    return isSupabaseConfigured() && !!createClient();
  }

  // Upload de arquivo
  static async uploadFile(
    path: string,
    file: File,
    _metadata?: Record<string, string>
  ): Promise<string> {
    console.log("StorageService.uploadFile iniciado");
    console.log("Path:", path);
    console.log("File:", file.name);

    // Se o storage estiver disponivel, tentar upload real
    if (this.isStorageAvailable()) {
      const supabase = createClient()!;
      
      try {
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (error) throw error;

        // Obter URL publica
        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(data.path);

        console.log("Arquivo enviado para Supabase Storage:", publicUrl);
        return publicUrl;
      } catch (error) {
        console.warn("Falha no upload para Supabase Storage, usando fallback base64:", error);
      }
    }

    // Fallback: retornar URL temporaria em base64
    console.warn("Usando upload local (base64)");

    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          console.log("Arquivo convertido para base64:", file.name);
          resolve(result);
        };
        reader.onerror = () => {
          console.error("Erro no FileReader:", reader.error);
          reject(reader.error);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Erro ao converter arquivo:", error);
        reject(error);
      }
    });
  }

  // Upload de foto de perfil
  static async uploadProfilePhoto(
    unitId: string,
    memberId: string,
    file: File
  ): Promise<string> {
    const path = `profiles/${unitId}/${memberId}/avatar.jpg`;
    return this.uploadFile(path, file, { type: 'profile' });
  }

  // Upload de documento de funcionario
  static async uploadEmployeeDocument(
    unitId: string,
    employeeId: string,
    documentType: string,
    file: File
  ): Promise<string> {
    const path = `employees/${unitId}/${employeeId}/${documentType}/${file.name}`;
    return this.uploadFile(path, file, {
      type: 'document',
      documentType,
      employeeId
    });
  }

  // Upload de documento de membro
  static async uploadMemberDocument(
    unitId: string,
    memberId: string,
    documentType: string,
    file: File
  ): Promise<string> {
    const path = `members/${unitId}/${memberId}/${documentType}/${file.name}`;
    return this.uploadFile(path, file, {
      type: 'document',
      documentType,
      memberId
    });
  }

  // Upload de documento financeiro
  static async uploadFinancialDocument(
    unitId: string,
    transactionId: string,
    documentType: string,
    file: File
  ): Promise<string> {
    const path = `financial/${unitId}/${transactionId}/${documentType}/${file.name}`;
    return this.uploadFile(path, file, {
      type: 'financial',
      documentType,
      transactionId
    });
  }

  // Upload de relatorio
  static async uploadReport(
    unitId: string,
    reportType: string,
    fileName: string,
    file: File
  ): Promise<string> {
    const path = `reports/${unitId}/${reportType}/${fileName}`;
    return this.uploadFile(path, file, {
      type: 'report',
      reportType
    });
  }

  // Download de arquivo (obter URL)
  static async getDownloadURL(path: string): Promise<string> {
    if (!this.isStorageAvailable()) return path;

    const supabase = createClient()!;

    try {
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(path);

      return publicUrl;
    } catch (error) {
      console.warn(`Erro ao obter URL de download: ${error}`);
      return path;
    }
  }

  // Deletar arquivo
  static async deleteFile(path: string): Promise<void> {
    if (!this.isStorageAvailable()) return;

    const supabase = createClient()!;

    try {
      const { error } = await supabase.storage
        .from('uploads')
        .remove([path]);

      if (error) throw error;
      console.log("Arquivo deletado:", path);
    } catch (error) {
      console.warn(`Erro ao deletar arquivo: ${error}`);
    }
  }

  // Listar arquivos de um diretorio
  static async listFiles(path: string): Promise<{
    name: string;
    path: string;
    downloadURL: string;
    metadata: {
      size: number;
      contentType: string | undefined;
      timeCreated: string;
      updated: string;
    };
  }[]> {
    if (!this.isStorageAvailable()) return [];

    const supabase = createClient()!;

    try {
      const { data, error } = await supabase.storage
        .from('uploads')
        .list(path);

      if (error) throw error;

      const files = await Promise.all(
        (data || []).map(async (file) => {
          const fullPath = `${path}/${file.name}`;
          const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(fullPath);

          return {
            name: file.name,
            path: fullPath,
            downloadURL: publicUrl,
            metadata: {
              size: file.metadata?.size || 0,
              contentType: file.metadata?.mimetype,
              timeCreated: file.created_at,
              updated: file.updated_at || file.created_at
            }
          };
        })
      );

      return files;
    } catch (error) {
      console.warn(`Erro ao listar arquivos: ${error}`);
      return [];
    }
  }

  // Listar documentos de um funcionario
  static async getEmployeeDocuments(unitId: string, employeeId: string): Promise<{
    name: string;
    path: string;
    downloadURL: string;
    metadata: {
      size: number;
      contentType: string | undefined;
      timeCreated: string;
      updated: string;
    };
  }[]> {
    return this.listFiles(`employees/${unitId}/${employeeId}`);
  }

  // Listar documentos de um membro
  static async getMemberDocuments(unitId: string, memberId: string): Promise<{
    name: string;
    path: string;
    downloadURL: string;
    metadata: {
      size: number;
      contentType: string | undefined;
      timeCreated: string;
      updated: string;
    };
  }[]> {
    return this.listFiles(`members/${unitId}/${memberId}`);
  }

  // Validar tipo de arquivo
  static validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  // Validar tamanho do arquivo (em MB)
  static validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  // Gerar nome de arquivo unico
  static generateUniqueFileName(originalName: string): string {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.');

    return `${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`;
  }

  // Obter metadados do arquivo (simplificado para Supabase)
  static async getFileMetadata(path: string): Promise<{
    size: number;
    contentType: string | undefined;
    timeCreated: string;
    updated: string;
  } | null> {
    if (!this.isStorageAvailable()) return null;

    const supabase = createClient()!;

    try {
      // Supabase nao tem um metodo direto para metadados
      // Usamos list para obter informacoes do arquivo
      const pathParts = path.split('/');
      const fileName = pathParts.pop();
      const dirPath = pathParts.join('/');

      const { data, error } = await supabase.storage
        .from('uploads')
        .list(dirPath);

      if (error) throw error;

      const file = data?.find(f => f.name === fileName);

      if (file) {
        return {
          size: file.metadata?.size || 0,
          contentType: file.metadata?.mimetype,
          timeCreated: file.created_at,
          updated: file.updated_at || file.created_at
        };
      }

      return null;
    } catch (error) {
      console.warn(`Erro ao obter metadados: ${error}`);
      return null;
    }
  }
}

export default StorageService;
