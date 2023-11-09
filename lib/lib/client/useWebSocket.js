"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSocket = exports.useWebSocket = void 0;
const react_1 = require("react");
const WebSocketContext_1 = require("./WebSocketContext");
const useWebSocket = (id) => {
    const managerMap = (0, react_1.useContext)(WebSocketContext_1.WebSocketContext);
    let manager = undefined;
    if (id) {
        manager = managerMap.get(id);
    }
    else {
        if (managerMap.size > 0)
            manager = Array.from(managerMap.values())[0];
    }
    if (!manager)
        throw Error("manager is null, did you provide a <WebSocketProvider> element with the correct id (" + id + ") ?");
    const send = (endpoint, message, payload, toSid = null) => {
        manager.send(endpoint, message, payload, toSid);
    };
    const listen = (endpoint, message, callback) => {
        return manager.addListener(endpoint, message, callback);
    };
    const isConnected = () => {
        return manager.isConnected();
    };
    const connectivity = (callback) => {
        return manager.addConnectivityListener(callback);
    };
    const setDefaultCallback = (callback) => {
        return manager.setDefaultCallback(callback);
    };
    return { manager, send, listen, isConnected, connectivity, setDefaultCallback };
};
exports.useWebSocket = useWebSocket;
const useSocket = (id) => {
    const { connectivity, manager } = (0, exports.useWebSocket)(id);
    const [sid, setSid] = (0, react_1.useState)(manager.getSid());
    const [uid, setUid] = (0, react_1.useState)(manager.getUid());
    (0, react_1.useEffect)(() => {
        const unsubscribe = connectivity((_isConnected, _isReady, sid, uid) => {
            if (sid)
                setSid(sid);
            if (uid)
                setUid(uid);
        });
        return () => {
            unsubscribe();
        };
    });
    return [sid, uid];
};
exports.useSocket = useSocket;
//# sourceMappingURL=useWebSocket.js.map