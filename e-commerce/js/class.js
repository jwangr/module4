class IndexedDBHelper {
    constructor(dbName, storeName, version = 1) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.version = version;
        this.db = null;
    }

    async init(keyPath = 'id', autoIncrement = true) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath, autoIncrement });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(true);
            };

            request.onerror = (event) => {
                reject(`IndexedDB error: ${event.target.errorCode}`);
            };
        });
    }

    _getStore(mode = 'readonly') {
        const tx = this.db.transaction(this.storeName, mode);
        return tx.objectStore(this.storeName);
    }

    async add(item) {
        return new Promise((resolve, reject) => {
            const store = this._getStore('readwrite');
            const request = store.add(item);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async get(key) {
        return new Promise((resolve, reject) => {
            const store = this._getStore();
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll() {
        return new Promise((resolve, reject) => {
            const store = this._getStore();
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async update(item) {
        return new Promise((resolve, reject) => {
            const store = this._getStore('readwrite');
            const request = store.put(item);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(key) {
        return new Promise((resolve, reject) => {
            const store = this._getStore('readwrite');
            const request = store.delete(key);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async clear() {
        return new Promise((resolve, reject) => {
            const store = this._getStore('readwrite');
            const request = store.clear();
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
}
