"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteStore = void 0;
const uuid_1 = require("uuid");
const Beans_1 = require("./beans/Beans");
const StoreBeanUtils_1 = require("./beans/StoreBeanUtils");
var SubscriberType;
(function (SubscriberType) {
    SubscriberType[SubscriberType["FULL"] = 0] = "FULL";
    SubscriberType[SubscriberType["UPDATE"] = 1] = "UPDATE";
})(SubscriberType || (SubscriberType = {}));
class RemoteStore {
    constructor(websocketManager) {
        this.store = new Map();
        this.subscribers = new Map();
        this.websocketManager = websocketManager;
        [this.unsubscribeUpdateListener, this.unsubscribeDisconnectListener] = this.initRemoteStore();
    }
    initRemoteStore() {
        return [this.websocketManager.addListener(Beans_1.CoreMessage.STORE_UPDATE, (payload, _fromSid) => {
                if (payload.initial)
                    this.clear(payload.id);
                this.update(payload.id, payload.payload);
            }),
            this.websocketManager.addListener(Beans_1.CoreMessage.STORE_DISCONNECT, (payload, _fromSid) => {
                payload.ids.forEach(id => {
                    this.subscribers.delete(id);
                    this.store.delete(id);
                });
            })
        ];
    }
    releaseRemoteStore() {
        this.unsubscribeUpdateListener();
    }
    openRemoteStore(path, params) {
        const storeId = StoreBeanUtils_1.createStoreId(path, params);
        if (!this.store.has(storeId)) {
            this.store.set(storeId, undefined);
            const payload = {
                path,
                params
            };
            this.websocketManager.send(Beans_1.CoreMessage.STORE_CONNECT, payload);
        }
    }
    closeRemoteStore(path, params) {
        const storeId = StoreBeanUtils_1.createStoreId(path, params);
        this.store.delete(storeId);
        const payload = {
            path,
            params
        };
        this.websocketManager.send(Beans_1.CoreMessage.STORE_DISCONNECT, payload);
    }
    getData(path, params) {
        const storeId = StoreBeanUtils_1.createStoreId(path, params);
        if (!this.store.has(storeId))
            return undefined;
        return this.store.get(storeId);
    }
    register(path, params, setData, update = false) {
        const storeId = StoreBeanUtils_1.createStoreId(path, params);
        if (!this.subscribers.has(storeId)) {
            this.subscribers.set(storeId, new Map());
        }
        const id = uuid_1.v4();
        const subscriber = {
            type: update ? SubscriberType.UPDATE : SubscriberType.FULL,
            callback: setData
        };
        this.subscribers.get(storeId).set(id, subscriber);
        this.openRemoteStore(path, params);
        const returnDeregisterCallback = () => this.deregister(path, id, params);
        return returnDeregisterCallback.bind(this);
    }
    deregister(path, id, params) {
        const storeId = StoreBeanUtils_1.createStoreId(path, params);
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            return;
        storeSubscribers.delete(id);
        if (storeSubscribers.size === 0) {
            storeSubscribers.delete(storeId);
            this.closeRemoteStore(path, params);
        }
    }
    editRemoteStore(msg, path, params, payload, originId) {
        const bean = {
            path,
            params,
            payload,
            originId
        };
        this.websocketManager.send(msg, bean);
    }
    clear(storeId) {
        if (!this.store.has(storeId)) {
            console.log("received data from store " + storeId + " without being subscribed to the store", this.store);
            return;
        }
        this.store.set(storeId, undefined);
    }
    update(storeId, data) {
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
        const update = new Map();
        if (Array.from(storeSubscribers.values()).some(subscriber => subscriber.type === SubscriberType.UPDATE)) {
            for (const [key, value] of Object.entries(data)) {
                update.set(key, value);
            }
        }
        storeSubscribers.forEach((subscriber) => {
            switch (subscriber.type) {
                case SubscriberType.UPDATE:
                    subscriber.callback(update);
                    break;
                case SubscriberType.FULL:
                    subscriber.callback(newStore);
                    break;
                default: throw new Error("unknown SubscriberType: " + subscriber.type);
            }
        });
    }
}
exports.RemoteStore = RemoteStore;
//# sourceMappingURL=RemoteStore.js.map