"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const WebSocketManager_1 = require("./WebSocketManager");
const WebSocketContext_1 = require("./WebSocketContext");
const react_error_boundary_1 = require("react-error-boundary");
const Beans_1 = require("../store/beans/Beans");
exports.WebSocketProvider = ({ id, url, domain, delimiter, logging, showElementWhileConnecting, children }) => {
    const managerMap = react_1.useContext(WebSocketContext_1.WebSocketContext);
    const managerRef = react_1.useRef();
    if (!managerRef.current) {
        managerRef.current = new WebSocketManager_1.WebSocketManager(url, domain, delimiter || "\t", false, logging || false);
    }
    const [, setUid] = react_1.useState(null);
    const onError = (error, info) => {
        const errorBean = {
            message: "" + error,
            componentStack: info === null || info === void 0 ? void 0 : info.componentStack
        };
        managerRef.current.send(Beans_1.CoreMessage.CLIENT_ERROR, errorBean);
    };
    const errorFallback = ({}) => {
        return react_1.default.createElement("div", null, "An error has occurred and was registered");
    };
    const [isSocketConnected, setSocketConnected] = react_1.useState(false);
    react_1.useEffect(() => {
        const unsubscribe = managerRef.current.addConnectivityListener((_isConnected, isReady, _sid, uid) => {
            if (logging)
                console.log("setting connectivity for uid:", uid, "ready:", isReady);
            setSocketConnected(isReady);
            setUid(uid);
        });
        return () => {
            unsubscribe();
        };
    }, []);
    if (!isSocketConnected && showElementWhileConnecting) {
        return (react_1.default.createElement("div", null, react_1.cloneElement(showElementWhileConnecting)));
    }
    const map = new Map();
    if (managerMap) {
        managerMap.forEach((value, key) => map.set(key, value));
    }
    map.set(id, managerRef.current);
    return (react_1.default.createElement(WebSocketContext_1.WebSocketContext.Provider, { value: map },
        react_1.default.createElement(react_error_boundary_1.ErrorBoundary, { onError: onError, fallbackRender: errorFallback }, children)));
};
//# sourceMappingURL=WebSocketProvider.js.map