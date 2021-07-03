"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRemoteStoreArrayRef = exports.useRemoteSingleStoreRef = exports.useRemoteStoreRef = void 0;
const react_1 = require("react");
const react_use_variable_1 = require("react-use-variable");
const useGetRemoteStore_1 = require("./useGetRemoteStore");
const useRemoteStoreRef = (id, path, params, callback, dependency, connectionStateRef, setConnectionState) => {
    const remoteStore = useGetRemoteStore_1.useGetRemoteStore(id);
    const dataRef = react_1.useRef(remoteStore.getData(path, params || null));
    const dependencyFulfilled = dependency === undefined || !!dependency;
    const pathId = path.join("/");
    const paramString = params ? JSON.stringify(params) : null;
    if (connectionStateRef && connectionStateRef.current && !connectionStateRef.current.has(pathId)) {
        connectionStateRef.current.set(pathId, dataRef.current !== undefined);
    }
    react_1.useEffect(() => {
        const setThisConnectionState = (s) => {
            if (connectionStateRef && connectionStateRef.current.get(pathId) !== s) {
                if (setConnectionState)
                    setConnectionState((state) => {
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
    }, [dependencyFulfilled, pathId, paramString]);
    return dataRef;
};
exports.useRemoteStoreRef = useRemoteStoreRef;
const useRemoteSingleStoreRef = (id, path, params, updateDependent, dependency, connectionStateRef, setConnectionState) => {
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
    const dataRef = exports.useRemoteStoreRef(id, path, params, callback, dependency, connectionStateRef, setConnectionState);
    const singleDataRef = react_use_variable_1.useVariable(dataRef.current && dataRef.current.size > 0 ? Array.from(dataRef.current.values())[0] : undefined);
    return singleDataRef;
};
exports.useRemoteSingleStoreRef = useRemoteSingleStoreRef;
const useRemoteStoreArrayRef = (id, path, params, dependency, connectionStateRef, setConnectionState) => {
    const dataRef = exports.useRemoteStoreRef(id, path, params, undefined, dependency, connectionStateRef, setConnectionState);
    const arrayDataRef = react_use_variable_1.useVariable(dataRef.current ? Array.from(dataRef.current.values()) : undefined);
    return arrayDataRef;
};
exports.useRemoteStoreArrayRef = useRemoteStoreArrayRef;
exports.default = exports.useRemoteStoreRef;
//# sourceMappingURL=useRemoteStoreRef.js.map