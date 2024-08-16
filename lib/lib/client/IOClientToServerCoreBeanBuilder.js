"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOClientToServerCoreBeanBuilder = exports.clientToServerCoreBeanBuilder = void 0;
const Beans_1 = require("../beans/Beans");
const clientToServerCoreBeanBuilder = () => {
    return new IOClientToServerCoreBeanBuilder();
};
exports.clientToServerCoreBeanBuilder = clientToServerCoreBeanBuilder;
class IOClientToServerCoreBeanBuilder {
    coreBean = (0, Beans_1.createIOClientToServerCoreBean)({});
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
        if (!this.coreBean.payload)
            throw new Error("payload cannot be undefined");
    }
}
exports.IOClientToServerCoreBeanBuilder = IOClientToServerCoreBeanBuilder;
//# sourceMappingURL=IOClientToServerCoreBeanBuilder.js.map