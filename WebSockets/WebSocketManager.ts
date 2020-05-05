


export class WebSocketManager {

    ws: WebSocket;
    url: string;
    messageToListeners: Map<string, Set<number>>;
    listenerToCallback: Map<number, any>;
    listenerToMessage: Map<number, any>;
    listenerIdCount: number;
    noReconnectOn: Set<number>;

    constructor(url: string) {
        this.url = url
        this.ws = new WebSocket(url);
        this.listenerIdCount = 0;
        this.messageToListeners = new Map();
        this.listenerToCallback = new Map();
        this.listenerToMessage = new Map();
        this.noReconnectOn = new Set();
        this.noReconnectOn.add(1000);
        this.noReconnectOn.add(1001);
    }

    reinit() {
        this.ws = new WebSocket(this.url);
    }


    onClose(event: CloseEvent) {
        if (!this.noReconnectOn.has(event.code)) this.reinit();
    }

    onMessage(event: MessageEvent) {
        const data = JSON.parse(event.data);
        const message = data.msg;
        if (!this.messageToListeners.has(message)) return;
        const listeners = this.messageToListeners.get(message);
        const callbacks = Array.from(listeners!.values()).map((listener: number) => this.listenerToMessage.get(listener));

        callbacks?.forEach(callback => callback());

    }


    send(message: string, payload: any) {
        const data = {
            msg: message,
            pl: payload
        }
        this.ws.send(JSON.stringify(data));
    }

    createId() {
        return this.listenerIdCount++;
    }

    removeListener(id: number) {
        const message = this.listenerToMessage.get(id);
        this.listenerToMessage.delete(id);
        this.listenerToCallback.delete(id);
        this.messageToListeners.get(message)?.delete(id);
    }

    addListener(message: string, callback: any) {
        const id = this.createId();
        this.listenerToCallback.set(id, callback);
        if (!this.messageToListeners.has(message)) this.messageToListeners.set(message, new Set());
        this.messageToListeners.get(message)?.add(id);
        this.listenerToMessage.set(id, message);

        const returnRemoveCallback = this.removeListener.bind(this);
        return returnRemoveCallback;
    }


}



export default WebSocketManager;