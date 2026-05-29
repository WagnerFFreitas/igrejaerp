/**
 * ============================================================================
 * INDEXEDDBSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para indexed d b service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

type StoreRecord = Record<string, any>;

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (indexed d b service).
 */

export default class IndexedDBService {
  static db: IDBDatabase | null = null;

  private static readonly DB_NAME = 'adjpa_erp';
  private static readonly DB_VERSION = 2;
  private static readonly DEFAULT_STORES = [
    'members',
    'employees',
    'transactions',
    'accounts',
    'assets',
    'leaves',
    'payroll',
    'payroll_periods',
    'units',
    'system_config',
    'system_users',
    'audit_logs'
  ];

  static async init(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;

        for (const storeName of this.DEFAULT_STORES) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = () => {
        reject(request.error ?? new Error('Falha ao abrir IndexedDB'));
      };
    });
  }

  private static async getStore(
    storeName: string,
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBObjectStore> {
    const db = await this.init();

    if (!db.objectStoreNames.contains(storeName)) {
      db.close();
      this.db = null;

      const upgradedDb = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open(this.DB_NAME, db.version + 1);

        request.onupgradeneeded = () => {
          const nextDb = request.result;
          if (!nextDb.objectStoreNames.contains(storeName)) {
            nextDb.createObjectStore(storeName, { keyPath: 'id' });
          }
        };

        request.onsuccess = () => {
          this.db = request.result;
          resolve(this.db);
        };

        request.onerror = () => {
          reject(request.error ?? new Error(`Falha ao criar store ${storeName}`));
        };
      });

      return upgradedDb.transaction(storeName, mode).objectStore(storeName);
    }

    return db.transaction(storeName, mode).objectStore(storeName);
  }

  private static ensureRecordId(data: any): StoreRecord {
    if (data && typeof data === 'object') {
      return {
        ...data,
        id: data.id ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`
      };
    }

    return {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      value: data
    };
  }

  static async save(storeName: string, data: any): Promise<any> {
    const record = this.ensureRecordId(data);
    const store = await this.getStore(storeName, 'readwrite');

    await new Promise<void>((resolve, reject) => {
      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error ?? new Error(`Falha ao salvar em ${storeName}`));
    });

    return record;
  }

  static async get(storeName: string, id: string): Promise<any> {
    if (id === 'all') {
      return this.getAll(storeName);
    }

    const store = await this.getStore(storeName, 'readonly');

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error ?? new Error(`Falha ao buscar ${id} em ${storeName}`));
    });
  }

  static async getAll(storeName: string): Promise<any[]> {
    const store = await this.getStore(storeName, 'readonly');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result ?? []);
      request.onerror = () => reject(request.error ?? new Error(`Falha ao listar ${storeName}`));
    });
  }

  static async delete(storeName: string, id: string): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error ?? new Error(`Falha ao remover ${id} de ${storeName}`));
    });
  }

  static async clear(storeName: string): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');

    await new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error ?? new Error(`Falha ao limpar ${storeName}`));
    });
  }
}
