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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketManager = void 0;
const Beans_1 = require("../store/beans/Beans");
const cookie_1 = require("./cookie");
const Deserialisation_1 = __importDefault(require("./serialisation/Deserialisation"));
const Serialisation_1 = __importDefault(require("./serialisation/Serialisation"));
class WebSocketManager {
    constructor(url, domain, delimiter = "\t", reconnect = false, ping = 5, logging = true, serialisationSignatures) {
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
        this.delimiter = delimiter;
        this.logging = logging;
        this.serialiser = new Serialisation_1.default(serialisationSignatures);
        this.deserialiser = new Deserialisation_1.default(serialisationSignatures);
        this.ws = new WebSocket(url);
        this.initListeners();
        this.sid = null;
        this.uid = null;
        this.domain = domain;
        this.unsubscribeInterval = setInterval(() => {
            if (this.logging)
                console.log("PING");
            this.send(Beans_1.CoreMessage.PING);
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
    reinit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sleep(1000);
            if (this.logging)
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
        if (this.logging)
            console.log("ws connection established");
        const authenticationBean = {
            token0: cookie_1.getCookie("token0"),
            token1: cookie_1.getCookie("token1"),
        };
        this.send(Beans_1.CoreMessage.AUTHENTICATE, authenticationBean);
        const callbacks = Array.from(this.connectivityListeners.values()).map((listener) => this.connectivityListenerToCallback.get(listener));
        callbacks === null || callbacks === void 0 ? void 0 : callbacks.forEach((callback) => callback ? callback(this.isConnected(), this.isReady(), this.sid, this.uid) : null);
    }
    facilitateConnect() {
        if (this.logging)
            console.log("connection established with sid ", this.sid, this.uid);
        const callbacks = Array.from(this.connectivityListeners.values()).map((listener) => this.connectivityListenerToCallback.get(listener));
        callbacks === null || callbacks === void 0 ? void 0 : callbacks.forEach((callback) => callback ? callback(this.isConnected(), this.isReady(), this.sid, this.uid) : null);
        this.resolveQueue();
    }
    onClose(event) {
        if (this.logging)
            console.log("close connection", event);
        const callbacks = Array.from(this.connectivityListeners.values()).map((listener) => this.connectivityListenerToCallback.get(listener));
        callbacks === null || callbacks === void 0 ? void 0 : callbacks.forEach((callback) => (callback ? callback(this.isConnected(), this.isReady(), null, null) : null));
        if (!this.noReconnectOn.has(event.code) && this.reconnect)
            this.reinit();
    }
    onMessage(event) {
        const raw = event.data;
        const parts = raw.split(this.delimiter);
        const message = parts[0];
        const fromSid = this.extractSid(parts[1]);
        let payload = this.extractJSONPayload(parts[2]);
        payload = this.deserialiser.deserialise(payload);
        if (message === Beans_1.CoreMessage.AUTHENTICATE) {
            const authenticationBean = payload;
            this.sid = authenticationBean.sid;
            this.uid = authenticationBean.uid;
            if (this.logging)
                console.log("received authentication bean with sid ", this.sid, "and uid", this.uid);
            cookie_1.setCookie("token0", authenticationBean.token0, this.domain, authenticationBean.validity);
            cookie_1.setCookie("token1", authenticationBean.token1, this.domain, authenticationBean.validity);
            this.facilitateConnect();
            return;
        }
        else if (message === Beans_1.CoreMessage.PONG) {
            if (this.logging)
                console.log("PONG");
            return;
        }
        if (this.logging)
            console.log("received message", message, "from", fromSid, "with payload", payload, "raw:", event.data);
        if (!this.messageToListeners.has(message)) {
            if (this.defaultCallback) {
                if (this.logging)
                    console.log("no listeners defined, calling default listener for ", message, "and payload", payload);
                this.defaultCallback(message, payload, fromSid);
            }
            return;
        }
        const listeners = this.messageToListeners.get(message);
        if (this.logging)
            console.log("message", message, "from", fromSid, "with payload", payload, " has listeners:", listeners);
        const callbacks = Array.from(listeners.values()).map((listener) => this.listenerToCallback.get(listener));
        callbacks === null || callbacks === void 0 ? void 0 : callbacks.forEach((callback) => (callback ? callback(payload, fromSid) : null));
    }
    extractSid(value) {
        if (!value)
            return null;
        return value;
    }
    extractJSONPayload(payload) {
        try {
            return JSON.parse(payload) || null;
        }
        catch (e) {
            return payload;
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
    send(message, payload = null, toSid = null) {
        payload = this.serialiser.serialise(payload);
        const data = [message, toSid, typeof payload !== "object" ? payload : JSON.stringify(payload)];
        const raw = data.join("\t");
        if (!this.isConnected()) {
            this.queue.push(raw);
            if (this.logging)
                console.log("queueing", message, "with payload", payload);
        }
        else {
            if (this.logging)
                console.log("sending", message, "with payload", payload);
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
        var _a;
        if (this.logging)
            console.log("removing listener with id", id);
        const message = this.listenerToMessage.get(id);
        this.listenerToMessage.delete(id);
        this.listenerToCallback.delete(id);
        if (message)
            (_a = this.messageToListeners.get(message)) === null || _a === void 0 ? void 0 : _a.delete(id);
    }
    addListener(message, callback) {
        var _a;
        const id = this.createId();
        if (this.logging)
            console.log("adding listener for", message, "with id", id);
        this.listenerToCallback.set(id, callback);
        if (!this.messageToListeners.has(message))
            this.messageToListeners.set(message, new Set());
        (_a = this.messageToListeners.get(message)) === null || _a === void 0 ? void 0 : _a.add(id);
        this.listenerToMessage.set(id, message);
        const returnRemoveCallback = () => this.removeListener(id);
        return returnRemoveCallback.bind(this);
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