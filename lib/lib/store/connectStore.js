"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectStore = void 0;
const react_1 = __importDefault(require("react")); // importing FunctionComponent
const react_use_variable_1 = require("react-use-variable");
const connectStore = (useMapStores, showElementWhileConnecting) => (WrappedComponent) => {
    return (props) => {
        const [connectionState, connectionStateRef, setConnectionState] = react_use_variable_1.useStateVariable(new Map());
        const newProps = useMapStores(props, connectionStateRef, setConnectionState);
        if (Object.values(newProps).some(v => v === undefined)) {
            return showElementWhileConnecting || null;
        }
        if (Array.from(connectionState.values()).some(v => !v)) {
            return showElementWhileConnecting || null;
        }
        return react_1.default.createElement(WrappedComponent, Object.assign({}, props, newProps));
    };
};
exports.connectStore = connectStore;
//# sourceMappingURL=connectStore.js.map