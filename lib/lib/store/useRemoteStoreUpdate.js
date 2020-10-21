"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RemoteStoreContext_1 = __importDefault(require("./RemoteStoreContext"));
const useWebSocket_1 = require("../client/useWebSocket");
const StoreBeans_1 = require("./beans/StoreBeans");
const uuid_1 = require("uuid");
exports.useRemoteStoreUpdate = (path, params, validationFunction, postValidationCallback) => {
    if (params.length === 0)
        throw new Error("params must contain at least one item (the key)");
    const [componentId] = react_1.useState(uuid_1.v4());
    const remoteStore = react_1.useContext(RemoteStoreContext_1.default);
    const { listen, send } = useWebSocket_1.useWebSocket();
    const [validation, setValidation] = react_1.useState(null);
    const pathId = path.join("/");
    const editRemoteStore = (payload) => {
        if (validationFunction) {
            const validationBean = validationFunction(payload);
            setValidation(validationBean);
            if (!validationBean.success)
                return;
        }
        remoteStore.editRemoteStore(path, params, payload, componentId);
    };
    react_1.useEffect(() => {
        const deregisterValidationListener = listen(StoreBeans_1.CoreMessage.VALIDATION, (payload, fromSid) => {
            if (payload.originId !== componentId)
                return;
            setValidation(payload);
            if (postValidationCallback)
                postValidationCallback(payload);
        });
        return () => {
            deregisterValidationListener();
        };
    }, [pathId]);
    return [editRemoteStore, validation];
};
exports.default = exports.useRemoteStoreUpdate;
