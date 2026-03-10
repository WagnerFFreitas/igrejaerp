// Serviço de persistência usando localStorage como fallback
export class LocalStorageService {
  private static readonly PREFIX = 'ADJPA_ERP_';

  static save(key: string, data: any): void {
    try {
      const fullKey = this.PREFIX + key;
      const jsonString = JSON.stringify(data);
      localStorage.setItem(fullKey, jsonString);
      console.log(`💾 Dados salvos no localStorage: ${key} (${data.id || 'sem ID'})`);
    } catch (error) {
      console.error(`❌ Erro ao salvar ${key} no localStorage:`, error);
      throw error;
    }
  }

  static getAll(key: string): any[] {
    try {
      const fullKey = this.PREFIX + key;
      const jsonString = localStorage.getItem(fullKey);
      
      if (!jsonString) {
        console.log(`📂 Nenhum dado encontrado no localStorage: ${key}`);
        return [];
      }
      
      const data = JSON.parse(jsonString);
      const dataArray = Array.isArray(data) ? data : [data];
      
      console.log(`📂 Dados carregados do localStorage: ${key} (${dataArray.length} itens)`);
      return dataArray;
    } catch (error) {
      console.error(`❌ Erro ao carregar ${key} do localStorage:`, error);
      return [];
    }
  }

  static clear(key: string): void {
    try {
      const fullKey = this.PREFIX + key;
      localStorage.removeItem(fullKey);
      console.log(`🧹 Dados limpos do localStorage: ${key}`);
    } catch (error) {
      console.error(`❌ Erro ao limpar ${key} do localStorage:`, error);
    }
  }

  static clearAll(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
      keys.forEach(key => localStorage.removeItem(key));
      console.log(`🧹 Todos os dados do ADJPA ERP limpos do localStorage (${keys.length} chaves)`);
    } catch (error) {
      console.error('❌ Erro ao limpar todos os dados:', error);
    }
  }

  static exportData(): string {
    try {
      const allData: any = {};
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
      
      keys.forEach(key => {
        const cleanKey = key.replace(this.PREFIX, '');
        allData[cleanKey] = localStorage.getItem(key);
      });
      
      return JSON.stringify(allData, null, 2);
    } catch (error) {
      console.error('❌ Erro ao exportar dados:', error);
      return '{}';
    }
  }

  static importData(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString);
      
      Object.keys(data).forEach(key => {
        const fullKey = this.PREFIX + key;
        localStorage.setItem(fullKey, data[key]);
      });
      
      console.log('📥 Dados importados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao importar dados:', error);
    }
  }
}

export default LocalStorageService;
