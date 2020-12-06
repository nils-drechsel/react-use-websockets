"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RemoteStoreContext_1 = __importDefault(require("./RemoteStoreContext"));
const react_use_variable_1 = require("react-use-variable");
exports.useRemoteStoreRef = (path, params, callback, dependency, connectionStateRef, setConnectionState) => {
    const remoteStore = react_1.useContext(RemoteStoreContext_1.default);
    const dataRef = react_1.useRef(remoteStore.getData(path, params || null));
    const dependencyFulfilled = dependency === undefined || !!dependency;
    const pathId = path.join("/");
    react_1.useEffect(() => {
        const setThisConnectionState = (s) => {
            if (connectionStateRef && connectionStateRef.current.get(pathId) !== s) {
                if (setConnectionState)
                    setConnectionState((state) => {
                        console.log("Setting new connection state", pathId, s);
                        const newState = new Map(state);
                        newState.set(pathId, s);
                        return newState;
                    });
            }
        };
        if (dataRef.current === undefined) {
            setThisConnectionState(false);
        }
        else {
            setThisConnectionState(true);
        }
        if (dependencyFulfilled) {
            let setIncomingData = (incomingData) => {
                setThisConnectionState(true);
                dataRef.current = incomingData;
            };
            if (callback) {
                setIncomingData = (incomingData) => {
                    setThisConnectionState(true);
                    dataRef.current = incomingData;
                    callback(incomingData);
                };
            }
            const deregister = remoteStore.register(path, params || null, setIncomingData);
            return () => {
                deregister();
                dataRef.current = undefined;
                if (callback)
                    callback(undefined);
            };
        }
        return () => {
            // do nothing in the case we wait for dependencies fulfilled
        };
    }, [dependencyFulfilled, pathId]);
    return dataRef;
};
exports.useRemoteSingleStoreRef = (path, params, updateDependent, dependency, connectionStateRef, setConnectionState) => {
    let callback = undefined;
    if (updateDependent) {
        callback = (incomingData) => {
            const item = incomingData && incomingData.size > 0 ? Array.from(incomingData.values())[0] : null;
            updateDependent((old) => {
                if (incomingData === undefined)
                    return undefined;
                if (old === null || old === undefined) {
                    return item;
                }
                else {
                    return Object.assign({}, old, item);
                }
            });
        };
    }
    const dataRef = exports.useRemoteStoreRef(path, params, callback, dependency, connectionStateRef, setConnectionState);
    const singleDataRef = react_use_variable_1.useVariable(dataRef.current && dataRef.current.size > 0 ? Array.from(dataRef.current.values())[0] : undefined);
    return singleDataRef;
};
exports.useRemoteStoreArrayRef = (path, params, dependency, connectionStateRef, setConnectionState) => {
    const dataRef = exports.useRemoteStoreRef(path, params, undefined, dependency, connectionStateRef, setConnectionState);
    const arrayDataRef = react_use_variable_1.useVariable(dataRef.current ? Array.from(dataRef.current.values()) : undefined);
    return arrayDataRef;
};
exports.default = exports.useRemoteStoreRef;
//# sourceMappingURL=useRemoteStoreRef.js.map