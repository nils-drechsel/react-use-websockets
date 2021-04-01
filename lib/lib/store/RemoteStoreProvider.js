"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const RemoteStore_1 = require("./RemoteStore");
const RemoteStoreContext_1 = __importDefault(require("./RemoteStoreContext"));
const useWebSocket_1 = require("../client/useWebSocket");
exports.RemoteStoreProvider = ({ id, children }) => {
    const remoteStoreMap = react_1.useContext(RemoteStoreContext_1.default);
    const { manager } = useWebSocket_1.useWebSocket(id);
    const storeRef = react_1.useRef();
    if (!storeRef.current && manager) {
        storeRef.current = new RemoteStore_1.RemoteStore(manager);
    }
    react_1.useEffect(() => {
        return () => {
            if (storeRef.current) {
                storeRef.current.releaseRemoteStore();
                storeRef.current = undefined;
            }
        };
    }, []);
    const map = new Map();
    if (remoteStoreMap) {
        remoteStoreMap.forEach((value, key) => map.set(key, value));
    }
    map.set(id, storeRef.current);
    return (react_1.default.createElement(RemoteStoreContext_1.default.Provider, { value: map }, children));
};
//# sourceMappingURL=RemoteStoreProvider.js.map