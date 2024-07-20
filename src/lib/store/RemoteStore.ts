import { nanoid } from 'nanoid';
import {
    AbstractIOBean,
    AbstractStoreBean,
    AbstractStoreParametersBean,
    ClientToServerStoreMessage,
    FragmentList,
    FragmentUpdateBean,
    IOClientToServerStoreBean,
    IOCoreEndpoints,
    IOServerToClientStoreBean,
    ServerToClientStoreMessage,
    StoreConnectionErrorBean,
    createIOClientToServerStoreBean
} from "../beans/Beans";
import { createStoreId } from '../beans/StoreBeanUtils';
import { mergeFragments } from "../client/Fragments/FragmentMerger";
import { clientToServerCoreBeanBuilder } from "../client/IOClientToServerCoreBeanBuilder";
import { clientToServerStoreBeanBuilder } from "../client/IOClientToServerStoreBeanBuilder";
import { ServerToClientCoreBean } from "../client/ServerToClientCoreBeanBuilder";
import { UnsubscribeCallback, WebSocketManager } from "../client/WebSocketManager";
import { deserialise } from "../client/serialisation/Deserialisation";
import { serialise } from "../client/serialisation/Serialisation";


interface Subscriber<FRAGMENT extends AbstractIOBean> {
    dataCallback: (data: Map<string, FRAGMENT>) => void;
    metaCallback: (meta: StoreMeta) => void;
}

export enum StoreConnectionState {
    UNKNOWN,
    CONNECTING,
    CONNECTED,
    READY,
    ERROR,
    ACCESS_DENIED
}

export interface StoreMeta {
    optional: boolean;
    state: StoreConnectionState;
    errors: Array<string> | null;
}

export interface UpdateBeanFunction<BEAN extends AbstractIOBean> {
    (payload: BEAN) : void;
}

export interface InsertBeanFunction<BEAN extends AbstractIOBean> {
    (payload: BEAN) : void;
}

export interface RemoveBeanFunction {
    (key: string) : void;
}

interface ClientStore<BEAN extends AbstractStoreBean> {
    meta: StoreMeta;
    data: Map<string, BEAN> | undefined;
}

export class RemoteStore<BEAN extends AbstractStoreBean> {
    clientStore: Map<string, ClientStore<BEAN>>;
    subscribers: Map<string, Map<string, Subscriber<BEAN>>>;
    websocketManager: WebSocketManager;
    unsubscribeUpdateListener: UnsubscribeCallback;
    unsubscribeDisconnectListener: UnsubscribeCallback;
    connectedListener: UnsubscribeCallback;
    connectionErrorListener: UnsubscribeCallback;

    constructor(websocketManager: WebSocketManager) {
        this.clientStore = new Map();
        this.subscribers = new Map();
        this.websocketManager = websocketManager;



        [this.unsubscribeUpdateListener, this.unsubscribeDisconnectListener, this.connectedListener, this.connectionErrorListener] = this.initRemoteStore();
    }

    initRemoteStore(): [UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback] {
        return [
            this.websocketManager.addListener(
                IOCoreEndpoints.STORE,
                ServerToClientStoreMessage.UPDATE,
                (coreBean: ServerToClientCoreBean<IOServerToClientStoreBean>) => {

                    const storeBean: IOServerToClientStoreBean = coreBean.payload;

                    const payload: FragmentUpdateBean = deserialise(storeBean.payload);
                    
                    this.update(storeBean.primaryId, payload);
                }
            ),
            this.websocketManager.addListener(
                IOCoreEndpoints.STORE,
                ServerToClientStoreMessage.DISCONNECT_FORCEFULLY,
                (_coreBean: ServerToClientCoreBean<IOServerToClientStoreBean>) => {
                    // FIXME
                    console.error("FORCEFUL DISCONNECT");

                    // payload.ids.forEach((id) => {
                    //     this.subscribers.delete(id);
                    //     this.clientStore.delete(id);
                    // });
                }
            ),
            this.websocketManager.addListener(
                IOCoreEndpoints.STORE,
                ServerToClientStoreMessage.CONNECTED,
                (coreBean: ServerToClientCoreBean<IOServerToClientStoreBean>) => {

                    const storeBean: IOServerToClientStoreBean = coreBean.payload;

                    //const bean: StoreConnectedBean = deserialise(storeBean.payload);
                    
                    this.storeConnected(storeBean.primaryId);
                }
            ),
            this.websocketManager.addListener(
                IOCoreEndpoints.STORE,
                ServerToClientStoreMessage.CONNECTION_ERROR,
                (coreBean: ServerToClientCoreBean<IOServerToClientStoreBean>) => {

                    const storeBean: IOServerToClientStoreBean = coreBean.payload;

                    const payload: StoreConnectionErrorBean = deserialise(storeBean.payload);

                    this.storeConnectionError(storeBean.primaryId, payload);
                }
            ),
            
        ];
    }

