"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteStore = exports.StoreConnectionState = void 0;
const nanoid_1 = require("nanoid");
const Beans_1 = require("../beans/Beans");
const StoreBeanUtils_1 = require("../beans/StoreBeanUtils");
const FragmentMerger_1 = require("../client/Fragments/FragmentMerger");
const IOClientToServerCoreBeanBuilder_1 = require("../client/IOClientToServerCoreBeanBuilder");
const IOClientToServerStoreBeanBuilder_1 = require("../client/IOClientToServerStoreBeanBuilder");
const Deserialisation_1 = require("../client/serialisation/Deserialisation");
const Serialisation_1 = require("../client/serialisation/Serialisation");
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
    constructor(websocketManager) {
        this.clientStore = new Map();
        this.subscribers = new Map();
        this.websocketManager = websocketManager;
        [this.unsubscribeUpdateListener, this.unsubscribeDisconnectListener, this.connectedListener, this.connectionErrorListener] = this.initRemoteStore();
    }
    initRemoteStore() {
        return [
            this.websocketManager.addListener(Beans_1.IOCoreEndpoints.STORE, Beans_1.ServerToClientStoreMessage.UPDATE, (coreBean) => {
                const storeBean = coreBean.payload;
                const payload = (0, Deserialisation_1.deserialise)(storeBean.payload);
                this.update(storeBean.primaryId, payload);
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
                //const bean: StoreConnectedBean = deserialise(storeBean.payload);
                this.storeConnected(storeBean.primaryId);
            }),
            this.websocketManager.addListener(Beans_1.IOCoreEndpoints.STORE, Beans_1.ServerToClientStoreMessage.CONNECTION_ERROR, (coreBean) => {
                const storeBean = coreBean.payload;
                const payload = (0, Deserialisation_1.deserialise)(storeBean.payload);
                this.storeConnectionError(storeBean.primaryId, payload);
            }),
        ];
    }
    releaseRemoteStore() {
        this.unsubscribeUpdateListener();
    }
    openRemoteStore(primaryPath, params, optional) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, params);
        if (!this.clientStore.has(storeId)) {
            this.clientStore.set(storeId, { data: undefined, meta: { state: StoreConnectionState.CONNECTING, errors: null, optional } });
            const payload = (0, Beans_1.createIOClientToServerStoreBean)({
                primaryPath,
                parametersJson: (0, Serialisation_1.serialise)(params)
            });
            this.websocketManager.send((0, IOClientToServerCoreBeanBuilder_1.clientToServerCoreBeanBuilder)()
                .endpoint(Beans_1.IOCoreEndpoints.STORE)
                .message(Beans_1.ClientToServerStoreMessage.CONNECT)
                .payload(payload)
                .build());
        }
    }
    closeRemoteStore(primaryPath, params) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, params);
        this.clientStore.delete(storeId);
        const payload = (0, IOClientToServerStoreBeanBuilder_1.clientToServerStoreBeanBuilder)()
            .primaryPath(primaryPath)
            .parameters(params)
            .build();
        this.websocketManager.send((0, IOClientToServerCoreBeanBuilder_1.clientToServerCoreBeanBuilder)()
            .endpoint(Beans_1.IOCoreEndpoints.STORE)
            .message(Beans_1.ClientToServerStoreMessage.DISCONNECT)
            .payload(payload)
            .build());
    }
    getData(primaryPath, params) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, params);
        if (!this.clientStore.has(storeId)) {
            return undefined;
        }
        return this.clientStore.get(storeId).data;
    }
    getStoreMeta(primaryPath, params, initialOptional) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, params);
        if (!this.clientStore.has(storeId)) {
            return { state: StoreConnectionState.UNKNOWN, errors: null, optional: initialOptional !== null && initialOptional !== void 0 ? initialOptional : false };
        }
        return this.clientStore.get(storeId).meta;
    }
    register(primaryPath, params, setData, setMeta, optional) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, params);
        if (!this.subscribers.has(storeId)) {
            this.subscribers.set(storeId, new Map());
        }
        const id = (0, nanoid_1.nanoid)();
        const subscriber = {
            dataCallback: setData,
            metaCallback: setMeta,
        };
        this.subscribers.get(storeId).set(id, subscriber);
        this.openRemoteStore(primaryPath, params, optional);
        const returnDeregisterCallback = () => this.deregister(primaryPath, id, params);
        return returnDeregisterCallback.bind(this);
    }
    deregister(primaryPath, id, params) {
        const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, params);
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            return;
        storeSubscribers.delete(id);
        if (storeSubscribers.size === 0) {
            storeSubscribers.delete(storeId);
            this.closeRemoteStore(primaryPath, params);
        }
    }
    updateBean(primaryPath, params, payload) {
        const storeBean = (0, IOClientToServerStoreBeanBuilder_1.clientToServerStoreBeanBuilder)()
            .primaryPath(primaryPath)
            .parameters(params)
            .payload(payload)
            .build();
        this.websocketManager.send((0, IOClientToServerCoreBeanBuilder_1.clientToServerCoreBeanBuilder)()
            .endpoint(Beans_1.IOCoreEndpoints.STORE)
            .message(Beans_1.ClientToServerStoreMessage.UPDATE)
            .payload(storeBean)
            .build());
    }
    insertBean(primaryPath, params, payload) {
        const storeBean = (0, IOClientToServerStoreBeanBuilder_1.clientToServerStoreBeanBuilder)()
            .primaryPath(primaryPath)
            .parameters(params)
            .payload(payload)
            .build();
        this.websocketManager.send((0, IOClientToServerCoreBeanBuilder_1.clientToServerCoreBeanBuilder)()
            .endpoint(Beans_1.IOCoreEndpoints.STORE)
            .message(Beans_1.ClientToServerStoreMessage.INSERT)
            .payload(storeBean)
            .build());
    }
    removeBean(primaryPath, params, key) {
        const storeBean = (0, IOClientToServerStoreBeanBuilder_1.clientToServerStoreBeanBuilder)()
            .primaryPath(primaryPath)
            .parameters(params)
            .key(key)
            .build();
        this.websocketManager.send((0, IOClientToServerCoreBeanBuilder_1.clientToServerCoreBeanBuilder)()
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
    update(storeId, updateBean) {
        if (!this.clientStore.has(storeId)) {
            console.error("received data from store " + storeId + " without being subscribed to the store", this.clientStore);
            return;
        }
        const store = this.clientStore.get(storeId);
        if (store.meta.state === StoreConnectionState.ERROR)
            throw new Error("received update from store " + storeId + " but store has error state");
        const data = store.data;
        updateBean.items.forEach((value, key) => {
            const fragmentList = value;
            if (fragmentList.fromVersion && !data.has(key))
                throw new Error("store " + storeId + " received fragment for " + key + " for version " + fragmentList.fromVersion + " but bean does not exist in store");
            if (fragmentList.fromVersion && fragmentList.fromVersion != data.get(key).version)
                throw new Error("store " + storeId + " received fragment for " + key + " for version " + fragmentList.fromVersion + " but bean does not exist in store");
            const bean = (0, FragmentMerger_1.mergeFragments)(data.get(key), fragmentList);
            if (!bean && data.has(key))
                data.delete(key);
            if (bean)
                data.set(key, bean);
        });
        const stateChanged = store.meta.state !== StoreConnectionState.READY;
        store.meta = { state: StoreConnectionState.READY, errors: null, optional: store.meta.optional };
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers)
            throw new Error("store has no subscribers");
        storeSubscribers.forEach((subscriber) => {
            subscriber.dataCallback(data);
        });
        if (stateChanged) {
            storeSubscribers.forEach((subscriber) => {
                subscriber.metaCallback(store.meta);
            });
        }
    }
}
exports.RemoteStore = RemoteStore;
//# sourceMappingURL=RemoteStore.js.map