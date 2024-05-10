"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteStore = exports.StoreConnectionState = void 0;
const uuid_1 = require("uuid");
const ClientToServerCoreBeanBuilder_1 = require("../client/ClientToServerCoreBeanBuilder");
const Deserialisation_1 = __importDefault(require("../client/serialisation/Deserialisation"));
const Serialisation_1 = __importDefault(require("../client/serialisation/Serialisation"));
const Beans_1 = require("./beans/Beans");
const StoreBeanUtils_1 = require("./beans/StoreBeanUtils");
const VALIDATION_TIMEOUT = 20;
var SubscriberType;
(function (SubscriberType) {
    SubscriberType[SubscriberType["FULL"] = 0] = "FULL";
    SubscriberType[SubscriberType["UPDATE"] = 1] = "UPDATE";
})(SubscriberType || (SubscriberType = {}));
var StoreConnectionState;
(function (StoreConnectionState) {
    StoreConnectionState[StoreConnectionState["UNKNOWN"] = 0] = "UNKNOWN";
    StoreConnectionState[StoreConnectionState["CONNECTING"] = 1] = "CONNECTING";
    StoreConnectionState[StoreConnectionState["CONNECTED"] = 2] = "CONNECTED";
    StoreConnectionState[StoreConnectionState["READY"] = 3] = "READY";
    StoreConnectionState[StoreConnectionState["ERROR"] = 4] = "ERROR";
    StoreConnectionState[StoreConnectionState["ACCESS_DENIED"] = 5] = "ACCESS_DENIED";
})(StoreConnectionState || (exports.StoreConnectionState = StoreConnectionState = {}));
class RemoteStore {
    constructor(websocketManager, serialisationSignatures) {
        this.clientStore = new Map();
        this.subscribers = new Map();
        this.websocketManager = websocketManager;
        this.serialiser = new Serialisation_1.default(serialisationSignatures);
        this.deserialiser = new Deserialisation_1.default(serialisationSignatures);
        this.transactionCallbacks = new Map();
        [this.unsubscribeUpdateListener, this.unsubscribeDisconnectListener, this.connectedListener, this.connectionErrorListener, this.validationListener] = this.initRemoteStore();
    }
    initRemoteStore() {
        return [
            this.websocketManager.addListener(Beans_1.IOCoreEndpoints.STORE, Beans_1.ServerToClientStoreMessage.UPDATE, (coreBean) => {
                const storeBean = coreBean.payload;
                const payload = this.deserialiser.deserialise(storeBean.payload);
                if (payload.initial) {
                    this.clear(storeBean.secondaryId);
                    this.update(storeBean.secondaryId, payload.payload, true /*initial*/);
                }
                else {
                    this.update(storeBean.secondaryId, payload.payload, false /*initial*/);
                }
            }),
            this.websocketManager.addListener(Beans_1.IOCoreEndpoints.STORE, Beans_1.ServerToClientStoreMessage.DISCONNECT_FORCEFULLY, (_coreBean) => {
                // FIXME
                console.error("FORCEFUL DISCONNECT");
                // payload.ids.forEach((id) => {
                //     this.subscribers.delete(id);
                //     this.clientStore.delete(id);
                // });
            }),
            this.websocketManager.addListener(Beans_1.IOCoreEndpoints.STORE, Beans_1.ServerToClientStoreMessage.CONNECTED, (coreBean) => {
                const storeBean = coreBean.payload;
                //const payload: StoreConnectedBean = this.deserialiser.deserialise(storeBean.payload);
                this.storeConnected(storeBean.secondaryId);
            }),
            this.websocketManager.addListener(Beans_1.IOCoreEndpoints.STORE, Beans_1.ServerToClientStoreMessage.CONNECTION_ERROR, (coreBean) => {
                const storeBean = coreBean.payload;
                const payload = this.deserialiser.deserialise(storeBean.payload);
                this.storeConnectionError(storeBean.secondaryId, payload);
            }),
            this.websocketManager.addListener(Beans_1.IOCoreEndpoints.STORE, Beans_1.ServerToClientStoreMessage.VALIDATION, (coreBean) => {
                const storeBean = coreBean.payload;
                const payload = this.deserialiser.deserialise(storeBean.payload);
                this.storeValidation(storeBean.secondaryId, payload);
            }),
        ];
    }
    releaseRemoteStore() {
        this.unsubscribeUpdateListener();
    }
    openRemoteStore(primaryPath, secondaryPath, params, optional) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, secondaryPath, params);
        if (!this.clientStore.has(storeId)) {
            this.clientStore.set(storeId, { data: undefined, meta: { state: StoreConnectionState.CONNECTING, errors: null, optional } });
            const payload = {
                primaryPath,
                secondaryPath,
                parametersJson: this.serialiser.serialise(params)
            };
            this.websocketManager.send((0, ClientToServerCoreBeanBuilder_1.clientToServerCoreBeanBuilder)()
                .endpoint(Beans_1.IOCoreEndpoints.STORE)
                .message(Beans_1.ClientToServerStoreMessage.CONNECT)
                .payload(payload)
                .build());
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
        this.websocketManager.send((0, ClientToServerCoreBeanBuilder_1.clientToServerCoreBeanBuilder)()
            .endpoint(Beans_1.IOCoreEndpoints.STORE)
            .message(Beans_1.ClientToServerStoreMessage.DISCONNECT)
            .payload(payload)
            .build());
    }
    getData(primaryPath, secondaryPath, params) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, secondaryPath, params);
        if (!this.clientStore.has(storeId)) {
            return undefined;
        }
        return this.clientStore.get(storeId).data;
    }
    getStoreMeta(primaryPath, secondaryPath, params, initialOptional) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, secondaryPath, params);
        if (!this.clientStore.has(storeId)) {
            return { state: StoreConnectionState.UNKNOWN, errors: null, optional: initialOptional !== null && initialOptional !== void 0 ? initialOptional : false };
        }
        return this.clientStore.get(storeId).meta;
    }
    register(primaryPath, secondaryPath, params, setData, setMeta, update, optional) {
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
        this.openRemoteStore(primaryPath, secondaryPath, params, optional);
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
    createTransactionId() {
        let tid = null;
        do {
            tid = (0, uuid_1.v4)();
            if (this.transactionCallbacks.has(tid)) {
                tid = null;
            }
        } while (tid === null);
        return tid;
    }
    addValidationCallback(transactionId, validationCallback) {
        const cb = (state, action, validation) => {
            this.transactionCallbacks.delete(transactionId);
            validationCallback(state, action, validation);
        };
        const callbackWithTimeout = (0, StoreBeanUtils_1.valdiationCallbackWithTimeout)(VALIDATION_TIMEOUT, cb);
        this.transactionCallbacks.set(transactionId, callbackWithTimeout);
    }
    updateBean(primaryPath, secondaryPath, params, payload, validationCallback) {
        const transactionId = this.createTransactionId();
        const storeBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params),
            payloadJson: this.serialiser.serialise(payload),
            transactionId,
        };
        if (validationCallback)
            this.addValidationCallback(transactionId, validationCallback);
        this.websocketManager.send((0, ClientToServerCoreBeanBuilder_1.clientToServerCoreBeanBuilder)()
            .endpoint(Beans_1.IOCoreEndpoints.STORE)
            .message(Beans_1.ClientToServerStoreMessage.UPDATE)
            .payload(storeBean)
            .build());
    }
    insertBean(primaryPath, secondaryPath, params, payload, validationCallback) {
        const transactionId = this.createTransactionId();
        const storeBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params),
            payloadJson: this.serialiser.serialise(payload),
            transactionId,
        };
        if (validationCallback)
            this.addValidationCallback(transactionId, validationCallback);
        this.websocketManager.send((0, ClientToServerCoreBeanBuilder_1.clientToServerCoreBeanBuilder)()
            .endpoint(Beans_1.IOCoreEndpoints.STORE)
            .message(Beans_1.ClientToServerStoreMessage.INSERT)
            .payload(storeBean)
            .build());
    }
    removeBean(primaryPath, secondaryPath, params, key, validationCallback) {
        const transactionId = this.createTransactionId();
        const storeBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params),
            key,
            transactionId,
        };
        if (validationCallback)
            this.addValidationCallback(transactionId, validationCallback);
        this.websocketManager.send((0, ClientToServerCoreBeanBuilder_1.clientToServerCoreBeanBuilder)()
            .endpoint(Beans_1.IOCoreEndpoints.STORE)
            .message(Beans_1.ClientToServerStoreMessage.REMOVE)
            .payload(storeBean)
            .build());
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
            store.meta = { state: StoreConnectionState.READY, errors: null, optional: store.meta.optional };
        }
        else {
            store.meta = { state: StoreConnectionState.CONNECTED, errors: null, optional: store.meta.optional };
        }
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            throw new Error("store has no subscribers");
        storeSubscribers.forEach((subscriber) => {
            subscriber.metaCallback(store.meta);
        });
    }
    storeConnectionError(storeId, errorBean) {
        if (!this.clientStore.has(storeId)) {
            console.error("received error from store " + storeId + " without being subscribed to the store", this.clientStore);
            return;
        }
        const errors = errorBean.errors;
        const accessDenied = errorBean.accessDenied;
        const store = this.clientStore.get(storeId);
        store.meta = accessDenied
            ? { state: StoreConnectionState.ERROR, errors, optional: store.meta.optional }
            : { state: StoreConnectionState.ACCESS_DENIED, errors, optional: store.meta.optional };
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            throw new Error("store has no subscribers");
        storeSubscribers.forEach((subscriber) => {
            subscriber.metaCallback(store.meta);
        });
    }
    storeValidation(storeId, validationMessageBean) {
        if (!this.clientStore.has(storeId)) {
            console.error("received error from store " + storeId + " without being subscribed to the store", this.clientStore);
            return;
        }
        const callback = this.transactionCallbacks.get(validationMessageBean.transactionId);
        if (!callback) {
            console.error("received validation from store " + storeId + " with transaction " + validationMessageBean.transactionId + " but no callback was registered (anymore)");
            return;
        }
        callback(validationMessageBean.action, validationMessageBean.validationBean);
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
        store.meta = { state: StoreConnectionState.READY, errors: null, optional: store.meta.optional };
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