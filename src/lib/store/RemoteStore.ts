import { v4 as uuidv4 } from 'uuid';
import { WebSocketManager, UnsubscribeCallback } from '../client/WebSocketManager';
import { StoreMessage, StoreUpdateBean, ConnectPayload, DisconnectPayload } from "./beans/StoreBeans";
import { createStoreId } from "./beans/StoreBeanUtils";





export class RemoteStore {

    store: Map<string, Map<string, any> | undefined>;
    subscribers: Map<string, Map<string, ((data: any) => void)>>;
    websocketManager: WebSocketManager;
    unsubscribeListener: UnsubscribeCallback;

    constructor(websocketManager: WebSocketManager) {
        this.store = new Map();
        this.subscribers = new Map();
        this.websocketManager = websocketManager;
        this.unsubscribeListener = this.initRemoteStore();
    }

    initRemoteStore(): UnsubscribeCallback {
        return this.websocketManager.addListener(StoreMessage.STORE_UPDATE, (payload: StoreUpdateBean, fromSid?: string | null) => {
            this.update(payload.id, payload.payload, this.store);
        })
    }

    releaseRemoteStore() {
        this.unsubscribeListener();
    }

    openRemoteStore(path: Array<string>) {
        const storeId = createStoreId(path);
        if (!this.store.has(storeId)) {
            this.store.set(storeId, undefined);
            const payload: ConnectPayload = {
                path,
            }
            this.websocketManager.send(StoreMessage.CONNECT, payload);
        }
    }

    closeRemoteStore(path: Array<string>) {
        const storeId = createStoreId(path);
        this.store.delete(storeId);
        const payload: DisconnectPayload = {
            path,
        }
        this.websocketManager.send(StoreMessage.DISCONNECT, payload);
    }

    getData(path: Array<string>) {
        const storeId = createStoreId(path);
        if (!this.store.has(storeId)) return undefined;
        return this.store.get(storeId);
    }


    register(path: Array<string>, setData: (data: any) => void): (() => void) {
        const storeId = createStoreId(path);
        if (!this.subscribers.has(storeId)) {
            this.subscribers.set(storeId, new Map());
        }

        const storeSubscribers = this.subscribers.get(storeId);

        const id = uuidv4();
        this.subscribers.get(storeId)!.set(id, setData);

        this.openRemoteStore(path);

        const returnDeregisterCallback = () => this.deregister(path, id);

        return returnDeregisterCallback.bind(this);
    }

    deregister(path: Array<string>, id: string) {
        const storeId = createStoreId(path);
        const storeSubscribers = this.subscribers.get(storeId);
        if (!storeSubscribers) return;
        storeSubscribers.delete(id);
        if (storeSubscribers.size === 0) {
            storeSubscribers.delete(storeId);
            this.closeRemoteStore(path);
        }
    }


    update(storeId: string, data: { [key: string]: any; }, lol: any) {

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

        storeSubscribers.forEach((setData, id) => {
            setData(newStore);
        });
    }

}

