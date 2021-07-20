import { v4 as uuidv4 } from "uuid";
import Deserialiser from "../client/serialisation/Deserialisation";
import Serialiser, { BeanSerialisationSignature } from "../client/serialisation/Serialisation";
import { WebSocketManager, UnsubscribeCallback } from "../client/WebSocketManager";
import {
    CoreMessage,
    StoreUpdateBean,
    ConnectPayload,
    DisconnectPayload,
    StoreEditBean,
    AbstractWebSocketBean,
    StoreForcefulDisconnectBean,
    WritableStoreParametersBean,
    ReadableStoreParametersBean,
} from "./beans/Beans";
import { createStoreId } from "./beans/StoreBeanUtils";

enum SubscriberType {
    FULL,
    UPDATE,
}

interface Subscriber {
    type: SubscriberType;
    callback: (data: Map<string, AbstractWebSocketBean>) => void;
}

interface ClientStore {
    data: Map<string, AbstractWebSocketBean> | undefined;
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

    initRemoteStore(): [UnsubscribeCallback, UnsubscribeCallback] {
        return [
            this.websocketManager.addListener(
                CoreMessage.STORE_UPDATE,
                (payload: StoreUpdateBean, _fromSid?: string | null) => {
                    if (payload.initial) this.clear(payload.id);
                    this.update(payload.id, payload.payload);
                }
            ),
            this.websocketManager.addListener(
                CoreMessage.STORE_DISCONNECT,
                (payload: StoreForcefulDisconnectBean, _fromSid?: string | null) => {
                    payload.ids.forEach((id) => {
                        this.subscribers.delete(id);
                        this.clientStore.delete(id);
                    });
                }
            ),
        ];
    }

    releaseRemoteStore() {
        this.unsubscribeUpdateListener();
    }

    openRemoteStore(path: Array<string>, params: ReadableStoreParametersBean | null) {
        const storeId = createStoreId(path, params);
        if (!this.clientStore.has(storeId)) {
            this.clientStore.set(storeId, { data: undefined });
            const payload: ConnectPayload = {
                path,
                params,
            };
            this.websocketManager.send(CoreMessage.STORE_CONNECT, payload);
        }
    }

    closeRemoteStore(path: Array<string>, params: ReadableStoreParametersBean | null) {
        const storeId = createStoreId(path, params);
        this.clientStore.delete(storeId);
        const payload: DisconnectPayload = {
            path,
            params,
        };
        this.websocketManager.send(CoreMessage.STORE_DISCONNECT, payload);
    }

    getData(
        path: Array<string>,
        params: ReadableStoreParametersBean | null
    ): Map<String, AbstractWebSocketBean> | undefined {
        const storeId = createStoreId(path, params);
        if (!this.clientStore.has(storeId)) return undefined;
        return this.clientStore.get(storeId)!.data;
    }

    register(
        path: Array<string>,
        params: ReadableStoreParametersBean | null,
        setData: (data: Map<string, AbstractWebSocketBean>) => void,
        update: boolean = false
    ): () => void {
        const storeId = createStoreId(path, params);
        if (!this.subscribers.has(storeId)) {
            this.subscribers.set(storeId, new Map());
        }

        const id = uuidv4();
        const subscriber = {
            type: update ? SubscriberType.UPDATE : SubscriberType.FULL,
            callback: setData,
        };
        this.subscribers.get(storeId)!.set(id, subscriber);

        this.openRemoteStore(path, params);

        const returnDeregisterCallback = () => this.deregister(path, id, params);

        return returnDeregisterCallback.bind(this);
    }

    deregister(path: Array<string>, id: string, params: ReadableStoreParametersBean | null) {
        const storeId = createStoreId(path, params);
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) return;
        storeSubscribers.delete(id);
        if (storeSubscribers.size === 0) {
            storeSubscribers.delete(storeId);
            this.closeRemoteStore(path, params);
        }
    }

    editRemoteStore(
        msg: string,
        path: Array<string>,
        params: WritableStoreParametersBean | null,
        payload: AbstractWebSocketBean,
        originId: string
    ) {
        payload = this.serialiser.serialise(payload);

        const bean: StoreEditBean = {
            path,
            params,
            payload,
            originId,
        };
        this.websocketManager.send(msg, bean);
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

    update(storeId: string, data: { [key: string]: AbstractWebSocketBean }) {
        if (!this.clientStore.has(storeId)) {
            console.error(
                "received data from store " + storeId + " without being subscribed to the store",
                this.clientStore
            );
            return;
        }

        const store = this.clientStore.get(storeId)!;

        const newData = new Map(store.data!);

        for (let [key, value] of Object.entries(data)) {
            if (value === null || value === undefined) {
                newData.delete(key);
            } else {
                value = this.deserialiser.deserialise(value);

                if (newData.has(key)) {
                    newData.set(key, Object.assign({}, newData.get(key), value));
                } else {
                    newData.set(key, value);
                }
            }
        }
        store.data = newData;

        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) throw new Error("store has no subscribers");

        const update = new Map();
        if (Array.from(storeSubscribers.values()).some((subscriber) => subscriber.type === SubscriberType.UPDATE)) {
            for (let [key, value] of Object.entries(data)) {
                value = this.deserialiser.deserialise(value);

                update.set(key, value);
            }
        }

        storeSubscribers.forEach((subscriber: Subscriber) => {
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
