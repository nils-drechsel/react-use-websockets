import { v4 as uuidv4 } from "uuid";
import { clientToServerCoreBeanBuilder } from "../client/ClientToServerCoreBeanBuilder";
import { ServerToClientCoreBean } from "../client/ServerToClientCoreBeanBuilder";
import { UnsubscribeCallback, WebSocketManager } from "../client/WebSocketManager";
import Deserialiser from "../client/serialisation/Deserialisation";
import Serialiser, { BeanSerialisationSignature } from "../client/serialisation/Serialisation";
import {
    AbstractIOBean,
    AbstractStoreParametersBean,
    ClientToServerStoreMessage,
    IOClientToServerStoreBean,
    IOCoreEndpoints,
    IOServerToClientStoreBean,
    ServerToClientStoreMessage,
    StoreConnectionErrorBean,
    StoreUpdateBean,
    StoreValidationMessageBean
} from "./beans/Beans";
import { ValidationTimeoutCallback, ValidationTimeoutCallbackWithState, createStoreId, valdiationCallbackWithTimeout } from "./beans/StoreBeanUtils";

const VALIDATION_TIMEOUT = 20;

enum SubscriberType {
    FULL,
    UPDATE,
}

interface Subscriber<FRAGMENT extends AbstractIOBean> {
    type: SubscriberType;
    dataCallback: (data: Map<string, FRAGMENT>) => void;
    metaCallback: (meta: StoreMeta) => void;
}

export enum StoreConnectionState {
    UNKNOWN,
    CONNECTING,
    CONNECTED,
    READY,
    ERROR
}

export interface StoreMeta {
    state: StoreConnectionState;
    errors: Array<string> | null;
}

export interface UpdateBeanFunction<FRAGMENT extends AbstractIOBean> {
    (payload: FRAGMENT, callback?: ValidationTimeoutCallbackWithState) : void;
}

export interface InsertBeanFunction<FRAGMENT extends AbstractIOBean> {
    (payload: FRAGMENT, callback?: ValidationTimeoutCallbackWithState) : void;
}

export interface RemoveBeanFunction {
    (key: string, callback?: ValidationTimeoutCallbackWithState) : void;
}

interface ClientStore<FRAGMENT extends AbstractIOBean> {
    meta: StoreMeta;
    data: Map<string, FRAGMENT> | undefined;
}

export class RemoteStore<FRAGMENT extends AbstractIOBean> {
    clientStore: Map<string, ClientStore<FRAGMENT>>;
    transactionCallbacks: Map<string, ValidationTimeoutCallback>;
    subscribers: Map<string, Map<string, Subscriber<FRAGMENT>>>;
    websocketManager: WebSocketManager;
    unsubscribeUpdateListener: UnsubscribeCallback;
    unsubscribeDisconnectListener: UnsubscribeCallback;
    connectedListener: UnsubscribeCallback;
    connectionErrorListener: UnsubscribeCallback;
    validationListener: UnsubscribeCallback;
    serialiser: Serialiser;
    deserialiser: Deserialiser;

    constructor(websocketManager: WebSocketManager, serialisationSignatures?: Map<string, BeanSerialisationSignature>) {
        this.clientStore = new Map();
        this.subscribers = new Map();
        this.websocketManager = websocketManager;

        this.serialiser = new Serialiser(serialisationSignatures);
        this.deserialiser = new Deserialiser(serialisationSignatures);

        this.transactionCallbacks = new Map();

        [this.unsubscribeUpdateListener, this.unsubscribeDisconnectListener, this.connectedListener, this.connectionErrorListener, this.validationListener] = this.initRemoteStore();
    }

    initRemoteStore(): [UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback] {
        return [
            this.websocketManager.addListener(
                IOCoreEndpoints.STORE,
                ServerToClientStoreMessage.UPDATE,
                (coreBean: ServerToClientCoreBean<IOServerToClientStoreBean>) => {

                    const storeBean: IOServerToClientStoreBean = coreBean.payload;

                    const payload: StoreUpdateBean = this.deserialiser.deserialise(storeBean.payload);

                    if (payload.initial) {
                        this.clear(storeBean.secondaryId);
                        this.update(storeBean.secondaryId, payload.payload, true /*initial*/);
                    } else {
                        this.update(storeBean.secondaryId, payload.payload, false /*initial*/);
                    }
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

                    //const payload: StoreConnectedBean = this.deserialiser.deserialise(storeBean.payload);
                    
                    this.storeConnected(storeBean.secondaryId);
                }
            ),
            this.websocketManager.addListener(
                IOCoreEndpoints.STORE,
                ServerToClientStoreMessage.CONNECTION_ERROR,
                (coreBean: ServerToClientCoreBean<IOServerToClientStoreBean>) => {

                    const storeBean: IOServerToClientStoreBean = coreBean.payload;

                    const payload: StoreConnectionErrorBean = this.deserialiser.deserialise(storeBean.payload);

                    this.storeConnectionError(storeBean.secondaryId, payload.errors);
                }
            ),
            this.websocketManager.addListener(
                IOCoreEndpoints.STORE,
                ServerToClientStoreMessage.VALIDATION,
                (coreBean: ServerToClientCoreBean<IOServerToClientStoreBean>) => {

                    const storeBean: IOServerToClientStoreBean = coreBean.payload;

                    const payload: StoreValidationMessageBean = this.deserialiser.deserialise(storeBean.payload);

                    this.storeValidation(storeBean.secondaryId, payload);
                }
            ),
        ];
    }

