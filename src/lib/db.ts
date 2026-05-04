/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const IDB_NAME = "NoorArabicDB";
const IDB_VER = 4; // Incremented for curriculum support
const STORE_PLANS = "plans";
const STORE_PREFS = "prefs";
const STORE_STUDENTS = "students";
const STORE_ACTIVITIES = "activities";
const STORE_CURRICULUM = "curriculum";

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
      if (!db.objectStoreNames.contains(STORE_STUDENTS)) {
        const res = db.createObjectStore(STORE_STUDENTS, { keyPath: "id" });
        res.createIndex("grade", "grade");
        res.createIndex("classId", "classId");
      }
      if (!db.objectStoreNames.contains(STORE_ACTIVITIES)) {
        const res = db.createObjectStore(STORE_ACTIVITIES, { keyPath: "id" });
        res.createIndex("studentId", "studentId");
        res.createIndex("timestamp", "timestamp");
        res.createIndex("lessonId", "lessonId");
      }
      if (!db.objectStoreNames.contains(STORE_CURRICULUM)) {
        const res = db.createObjectStore(STORE_CURRICULUM, { keyPath: "id" });
        res.createIndex("grade", "grade");
        res.createIndex("subject", "subject");
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
  },

  // Student Methods
  async getStudents(grade?: string): Promise<any[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_STUDENTS, "readonly");
      const store = transaction.objectStore(STORE_STUDENTS);
      const request = grade 
        ? store.index("grade").getAll(grade)
        : store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async saveStudent(student: any): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_STUDENTS, "readwrite");
      const request = transaction.objectStore(STORE_STUDENTS).put(student);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async deleteStudent(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_STUDENTS, "readwrite");
      const request = transaction.objectStore(STORE_STUDENTS).delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // Activity Methods
  async logActivity(log: any): Promise<void> {
    const db = await openDB();
    const transaction = db.transaction([STORE_ACTIVITIES, STORE_STUDENTS], "readwrite");
    
    // 1. Add log
    transaction.objectStore(STORE_ACTIVITIES).add(log);
    
    // 2. Update student points
    const studentStore = transaction.objectStore(STORE_STUDENTS);
    const getReq = studentStore.get(log.studentId);
    
    getReq.onsuccess = () => {
      const student = getReq.result;
      if (student) {
        student.points = (student.points || 0) + log.points;
        student.lastActivityAt = log.timestamp;
        studentStore.put(student);
      }
    };
  },

  async getActivitiesByStudent(studentId: string): Promise<any[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_ACTIVITIES, "readonly");
      const request = transaction.objectStore(STORE_ACTIVITIES).index("studentId").getAll(studentId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async getAllActivities(): Promise<any[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_ACTIVITIES, "readonly");
      const request = transaction.objectStore(STORE_ACTIVITIES).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  // Curriculum Methods
  async getCurriculum(grade?: string): Promise<any[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_CURRICULUM, "readonly");
      const store = transaction.objectStore(STORE_CURRICULUM);
      const request = grade 
        ? store.index("grade").getAll(grade)
        : store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async saveCurriculumBatch(items: any[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_CURRICULUM, "readwrite");
      const store = transaction.objectStore(STORE_CURRICULUM);
      items.forEach(item => store.put(item));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
};
