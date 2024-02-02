"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteStore = exports.StoreConnectionState = void 0;
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
var StoreConnectionState;
(function (StoreConnectionState) {
    StoreConnectionState[StoreConnectionState["CONNECTING"] = 0] = "CONNECTING";
    StoreConnectionState[StoreConnectionState["CONNECTED"] = 1] = "CONNECTED";
    StoreConnectionState[StoreConnectionState["READY"] = 2] = "READY";
    StoreConnectionState[StoreConnectionState["ERROR"] = 3] = "ERROR";
})(StoreConnectionState || (exports.StoreConnectionState = StoreConnectionState = {}));
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
            this.websocketManager.addListener("store", Beans_1.ServerToClientStoreMessage.UPDATE, (storeBean, _fromSid) => {
                const payload = this.deserialiser.deserialise(storeBean.payload);
                if (payload.initial) {
                    this.clear(storeBean.secondaryId);
                    this.update(storeBean.secondaryId, payload.payload, true /*initial*/);
                }
                else {
                    this.update(storeBean.secondaryId, payload.payload, false /*initial*/);
                }
            }),
            this.websocketManager.addListener("store", Beans_1.ServerToClientStoreMessage.DISCONNECT_FORCEFULLY, (_payload, _fromSid) => {
                // FIXME
                console.error("FORCEFUL DISCONNECT");
                // payload.ids.forEach((id) => {
                //     this.subscribers.delete(id);
                //     this.clientStore.delete(id);
                // });
            }),
            this.websocketManager.addListener("store", Beans_1.ServerToClientStoreMessage.CONNECTED, (storeBean, _fromSid) => {
                //const payload: StoreConnectedBean = this.deserialiser.deserialise(storeBean.payload);
                this.storeConnected(storeBean.secondaryId);
            }),
            this.websocketManager.addListener("store", Beans_1.ServerToClientStoreMessage.CONNECTION_ERROR, (storeBean, _fromSid) => {
                const payload = this.deserialiser.deserialise(storeBean.payload);
                this.storeConnectionError(storeBean.secondaryId, payload.errors);
            }),
        ];
    }
    releaseRemoteStore() {
        this.unsubscribeUpdateListener();
    }
    openRemoteStore(primaryPath, secondaryPath, params) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, secondaryPath, params);
        if (!this.clientStore.has(storeId)) {
            this.clientStore.set(storeId, { data: undefined, meta: { state: StoreConnectionState.CONNECTING, errors: null } });
            const payload = {
                primaryPath,
                secondaryPath,
                parametersJson: this.serialiser.serialise(params)
            };
            this.websocketManager.send("store", Beans_1.ClientToServerStoreMessage.CONNECT, payload);
        }
    }
    closeRemoteStore(primaryPath, secondaryPath, params) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, secondaryPath, params);
        this.clientStore.delete(storeId);
        const payload = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params)
        };
        this.websocketManager.send("store", Beans_1.ClientToServerStoreMessage.DISCONNECT, payload);
    }
    getData(primaryPath, secondaryPath, params) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, secondaryPath, params);
        if (!this.clientStore.has(storeId)) {
            throw new Error("store " + storeId + " does not exist");
        }
        return this.clientStore.get(storeId).data;
    }
    getStoreMeta(primaryPath, secondaryPath, params) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, secondaryPath, params);
        if (!this.clientStore.has(storeId)) {
            throw new Error("store " + storeId + " does not exist");
        }
        return this.clientStore.get(storeId).meta;
    }
    register(primaryPath, secondaryPath, params, setData, setMeta, update = false) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, secondaryPath, params);
        if (!this.subscribers.has(storeId)) {
            this.subscribers.set(storeId, new Map());
        }
        const id = (0, uuid_1.v4)();
        const subscriber = {
            type: update ? SubscriberType.UPDATE : SubscriberType.FULL,
            dataCallback: setData,
            metaCallback: setMeta,
        };
        this.subscribers.get(storeId).set(id, subscriber);
        this.openRemoteStore(primaryPath, secondaryPath, params);
        const returnDeregisterCallback = () => this.deregister(primaryPath, secondaryPath, id, params);
        return returnDeregisterCallback.bind(this);
    }
    deregister(primaryPath, secondaryPath, id, params) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, secondaryPath, params);
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            return;
        storeSubscribers.delete(id);
        if (storeSubscribers.size === 0) {
            storeSubscribers.delete(storeId);
            this.closeRemoteStore(primaryPath, secondaryPath, params);
        }
    }
    updateBean(primaryPath, secondaryPath, params, payload, origin) {
        const storeBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params),
            payloadJson: this.serialiser.serialise(payload),
            origin,
        };
        this.websocketManager.send("store", Beans_1.ClientToServerStoreMessage.UPDATE, storeBean);
    }
    insertBean(primaryPath, secondaryPath, params, payload, origin) {
        const storeBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params),
            payloadJson: this.serialiser.serialise(payload),
            origin,
        };
        this.websocketManager.send("store", Beans_1.ClientToServerStoreMessage.INSERT, storeBean);
    }
    removeBean(primaryPath, secondaryPath, params, key, origin) {
        const storeBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params),
            key,
            origin,
        };
        this.websocketManager.send("store", Beans_1.ClientToServerStoreMessage.REMOVE, storeBean);
    }
    clear(storeId) {
        if (!this.clientStore.has(storeId)) {
            console.log("received data from store " + storeId + " without being subscribed to the store", this.clientStore);
            return;
        }
        this.clientStore.get(storeId).data = undefined;
    }
    storeConnected(storeId) {
        if (!this.clientStore.has(storeId)) {
            console.error("received state from store " + storeId + " without being subscribed to the store", this.clientStore);
            return;
        }
        const store = this.clientStore.get(storeId);
        if (store.data) {
            store.meta = { state: StoreConnectionState.READY, errors: null };
        }
        else {
            store.meta = { state: StoreConnectionState.CONNECTED, errors: null };
        }
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            throw new Error("store has no subscribers");
        storeSubscribers.forEach((subscriber) => {
            subscriber.metaCallback(store.meta);
        });
    }
    storeConnectionError(storeId, errors) {
        if (!this.clientStore.has(storeId)) {
            console.error("received error from store " + storeId + " without being subscribed to the store", this.clientStore);
            return;
        }
        const store = this.clientStore.get(storeId);
        store.meta = { state: StoreConnectionState.ERROR, errors };
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            throw new Error("store has no subscribers");
        storeSubscribers.forEach((subscriber) => {
            subscriber.metaCallback(store.meta);
        });
    }
    update(storeId, data, initial) {
        if (!this.clientStore.has(storeId)) {
            console.error("received data from store " + storeId + " without being subscribed to the store", this.clientStore);
            return;
        }
        const store = this.clientStore.get(storeId);
        if (store.meta.state === StoreConnectionState.ERROR)
            throw new Error("received update from store " + storeId + " but store has error state");
        const newData = new Map(store.data);
        data.forEach((value, key) => {
            if (value === null || value === undefined) {
                newData.delete(key);
            }
            else {
                //value = this.deserialiser.resolve(value); // FIXME
                if (newData.has(key)) {
                    newData.set(key, Object.assign({}, newData.get(key), value));
                }
                else {
                    newData.set(key, value);
                }
            }
        });
        store.data = newData;
        store.meta = { state: StoreConnectionState.READY, errors: null };
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            throw new Error("store has no subscribers");
        const update = new Map();
        if (Array.from(storeSubscribers.values()).some((subscriber) => subscriber.type === SubscriberType.UPDATE)) {
            for (let [key, value] of Object.entries(data)) {
                //value = this.deserialiser.deserialise(value); // FIXME
                update.set(key, value);
            }
        }
        storeSubscribers.forEach((subscriber) => {
            switch (subscriber.type) {
                case SubscriberType.UPDATE:
                    console.log("PARTIAL:", update);
                    subscriber.dataCallback(update);
                    break;
                case SubscriberType.FULL:
                    console.log("FULL:", newData);
                    subscriber.dataCallback(newData);
                    break;
                default:
                    throw new Error("unknown SubscriberType: " + subscriber.type);
            }
        });
        if (initial) {
            storeSubscribers.forEach((subscriber) => {
                subscriber.metaCallback(store.meta);
            });
        }
    }
}
exports.RemoteStore = RemoteStore;
//# sourceMappingURL=RemoteStore.js.map