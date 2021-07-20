"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRemoteStoreUpdate = exports.usePartialRemoteStoreUpdate = void 0;
const react_1 = require("react");
const useWebSocket_1 = require("../client/useWebSocket");
const Beans_1 = require("./beans/Beans");
const uuid_1 = require("uuid");
const useGetRemoteStore_1 = require("./useGetRemoteStore");
const usePartialRemoteStoreUpdate = (id, path, params, validationFunction, postServerValidationCallback, postClientValidationCallback, onInitCallback, beanType) => {
    return exports.useRemoteStoreUpdate(id, path, params, validationFunction, postServerValidationCallback, postClientValidationCallback, onInitCallback, beanType, true);
};
exports.usePartialRemoteStoreUpdate = usePartialRemoteStoreUpdate;
const useRemoteStoreUpdate = (id, path, params, validationFunction, postServerValidationCallback, postClientValidationCallback, onInitCallback, beanType, partial) => {
    const [componentId] = react_1.useState(uuid_1.v4());
    const remoteStore = useGetRemoteStore_1.useGetRemoteStore(id);
    const { listen } = useWebSocket_1.useWebSocket();
    const [validation, setValidation] = react_1.useState(null);
    const pathId = path.join("/");
    const editRemoteBean = (payload) => {
        if (validationFunction) {
            const validationBean = validationFunction(payload, partial);
            setValidation(validationBean);
            if (postClientValidationCallback)
                postClientValidationCallback(validationBean);
            if (!validationBean.success)
                return;
        }
        if (payload) {
            payload._t = beanType;
        }
        if (!params || !params.key) {
            remoteStore.editRemoteStore(Beans_1.CoreMessage.STORE_CREATE, path, params || null, payload, componentId);
        }
        else {
            remoteStore.editRemoteStore(Beans_1.CoreMessage.STORE_EDIT, path, params, payload, componentId);
        }
    };
    react_1.useEffect(() => {
        const deregisterValidationListener = listen(Beans_1.CoreMessage.VALIDATION, (payload, _fromSid) => {
            if (payload.originId !== componentId)
                return;
            setValidation(payload);
            if (postServerValidationCallback)
                postServerValidationCallback(payload);
        });
        if (onInitCallback)
            onInitCallback();
        return () => {
            deregisterValidationListener();
        };
    }, [pathId]);
    return [editRemoteBean, validation];
};
exports.useRemoteStoreUpdate = useRemoteStoreUpdate;
exports.default = exports.useRemoteStoreUpdate;
//# sourceMappingURL=useRemoteStoreUpdate.js.map