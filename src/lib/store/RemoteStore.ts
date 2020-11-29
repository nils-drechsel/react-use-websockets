import { v4 as uuidv4 } from 'uuid';
import { WebSocketManager, UnsubscribeCallback } from '../client/WebSocketManager';
import { CoreMessage, StoreUpdateBean, ConnectPayload, DisconnectPayload , StoreEditBean, AbstractWebSocketBean, StoreParametersBean, StoreForcefulDisconnectBean} from "./beans/Beans";
import { createStoreId } from "./beans/StoreBeanUtils";





export class RemoteStore {

    store: Map<string, Map<string, AbstractWebSocketBean> | undefined>;
    subscribers: Map<string, Map<string, ((data: Map<string, AbstractWebSocketBean>) => void)>>;
    websocketManager: WebSocketManager;
    unsubscribeUpdateListener: UnsubscribeCallback;
    unsubscribeDisconnectListener: UnsubscribeCallback;

    constructor(websocketManager: WebSocketManager) {
        this.store = new Map();
        this.subscribers = new Map();
        this.websocketManager = websocketManager;
        [this.unsubscribeUpdateListener, this.unsubscribeDisconnectListener] = this.initRemoteStore();
    }

    initRemoteStore(): [UnsubscribeCallback, UnsubscribeCallback] {
        return [this.websocketManager.addListener(CoreMessage.STORE_UPDATE, (payload: StoreUpdateBean, _fromSid?: string | null) => {
            this.update(payload.id, payload.payload);
        }),
            this.websocketManager.addListener(CoreMessage.STORE_DISCONNECT, (payload: StoreForcefulDisconnectBean, _fromSid?: string | null) => {
                this.subscribers.delete(payload.id);
                this.store.delete(payload.id);
        })];
    }

    releaseRemoteStore() {
        this.unsubscribeUpdateListener();
    }

    openRemoteStore(path: Array<string>, params:  StoreParametersBean | null) {
        const storeId = createStoreId(path, params);
        if (!this.store.has(storeId)) {
            this.store.set(storeId, undefined);
            const payload: ConnectPayload = {
                path,
                params
            }
            this.websocketManager.send(CoreMessage.STORE_CONNECT, payload);
        }
    }

    closeRemoteStore(path: Array<string>, params:  StoreParametersBean | null) {
        const storeId = createStoreId(path, params);
        this.store.delete(storeId);
        const payload: DisconnectPayload = {
            path,
            params
        }
        this.websocketManager.send(CoreMessage.STORE_DISCONNECT, payload);
    }

    getData(path: Array<string>, params:  StoreParametersBean | null) {
        const storeId = createStoreId(path, params);
        if (!this.store.has(storeId)) return undefined;
        return this.store.get(storeId);
    }


    register(path: Array<string>, params:  StoreParametersBean | null, setData: (data: Map<string, AbstractWebSocketBean>) => void): (() => void) {
        const storeId = createStoreId(path, params);
        if (!this.subscribers.has(storeId)) {
            this.subscribers.set(storeId, new Map());
        }

        const id = uuidv4();
        this.subscribers.get(storeId)!.set(id, setData);

        this.openRemoteStore(path, params);

        const returnDeregisterCallback = () => this.deregister(path, id, params);

        return returnDeregisterCallback.bind(this);
    }

    deregister(path: Array<string>, id: string, params:  StoreParametersBean | null) {
        const storeId = createStoreId(path, params);
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) return;
        storeSubscribers.delete(id);
        if (storeSubscribers.size === 0) {
            storeSubscribers.delete(storeId);
            this.closeRemoteStore(path, params);
        }
    }

    editRemoteStore(msg: string, path: Array<string>, params:  StoreParametersBean | null, payload: AbstractWebSocketBean, originId: string) {
        const bean: StoreEditBean = {
            path,
            params,
            payload,
            originId

        }
        this.websocketManager.send(msg, bean);
    }


    update(storeId: string, data: { [key: string]: AbstractWebSocketBean; }) {

        if (!this.store.has(storeId)) {
            console.log("received data from store " + storeId + " without being subscribed to the store", this.store);
            return;
        }
        const newStore = new Map(this.store.get(storeId)!);
        for (const [key, value] of Object.entries(data)) {
            if (value === null || value === undefined) {
                newStore.delete(key);
            } else {
                if (newStore.has(key)) {
                    newStore.set(key, Object.assign({}, newStore.get(key), value));
                } else {
                    newStore.set(key, value);
                }
            }
        }
        this.store.set(storeId, newStore);

        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) throw new Error("store has no subscribers");

        storeSubscribers.forEach((setData) => {
            setData(newStore);
        });
    }

}

