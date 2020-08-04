"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const StoreBeans_1 = require("./beans/StoreBeans");
const StoreBeanUtils_1 = require("./beans/StoreBeanUtils");
class RemoteStore {
    constructor(websocketManager) {
        this.store = new Map();
        this.subscribers = new Map();
        this.websocketManager = websocketManager;
        this.unsubscribeListener = this.initRemoteStore();
    }
    initRemoteStore() {
        return this.websocketManager.addListener(StoreBeans_1.StoreMessage.STORE_UPDATE, (payload, fromSid) => {
            this.update(payload.id, payload.payload);
        });
    }
    releaseRemoteStore() {
        this.unsubscribeListener();
    }
    openRemoteStore(path) {
        const storeId = StoreBeanUtils_1.createStoreId(path);
        if (!this.store.has(storeId)) {
            this.store.set(storeId, null);
            const payload = {
                path,
            };
            this.websocketManager.send(StoreBeans_1.StoreMessage.CONNECT, payload);
        }
    }
    closeRemoteStore(storeId) {
        this.store.delete(storeId);
        const payload = {
            storeId,
        };
        this.websocketManager.send(StoreBeans_1.StoreMessage.DISCONNECT, payload);
    }
    register(path, setData) {
        const storeId = StoreBeanUtils_1.createStoreId(path);
        if (!this.subscribers.has(storeId)) {
            this.subscribers.set(storeId, new Map());
        }
        const storeSubscribers = this.subscribers.get(storeId);
        const id = uuid_1.v4();
        this.subscribers.get(storeId).set(id, setData);
        this.openRemoteStore(path);
        const returnDeregisterCallback = () => this.deregister(storeId, id);
        return returnDeregisterCallback.bind(this);
    }
    deregister(storeId, id) {
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            return;
        storeSubscribers.delete(id);
        if (storeSubscribers.size === 0) {
            storeSubscribers.delete(storeId);
            this.closeRemoteStore(storeId);
        }
    }
    update(storeId, data) {
        if (!this.store.has(storeId)) {
            console.log("received data from store " + storeId + " without being subscribed to the store");
            return;
        }
        const newStore = new Map(this.store.get(storeId));
        data.forEach((value, key) => {
            if (value === null || value === undefined) {
                newStore.delete(key);
            }
            else {
                if (newStore.has(key)) {
                    newStore.set(key, Object.assign({}, newStore.get(key), value));
                }
                else {
                    newStore.set(key, value);
                }
            }
        });
        this.store.set(storeId, newStore);
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            throw new Error("store has no subscribers");
        storeSubscribers.forEach((setData, id) => {
            setData(newStore);
        });
    }
}
exports.RemoteStore = RemoteStore;