    releaseRemoteStore() {
        this.unsubscribeUpdateListener();
    }

    openRemoteStore(primaryPath: Array<string>, params: AbstractStoreParametersBean, optional: boolean) {
        const storeId = createStoreId(primaryPath, params);
        if (!this.clientStore.has(storeId)) {
            this.clientStore.set(storeId, { data: undefined, meta: {state: StoreConnectionState.CONNECTING, errors: null, optional} });

            const payload: IOClientToServerStoreBean = createIOClientToServerStoreBean({
                primaryPath,
                parametersJson: serialise(params)
            });
            this.websocketManager.send(
                clientToServerCoreBeanBuilder()
                .endpoint(IOCoreEndpoints.STORE)
                .message(ClientToServerStoreMessage.CONNECT)
                .payload(payload)
                .build());
        }
    }

    closeRemoteStore(primaryPath: Array<string>, params: AbstractStoreParametersBean) {
        const storeId = createStoreId(primaryPath, params);
        this.clientStore.delete(storeId);
        const payload: IOClientToServerStoreBean = 
            clientToServerStoreBeanBuilder()
                .primaryPath(primaryPath)
                .parameters(params)
                .build();

        this.websocketManager.send(
            clientToServerCoreBeanBuilder()
                .endpoint(IOCoreEndpoints.STORE)
                .message(ClientToServerStoreMessage.DISCONNECT)
                .payload(payload)
                .build());
    }

    getData(
        primaryPath: Array<string>, 
        params: AbstractStoreParametersBean | null
    ): Map<String, BEAN> | undefined {
        const storeId = createStoreId(primaryPath, params);

        if (!this.clientStore.has(storeId)) {
            return undefined;
        }
        return this.clientStore.get(storeId)!.data;
    }

    getStoreMeta(
        primaryPath: Array<string>, 
        params: AbstractStoreParametersBean | null,
        initialOptional?: boolean
    ): StoreMeta {
        const storeId = createStoreId(primaryPath, params);
        if (!this.clientStore.has(storeId)) {
            return {state: StoreConnectionState.UNKNOWN, errors: null, optional: initialOptional ?? false};
        }
        return this.clientStore.get(storeId)!.meta;
    }

    register(
        primaryPath: Array<string>,
        params: AbstractStoreParametersBean,
        setData: (data: Map<string, BEAN>) => void,
        setMeta: (meta: StoreMeta) => void,
        optional: boolean
    ): () => void {
        const storeId = createStoreId(primaryPath, params);
        if (!this.subscribers.has(storeId)) {
            this.subscribers.set(storeId, new Map());
        }

        const id = nanoid();
        const subscriber: Subscriber<BEAN> = {
            dataCallback: setData,
            metaCallback: setMeta,
        };
        this.subscribers.get(storeId)!.set(id, subscriber);

        this.openRemoteStore(primaryPath, params, optional);

        const returnDeregisterCallback = () => this.deregister(primaryPath, id, params);

        return returnDeregisterCallback.bind(this);
    }

