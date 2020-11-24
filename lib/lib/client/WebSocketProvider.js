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
exports.WebSocketProvider = ({ url, delimiter, logging, ElementWhileConnecting, children }) => {
    const managerRef = react_1.useRef();
    if (!managerRef.current) {
        managerRef.current = new WebSocketManager_1.WebSocketManager(url, delimiter || "\t", logging || false);
    }
    // window.onerror = (message: string | Event, source: string | undefined, lineno: number | undefined, colno: number | undefined, error: Error | undefined) => {
    //     if (typeof(message) === "string" && message.startsWith("ResizeObserver")) return;
    //     const errorBean: ClientErrorBean = {
    //         message: "message: " + message + "\n"
    //             + "source: "+ source + "\n"
    //             + "lineno: "+ source + "\n"
    //             + "colno: "+ source + "\n"
    //             + "error name : "+ error?.name
    //             + "error message: " + error?.message,
    //         componentStack: error?.stack
    //     }
    //     managerRef.current!.send(CoreMessage.CLIENT_ERROR, errorBean);
    // }
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
        const unsubscribe = managerRef.current.addConnectivityListener((isConnected, isReady, sid) => {
            setSocketConnected(isReady);
        });
        return () => {
            unsubscribe();
        };
    }, []);
    if (!isSocketConnected && ElementWhileConnecting) {
        return (react_1.default.createElement("div", null, react_1.cloneElement(ElementWhileConnecting)));
    }
    return (react_1.default.createElement(WebSocketContext_1.WebSocketContext.Provider, { value: managerRef.current },
        react_1.default.createElement(react_error_boundary_1.ErrorBoundary, { onError: onError, fallbackRender: errorFallback }, children)));
};
