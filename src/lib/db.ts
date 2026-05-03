/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const IDB_NAME = "NoorArabicDB";
const IDB_VER = 2; // Incremented for new features like backups
const STORE_PLANS = "plans";
const STORE_PREFS = "prefs";

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, IDB_VER);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_PLANS)) {
        const store = db.createObjectStore(STORE_PLANS, { 
          keyPath: "id", 
          autoIncrement: true 
        });
        store.createIndex("savedAt", "savedAt");
        store.createIndex("grade", "grade");
        store.createIndex("subject", "subject");
      }
      if (!db.objectStoreNames.contains(STORE_PREFS)) {
        db.createObjectStore(STORE_PREFS, { keyPath: "key" });
      }
    };
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = (event: any) => reject(event.target.error);
  });
}

export const NoorDB = {
  async savePlan(plan: any): Promise<number> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_PLANS, "readwrite");
      const request = transaction.objectStore(STORE_PLANS).add({
        ...plan,
        savedAt: new Date().toISOString()
      });
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  },

  async getPlans(): Promise<any[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_PLANS, "readonly");
      const request = transaction.objectStore(STORE_PLANS).getAll();
      request.onsuccess = () => resolve((request.result || []).reverse());
      request.onerror = () => reject(request.error);
    });
  },

  async deletePlan(id: number): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_PLANS, "readwrite");
      const request = transaction.objectStore(STORE_PLANS).delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getPref(key: string, defaultValue: any = null): Promise<any> {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_PREFS, "readonly");
      const request = transaction.objectStore(STORE_PREFS).get(key);
      request.onsuccess = () => resolve(request.result ? request.result.value : defaultValue);
      request.onerror = () => resolve(defaultValue);
    });
  },

  async setPref(key: string, value: any): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_PREFS, "readwrite");
      const request = transaction.objectStore(STORE_PREFS).put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // NEW: Backup Feature
  async exportData(): Promise<string> {
    const plans = await this.getPlans();
    const profile = await this.getPref("profile");
    return JSON.stringify({ 
      version: IDB_VER,
      exportedAt: new Date().toISOString(),
      plans, 
      profile 
    }, null, 2);
  },

  async importData(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString);
      if (!data.plans || !Array.isArray(data.plans)) throw new Error("Invalid format");
      
      const db = await openDB();
      const transaction = db.transaction(STORE_PLANS, "readwrite");
      const store = transaction.objectStore(STORE_PLANS);
      
      for (const plan of data.plans) {
        // Remove existing ID to avoid collisions or keep if intended
        const { id, ...planData } = plan;
        store.add(planData);
      }
      
      if (data.profile) {
        await this.setPref("profile", data.profile);
      }
    } catch (e) {
      console.error("Import failed:", e);
      throw e;
    }
  }
};
