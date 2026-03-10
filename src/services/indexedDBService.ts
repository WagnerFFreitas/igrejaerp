// Serviço de persistência local usando IndexedDB
export class IndexedDBService {
  private static dbName = 'ADJPA_ERP_DB';
  private static version = 3; // Atualizado para versão 3 para incluir audit_logs
  private static db: IDBDatabase | null = null;

  static async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB inicializado com sucesso');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log(`📝 Atualizando IndexedDB para versão ${this.version}...`);
        
        // Criar stores
        if (!db.objectStoreNames.contains('members')) {
          db.createObjectStore('members', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('transactions')) {
          db.createObjectStore('transactions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('accounts')) {
          db.createObjectStore('accounts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('assets')) {
          db.createObjectStore('assets', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('leaves')) {
          db.createObjectStore('leaves', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('system_users')) {
          db.createObjectStore('system_users', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('audit_logs')) {
          db.createObjectStore('audit_logs', { keyPath: 'id' });
        }
        
        console.log('📁 IndexedDB stores criados');
      };
    });
  }

  static async save(storeName: string, data: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => {
        console.log(`💾 Dado salvo em ${storeName}:`, data.id);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  static async getAll(storeName: string): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const data = request.result || [];
        console.log(`📂 Dados carregados de ${storeName}:`, data.length, 'itens');
        resolve(data);
      };
      request.onerror = () => reject(request.error);
    });
  }

  static async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        console.log(`🗑️ Dado removido de ${storeName}:`, id);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  static async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => {
        console.log(`🧹 Store ${storeName} limpo`);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export default IndexedDBService;
