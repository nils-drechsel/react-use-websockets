"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketManager = void 0;
const Beans_1 = require("../beans/Beans");
const RemoteStore_1 = require("../store/RemoteStore");
const IOClientToServerCoreBeanBuilder_1 = require("./IOClientToServerCoreBeanBuilder");
const ServerToClientCoreBeanBuilder_1 = require("./ServerToClientCoreBeanBuilder");
const cookie_1 = require("./cookie");
const Deserialisation_1 = require("./serialisation/Deserialisation");
const Serialisation_1 = require("./serialisation/Serialisation");
class WebSocketManager {
    ws;
    url;
    messageToListeners;
    listenerToCallback;
    connectivityListenerToCallback;
    listenerToMessage;
    defaultCallback;
    connectivityListeners;
    listenerIdCount;
    noReconnectOn;
    queue;
    reconnect;
    logging;
    sid;
    uid;
    domain;
    unsubscribeInterval;
    constructor(url, domain, reconnect = false, ping = 5, logging = true) {
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
        this.ws = new WebSocket(url);
        this.initListeners();
        this.sid = null;
        this.uid = null;
        this.domain = domain;
        this.unsubscribeInterval = setInterval(() => {
            if (this.logging)
                console.log("PING");
            this.send((0, IOClientToServerCoreBeanBuilder_1.clientToServerCoreBeanBuilder)()
                .endpoint(Beans_1.IOCoreEndpoints.CORE)
                .message(Beans_1.CoreMessage.PING)
                .payload((0, Beans_1.createIOPingPongBean)())
                .build());
        }, ping * 60 * 1000);
    }
    isConnected() {
        return this.ws.readyState === 1;
    }
    isReady() {
        return this.ws.readyState === 1 && !!this.sid && !!this.uid;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async reinit() {
        await this.sleep(1000);
        if (this.logging)
            console.log("reinit");
        this.ws = new WebSocket(this.url);
        this.initListeners();
    }
    initListeners() {
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onopen = this.onConnect.bind(this);
        this.ws.onclose = this.onClose.bind(this);
    }
    onConnect(_event) {
        if (this.logging)
            console.log("ws connection established");
        const authenticationBean = (0, Beans_1.createClientToServerAuthenticationBean)({
            token0: (0, cookie_1.getCookie)("token0"),
            token1: (0, cookie_1.getCookie)("token1"),
        });
        this.send((0, IOClientToServerCoreBeanBuilder_1.clientToServerCoreBeanBuilder)()
            .endpoint(Beans_1.IOCoreEndpoints.CORE)
            .message(Beans_1.CoreMessage.AUTHENTICATE)
            .payload(authenticationBean)
            .build());
        const callbacks = Array.from(this.connectivityListeners.values()).map((listener) => this.connectivityListenerToCallback.get(listener));
        callbacks?.forEach((callback) => callback ? callback(this.isConnected(), this.isReady(), this.sid, this.uid) : null);
    }
    facilitateConnect() {
        if (this.logging)
            console.log("connection established with sid ", this.sid, this.uid);
        const callbacks = Array.from(this.connectivityListeners.values()).map((listener) => this.connectivityListenerToCallback.get(listener));
        callbacks?.forEach((callback) => callback ? callback(this.isConnected(), this.isReady(), this.sid, this.uid) : null);
        this.resolveQueue();
    }
    onClose(event) {
        if (this.logging)
            console.log("close connection", event);
        const callbacks = Array.from(this.connectivityListeners.values()).map((listener) => this.connectivityListenerToCallback.get(listener));
        callbacks?.forEach((callback) => (callback ? callback(this.isConnected(), this.isReady(), null, null) : null));
        if (!this.noReconnectOn.has(event.code) && this.reconnect)
            this.reinit();
    }
    onMessage(event) {
        const raw = event.data;
        const coreBean = (0, Deserialisation_1.deserialise)(raw);
        const bean = (0, ServerToClientCoreBeanBuilder_1.serverToClientCoreBeanBuilder)()
            .endpoint(coreBean.endpoint)
            .message(coreBean.message)
            .payload(coreBean.payload)
            .origin(coreBean.origin ?? undefined)
            .fromSid(coreBean.fromSid ?? undefined)
            .build();
        const messageId = this.createMessageId(bean.endpoint, bean.message);
        if (messageId === this.createMessageId(Beans_1.IOCoreEndpoints.CORE, Beans_1.CoreMessage.AUTHENTICATE)) {
            const authenticationBean = bean.payload;
            this.sid = authenticationBean.sid;
            this.uid = authenticationBean.uid;
            if (this.logging)
                console.log("received authentication bean with sid ", this.sid, "and uid", this.uid);
            (0, cookie_1.setCookie)("token0", authenticationBean.token0, this.domain, authenticationBean.validity);
            (0, cookie_1.setCookie)("token1", authenticationBean.token1, this.domain, authenticationBean.validity);
            this.facilitateConnect();
            return;
        }
        else if (messageId === this.createMessageId(Beans_1.IOCoreEndpoints.CORE, Beans_1.CoreMessage.PONG)) {
            if (this.logging)
                console.log("PONG");
            return;
        }
        if (this.logging)
            console.log("received message", messageId, "from", bean.fromSid, "with payload", bean.payload, "raw:", event.data);
        if (!this.messageToListeners.has(messageId)) {
            if (this.defaultCallback) {
                if (this.logging)
                    console.log("no listeners defined, calling default listener for ", bean.message, "and payload", bean.payload);
                this.defaultCallback(bean);
            }
            return;
        }
        const listeners = this.messageToListeners.get(messageId);
        const callbacks = Array.from(listeners.values()).map((listener) => this.listenerToCallback.get(listener));
        try {
            callbacks?.forEach((callback) => (callback ? callback(bean) : null));
        }
        catch (e) {
            if (e instanceof RemoteStore_1.SessionError) {
                console.error(e.message);
            }
            else {
                throw e;
            }
        }
    }
    resolveQueue() {
        while (this.isConnected() && this.queue.length > 0) {
            const item = this.queue.shift();
            if (!item)
                continue;
            if (this.logging)
                console.log("sending queued item");
            this.sendRaw(item);
        }
    }
    send(coreBean) {
        const raw = (0, Serialisation_1.serialise)(coreBean);
        if (!this.isConnected()) {
            this.queue.push(raw);
            if (this.logging)
                console.log("queueing", coreBean.message, "with payload", coreBean.payload);
        }
        else {
            if (this.logging)
                console.log("sending", coreBean.message, "with payload", coreBean.payload);
            this.sendRaw(raw);
        }
    }
    sendRaw(raw) {
        try {
            this.ws.send(raw);
        }
        catch (e) {
            if (this.logging)
                console.log("could not send message, will queue and retry");
            this.queue.push(raw);
        }
    }
    createId() {
        return this.listenerIdCount++;
    }
    removeListener(id) {
        if (this.logging)
            console.log("removing listener with id", id);
        const message = this.listenerToMessage.get(id);
        this.listenerToMessage.delete(id);
        this.listenerToCallback.delete(id);
        if (message)
            this.messageToListeners.get(message)?.delete(id);
    }
    addListener(endpoint, message, callback) {
        const id = this.createId();
        const messageId = this.createMessageId(endpoint, message);
        if (this.logging)
            console.log("adding listener for", messageId, "with id", id);
        this.listenerToCallback.set(id, callback);
        if (!this.messageToListeners.has(messageId))
            this.messageToListeners.set(messageId, new Set());
        this.messageToListeners.get(messageId)?.add(id);
        this.listenerToMessage.set(id, messageId);
        const returnRemoveCallback = () => this.removeListener(id);
        return returnRemoveCallback.bind(this);
    }
    createMessageId(endpoint, message) {
        return endpoint + "/" + message;
    }
    removeConnectivityListener(id) {
        if (this.logging)
            console.log("removing connectivity listener with id", id);
        this.connectivityListeners.delete(id);
        this.connectivityListenerToCallback.delete(id);
    }
    addConnectivityListener(callback) {
        const id = this.createId();
        if (this.logging)
            console.log("adding connectivity listener with id", id);
        this.connectivityListenerToCallback.set(id, callback);
        this.connectivityListeners.add(id);
        callback(this.isConnected(), this.isReady(), this.sid, this.uid);
        const returnRemoveCallback = () => this.removeConnectivityListener(id);
        return returnRemoveCallback.bind(this);
    }
    setDefaultCallback(callback) {
        this.defaultCallback = callback;
    }
    getSid() {
        return this.sid;
    }
    getUid() {
        return this.uid;
    }
    destroy() {
        clearInterval(this.unsubscribeInterval);
        this.ws.onmessage = null;
        this.ws.onopen = null;
        this.ws.onclose = null;
        this.ws.close();
    }
}
exports.WebSocketManager = WebSocketManager;
//# sourceMappingURL=WebSocketManager.js.map