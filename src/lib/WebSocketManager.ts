
export interface ListenerCallback {
    (message: string, payload: any, id: number | null | undefined): void;
}

export interface UnsubscribeCallback {
    (): void;
}


export class WebSocketManager {

    ws: WebSocket;
    url: string;
    messageToListeners: Map<string, Set<number>>;
    listenerToCallback: Map<number, any>;
    listenerToMessage: Map<number, any>;
    listenerIdCount: number;
    noReconnectOn: Set<number>;
    queue: Array<string>;
    messageIdent: string;
    payloadIdent: string;

    constructor(url: string, messageIdent = "message", payloadIdent = "payload") {
        this.url = url
        this.listenerIdCount = 0;
        this.messageToListeners = new Map();
        this.listenerToCallback = new Map();
        this.listenerToMessage = new Map();
        this.noReconnectOn = new Set();
        this.noReconnectOn.add(1000);
        this.noReconnectOn.add(1001);
        this.queue = [];
        this.messageIdent = messageIdent;
        this.payloadIdent = payloadIdent;
        this.ws = new WebSocket(url);
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onopen = this.onConnect.bind(this);
        this.ws.onclose = this.onClose.bind(this);
    }

    isConnected() {
        return this.ws.readyState === 1;
    }

    reinit() {
        console.log("reinit");
        this.ws = new WebSocket(this.url);
    }

    onConnect(_event: Event) {
        console.log("connection established");
        this.resolveQueue();
    }


    onClose(event: CloseEvent) {
        console.log("close connection");
        if (!this.noReconnectOn.has(event.code)) this.reinit();
    }

    onMessage(event: MessageEvent) {
        const data = JSON.parse(event.data);
        const message = data[this.messageIdent];
        const payload = data[this.payloadIdent];
        console.log("received message", message, "with payload", data.payload, "raw:", event.data);

        if (!this.messageToListeners.has(message)) return;
        const listeners = this.messageToListeners.get(message);

        console.log("message", message, "with payload", payload, " has listeners:", listeners);

        const callbacks = Array.from(listeners!.values()).map((listener: number) => this.listenerToCallback.get(listener));

        callbacks?.forEach(callback => callback(payload));

    }

    resolveQueue() {
        while (this.isConnected && this.queue.length > 0) {
            const item = this.queue.shift();
            if (!item) continue;
            console.log("sending queued item");
            this.sendRaw(item);
        }
    }


    send(message: string, payload: any = null) {
        const data: any = {}
        data[this.messageIdent] = message;
        if (payload) {
            data[this.payloadIdent] = payload
        }

        const raw = JSON.stringify(data);

        if (!this.isConnected()) {
            this.queue.push(raw);
            console.log("queueing", message, "with payload", payload);
        } else {
            console.log("sending", message, "with payload", payload);
            this.sendRaw(raw)
        }
    }

    sendRaw(raw: string) {
        try {
            this.ws.send(raw);
        } catch (e) {
            console.log("could not send message, will queue and retry");
            this.queue.push(raw);
        }
    }

    createId() {
        return this.listenerIdCount++;
    }

    removeListener(id: number) {
        console.log("removing listener with id", id);
        const message = this.listenerToMessage.get(id);
        this.listenerToMessage.delete(id);
        this.listenerToCallback.delete(id);
        this.messageToListeners.get(message)?.delete(id);
    }

    addListener(message: string, callback: ListenerCallback): UnsubscribeCallback {
        const id = this.createId();
        console.log("adding listener for", message, "with id", id);
        this.listenerToCallback.set(id, callback);
        if (!this.messageToListeners.has(message)) this.messageToListeners.set(message, new Set());
        this.messageToListeners.get(message)?.add(id);
        this.listenerToMessage.set(id, message);

        const returnRemoveCallback = () => this.removeListener(id);
        return returnRemoveCallback;
    }


}
