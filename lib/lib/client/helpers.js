"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performClientValidation = exports.useServerValidation = exports.useServerValidationEffect = exports.useListen = exports.useListenEffect = exports.updateSet = void 0;
const react_1 = require("react");
const Beans_1 = require("../store/beans/Beans");
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
const useServerValidationEffect = (id, endpoint, componentId, setValidation, onSuccess, onFailure, onInit) => {
    (0, exports.useListenEffect)(id, endpoint, Beans_1.CoreMessage.VALIDATION, (validationBean) => {
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
exports.useServerValidationEffect = useServerValidationEffect;
const useServerValidation = (id, endpoint, componentId, setValidation) => {
    const { listen } = (0, useWebSocket_1.useWebSocket)(id);
    return (onSuccess, onFailure) => {
        const unsubscribe = listen(endpoint, Beans_1.CoreMessage.VALIDATION, (validationBean, _fromSid) => {
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
        });
        return unsubscribe;
    };
};
exports.useServerValidation = useServerValidation;
const performClientValidation = (bean, validationCallback, setValidation, onSuccess, onFailure) => {
    const validation = validationCallback(bean);
    setValidation(validation);
    if (validation === null || validation === void 0 ? void 0 : validation.success) {
        onSuccess(validation, bean);
    }
    else {
        onFailure(validation, bean);
    }
};
exports.performClientValidation = performClientValidation;
//# sourceMappingURL=helpers.js.map