    releaseRemoteStore() {
        this.unsubscribeUpdateListener();
    }

    openRemoteStore(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null) {
        const storeId = createStoreId(primaryPath, secondaryPath, params);
        if (!this.clientStore.has(storeId)) {
            this.clientStore.set(storeId, { data: undefined, meta: {state: StoreConnectionState.CONNECTING, errors: null} });

            const payload: IOClientToServerStoreBean = {
                primaryPath,
                secondaryPath,
                parametersJson: this.serialiser.serialise(params)
            };
            this.websocketManager.send(
                clientToServerCoreBeanBuilder()
                .endpoint(IOCoreEndpoints.STORE)
                .message(ClientToServerStoreMessage.CONNECT)
                .payload(payload)
                .build());
        }
    }

    closeRemoteStore(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null) {
        const storeId = createStoreId(primaryPath, secondaryPath, params);
        this.clientStore.delete(storeId);
        const payload: IOClientToServerStoreBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params)
        };
        this.websocketManager.send(
            clientToServerCoreBeanBuilder()
                .endpoint(IOCoreEndpoints.STORE)
                .message(ClientToServerStoreMessage.DISCONNECT)
                .payload(payload)
                .build());
    }

    getData(
        primaryPath: Array<string>, 
        secondaryPath: Array<string>,
        params: AbstractStoreParametersBean | null
    ): Map<String, FRAGMENT> | undefined {
        const storeId = createStoreId(primaryPath, secondaryPath, params);

        if (!this.clientStore.has(storeId)) {
            return undefined;
        }
        return this.clientStore.get(storeId)!.data;
    }

    getStoreMeta(
        primaryPath: Array<string>, 
        secondaryPath: Array<string>,
        params: AbstractStoreParametersBean | null
    ): StoreMeta {
        const storeId = createStoreId(primaryPath, secondaryPath, params);
        if (!this.clientStore.has(storeId)) {
            return {state: StoreConnectionState.UNKNOWN, errors: null};
        }
        return this.clientStore.get(storeId)!.meta;
    }

    register(
        primaryPath: Array<string>,
        secondaryPath: Array<string>,
        params: AbstractStoreParametersBean | null,
        setData: (data: Map<string, FRAGMENT>) => void,
        setMeta: (meta: StoreMeta) => void,
        update: boolean = false
    ): () => void {
        const storeId = createStoreId(primaryPath, secondaryPath, params);
        if (!this.subscribers.has(storeId)) {
            this.subscribers.set(storeId, new Map());
        }

        const id = uuidv4();
        const subscriber: Subscriber<FRAGMENT> = {
            type: update ? SubscriberType.UPDATE : SubscriberType.FULL,
            dataCallback: setData,
            metaCallback: setMeta,
        };
        this.subscribers.get(storeId)!.set(id, subscriber);

        this.openRemoteStore(primaryPath, secondaryPath, params);

        const returnDeregisterCallback = () => this.deregister(primaryPath, secondaryPath, id, params);

        return returnDeregisterCallback.bind(this);
    }

    deregister(primaryPath: Array<string>, secondaryPath: Array<string>, id: string, params: AbstractStoreParametersBean | null) {
        const storeId = createStoreId(primaryPath, secondaryPath, params);
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) return;
        storeSubscribers.delete(id);
        if (storeSubscribers.size === 0) {
            storeSubscribers.delete(storeId);
            this.closeRemoteStore(primaryPath, secondaryPath, params);
        }
    }

    createTransactionId():string {
        let tid = null;
        do {
            tid = uuidv4();
            if (this.transactionCallbacks.has(tid)) {
                tid = null;
            }
        } while(tid === null);

        return tid;
    }

    addValidationCallback(transactionId: string, validationCallback: ValidationTimeoutCallbackWithState): void {

        const cb: ValidationTimeoutCallbackWithState = (state, action, validation)  => {
            this.transactionCallbacks.delete(transactionId);
            validationCallback(state, action, validation);
        }

        const callbackWithTimeout: ValidationTimeoutCallback = valdiationCallbackWithTimeout(VALIDATION_TIMEOUT, cb);
        
        this.transactionCallbacks.set(transactionId, callbackWithTimeout);

    }

    updateBean(
        primaryPath: Array<string>, 
        secondaryPath: Array<string>,
        params: AbstractStoreParametersBean | null,
        payload: FRAGMENT,
        validationCallback?: ValidationTimeoutCallbackWithState
    ) {

        const transactionId = this.createTransactionId();

        const storeBean: IOClientToServerStoreBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params),
            payloadJson: this.serialiser.serialise(payload),
            transactionId,
        }

        if (validationCallback) this.addValidationCallback(transactionId, validationCallback);

        this.websocketManager.send(
            clientToServerCoreBeanBuilder()
                .endpoint(IOCoreEndpoints.STORE)
                .message(ClientToServerStoreMessage.UPDATE)
                .payload(storeBean)
                .build());
    }

    insertBean(
        primaryPath: Array<string>, 
        secondaryPath: Array<string>,
        params: AbstractStoreParametersBean | null,
        payload: FRAGMENT,
        validationCallback?: ValidationTimeoutCallbackWithState
    ) {

        const transactionId = this.createTransactionId();

        const storeBean: IOClientToServerStoreBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params),
            payloadJson: this.serialiser.serialise(payload),
            transactionId,
        }

        if (validationCallback) this.addValidationCallback(transactionId, validationCallback);

        this.websocketManager.send(
            clientToServerCoreBeanBuilder()
                .endpoint(IOCoreEndpoints.STORE)
                .message(ClientToServerStoreMessage.INSERT)
                .payload(storeBean)
                .build());
    }    

    removeBean(
        primaryPath: Array<string>, 
        secondaryPath: Array<string>,
        params: AbstractStoreParametersBean | null,
        key: string,
        validationCallback?: ValidationTimeoutCallbackWithState
    ) {

        const transactionId = this.createTransactionId();

        const storeBean: IOClientToServerStoreBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params),
            key,
            transactionId,
        }

        if (validationCallback) this.addValidationCallback(transactionId, validationCallback);

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
            store.meta = {state: StoreConnectionState.READY, errors:null};
        } else {
            store.meta = {state: StoreConnectionState.CONNECTED, errors:null};
        }

        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) throw new Error("store has no subscribers");

        storeSubscribers.forEach((subscriber: Subscriber<FRAGMENT>) => {
            subscriber.metaCallback(store.meta);
        });
    }

    storeConnectionError(storeId: string, errors: Array<string>) {
        if (!this.clientStore.has(storeId)) {
            console.error(
                "received error from store " + storeId + " without being subscribed to the store",
                this.clientStore
            );
            return;
        }

        const store = this.clientStore.get(storeId)!;
        store.meta = {state: StoreConnectionState.ERROR, errors};

        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) throw new Error("store has no subscribers");

        storeSubscribers.forEach((subscriber: Subscriber<FRAGMENT>) => {
            subscriber.metaCallback(store.meta);
        });
    }    

    storeValidation(storeId: string, validationMessageBean: StoreValidationMessageBean) {
        if (!this.clientStore.has(storeId)) {
            console.error(
                "received error from store " + storeId + " without being subscribed to the store",
                this.clientStore
            );
            return;
        }

        const callback = this.transactionCallbacks.get(validationMessageBean.transactionId);
        if (!callback) {
            console.error("received validation from store " + storeId + " with transaction " + validationMessageBean.transactionId + " but no callback was registered (anymore)");
            return;
        }

        callback(validationMessageBean.action, validationMessageBean.validationBean);
    }  

    update(storeId: string, data: Map<string, AbstractIOBean>, initial: boolean) {
        if (!this.clientStore.has(storeId)) {
            console.error(
                "received data from store " + storeId + " without being subscribed to the store",
                this.clientStore
            );
            return;
        }

        const store = this.clientStore.get(storeId)!;

        if (store.meta.state === StoreConnectionState.ERROR) throw new Error("received update from store " + storeId + " but store has error state");

        const newData = new Map(store.data!);

        data.forEach((value, key) => {
            if (value === null || value === undefined) {
                newData.delete(key);
            } else {
                //value = this.deserialiser.resolve(value); // FIXME

                if (newData.has(key)) {
                    newData.set(key, Object.assign({}, newData.get(key), value));
                } else {
                    newData.set(key, value as FRAGMENT);
                }
            }
        });
        
        store.data = newData;

        store.meta = {state: StoreConnectionState.READY, errors: null};

        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) throw new Error("store has no subscribers");

        const update = new Map();
        if (Array.from(storeSubscribers.values()).some((subscriber) => subscriber.type === SubscriberType.UPDATE)) {
            for (let [key, value] of Object.entries(data)) {
                //value = this.deserialiser.deserialise(value); // FIXME

                update.set(key, value);
            }
        }

        storeSubscribers.forEach((subscriber: Subscriber<FRAGMENT>) => {
            switch (subscriber.type) {
                case SubscriberType.UPDATE:
                    console.log("PARTIAL:",update);
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
            storeSubscribers.forEach((subscriber: Subscriber<FRAGMENT>) => {
                subscriber.metaCallback(store.meta);
            }); 
        }
    }
}
