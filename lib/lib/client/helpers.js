"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useWebSocket_1 = require("./useWebSocket");
exports.useListenEffect = (message, callback) => {
    const { listen } = useWebSocket_1.useWebSocket();
    react_1.useEffect(() => {
        const unsubscribe = listen(message, callback);
        () => {
            unsubscribe();
        };
    }, []);
};
exports.useListen = (message) => {
    const { listen } = useWebSocket_1.useWebSocket();
    return (callback) => {
        const unsubscribe = listen(message, callback);
        return unsubscribe;
    };
};
exports.useValidation = (componentId, setValidation, onSuccess, onFailure) => {
    exports.useListenEffect("VALIDATION", (validationBean) => {
        if (validationBean.originId !== componentId)
            return;
        setValidation(validationBean);
        if (!validationBean.success) {
            if (onFailure)
                onFailure();
        }
        else {
            if (onSuccess)
                onSuccess();
        }
    });
};
