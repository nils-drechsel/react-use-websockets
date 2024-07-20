"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientToServerStoreBeanBuilder = exports.clientToServerStoreBeanBuilder = void 0;
const Beans_1 = require("../beans/Beans");
const Serialisation_1 = require("./serialisation/Serialisation");
const clientToServerStoreBeanBuilder = () => {
    return new ClientToServerStoreBeanBuilder();
};
exports.clientToServerStoreBeanBuilder = clientToServerStoreBeanBuilder;
class ClientToServerStoreBeanBuilder {
    constructor() {
        this.coreBean = (0, Beans_1.createIOClientToServerStoreBean)({});
    }
    primaryPath(primaryPath) {
        this.coreBean.primaryPath = primaryPath;
        return this;
    }
    payload(payload) {
        if (typeof (payload) == "string") {
            this.coreBean.payloadJson = payload;
        }
        else {
            this.coreBean.payloadJson = (0, Serialisation_1.serialise)(payload);
        }
        return this;
    }
    parameters(payload) {
        if (typeof (payload) == "string") {
            this.coreBean.parametersJson = payload;
        }
        else {
            this.coreBean.parametersJson = (0, Serialisation_1.serialise)(payload);
        }
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
        if (!this.coreBean.primaryPath)
            throw new Error("primaryPath cannot be undefined");
        if (!this.coreBean.parametersJson)
            throw new Error("parameters cannot be undefined");
    }
}
exports.ClientToServerStoreBeanBuilder = ClientToServerStoreBeanBuilder;
//# sourceMappingURL=IOClientToServerStoreBeanBuilder.js.map