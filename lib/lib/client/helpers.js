"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useWebSocket_1 = require("./useWebSocket");
exports.useListenEffect = (message, callback, onInit) => {
    const { listen } = useWebSocket_1.useWebSocket();
    react_1.useEffect(() => {
        const unsubscribe = listen(message, callback);
        if (onInit)
            onInit();
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
exports.useServerValidation = (componentId, setValidation, onSuccess, onFailure, onInit) => {
    exports.useListenEffect("VALIDATION", (validationBean) => {
        if (validationBean.originId !== componentId)
            return;
        setValidation(validationBean);
        if (!validationBean.success) {
            if (onFailure)
                onFailure(validationBean);
        }
        else {
            if (onSuccess)
                onSuccess(validationBean);
        }
    }, onInit);
};
exports.useClientValidation = (bean, validationCallback, setValidation, onSuccess, onFailure) => {
    const validation = validationCallback(bean);
    setValidation(validation);
    if (validation === null || validation === void 0 ? void 0 : validation.success) {
        onSuccess(validation, bean);
    }
    else {
        onFailure(validation, bean);
    }
};
