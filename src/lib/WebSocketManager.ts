
export interface ListenerCallback {
    (payload: any): void;
}

export interface ConnectivityCallback {
    (isConnected: boolean): void;
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
    connectivityListeners: Set<number>
    listenerIdCount: number;
    noReconnectOn: Set<number>;
    queue: Array<string>;
    messageIdent: string;
    payloadIdent: string;
    reconnect: boolean;

    constructor(url: string, messageIdent = "message", payloadIdent = "payload", reconnect = false) {
        this.url = url
        this.reconnect = reconnect;
        this.listenerIdCount = 0;
        this.messageToListeners = new Map();
        this.listenerToCallback = new Map();
        this.listenerToMessage = new Map();
        this.connectivityListeners = new Set();
        this.noReconnectOn = new Set();
        this.noReconnectOn.add(1000);
        this.noReconnectOn.add(1001);
        this.queue = [];
        this.messageIdent = messageIdent;
        this.payloadIdent = payloadIdent;
        this.ws = new WebSocket(url);
        this.initListeners();
    }

    isConnected() {
        return this.ws.readyState === 1;
    }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async reinit() {
        await this.sleep(1000);
        console.log("reinit");
        this.ws = new WebSocket(this.url);
        this.initListeners();
    }

    initListeners() {
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onopen = this.onConnect.bind(this);
        this.ws.onclose = this.onClose.bind(this);
    }

    onConnect(_event: Event) {
        console.log("connection established");
        const callbacks = Array.from(this.connectivityListeners.values()).map((listener: number) => this.listenerToCallback.get(listener));
        callbacks?.forEach(callback => callback(true));
        this.resolveQueue();
    }


    onClose(event: CloseEvent) {
        console.log("close connection", event);

        const callbacks = Array.from(this.connectivityListeners.values()).map((listener: number) => this.listenerToCallback.get(listener));
        callbacks?.forEach(callback => callback(false));

        if (!this.noReconnectOn.has(event.code) && this.reconnect) this.reinit();
    }

    onMessage(event: MessageEvent) {
        const data = JSON.parse(event.data);
        const message = data[this.messageIdent];
        const payload = data[this.payloadIdent];
        console.log("received message", message, "with payload", payload, "raw:", event.data);

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
        return returnRemoveCallback.bind(this);
    }


    removeConnectivityListener(id: number) {
        console.log("removing connectivity listener with id", id);
        this.connectivityListeners.delete(id);
        this.listenerToCallback.delete(id);
    }

    addConnectivityListener(callback: ListenerCallback): UnsubscribeCallback {
        const id = this.createId();
        console.log("adding connectivity listener with id", id);
        this.listenerToCallback.set(id, callback);
        this.connectivityListeners.add(id);


        const returnRemoveCallback = () => this.removeConnectivityListener(id);
        return returnRemoveCallback.bind(this);
    }
}
