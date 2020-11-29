"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react")); // importing FunctionComponent
exports.connectStore = (useMapStores) => (WrappedComponent) => {
    return (props) => {
        const newProps = useMapStores(props);
        if (Object.values(newProps).some(v => v === undefined))
            return null;
        return react_1.default.createElement(WrappedComponent, Object.assign({}, props, newProps));
    };
};
//# sourceMappingURL=connectStore.js.map