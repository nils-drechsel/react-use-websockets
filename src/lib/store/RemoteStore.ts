import { nanoid } from 'nanoid';
import {
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


interface Subscriber<BEAN extends AbstractStoreBean> {
    dataCallback: (data: Map<string, BEAN>) => void;
    metaCallback: (meta: StoreMeta) => void;
}

export class SessionError extends Error {

    constructor(message: string) {
        super(message);
    }

}

export class AsynchronicityError extends Error {

    constructor(message: string) {
        super(message);
    }

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

export interface UpdateBeanFunction<BEAN extends AbstractStoreBean> {
    (payload: BEAN) : void;
}

export interface InsertBeanFunction<BEAN extends AbstractStoreBean> {
    (payload: BEAN) : void;
}

export interface RemoveBeanFunction {
    (key: string) : void;
}

interface ClientStore<BEAN extends AbstractStoreBean> {
    storeSessionId: string;
    meta: StoreMeta;
    data: Map<string, BeanCache<BEAN>> | undefined;
}

interface BeanCache<BEAN extends AbstractStoreBean> {
    items: Map<string, BEAN>;
    current: BEAN;
}


export class RemoteStore {
    clientStore: Map<string, ClientStore<AbstractStoreBean>>;
    subscribers: Map<string, Map<string, Subscriber<AbstractStoreBean>>>;
    websocketManager: WebSocketManager;
    unsubscribeUpdateListener: UnsubscribeCallback;
    unsubscribeDisconnectListener: UnsubscribeCallback;
    connectedListener: UnsubscribeCallback;
    connectionErrorListener: UnsubscribeCallback;
    unsubscribePopulationListener: UnsubscribeCallback;

    constructor(websocketManager: WebSocketManager) {
        this.clientStore = new Map();
        this.subscribers = new Map();
        this.websocketManager = websocketManager;


        [this.unsubscribeUpdateListener, this.unsubscribePopulationListener, this.unsubscribeDisconnectListener, this.connectedListener, this.connectionErrorListener] = this.initRemoteStore();
    }

    initRemoteStore(): [UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback] {
        return [
            this.websocketManager.addListener(
                IOCoreEndpoints.STORE,
                ServerToClientStoreMessage.UPDATE,
                (coreBean: ServerToClientCoreBean<IOServerToClientStoreBean>) => {

                    const storeBean: IOServerToClientStoreBean = coreBean.payload;

                    this.update(storeBean.primaryId, storeBean.payload as FragmentUpdateBean, storeBean.storeSessionId);
                }
            ),
            this.websocketManager.addListener(
                IOCoreEndpoints.STORE,
                ServerToClientStoreMessage.POPULATE,
                (coreBean: ServerToClientCoreBean<IOServerToClientStoreBean>) => {

                    const storeBean: IOServerToClientStoreBean = coreBean.payload;

                    const payload: FragmentUpdateBean = storeBean.payload as FragmentUpdateBean;
                    
                    this.clear(storeBean.primaryId, storeBean.storeSessionId);
                    this.clientStore.get(storeBean.primaryId)!.data = new Map();
                    this.update(storeBean.primaryId, payload, storeBean.storeSessionId);
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
                    
                    this.storeConnected(storeBean.primaryId, storeBean.storeSessionId);
                }
            ),
            this.websocketManager.addListener(
                IOCoreEndpoints.STORE,
                ServerToClientStoreMessage.CONNECTION_ERROR,
                (coreBean: ServerToClientCoreBean<IOServerToClientStoreBean>) => {

                    const storeBean: IOServerToClientStoreBean = coreBean.payload;

                    const payload: StoreConnectionErrorBean = storeBean.payload as StoreConnectionErrorBean;

                    this.storeConnectionError(storeBean.primaryId, payload, storeBean.storeSessionId);
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
            const storeSessionId = nanoid();
            this.clientStore.set(storeId, { storeSessionId, data: undefined, meta: {state: StoreConnectionState.CONNECTING, errors: null, optional} });

            console.log("remote store opened", storeId, storeSessionId, this.clientStore);

            const payload: IOClientToServerStoreBean = createIOClientToServerStoreBean({
                primaryPath,
                parameters: params as AbstractStoreParametersBean,
                storeSessionId
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
        if (!this.clientStore.has(storeId)) {
            throw new Error("store " + storeId + " does not exist");
        }
        const storeSessionId = this.clientStore.get(storeId)!.storeSessionId;
        this.clientStore.delete(storeId);

        console.log("remote store closed", storeId, storeSessionId, this.clientStore);

        const payload: IOClientToServerStoreBean = 
            clientToServerStoreBeanBuilder()
                .primaryPath(primaryPath)
                .parameters(params)
                .storeSessionId(storeSessionId)
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
    ): Map<string, AbstractStoreBean> | undefined {
        const storeId = createStoreId(primaryPath, params);

        if (!this.clientStore.has(storeId)) {
            return undefined;
        }
        const data = this.clientStore.get(storeId)!.data;

        if (!data) return undefined;

        const result = new Map();
        data.forEach((value, key) => result.set(key, value.current));

        return result;
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

    register <BEAN extends AbstractStoreBean>(
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
        this.subscribers.get(storeId)!.set(id, subscriber as Subscriber<AbstractStoreBean>);

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
        payload: AbstractStoreBean
    ) {
        const storeId = createStoreId(primaryPath, params);

        if (!this.clientStore.has(storeId)) {
            throw new Error("store " + storeId + " does not exist");
        }

        const storeBean: IOClientToServerStoreBean = 
            clientToServerStoreBeanBuilder()
                .primaryPath(primaryPath)
                .parameters(params)
                .payload(payload)
                .storeSessionId(this.clientStore.get(storeId)!.storeSessionId)
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
        payload: AbstractStoreBean,
    ) {

        const storeId = createStoreId(primaryPath, params);

        if (!this.clientStore.has(storeId)) {
            throw new SessionError("store " + storeId + " does not exist");
        }

        const storeBean: IOClientToServerStoreBean = 
            clientToServerStoreBeanBuilder()
                .primaryPath(primaryPath)
                .parameters(params)
                .payload(payload)
                .storeSessionId(this.clientStore.get(storeId)!.storeSessionId)
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
        const storeId = createStoreId(primaryPath, params);

        if (!this.clientStore.has(storeId)) {
            throw new SessionError("store " + storeId + " does not exist");
        }

        

        const storeBean: IOClientToServerStoreBean = 
            clientToServerStoreBeanBuilder()
                .primaryPath(primaryPath)
                .parameters(params)
                .key(key)
                .storeSessionId(this.clientStore.get(storeId)!.storeSessionId)
                .build();

        this.websocketManager.send(
            clientToServerCoreBeanBuilder()
                .endpoint(IOCoreEndpoints.STORE)
                .message(ClientToServerStoreMessage.REMOVE)
                .payload(storeBean)
                .build());
    }    


    checkStoreAccess(storeId: string, storeSessionId: string) {

        if (!this.clientStore.has(storeId)) {
            throw new SessionError(
                "received data from store " + storeId + " without being subscribed to the store " + this.clientStore
            );
        }

        const store = this.clientStore.get(storeId)!;

        if (store.storeSessionId != storeSessionId) {

            throw new SessionError(
                "received update for store " + storeId + " and session id " + storeSessionId + " but that session has already ended");

        }

    }

    clear(storeId: string, storeSessionId: string) {

        this.checkStoreAccess(storeId, storeSessionId);

        this.clientStore.get(storeId)!.data = undefined;

        console.log("remote store cleared", storeId, storeSessionId, this.clientStore);
    }

    storeConnected(storeId: string, storeSessionId: string) {
        this.checkStoreAccess(storeId, storeSessionId);

        const store = this.clientStore.get(storeId)!;



        if (store.data) {
            store.meta = {state: StoreConnectionState.READY, errors:null, optional: store.meta.optional};
        } else {
            store.meta = {state: StoreConnectionState.CONNECTED, errors:null, optional: store.meta.optional};
        }

        console.log("remote store connected", storeId, storeSessionId, this.clientStore);

        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) throw new Error("store has no subscribers");

        storeSubscribers.forEach((subscriber: Subscriber<AbstractStoreBean>) => {
            subscriber.metaCallback(store.meta);
        });
    }

    storeConnectionError(storeId: string, errorBean: StoreConnectionErrorBean, storeSessionId: string) {
        this.checkStoreAccess(storeId, storeSessionId);


        const errors = errorBean.errors;
        const accessDenied = errorBean.accessDenied;

        const store = this.clientStore.get(storeId)!;
        store.meta = accessDenied 
            ? {state: StoreConnectionState.ERROR, errors, optional: store.meta.optional}
            : {state: StoreConnectionState.ACCESS_DENIED, errors, optional: store.meta.optional}

        console.log("remote store error", storeId, storeSessionId, this.clientStore);

        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) throw new Error("store has no subscribers");

        storeSubscribers.forEach((subscriber: Subscriber<AbstractStoreBean>) => {
            subscriber.metaCallback(store.meta);
        });
    }


    consolidate<BEAN extends AbstractStoreBean> (store: ClientStore<BEAN>, key: string, version: string | undefined) {

        const cache = store.data!.get(key)!;

        const bean = !!version
            ? cache.items.get(version)
            : undefined

        if (!bean) {
            store.data!.delete(key);
        } else {

            cache.items = new Map();
            cache.items.set(version!, bean);
            cache.current = bean;
        }

    }


    hasInCache <BEAN extends AbstractStoreBean>(cache: BeanCache<BEAN> | undefined, version: string | undefined) {
        if (!cache) return false;
        if (!version) return false;
        return cache.items.has(version);
    }

    update(storeId: string, updateBean: FragmentUpdateBean, storeSessionId: string) {
        this.checkStoreAccess(storeId, storeSessionId);

        const store = this.clientStore.get(storeId)!;


        console.log("updating remote store", storeId, storeSessionId, store);


        if (store.meta.state === StoreConnectionState.ERROR) throw new Error("received update from store " + storeId + " but store has error state");

        const data = store.data!;


        /**
         * Update rules:
         * 1. toVersion is defined
         *  1.1 A server toVersion exists in the cache
         *      1.1.1 It's the same as the current
         *            -> consolidate bean
         *      1.1.2 It's different:
         *            -> It's from a previous update. Do nothing
         *  1.2 A server toVersion does not exist in the cache
         *          This means it's an update either done by the server, or a different client
         *      1.2.1 A server fromVersion is defined
         *            1.2.1.1 A server fromVersion exists in the cache
         *                    This means that while the client was submitting state changes, either the server or
         *                    another client has made a change
         *                    -> add change into the cache
         *                    -> consolidate bean
         *            1.2.1.2 A server fromVersion does not exist in the cache
         *                    This is odd, throw exception and have the store repopulated
         *      1.2.2 Server fromVersion is null
         *            This means that the bean was created
         *            -> consolidate bean
         * 2. toVersion is null
         *       This means that the bean was deleted
         *  2.1 A server fromVersion is defined
         *      2.1.1 A server fromVersion exists in the cache
         *            -> consolidate bean
         *      2.1.2 A server fromVersion does not exist in the cache
         *            This is odd
         *            -> throw exception
         *  2.2 Server fromVersion is not defined
         *      So... neither toVersion nor fromVersion is defined.
         *      This is very odd
         *      -> throw exception
         */
        updateBean.items.forEach((value, key) => {

            const fragmentList: FragmentList = value;

            let cache = data.get(key);

            if(fragmentList.toVersion) {
                // 1. toVersion is defined


                if (this.hasInCache(cache, fragmentList.toVersion)) {
                    // 1.1 A server toVersion exists in the cache

                    if (cache!.current.version === fragmentList.toVersion) {
                        // 1.1.1 It's the same as the current
                        // -> consolidate bean
                        this.consolidate(store, key, fragmentList.toVersion);
                    } else {

                        // 1.1.2 It's different:
                        // -> It's from a previous update. Do nothing
                    }

                    
                } else {
                    // 1.2. A server toVersion does not exist in the cache
                    // This means it's an update either done by the server, or a different client


                    if (fragmentList.fromVersion) {
                        // 1.2.1 A server fromVersion is defined

                        if (this.hasInCache(cache, fragmentList.fromVersion)) {
                            // 1.2.1.1 A server fromVersion exists in the cache
                            //         This means that while the client was submitting state changes, either the server or
                            //         another client has made a change
                            //         -> add change into the cache
                            //         -> consolidate bean

                            const bean = mergeFragments(cache!.items.get(fragmentList.fromVersion), fragmentList)!;
                            cache!.items.set(fragmentList.toVersion, bean);
                            this.consolidate(store, key, fragmentList.toVersion);

                        } else {
                            // 1.2.1.2 A server fromVersion does not exist in the cache
                            //         This is odd, throw exception and have the store repopulated

                            throw new AsynchronicityError("unknown versions. From: " + fragmentList.fromVersion + ", to: " + fragmentList.toVersion);

                        }

                    } else {

                        // 1.2.2 Server fromVersion is null
                        //         This means that the bean was created
                        //         -> consolidate bean

                        const bean = mergeFragments(undefined, fragmentList)!;

                        if (!bean) {
                            throw new AsynchronicityError("fromVersion is null, a bean was meant to be created, but is undefined after merge");
                        }

                        if (!cache) {
                            cache = {
                                items: new Map(),
                                current: bean
                            }
                            data.set(key, cache);
                        }

                        cache.items.set(fragmentList.toVersion, bean);
                        this.consolidate(store, key, fragmentList.toVersion);

                    }
                } 
            } else {

                // 2. toVersion is null
                //    This means that the bean was deleted

                if (fragmentList.fromVersion) {
                    // 2.1 A server fromVersion is defined

                    if (this.hasInCache(cache, fragmentList.fromVersion)) {

                        // 2.1.1 A server fromVersion exists in the cache
                        //       -> consolidate bean

                        const bean = mergeFragments(cache!.items.get(fragmentList.fromVersion), fragmentList);

                        if (bean) {
                            throw new AsynchronicityError("toVersion is null, a bean was meant to be deleted, but actually exists after merge");
                        }

                        this.consolidate(store, key, undefined);

                    } else {
                        // 2.1.2 A server fromVersion does not exist in the cache
                        //       This is odd
                        //       -> throw exception
                        throw new AsynchronicityError("toVersion is null and fromVersion doesn't exit in cache: " + fragmentList.fromVersion);
                 
                    }

                } else {

                    // 2.2 Server fromVersion is not defined
                    // So... neither toVersion nor fromVersion is defined.
                    //      This is very odd
                    //      -> throw exception

                    throw new AsynchronicityError("both fromVersion and toVersion are null")
                }

            }

        });
        
        const stateChanged = store.meta.state !== StoreConnectionState.READY;

        store.meta = {state: StoreConnectionState.READY, errors: null, optional: store.meta.optional};

        console.log("remote store updated", storeId, storeSessionId, this.clientStore);

        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) throw new Error("store has no subscribers");

        const result = new Map();
        data.forEach((value, key) => result.set(key, value.current));

        console.log("notifying subscribers")
        storeSubscribers.forEach((subscriber: Subscriber<AbstractStoreBean>) => {
            console.log("subscriber", subscriber);
            subscriber.dataCallback(result);
        });

        if (stateChanged) {
            console.log("state change notifying subscribers")
            storeSubscribers.forEach((subscriber: Subscriber<AbstractStoreBean>) => {
                console.log("subscriber", subscriber);
                subscriber.metaCallback(store.meta);
            }); 
        }
    }
}
