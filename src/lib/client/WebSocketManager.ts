import { CoreMessage } from "../store/beans/Beans";

export interface ListenerCallback {
    (payload: any, fromSid?: string | null): void;
}


export interface DefaultListenerCallback {
    (message: string, payload: any, fromSid?: string | null): void;
}

export interface ConnectivityCallback {
    (isConnected: boolean, isReady: boolean, sid: string | null): void;
}

export interface UnsubscribeCallback {
    (): void;
}


export class WebSocketManager {

    ws: WebSocket;
    url: string;
    messageToListeners: Map<string, Set<number>>;
    listenerToCallback: Map<number, ListenerCallback>;
    connectivityListenerToCallback: Map<number, ConnectivityCallback>;
    listenerToMessage: Map<number, string>;
    defaultCallback: DefaultListenerCallback | null;
    connectivityListeners: Set<number>;
    listenerIdCount: number;
    noReconnectOn: Set<number>;
    queue: Array<string>;
    delimiter: string;
    reconnect: boolean;
    logging: boolean;
    sid: string;

    constructor(url: string, delimiter = "\t", reconnect = false, logging = true) {
        this.url = url
        this.reconnect = reconnect;
        this.defaultCallback = null;
        this.listenerIdCount = 0;
        this.messageToListeners = new Map();
        this.listenerToCallback = new Map();
        this.listenerToMessage = new Map();
        this.connectivityListenerToCallback = new Map();
        this.connectivityListeners = new Set();
        this.noReconnectOn = new Set();
        this.noReconnectOn.add(1000);
        this.noReconnectOn.add(1001);
        this.queue = [];
        this.delimiter = delimiter;
        this.logging = logging;
        this.ws = new WebSocket(url);
        this.initListeners();
        this.sid = null as any;
    }

    isConnected(): boolean {
        return this.ws.readyState === 1;
    }

    isReady(): boolean {
        return this.ws.readyState === 1 && !!this.sid;
    }    

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async reinit() {
        await this.sleep(1000);
        if (this.logging) console.log("reinit");
        this.ws = new WebSocket(this.url);
        this.initListeners();
    }

    private initListeners() {
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onopen = this.onConnect.bind(this);
        this.ws.onclose = this.onClose.bind(this);
    }

    private onConnect(_event?: Event) {
        if (this.logging) console.log("ws connection established");
        this.send(CoreMessage.SID);
        const callbacks = Array.from(this.connectivityListeners.values()).map((listener: number) => this.connectivityListenerToCallback.get(listener));
        callbacks?.forEach(callback => callback ? callback(this.isConnected(), this.isReady(), this.sid) : null);        
    }

    private facilitateConnect() {
        if (this.logging) console.log("connection established with sid ", this.sid);
        const callbacks = Array.from(this.connectivityListeners.values()).map((listener: number) => this.connectivityListenerToCallback.get(listener));
        callbacks?.forEach(callback => callback ? callback(this.isConnected(), this.isReady(), this.sid) : null);
        this.resolveQueue();
    }


    private onClose(event: CloseEvent) {
        if (this.logging) console.log("close connection", event);

        const callbacks = Array.from(this.connectivityListeners.values()).map((listener: number) => this.connectivityListenerToCallback.get(listener));
        callbacks?.forEach(callback => callback ? callback(this.isConnected(), this.isReady(), null) : null);

        if (!this.noReconnectOn.has(event.code) && this.reconnect) this.reinit();
    }

    private onMessage(event: MessageEvent) {
        const raw: string = event.data;
        const parts = raw.split(this.delimiter);

        const message = parts[0];
        const fromSid = this.extractSid(parts[1]);
        const payload = this.extractJSONPayload(parts[2]);

        if (message === CoreMessage.SID) {
            this.sid = payload;
            this.facilitateConnect();
            return;
        }


        if (this.logging) console.log("received message", message, "from", fromSid, "with payload", payload, "raw:", event.data);

        if (!this.messageToListeners.has(message)) {
            if (this.defaultCallback) {
                if (this.logging) console.log("no listeners defined, calling default listener for ", message, "and payload", payload);
                this.defaultCallback(message, payload, fromSid);
            }
            return;
        }
        const listeners = this.messageToListeners.get(message);

        if (this.logging) console.log("message", message, "from", fromSid, "with payload", payload, " has listeners:", listeners);

        const callbacks = Array.from(listeners!.values()).map((listener: number) => this.listenerToCallback.get(listener));

        callbacks?.forEach(callback => callback ? callback(payload, fromSid) : null);
    }

    private extractSid(value: string | null | undefined) {
        if (!value) return null;
        return value;
    }

    private extractJSONPayload(payload: any) {
        try {
            return JSON.parse(payload) || null;
        } catch (e) {
            return payload;
        }
    }

    private resolveQueue() {
        while (this.isConnected && this.queue.length > 0) {
            const item = this.queue.shift();
            if (!item) continue;
            if (this.logging) console.log("sending queued item");
            this.sendRaw(item);
        }
    }


    send(message: string, payload: any = null, toSid: string | null = null) {
        const data: any = [message, toSid, typeof (payload) !== "object" ? payload : JSON.stringify(payload)]

        const raw = data.join("\t");

        if (!this.isConnected()) {
            this.queue.push(raw);
            if (this.logging) console.log("queueing", message, "with payload", payload);
        } else {
            if (this.logging) console.log("sending", message, "with payload", payload);
            this.sendRaw(raw)
        }
    }

    sendRaw(raw: string) {
        try {
            this.ws.send(raw);
        } catch (e) {
            if (this.logging) console.log("could not send message, will queue and retry");
            this.queue.push(raw);
        }
    }

    private createId() {
        return this.listenerIdCount++;
    }

    removeListener(id: number) {
        if (this.logging) console.log("removing listener with id", id);
        const message: string | null | undefined = this.listenerToMessage.get(id);
        this.listenerToMessage.delete(id);
        this.listenerToCallback.delete(id);
        if (message) this.messageToListeners.get(message)?.delete(id);
    }

    addListener(message: string, callback: ListenerCallback): UnsubscribeCallback {
        const id = this.createId();
        if (this.logging) console.log("adding listener for", message, "with id", id);
        this.listenerToCallback.set(id, callback);
        if (!this.messageToListeners.has(message)) this.messageToListeners.set(message, new Set());
        this.messageToListeners.get(message)?.add(id);
        this.listenerToMessage.set(id, message);

        const returnRemoveCallback = () => this.removeListener(id);
        return returnRemoveCallback.bind(this);
    }


    removeConnectivityListener(id: number) {
        if (this.logging) console.log("removing connectivity listener with id", id);
        this.connectivityListeners.delete(id);
        this.connectivityListenerToCallback.delete(id);
    }

    addConnectivityListener(callback: ConnectivityCallback): UnsubscribeCallback {
        const id = this.createId();
        if (this.logging) console.log("adding connectivity listener with id", id);
        this.connectivityListenerToCallback.set(id, callback);
        this.connectivityListeners.add(id);

        callback(this.isConnected(), this.isReady(), this.sid);

        const returnRemoveCallback = () => this.removeConnectivityListener(id);
        return returnRemoveCallback.bind(this);
    }

    setDefaultCallback(callback: DefaultListenerCallback) {
        this.defaultCallback = callback;
    }
}
