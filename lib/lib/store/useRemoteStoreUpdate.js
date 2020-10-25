"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RemoteStoreContext_1 = __importDefault(require("./RemoteStoreContext"));
const useWebSocket_1 = require("../client/useWebSocket");
const Beans_1 = require("./beans/Beans");
const uuid_1 = require("uuid");
exports.useRemoteStoreUpdate = (path, params, validationFunction, postServerValidationCallback, postClientValidationCallback) => {
    const [componentId] = react_1.useState(uuid_1.v4());
    const remoteStore = react_1.useContext(RemoteStoreContext_1.default);
    const { listen, send } = useWebSocket_1.useWebSocket();
    const [validation, setValidation] = react_1.useState(null);
    const pathId = path.join("/");
    const editRemoteBean = (payload) => {
        if (validationFunction) {
            const validationBean = validationFunction(payload);
            setValidation(validationBean);
            if (postClientValidationCallback)
                postClientValidationCallback(validationBean);
            if (!validationBean.success)
                return;
        }
        if (!params || !params.key) {
            remoteStore.editRemoteStore(Beans_1.CoreMessage.STORE_CREATE, path, params || null, payload, componentId);
        }
        else {
            remoteStore.editRemoteStore(Beans_1.CoreMessage.STORE_EDIT, path, params, payload, componentId);
        }
    };
    react_1.useEffect(() => {
        const deregisterValidationListener = listen(Beans_1.CoreMessage.VALIDATION, (payload, fromSid) => {
            if (payload.originId !== componentId)
                return;
            setValidation(payload);
            if (postServerValidationCallback)
                postServerValidationCallback(payload);
        });
        return () => {
            deregisterValidationListener();
        };
    }, [pathId]);
    return [editRemoteBean, validation];
};
exports.default = exports.useRemoteStoreUpdate;
