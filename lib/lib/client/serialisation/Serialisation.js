"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialise = void 0;
const serialise = (obj) => {
    return JSON.stringify(obj, (_key, value) => {
        if (value instanceof Map) {
            const obj = {};
            value.forEach((value, key) => {
                obj[key] = value;
            });
            return obj;
        }
        else if (value instanceof Set) {
            return Array.from(value);
        }
        else if (Array.isArray(value)) {
            return Array.from(value);
        }
        return value;
    });
};
exports.serialise = serialise;
//# sourceMappingURL=Serialisation.js.map