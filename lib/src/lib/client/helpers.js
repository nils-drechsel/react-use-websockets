"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useListen = exports.useListenEffect = exports.updateSet = void 0;
const react_1 = require("react");
const useWebSocket_1 = require("./useWebSocket");
const updateSet = (set, value, state) => {
    const result = new Set(set);
    if (state) {
        result.add(value);
    }
    else {
        result.delete(value);
    }
    return result;
};
exports.updateSet = updateSet;
const useListenEffect = (id, endpoint, message, callback, onInit) => {
    const { listen } = (0, useWebSocket_1.useWebSocket)(id);
    (0, react_1.useEffect)(() => {
        const unsubscribe = listen(endpoint, message, callback);
        if (onInit)
            onInit();
        return () => {
            unsubscribe();
        };
    }, []);
};
exports.useListenEffect = useListenEffect;
const useListen = (id, endpoint, message) => {
    const { listen } = (0, useWebSocket_1.useWebSocket)(id);
    return (callback) => {
        const unsubscribe = listen(endpoint, message, callback);
        return unsubscribe;
    };
};
exports.useListen = useListen;
//# sourceMappingURL=helpers.js.map