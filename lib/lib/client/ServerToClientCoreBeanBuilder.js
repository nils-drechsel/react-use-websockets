"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerToClientCoreBeanBuilder = exports.serverToClientCoreBeanBuilder = void 0;
const serverToClientCoreBeanBuilder = () => {
    return new ServerToClientCoreBeanBuilder();
};
exports.serverToClientCoreBeanBuilder = serverToClientCoreBeanBuilder;
class ServerToClientCoreBeanBuilder {
    constructor() {
        this.coreBean = {};
    }
    endpoint(endpoint) {
        this.coreBean.endpoint = endpoint;
        return this;
    }
    payload(payload) {
        this.coreBean.payload = payload;
        return this;
    }
    message(message) {
        this.coreBean.message = message;
        return this;
    }
    origin(origin) {
        if (origin)
            this.coreBean.origin = origin;
        return this;
    }
    fromSid(fromSid) {
        if (fromSid)
            this.coreBean.fromSid = fromSid;
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
        if (!this.coreBean.payload)
            throw new Error("payload cannot be undefined");
    }
}
exports.ServerToClientCoreBeanBuilder = ServerToClientCoreBeanBuilder;
//# sourceMappingURL=ServerToClientCoreBeanBuilder.js.map