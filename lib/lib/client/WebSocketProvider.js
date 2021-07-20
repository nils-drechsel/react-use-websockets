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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketProvider = void 0;
const react_1 = __importStar(require("react"));
const WebSocketManager_1 = require("./WebSocketManager");
const WebSocketContext_1 = require("./WebSocketContext");
const react_error_boundary_1 = require("react-error-boundary");
const Beans_1 = require("../store/beans/Beans");
const WebSocketProvider = ({ id, url, domain, delimiter, ping, logging, reconnect, showElementWhileConnecting, children, serialisationSignatures, }) => {
    const managerMap = react_1.useContext(WebSocketContext_1.WebSocketContext);
    const [manager, setManager] = react_1.useState(null);
    react_1.useEffect(() => {
        const manager = new WebSocketManager_1.WebSocketManager(url, domain, delimiter || "\t", reconnect, ping, logging || false, serialisationSignatures);
        setManager(manager);
        const unsubscribe = manager.addConnectivityListener((_isConnected, isReady, _sid, uid) => {
            if (logging)
                console.log("setting connectivity for uid:", uid, "ready:", isReady);
            setSocketConnected(isReady);
            setUid(uid);
        });
        return () => {
            if (logging)
                console.log("destroying websocket manager");
            unsubscribe();
            manager.destroy();
        };
    }, []);
    const [, setUid] = react_1.useState(null);
    const onError = (error, info) => {
        const errorBean = {
            message: "" + error,
            componentStack: info === null || info === void 0 ? void 0 : info.componentStack,
        };
        if (manager)
            manager.send(Beans_1.CoreMessage.CLIENT_ERROR, errorBean);
    };
    const errorFallback = ({}) => {
        return react_1.default.createElement("div", null, "An error has occurred and was registered");
    };
    const [isSocketConnected, setSocketConnected] = react_1.useState(false);
    if ((!manager || !isSocketConnected) && showElementWhileConnecting) {
        return react_1.default.createElement("div", null, react_1.cloneElement(showElementWhileConnecting));
    }
    const map = new Map();
    if (managerMap) {
        managerMap.forEach((value, key) => map.set(key, value));
    }
    map.set(id, manager);
    return (react_1.default.createElement(WebSocketContext_1.WebSocketContext.Provider, { value: map },
        react_1.default.createElement(react_error_boundary_1.ErrorBoundary, { onError: onError, fallbackRender: errorFallback }, children)));
};
exports.WebSocketProvider = WebSocketProvider;
//# sourceMappingURL=WebSocketProvider.js.map