    deregister(primaryPath: Array<string>, id: string, params: AbstractStoreParametersBean) {
        const storeId = createStoreId(primaryPath, params);
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) return;
        storeSubscribers.delete(id);
        if (storeSubscribers.size === 0) {
            storeSubscribers.delete(storeId);
            this.closeRemoteStore(primaryPath, params);
        }
    }

    updateBean(
        primaryPath: Array<string>, 
        params: AbstractStoreParametersBean,
        payload: BEAN
    ) {

        const storeBean: IOClientToServerStoreBean = 
            clientToServerStoreBeanBuilder()
                .primaryPath(primaryPath)
                .parameters(params)
                .payload(payload)
                .build();

        this.websocketManager.send(
            clientToServerCoreBeanBuilder()
                .endpoint(IOCoreEndpoints.STORE)
                .message(ClientToServerStoreMessage.UPDATE)
                .payload(storeBean)
                .build());
    }

    insertBean(
        primaryPath: Array<string>, 
        params: AbstractStoreParametersBean ,
        payload: BEAN,
    ) {


        const storeBean: IOClientToServerStoreBean = 
            clientToServerStoreBeanBuilder()
                .primaryPath(primaryPath)
                .parameters(params)
                .payload(payload)
                .build();

        this.websocketManager.send(
            clientToServerCoreBeanBuilder()
                .endpoint(IOCoreEndpoints.STORE)
                .message(ClientToServerStoreMessage.INSERT)
                .payload(storeBean)
                .build());
    }    

    removeBean(
        primaryPath: Array<string>, 
        params: AbstractStoreParametersBean,
        key: string,
    ) {

        const storeBean: IOClientToServerStoreBean = 
            clientToServerStoreBeanBuilder()
                .primaryPath(primaryPath)
                .parameters(params)
                .key(key)
                .build();

        this.websocketManager.send(
            clientToServerCoreBeanBuilder()
                .endpoint(IOCoreEndpoints.STORE)
                .message(ClientToServerStoreMessage.REMOVE)
                .payload(storeBean)
                .build());
    }    

    clear(storeId: string) {
        if (!this.clientStore.has(storeId)) {
            console.log(
                "received data from store " + storeId + " without being subscribed to the store",
                this.clientStore
            );
            return;
        }
        this.clientStore.get(storeId)!.data = undefined;
    }

    storeConnected(storeId: string) {
        if (!this.clientStore.has(storeId)) {
            console.error(
                "received state from store " + storeId + " without being subscribed to the store",
                this.clientStore
            );
            return;
        }

        const store = this.clientStore.get(storeId)!;
        if (store.data) {
            store.meta = {state: StoreConnectionState.READY, errors:null, optional: store.meta.optional};
        } else {
            store.meta = {state: StoreConnectionState.CONNECTED, errors:null, optional: store.meta.optional};
        }

        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) throw new Error("store has no subscribers");

        storeSubscribers.forEach((subscriber: Subscriber<BEAN>) => {
            subscriber.metaCallback(store.meta);
        });
    }

    storeConnectionError(storeId: string, errorBean: StoreConnectionErrorBean) {
        if (!this.clientStore.has(storeId)) {
            console.error(
                "received error from store " + storeId + " without being subscribed to the store",
                this.clientStore
            );
            return;
        }

        const errors = errorBean.errors;
        const accessDenied = errorBean.accessDenied;

        const store = this.clientStore.get(storeId)!;
        store.meta = accessDenied 
            ? {state: StoreConnectionState.ERROR, errors, optional: store.meta.optional}
            : {state: StoreConnectionState.ACCESS_DENIED, errors, optional: store.meta.optional}

        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) throw new Error("store has no subscribers");

        storeSubscribers.forEach((subscriber: Subscriber<BEAN>) => {
            subscriber.metaCallback(store.meta);
        });
    }    

    update(storeId: string, updateBean: FragmentUpdateBean) {
        if (!this.clientStore.has(storeId)) {
            console.error(
                "received data from store " + storeId + " without being subscribed to the store",
                this.clientStore
            );
            return;
        }

        const store = this.clientStore.get(storeId)!;

        if (store.meta.state === StoreConnectionState.ERROR) throw new Error("received update from store " + storeId + " but store has error state");

        const data = store.data!;

        updateBean.items.forEach((value, key) => {

            const fragmentList: FragmentList = value;

            if (fragmentList.fromVersion && !data.has(key)) throw new Error("store " + storeId + " received fragment for " + key + " for version " + fragmentList.fromVersion + " but bean does not exist in store");

            if (fragmentList.fromVersion && fragmentList.fromVersion != data.get(key)!.version) throw new Error("store " + storeId + " received fragment for " + key + " for version " + fragmentList.fromVersion + " but bean does not exist in store");

            const bean = mergeFragments(data.get(key), fragmentList);

            if (!bean && data.has(key)) data.delete(key);

            if (bean) data.set(key, bean);

        });
        
        const stateChanged = store.meta.state !== StoreConnectionState.READY;

        store.meta = {state: StoreConnectionState.READY, errors: null, optional: store.meta.optional};

        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) throw new Error("store has no subscribers");


        storeSubscribers.forEach((subscriber: Subscriber<BEAN>) => {
            subscriber.dataCallback(data);
        });

        if (stateChanged) {
            storeSubscribers.forEach((subscriber: Subscriber<BEAN>) => {
                subscriber.metaCallback(store.meta);
            }); 
        }
    }
}
