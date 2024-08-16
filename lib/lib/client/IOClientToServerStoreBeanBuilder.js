"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientToServerStoreBeanBuilder = exports.clientToServerStoreBeanBuilder = void 0;
const Beans_1 = require("../beans/Beans");
const clientToServerStoreBeanBuilder = () => {
    return new ClientToServerStoreBeanBuilder();
};
exports.clientToServerStoreBeanBuilder = clientToServerStoreBeanBuilder;
class ClientToServerStoreBeanBuilder {
    coreBean = (0, Beans_1.createIOClientToServerStoreBean)({});
    primaryPath(primaryPath) {
        this.coreBean.primaryPath = primaryPath;
        return this;
    }
    storeSessionId(storeSessionId) {
        this.coreBean.storeSessionId = storeSessionId;
        return this;
    }
    payload(payload) {
        if (typeof (payload) == "string") {
            this.coreBean.payload = payload;
        }
        return this;
    }
    parameters(payload) {
        this.coreBean.parameters = payload;
        return this;
    }
    key(key) {
        this.coreBean.key = key;
        return this;
    }
    build() {
        this.sanityCheck();
        return this.coreBean;
    }
    sanityCheck() {
        if (!this.coreBean.storeSessionId)
            throw new Error("storeSessionId cannot be undefined");
        if (!this.coreBean.primaryPath)
            throw new Error("primaryPath cannot be undefined");
        if (!this.coreBean.parameters)
            throw new Error("parameters cannot be undefined");
    }
}
exports.ClientToServerStoreBeanBuilder = ClientToServerStoreBeanBuilder;
//# sourceMappingURL=IOClientToServerStoreBeanBuilder.js.map