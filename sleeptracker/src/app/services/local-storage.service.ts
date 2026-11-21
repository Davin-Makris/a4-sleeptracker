import { Injectable } from '@angular/core';

interface StoredValue<T> {
  key: string;
  value: T;
}

@Injectable({
  providedIn: 'root',
})
export class SleepStorageService {
  private readonly database: Promise<IDBDatabase>;

  constructor() {
    this.database = this.create();
  }

  private create(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('sleep-tracker', 1);

      request.onupgradeneeded = () => {
        const database = request.result;

        if (!database.objectStoreNames.contains('sleep-data')) {
          database.createObjectStore('sleep-data', {
            keyPath: 'key',
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public async set<T>(key: string, value: T): Promise<void> {
    const database = await this.database;

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        'sleep-data',
        'readwrite'
      );

      transaction.objectStore('sleep-data').put({
        key,
        value,
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  public async get<T>(key: string): Promise<T | undefined> {
    const database = await this.database;

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        'sleep-data',
        'readonly'
      );

      const request = transaction
        .objectStore('sleep-data')
        .get(key);

      request.onsuccess = () => {
        const result = request.result as StoredValue<T> | undefined;
        resolve(result?.value);
      };

      request.onerror = () => reject(request.error);
    });
  }

  public async reset(): Promise<void> {
    const database = await this.database;

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        'sleep-data',
        'readwrite'
      );

      transaction.objectStore('sleep-data').clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}