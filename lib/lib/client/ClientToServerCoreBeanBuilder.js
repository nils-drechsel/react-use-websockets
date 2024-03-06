"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientToServerCoreBeanBuilder = exports.clientToServerCoreBeanBuilder = void 0;
const clientToServerCoreBeanBuilder = () => {
    return new ClientToServerCoreBeanBuilder();
};
exports.clientToServerCoreBeanBuilder = clientToServerCoreBeanBuilder;
class ClientToServerCoreBeanBuilder {
    constructor() {
        this.coreBean = {};
    }
    endpoint(endpoint) {
        this.coreBean.endpoint = endpoint;
        return this;
    }
    payload(payload) {
        this.coreBean.payloadObject = payload;
        return this;
    }
    payloadJSON(payload) {
        this.coreBean.payloadJSON = payload;
        return this;
    }
    message(message) {
        this.coreBean.message = message;
        return this;
    }
    origin(origin) {
        this.coreBean.origin = origin;
        return this;
    }
    toSid(toSid) {
        this.coreBean.toSid = toSid;
        return this;
    }
    build() {
        this.sanityCheck();
        return this.coreBean;
    }
    sanityCheck() {
        if (!this.coreBean.endpoint)
            throw new Error("endpoint cannot be undefined");
        if (!this.coreBean.message)
            throw new Error("message cannot be undefined");
        if (!this.coreBean.payloadObject && !this.coreBean.payloadJSON)
            throw new Error("payload cannot be undefined");
    }
}
exports.ClientToServerCoreBeanBuilder = ClientToServerCoreBeanBuilder;
//# sourceMappingURL=ClientToServerCoreBeanBuilder.js.map