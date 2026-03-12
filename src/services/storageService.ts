import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { storage } from './firebaseService';
import { withTimeout } from '../utils/promiseUtils';

export class StorageService {
  // FORÇAR modo local para evitar Firebase Storage
  private static readonly FORCE_LOCAL_MODE = true;

  // Verificar se Storage está disponível
  private static isStorageAvailable(): boolean {
    return !this.FORCE_LOCAL_MODE && !!storage;
  }

  // Upload de arquivo
  static async uploadFile(
    path: string, 
    file: File, 
    metadata?: any
  ): Promise<string> {
    console.log("🚀 StorageService.uploadFile iniciado");
    console.log("📁 Path:", path);
    console.log("📄 File:", file.name);
    console.log("💾 Force local mode:", this.FORCE_LOCAL_MODE);
    
    // Se o storage estiver disponível e não estivermos em modo forçado, tentar upload real
    if (this.isStorageAvailable()) {
      try {
        const storageRef = ref(storage, path);
        await withTimeout(uploadBytes(storageRef, file, { customMetadata: metadata }), 15000);
        const downloadURL = await withTimeout(getDownloadURL(storageRef), 5000);
        console.log("✅ Arquivo enviado para Firebase Storage:", downloadURL);
        return downloadURL;
      } catch (error) {
        console.warn("⚠️ Falha no upload para Firebase Storage, usando fallback base64:", error);
      }
    }
    
    // SEMPRE usar modo local (base64) como fallback ou se forçado
    console.warn("💾 Usando upload local (base64)");
    
    // Retornar URL temporária em base64
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          console.log("✅ Arquivo convertido para base64:", file.name);
          resolve(result);
        };
        reader.onerror = () => {
          console.error("❌ Erro no FileReader:", reader.error);
          reject(reader.error);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("❌ Erro ao converter arquivo:", error);
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

  // Upload de documento de funcionário
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

  // Upload de relatório
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

  // Download de arquivo
  static async getDownloadURL(path: string): Promise<string> {
    if (!this.isStorageAvailable()) return path;
    try {
      const storageRef = ref(storage, path);
      return await withTimeout(getDownloadURL(storageRef), 8000);
    } catch (error: any) {
      console.warn(`Erro ao obter URL de download: ${error.message}`);
      return path;
    }
  }

  // Deletar arquivo
  static async deleteFile(path: string): Promise<void> {
    if (!this.isStorageAvailable()) return;
    try {
      const storageRef = ref(storage, path);
      await withTimeout(deleteObject(storageRef), 8000);
    } catch (error: any) {
      console.warn(`Erro ao deletar arquivo: ${error.message}`);
    }
  }

  // Listar arquivos de um diretório
  static async listFiles(path: string): Promise<any[]> {
    if (!this.isStorageAvailable()) return [];
    try {
      const storageRef = ref(storage, path);
      const result = await withTimeout(listAll(storageRef), 10000);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          try {
            const downloadURL = await withTimeout(getDownloadURL(itemRef), 5000);
            const metadata = await withTimeout(getMetadata(itemRef), 5000);
            
            return {
              name: itemRef.name,
              path: itemRef.fullPath,
              downloadURL,
              metadata: {
                size: metadata.size,
                contentType: metadata.contentType,
                timeCreated: metadata.timeCreated,
                updated: metadata.updated,
                customMetadata: metadata.customMetadata
              }
            };
          } catch (itemError) {
            console.warn(`Erro ao processar item ${itemRef.name}:`, itemError);
            return null;
          }
        })
      );

      return files.filter(f => f !== null);
    } catch (error: any) {
      console.warn(`Erro ao listar arquivos: ${error.message}`);
      return [];
    }
  }

  // Listar documentos de um funcionário
  static async getEmployeeDocuments(unitId: string, employeeId: string): Promise<any[]> {
    return this.listFiles(`employees/${unitId}/${employeeId}`);
  }

  // Listar documentos de um membro
  static async getMemberDocuments(unitId: string, memberId: string): Promise<any[]> {
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

  // Gerar nome de arquivo único
  static generateUniqueFileName(originalName: string): string {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.');
    
    return `${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`;
  }

  // Obter metadados do arquivo
  static async getFileMetadata(path: string): Promise<any> {
    if (!this.isStorageAvailable()) return null;
    try {
      const storageRef = ref(storage, path);
      return await withTimeout(getMetadata(storageRef), 8000);
    } catch (error: any) {
      console.warn(`Erro ao obter metadados: ${error.message}`);
      return null;
    }
  }
}

export default StorageService;
