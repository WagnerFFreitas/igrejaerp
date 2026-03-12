// Serviço de persistência local usando IndexedDB
export class IndexedDBService {
  private static dbName = 'ADJPA_ERP_DB';
  private static version = 5; // Atualizado para versão 5 para garantir criação de todas as tabelas
  private static db: IDBDatabase | null = null;
  private static initPromise: Promise<void> | null = null;

  static async init(): Promise<void> {
    if (IndexedDBService.db) return Promise.resolve();
    if (IndexedDBService.initPromise) return IndexedDBService.initPromise;

    IndexedDBService.initPromise = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        IndexedDBService.initPromise = null;
        reject(new Error('Tempo limite excedido ao abrir o IndexedDB. Verifique se o navegador está bloqueando o acesso ao banco de dados.'));
      }, 10000);

      // Bump version to 5 to trigger upgrade and ensure all stores are created
      IndexedDBService.version = 5;
      const request = indexedDB.open(IndexedDBService.dbName, IndexedDBService.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log(`📝 Atualizando IndexedDB para versão ${IndexedDBService.version}...`);
        
        // Criar stores
        const stores = [
          'members', 'transactions', 'accounts', 'employees', 
          'assets', 'leaves', 'system_users', 'audit_logs', 
          'system_config', 'payroll'
        ];

        stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
            console.log(`📁 Store criado: ${storeName}`);
          }
        });
        
        console.log('📁 IndexedDB stores criados/atualizados');
      };

      request.onerror = () => {
        clearTimeout(timeoutId);
        IndexedDBService.initPromise = null;
        reject(request.error);
      };
      
      request.onsuccess = () => {
        clearTimeout(timeoutId);
        IndexedDBService.db = request.result;
        console.log('✅ IndexedDB inicializado com sucesso');
        IndexedDBService.initPromise = null;
        resolve();
      };
      
      request.onblocked = () => {
        clearTimeout(timeoutId);
        console.warn('⚠️ IndexedDB bloqueado. Feche outras abas do aplicativo e tente novamente.');
        IndexedDBService.initPromise = null;
        reject(new Error('IndexedDB bloqueado por outra aba/janela.'));
      };
    });
    return IndexedDBService.initPromise;
  }

  static async get(storeName: string, id: string): Promise<any | null> {
    try {
      if (!IndexedDBService.db) await IndexedDBService.init();
      if (!IndexedDBService.db) throw new Error('Conexão com IndexedDB não estabelecida');
      
      return new Promise((resolve, reject) => {
        const transaction = IndexedDBService.db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
        
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`❌ IndexedDBService.get error (${storeName}, ${id}):`, error);
      throw error;
    }
  }

  static async save(storeName: string, data: any): Promise<void> {
    try {
      if (!IndexedDBService.db) await IndexedDBService.init();
      if (!IndexedDBService.db) throw new Error('Conexão com IndexedDB não estabelecida');
      
      return new Promise((resolve, reject) => {
        const transaction = IndexedDBService.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
        
        request.onsuccess = () => {
          console.log(`💾 Dado salvo em ${storeName}:`, data.id);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`❌ IndexedDBService.save error (${storeName}):`, error);
      throw error;
    }
  }

  static async getAll(storeName: string): Promise<any[]> {
    try {
      if (!IndexedDBService.db) await IndexedDBService.init();
      if (!IndexedDBService.db) throw new Error('Conexão com IndexedDB não estabelecida');
      
      return new Promise((resolve, reject) => {
        const transaction = IndexedDBService.db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => {
          const data = request.result || [];
          console.log(`📂 Dados carregados de ${storeName}:`, data.length, 'itens');
          resolve(data);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`❌ IndexedDBService.getAll error (${storeName}):`, error);
      throw error;
    }
  }

  static async delete(storeName: string, id: string): Promise<void> {
    try {
      if (!IndexedDBService.db) await IndexedDBService.init();
      if (!IndexedDBService.db) throw new Error('Conexão com IndexedDB não estabelecida');
      
      return new Promise((resolve, reject) => {
        const transaction = IndexedDBService.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        
        request.onsuccess = () => {
          console.log(`🗑️ Dado removido de ${storeName}:`, id);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`❌ IndexedDBService.delete error (${storeName}, ${id}):`, error);
      throw error;
    }
  }

  static async clear(storeName: string): Promise<void> {
    try {
      if (!IndexedDBService.db) await IndexedDBService.init();
      if (!IndexedDBService.db) throw new Error('Conexão com IndexedDB não estabelecida');
      
      return new Promise((resolve, reject) => {
        const transaction = IndexedDBService.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => {
          console.log(`🧹 Store ${storeName} limpo`);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`❌ IndexedDBService.clear error (${storeName}):`, error);
      throw error;
    }
  }
}

export default IndexedDBService;
