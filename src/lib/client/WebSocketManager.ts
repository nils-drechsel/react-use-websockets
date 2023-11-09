import { ClientToServerAuthenticationBean, CoreMessage, IOClientToServerCoreBean, IOPingPongBean, IOServerToClientCoreBean, ServerToClientAuthenticationBean } from "../store/beans/Beans";
import { getCookie, setCookie } from "./cookie";
import Deserialiser from "./serialisation/Deserialisation";
import Serialiser, { BeanSerialisationSignature } from "./serialisation/Serialisation";

export interface ListenerCallback {
    (payload: any, fromSid?: string | null): void;
}

export interface DefaultListenerCallback {
    (message: string, payload: any, fromSid?: string | null): void;
}

export interface ConnectivityCallback {
    (isConnected: boolean, isReady: boolean, sid: string | null, uid: string | null): void;
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
    reconnect: boolean;
    logging: boolean;
    sid: string;
    uid: string;
    domain: string;
    unsubscribeInterval: number;
    serialiser: Serialiser;
    deserialiser: Deserialiser;

    constructor(
        url: string,
        domain: string,
        reconnect = false,
        ping = 5,
        logging = true,
        serialisationSignatures?: Map<string, BeanSerialisationSignature>
    ) {
        this.url = url;
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
        this.logging = logging;

        this.serialiser = new Serialiser(serialisationSignatures);
        this.deserialiser = new Deserialiser(serialisationSignatures);

        this.ws = new WebSocket(url);
        this.initListeners();
        this.sid = null as any;
        this.uid = null as any;
        this.domain = domain;

        this.unsubscribeInterval = setInterval(() => {
            if (this.logging) console.log("PING");
            this.send("core", CoreMessage.PING, {} as IOPingPongBean);
        }, ping * 60 * 1000) as unknown as number;
    }

    isConnected(): boolean {
        return this.ws.readyState === 1;
    }

    isReady(): boolean {
        return this.ws.readyState === 1 && !!this.sid && !!this.uid;
    }

    sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
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

        const authenticationBean: ClientToServerAuthenticationBean = {
            token0: getCookie("token0"),
            token1: getCookie("token1"),
        };

        this.send("core", CoreMessage.AUTHENTICATE, authenticationBean);

        const callbacks = Array.from(this.connectivityListeners.values()).map((listener: number) =>
            this.connectivityListenerToCallback.get(listener)
        );
        callbacks?.forEach((callback) =>
            callback ? callback(this.isConnected(), this.isReady(), this.sid, this.uid) : null
        );
    }

    private facilitateConnect() {
        if (this.logging) console.log("connection established with sid ", this.sid, this.uid);
        const callbacks = Array.from(this.connectivityListeners.values()).map((listener: number) =>
            this.connectivityListenerToCallback.get(listener)
        );
        callbacks?.forEach((callback) =>
            callback ? callback(this.isConnected(), this.isReady(), this.sid, this.uid) : null
        );
        this.resolveQueue();
    }

    private onClose(event: CloseEvent) {
        if (this.logging) console.log("close connection", event);

        const callbacks = Array.from(this.connectivityListeners.values()).map((listener: number) =>
            this.connectivityListenerToCallback.get(listener)
        );
        callbacks?.forEach((callback) => (callback ? callback(this.isConnected(), this.isReady(), null, null) : null));

        if (!this.noReconnectOn.has(event.code) && this.reconnect) this.reinit();
    }

    private onMessage(event: MessageEvent) {
        const raw: string = event.data;

        const coreBean: IOServerToClientCoreBean = this.deserialiser.deserialise(raw);

        const endpoint = coreBean.endpoint;
        const message = coreBean.message;

        const messageId = this.createMessageId(endpoint, message);

        const fromSid = coreBean.fromSid;
        const payloadJSON = JSON.parse(coreBean.payload);

        const payload = this.deserialiser.deserialise(payloadJSON);
        

        if (messageId === this.createMessageId("core", CoreMessage.AUTHENTICATE)) {
            const authenticationBean = payload as ServerToClientAuthenticationBean;
            this.sid = authenticationBean.sid;
            this.uid = authenticationBean.uid;
            if (this.logging) console.log("received authentication bean with sid ", this.sid, "and uid", this.uid);
            setCookie("token0", authenticationBean.token0, this.domain, authenticationBean.validity);
            setCookie("token1", authenticationBean.token1, this.domain, authenticationBean.validity);
            this.facilitateConnect();
            return;
        } else if (messageId === this.createMessageId("core", CoreMessage.PONG)) {
            if (this.logging) console.log("PONG");
            return;
        }

        if (this.logging)
            console.log("received message", messageId, "from", fromSid, "with payload", payload, "raw:", event.data);

        if (!this.messageToListeners.has(messageId)) {
            if (this.defaultCallback) {
                if (this.logging)
                    console.log("no listeners defined, calling default listener for ", message, "and payload", payload);
                this.defaultCallback(messageId, payload, fromSid);
            }
            return;
        }
        const listeners = this.messageToListeners.get(messageId);

        if (this.logging)
            console.log("message", messageId, "from", fromSid, "with payload", payload, " has listeners:", listeners);

        const callbacks = Array.from(listeners!.values()).map((listener: number) =>
            this.listenerToCallback.get(listener)
        );

        callbacks?.forEach((callback) => (callback ? callback(payload, fromSid) : null));
    }


    private resolveQueue() {
        while (this.isConnected() && this.queue.length > 0) {
            const item = this.queue.shift();
            if (!item) continue;
            if (this.logging) console.log("sending queued item");
            this.sendRaw(item);
        }
    }

    send(endpoint: string, message: string, payload: any = null, toSid: string | null = null) {

        const _payload = this.serialiser.serialise(payload);

        const coreBean: IOClientToServerCoreBean = {
            endpoint,
            payload: _payload,
            toSid: toSid,
            message: message,
        }

        const raw = this.serialiser.serialise(coreBean);

        if (!this.isConnected()) {
            this.queue.push(raw);
            if (this.logging) console.log("queueing", message, "with payload", payload);
        } else {
            if (this.logging) console.log("sending", message, "with payload", payload);
            this.sendRaw(raw);
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

    addListener(endpoint:string, message: string, callback: ListenerCallback): UnsubscribeCallback {
        const id = this.createId();
        const messageId = this.createMessageId(endpoint, message);
        if (this.logging) console.log("adding listener for", messageId, "with id", id);
        this.listenerToCallback.set(id, callback);
        if (!this.messageToListeners.has(messageId)) this.messageToListeners.set(messageId, new Set());
        this.messageToListeners.get(messageId)?.add(id);
        this.listenerToMessage.set(id, messageId);

        const returnRemoveCallback = () => this.removeListener(id);
        return returnRemoveCallback.bind(this);
    }

    createMessageId(endpoint: string, message:string): string {
        return endpoint + "/" + message;
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

        callback(this.isConnected(), this.isReady(), this.sid, this.uid);

        const returnRemoveCallback = () => this.removeConnectivityListener(id);
        return returnRemoveCallback.bind(this);
    }

    setDefaultCallback(callback: DefaultListenerCallback): void {
        this.defaultCallback = callback;
    }

    getSid(): string {
        return this.sid;
    }

    getUid(): string {
        return this.uid;
    }

    destroy(): void {
        clearInterval(this.unsubscribeInterval);
        this.ws.onmessage = null;
        this.ws.onopen = null;
        this.ws.onclose = null;
        this.ws.close();
    }
}
