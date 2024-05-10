"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectStore = void 0;
const react_1 = __importDefault(require("react")); // importing FunctionComponent
const react_use_variable_1 = require("react-use-variable");
const RemoteStore_1 = require("./RemoteStore");
const connectStore = (useMapStores, showElementWhileConnecting, showElementOnError) => (WrappedComponent) => {
    return (props) => {
        const [connectionState, connectionStateRef, setConnectionState] = (0, react_use_variable_1.useStateVariable)(new Map());
        const newProps = useMapStores(props, connectionStateRef, setConnectionState);
        const storeMetas = Array.from(connectionState.values());
        if (storeMetas.some(meta => meta.state === RemoteStore_1.StoreConnectionState.ERROR || (meta.state === RemoteStore_1.StoreConnectionState.ACCESS_DENIED && !meta.optional))) {
            const errors = storeMetas
                .filter(meta => meta.state === RemoteStore_1.StoreConnectionState.ERROR || meta.state === RemoteStore_1.StoreConnectionState.ACCESS_DENIED)
                .filter(meta => !!meta.errors)
                .map(meta => meta.errors)
                .reduce((a, b) => a.concat(b), []);
            return showElementOnError ? showElementOnError(errors) : react_1.default.createElement("div", null, errors.join(";"));
        }
        if (storeMetas.some(meta => meta.state !== RemoteStore_1.StoreConnectionState.READY)) {
            return showElementWhileConnecting || null;
        }
        return react_1.default.createElement(WrappedComponent, Object.assign({}, props, newProps));
    };
};
exports.connectStore = connectStore;
//# sourceMappingURL=connectStore.js.map