"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteStore = void 0;
const uuid_1 = require("uuid");
const Deserialisation_1 = __importDefault(require("../client/serialisation/Deserialisation"));
const Serialisation_1 = __importDefault(require("../client/serialisation/Serialisation"));
const Beans_1 = require("./beans/Beans");
const StoreBeanUtils_1 = require("./beans/StoreBeanUtils");
var SubscriberType;
(function (SubscriberType) {
    SubscriberType[SubscriberType["FULL"] = 0] = "FULL";
    SubscriberType[SubscriberType["UPDATE"] = 1] = "UPDATE";
})(SubscriberType || (SubscriberType = {}));
class RemoteStore {
    constructor(websocketManager, serialisationSignatures) {
        this.clientStore = new Map();
        this.subscribers = new Map();
        this.websocketManager = websocketManager;
        this.serialiser = new Serialisation_1.default(serialisationSignatures);
        this.deserialiser = new Deserialisation_1.default(serialisationSignatures);
        [this.unsubscribeUpdateListener, this.unsubscribeDisconnectListener] = this.initRemoteStore();
    }
    initRemoteStore() {
        return [
            this.websocketManager.addListener(Beans_1.CoreMessage.STORE_UPDATE, (payload, _fromSid) => {
                if (payload.initial)
                    this.clear(payload.id);
                this.update(payload.id, payload.payload);
            }),
            this.websocketManager.addListener(Beans_1.CoreMessage.STORE_DISCONNECT, (payload, _fromSid) => {
                payload.ids.forEach((id) => {
                    this.subscribers.delete(id);
                    this.clientStore.delete(id);
                });
            }),
        ];
    }
    releaseRemoteStore() {
        this.unsubscribeUpdateListener();
    }
    openRemoteStore(path, params) {
        const storeId = StoreBeanUtils_1.createStoreId(path, params);
        if (!this.clientStore.has(storeId)) {
            this.clientStore.set(storeId, { data: undefined });
            const payload = {
                path,
                params,
            };
            this.websocketManager.send(Beans_1.CoreMessage.STORE_CONNECT, payload);
        }
    }
    closeRemoteStore(path, params) {
        const storeId = StoreBeanUtils_1.createStoreId(path, params);
        this.clientStore.delete(storeId);
        const payload = {
            path,
            params,
        };
        this.websocketManager.send(Beans_1.CoreMessage.STORE_DISCONNECT, payload);
    }
    getData(path, params) {
        const storeId = StoreBeanUtils_1.createStoreId(path, params);
        if (!this.clientStore.has(storeId))
            return undefined;
        return this.clientStore.get(storeId).data;
    }
    register(path, params, setData, update = false) {
        const storeId = StoreBeanUtils_1.createStoreId(path, params);
        if (!this.subscribers.has(storeId)) {
            this.subscribers.set(storeId, new Map());
        }
        const id = uuid_1.v4();
        const subscriber = {
            type: update ? SubscriberType.UPDATE : SubscriberType.FULL,
            callback: setData,
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
        payload = this.serialiser.serialise(payload);
        const bean = {
            path,
            params,
            payload,
            originId,
        };
        this.websocketManager.send(msg, bean);
    }
    clear(storeId) {
        if (!this.clientStore.has(storeId)) {
            console.log("received data from store " + storeId + " without being subscribed to the store", this.clientStore);
            return;
        }
        this.clientStore.get(storeId).data = undefined;
    }
    update(storeId, data) {
        if (!this.clientStore.has(storeId)) {
            console.error("received data from store " + storeId + " without being subscribed to the store", this.clientStore);
            return;
        }
        const store = this.clientStore.get(storeId);
        const newData = new Map(store.data);
        for (let [key, value] of Object.entries(data)) {
            if (value === null || value === undefined) {
                newData.delete(key);
            }
            else {
                value = this.deserialiser.deserialise(value);
                if (newData.has(key)) {
                    newData.set(key, Object.assign({}, newData.get(key), value));
                }
                else {
                    newData.set(key, value);
                }
            }
        }
        store.data = newData;
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            throw new Error("store has no subscribers");
        const update = new Map();
        if (Array.from(storeSubscribers.values()).some((subscriber) => subscriber.type === SubscriberType.UPDATE)) {
            for (let [key, value] of Object.entries(data)) {
                value = this.deserialiser.deserialise(value);
                update.set(key, value);
            }
        }
        storeSubscribers.forEach((subscriber) => {
            switch (subscriber.type) {
                case SubscriberType.UPDATE:
                    subscriber.callback(update);
                    break;
                case SubscriberType.FULL:
                    subscriber.callback(newData);
                    break;
                default:
                    throw new Error("unknown SubscriberType: " + subscriber.type);
            }
        });
    }
}
exports.RemoteStore = RemoteStore;
//# sourceMappingURL=RemoteStore.js.map