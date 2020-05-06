"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class WebSocketManager {
    constructor(url, messageIdent = "message", payloadIdent = "payload", reconnect = false) {
        this.url = url;
        this.reconnect = reconnect;
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
        this.initListeners();
    }
    isConnected() {
        return this.ws.readyState === 1;
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    reinit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sleep(1000);
            console.log("reinit");
            this.ws = new WebSocket(this.url);
            this.initListeners();
        });
    }
    initListeners() {
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onopen = this.onConnect.bind(this);
        this.ws.onclose = this.onClose.bind(this);
    }
    onConnect(_event) {
        console.log("connection established");
        this.resolveQueue();
    }
    onClose(event) {
        console.log("close connection", event);
        if (!this.noReconnectOn.has(event.code) && this.reconnect)
            this.reinit();
    }
    onMessage(event) {
        const data = JSON.parse(event.data);
        const message = data[this.messageIdent];
        const payload = data[this.payloadIdent];
        console.log("received message", message, "with payload", payload, "raw:", event.data);
        if (!this.messageToListeners.has(message))
            return;
        const listeners = this.messageToListeners.get(message);
        console.log("message", message, "with payload", payload, " has listeners:", listeners);
        const callbacks = Array.from(listeners.values()).map((listener) => this.listenerToCallback.get(listener));
        callbacks === null || callbacks === void 0 ? void 0 : callbacks.forEach(callback => callback(payload));
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
        const data = {};
        data[this.messageIdent] = message;
        if (payload) {
            data[this.payloadIdent] = payload;
        }
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
