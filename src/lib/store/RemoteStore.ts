import { v4 as uuidv4 } from "uuid";
import { UnsubscribeCallback, WebSocketManager } from "../client/WebSocketManager";
import Deserialiser from "../client/serialisation/Deserialisation";
import Serialiser, { BeanSerialisationSignature } from "../client/serialisation/Serialisation";
import {
    AbstractIOBean,
    AbstractStoreParametersBean,
    ClientToServerStoreMessage,
    IOClientToServerStoreBean,
    IOServerToClientStoreBean,
    ServerToClientStoreMessage,
    StoreConnectionErrorBean,
    StoreUpdateBean
} from "./beans/Beans";
import { createStoreId } from "./beans/StoreBeanUtils";

enum SubscriberType {
    FULL,
    UPDATE,
}

interface Subscriber {
    type: SubscriberType;
    dataCallback: (data: Map<string, AbstractIOBean>) => void;
    metaCallback: (meta: StoreMeta) => void;
}

export enum StoreConnectionState {
    CONNECTING,
    CONNECTED,
    READY,
    ERROR
}

export interface StoreMeta {
    state: StoreConnectionState;
    errors: Array<string> | null;
}

interface ClientStore {
    meta: StoreMeta;
    data: Map<string, AbstractIOBean> | undefined;
}

export class RemoteStore {
    clientStore: Map<string, ClientStore>;
    subscribers: Map<string, Map<string, Subscriber>>;
    websocketManager: WebSocketManager;
    unsubscribeUpdateListener: UnsubscribeCallback;
    unsubscribeDisconnectListener: UnsubscribeCallback;
    serialiser: Serialiser;
    deserialiser: Deserialiser;

    constructor(websocketManager: WebSocketManager, serialisationSignatures?: Map<string, BeanSerialisationSignature>) {
        this.clientStore = new Map();
        this.subscribers = new Map();
        this.websocketManager = websocketManager;

        this.serialiser = new Serialiser(serialisationSignatures);
        this.deserialiser = new Deserialiser(serialisationSignatures);

        [this.unsubscribeUpdateListener, this.unsubscribeDisconnectListener] = this.initRemoteStore();
    }

    initRemoteStore(): [UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback] {
        return [
            this.websocketManager.addListener(
                "store",
                ServerToClientStoreMessage.UPDATE,
                (storeBean: IOServerToClientStoreBean, _fromSid?: string | null) => {

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
                "store",
                ServerToClientStoreMessage.DISCONNECT_FORCEFULLY,
                (_payload: IOServerToClientStoreBean, _fromSid?: string | null) => {
                    // FIXME
                    console.error("FORCEFUL DISCONNECT");

                    // payload.ids.forEach((id) => {
                    //     this.subscribers.delete(id);
                    //     this.clientStore.delete(id);
                    // });
                }
            ),
            this.websocketManager.addListener(
                "store",
                ServerToClientStoreMessage.CONNECTED,
                (storeBean: IOServerToClientStoreBean, _fromSid?: string | null) => {

                    //const payload: StoreConnectedBean = this.deserialiser.deserialise(storeBean.payload);
                    
                    this.storeConnected(storeBean.secondaryId);
                }
            ),
            this.websocketManager.addListener(
                "store",
                ServerToClientStoreMessage.CONNECTION_ERROR,
                (storeBean: IOServerToClientStoreBean, _fromSid?: string | null) => {

                    const payload: StoreConnectionErrorBean = this.deserialiser.deserialise(storeBean.payload);

                    this.storeConnectionError(storeBean.secondaryId, payload.errors);
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
            this.websocketManager.send("store", ClientToServerStoreMessage.CONNECT, payload);
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
        this.websocketManager.send("store", ClientToServerStoreMessage.DISCONNECT, payload);
    }

    getData(
        primaryPath: Array<string>, 
        secondaryPath: Array<string>,
        params: AbstractStoreParametersBean | null
    ): Map<String, AbstractIOBean> | undefined {
        const storeId = createStoreId(primaryPath, secondaryPath, params);
        if (!this.clientStore.has(storeId)) {
            throw new Error("store " + storeId + " does not exist");
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
            throw new Error("store " + storeId + " does not exist");
        }
        return this.clientStore.get(storeId)!.meta;
    }

    register(
        primaryPath: Array<string>,
        secondaryPath: Array<string>,
        params: AbstractStoreParametersBean | null,
        setData: (data: Map<string, AbstractIOBean>) => void,
        setMeta: (meta: StoreMeta) => void,
        update: boolean = false
    ): () => void {
        const storeId = createStoreId(primaryPath, secondaryPath, params);
        if (!this.subscribers.has(storeId)) {
            this.subscribers.set(storeId, new Map());
        }

        const id = uuidv4();
        const subscriber: Subscriber = {
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

    updateBean(
        primaryPath: Array<string>, 
        secondaryPath: Array<string>,
        params: AbstractStoreParametersBean | null,
        payload: AbstractIOBean,
        origin: string
    ) {

        const storeBean: IOClientToServerStoreBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params),
            payloadJson: this.serialiser.serialise(payload),
            origin,
        }

        this.websocketManager.send("store", ClientToServerStoreMessage.UPDATE, storeBean);
    }

    insertBean(
        primaryPath: Array<string>, 
        secondaryPath: Array<string>,
        params: AbstractStoreParametersBean | null,
        payload: AbstractIOBean,
        origin: string
    ) {

        const storeBean: IOClientToServerStoreBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params),
            payloadJson: this.serialiser.serialise(payload),
            origin,
        }

        this.websocketManager.send("store", ClientToServerStoreMessage.INSERT, storeBean);
    }    

    removeBean(
        primaryPath: Array<string>, 
        secondaryPath: Array<string>,
        params: AbstractStoreParametersBean | null,
        key: string,
        origin: string
    ) {

        const storeBean: IOClientToServerStoreBean = {
            primaryPath,
            secondaryPath,
            parametersJson: this.serialiser.serialise(params),
            key,
            origin,
        }

        this.websocketManager.send("store", ClientToServerStoreMessage.REMOVE, storeBean);
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

        storeSubscribers.forEach((subscriber: Subscriber) => {
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

        storeSubscribers.forEach((subscriber: Subscriber) => {
            subscriber.metaCallback(store.meta);
        });
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
                    newData.set(key, value);
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

        storeSubscribers.forEach((subscriber: Subscriber) => {
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
            storeSubscribers.forEach((subscriber: Subscriber) => {
                subscriber.metaCallback(store.meta);
            }); 
        }
    }
}
