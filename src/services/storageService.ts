/**
 * ============================================================================
 * STORAGESERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para storage service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (storage service).
 */

export class StorageService {
  static async upload(file: any) {
    if (!file) {
      return { url: '' };
    }

    const url = await this.fileToDataUrl(file);
    return { url };
  }
  
  static async uploadProfilePhoto(_unitId: string, _entityId: string, file: File) {
    return this.fileToDataUrl(file);
  }

  /**
   * Valida o tamanho do arquivo (em MB)
   */
  static validateFileSize(file: File, maxMB: number): boolean {
    return file.size <= maxMB * 1024 * 1024;
  }

  /**
   * Converte documento para base64 e retorna data URL
   * Os documentos são salvos em profile_data do funcionário
   */
  static async uploadEmployeeDocument(
    _unitId: string,
    _employeeId: string,
    _docType: string,
    file: File
  ): Promise<string> {
    return this.fileToDataUrl(file);
  }

  /**
   * Converte documento de membro para base64
   */
  static async uploadMemberDocument(
    _unitId: string,
    _memberId: string,
    _docType: string,
    file: File
  ): Promise<string> {
    return this.fileToDataUrl(file);
  }

  static async delete(_url: string) {
    return true;
  }

  private static fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
}
