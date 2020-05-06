"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebSocketManager {
    constructor(url) {
        this.url = url;
        this.ws = new WebSocket(url);
        this.listenerIdCount = 0;
        this.messageToListeners = new Map();
        this.listenerToCallback = new Map();
        this.listenerToMessage = new Map();
        this.noReconnectOn = new Set();
        this.noReconnectOn.add(1000);
        this.noReconnectOn.add(1001);
        this.queue = [];
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
    onConnect(_event) {
        console.log("connection established");
        this.resolveQueue();
    }
    onClose(event) {
        console.log("close connection");
        if (!this.noReconnectOn.has(event.code))
            this.reinit();
    }
    onMessage(event) {
        const data = JSON.parse(event.data);
        const message = data.msg;
        if (!this.messageToListeners.has(message))
            return;
        const listeners = this.messageToListeners.get(message);
        console.log("received message", message, "with payload", data.payload, " listeners:", listeners);
        const callbacks = Array.from(listeners.values()).map((listener) => this.listenerToMessage.get(listener));
        callbacks === null || callbacks === void 0 ? void 0 : callbacks.forEach(callback => callback());
    }
    resolveQueue() {
        while (this.isConnected && this.queue.length > 0) {
            const item = this.queue.shift();
            if (!item)
                continue;
            console.log("sending queued item");
            this.sendRaw(item);
        }
    }
    send(message, payload = null) {
        const data = {
            msg: message,
            pl: payload
        };
        const raw = JSON.stringify(data);
        if (!this.isConnected()) {
            this.queue.push(raw);
            console.log("queueing", message, "with payload", payload);
        }
        else {
            console.log("sending", message, "with payload", payload);
            this.sendRaw(raw);
        }
    }
    sendRaw(raw) {
        try {
            this.ws.send(raw);
        }
        catch (e) {
            console.log("could not send message, will queue and retry");
            this.queue.push(raw);
        }
    }
    createId() {
        return this.listenerIdCount++;
    }
    removeListener(id) {
        var _a;
        console.log("removing listener with id", id);
        const message = this.listenerToMessage.get(id);
        this.listenerToMessage.delete(id);
        this.listenerToCallback.delete(id);
        (_a = this.messageToListeners.get(message)) === null || _a === void 0 ? void 0 : _a.delete(id);
    }
    addListener(message, callback) {
        var _a;
        const id = this.createId();
        console.log("adding listener for", message, "with id", id);
        this.listenerToCallback.set(id, callback);
        if (!this.messageToListeners.has(message))
            this.messageToListeners.set(message, new Set());
        (_a = this.messageToListeners.get(message)) === null || _a === void 0 ? void 0 : _a.add(id);
        this.listenerToMessage.set(id, message);
        const returnRemoveCallback = () => this.removeListener(id);
        return returnRemoveCallback;
    }
}
exports.WebSocketManager = WebSocketManager;
