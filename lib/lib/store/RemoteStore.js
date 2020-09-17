"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const StoreBeans_1 = require("./beans/StoreBeans");
const StoreBeanUtils_1 = require("./beans/StoreBeanUtils");
class RemoteStore {
    constructor(websocketManager) {
        console.log("CONSTRUCTING REMOTE STORE");
        this.store = new Map();
        this.subscribers = new Map();
        this.websocketManager = websocketManager;
        this.unsubscribeListener = this.initRemoteStore();
    }
    initRemoteStore() {
        console.log("INIT REMOTE STORE");
        return this.websocketManager.addListener(StoreBeans_1.StoreMessage.STORE_UPDATE, (payload, fromSid) => {
            this.update(payload.id, payload.payload, this.store);
        });
    }
    releaseRemoteStore() {
        this.unsubscribeListener();
    }
    openRemoteStore(path) {
        console.log("opening remote store ", path);
        const storeId = StoreBeanUtils_1.createStoreId(path);
        if (!this.store.has(storeId)) {
            this.store.set(storeId, undefined);
            const payload = {
                path,
            };
            this.websocketManager.send(StoreBeans_1.StoreMessage.CONNECT, payload);
        }
        console.log("after opening: ", this.store);
    }
    closeRemoteStore(path) {
        console.log("closing remote store ", path);
        const storeId = StoreBeanUtils_1.createStoreId(path);
        this.store.delete(storeId);
        const payload = {
            path,
        };
        this.websocketManager.send(StoreBeans_1.StoreMessage.DISCONNECT, payload);
    }
    getData(path) {
        console.log("getting store data", path);
        const storeId = StoreBeanUtils_1.createStoreId(path);
        if (!this.store.has(storeId))
            return undefined;
        return this.store.get(storeId);
    }
    register(path, setData) {
        console.log("registering store ", path);
        const storeId = StoreBeanUtils_1.createStoreId(path);
        if (!this.subscribers.has(storeId)) {
            this.subscribers.set(storeId, new Map());
        }
        const storeSubscribers = this.subscribers.get(storeId);
        const id = uuid_1.v4();
        this.subscribers.get(storeId).set(id, setData);
        this.openRemoteStore(path);
        const returnDeregisterCallback = () => this.deregister(path, id);
        console.log("after registering: ", this.store);
        return returnDeregisterCallback.bind(this);
    }
    deregister(path, id) {
        console.log("deregistering store ", path);
        const storeId = StoreBeanUtils_1.createStoreId(path);
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            return;
        storeSubscribers.delete(id);
        if (storeSubscribers.size === 0) {
            storeSubscribers.delete(storeId);
            this.closeRemoteStore(path);
        }
    }
    update(storeId, data, lol) {
        console.log("updating id ", storeId, "data", data);
        if (!this.store.has(storeId)) {
            console.log("received data from store " + storeId + " without being subscribed to the store", this.store);
            return;
        }
        const newStore = new Map(this.store.get(storeId));
        for (const [key, value] of Object.entries(data)) {
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
        }
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
