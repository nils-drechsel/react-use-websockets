"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteStoreProvider = void 0;
const react_1 = __importStar(require("react"));
const RemoteStore_1 = require("./RemoteStore");
const RemoteStoreContext_1 = __importDefault(require("./RemoteStoreContext"));
const useWebSocket_1 = require("../client/useWebSocket");
const RemoteStoreProvider = ({ id, children, serialisationSignatures }) => {
    const remoteStoreMap = react_1.useContext(RemoteStoreContext_1.default);
    const { manager } = useWebSocket_1.useWebSocket(id);
    const [store, setStore] = react_1.useState(null);
    react_1.useEffect(() => {
        const store = new RemoteStore_1.RemoteStore(manager, serialisationSignatures);
        setStore(store);
        return () => {
            store.releaseRemoteStore();
        };
    }, []);
    const map = new Map();
    if (remoteStoreMap) {
        remoteStoreMap.forEach((value, key) => map.set(key, value));
    }
    map.set(id, store);
    return react_1.default.createElement(RemoteStoreContext_1.default.Provider, { value: map }, children);
};
exports.RemoteStoreProvider = RemoteStoreProvider;
//# sourceMappingURL=RemoteStoreProvider.js.map