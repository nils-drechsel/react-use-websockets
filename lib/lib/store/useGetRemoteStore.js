"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetRemoteStore = void 0;
const react_1 = require("react");
const RemoteStoreContext_1 = __importDefault(require("./RemoteStoreContext"));
const useGetRemoteStore = (id) => {
    const remoteStoreMap = react_1.useContext(RemoteStoreContext_1.default);
    let store = undefined;
    if (id) {
        store = remoteStoreMap.get(id);
    }
    else {
        if (remoteStoreMap.size > 0)
            store = Array.from(remoteStoreMap.values())[0];
    }
    if (!store)
        throw Error("store is null, did you provide a <RemoteStoreProvider> element with the correct id (" + id + ") ?");
    return store;
};
exports.useGetRemoteStore = useGetRemoteStore;
//# sourceMappingURL=useGetRemoteStore.js.map