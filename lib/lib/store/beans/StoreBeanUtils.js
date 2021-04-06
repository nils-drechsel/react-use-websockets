"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorSize = exports.validateSize = exports.errorLength = exports.validateLength = exports.errorRegex = exports.validateRegex = exports.errorComparison = exports.validateComparison = exports.errorNotEmpty = exports.validateNotEmpty = exports.updateBean = exports.createStoreId = void 0;
const Beans_1 = require("./Beans");
const createStoreId = (path, params) => {
    path = [...path];
    if (params && params.key)
        path.push(params.key);
    return path.join("/");
};
exports.createStoreId = createStoreId;
const updateBean = (setBean) => {
    const result = (changeset) => {
        setBean((old) => {
            const res = Object.assign({}, old, changeset);
            return res;
        });
    };
    return result;
};
exports.updateBean = updateBean;
const validateNotEmpty = (value) => {
    return !!value;
};
exports.validateNotEmpty = validateNotEmpty;
const errorNotEmpty = (fieldName, errorMessage) => {
    if (errorMessage)
        return errorMessage;
    return fieldName + " cannot be left empty";
};
exports.errorNotEmpty = errorNotEmpty;
const validateComparison = (cmp, baseValue, value) => {
    if (value === null || value === undefined)
        return false;
    switch (cmp) {
        case Beans_1.Comparator.EQUAL:
            return baseValue == value;
        case Beans_1.Comparator.NOT_EQUAL:
            return baseValue != value;
        case Beans_1.Comparator.GREATER:
            return value > baseValue;
        case Beans_1.Comparator.GREATER_OR_EQUAL:
            return value >= baseValue;
        case Beans_1.Comparator.SMALLER:
            return value < baseValue;
        case Beans_1.Comparator.SMALLER_OR_EQUAL:
            return value <= baseValue;
        default:
            throw new Error("unknown comparator " + cmp);
    }
};
exports.validateComparison = validateComparison;
const errorComparison = (cmp, baseValue, fieldName, errorMessage) => {
    if (errorMessage)
        return errorMessage;
    switch (cmp) {
        case Beans_1.Comparator.EQUAL:
            return fieldName + " must be equal to " + baseValue;
        case Beans_1.Comparator.NOT_EQUAL:
            return fieldName + " must not be equal to " + baseValue;
        case Beans_1.Comparator.GREATER:
            return fieldName + " must be greater than " + baseValue;
        case Beans_1.Comparator.GREATER_OR_EQUAL:
            return fieldName + " must be greater than or equal to " + baseValue;
        case Beans_1.Comparator.SMALLER:
            return fieldName + " must be smaller than " + baseValue;
        case Beans_1.Comparator.SMALLER_OR_EQUAL:
            return fieldName + " must be smaller than or equal to " + baseValue;
        default:
            throw new Error("unknown comparator " + cmp);
    }
};
exports.errorComparison = errorComparison;
const validateRegex = (regex, value) => {
    if (!value)
        return false;
    const expr = new RegExp(regex);
    return expr.test(value);
};
exports.validateRegex = validateRegex;
const errorRegex = (fieldName, errorMessage) => {
    if (errorMessage)
        return errorMessage;
    return fieldName + " is not valid";
};
exports.errorRegex = errorRegex;
const validateLength = (length, value) => {
    if (!value)
        return false;
    return value.length >= length;
};
exports.validateLength = validateLength;
const errorLength = (length, fieldName, errorMessage) => {
    if (errorMessage)
        return errorMessage;
    return fieldName + " needs at least " + length + " characters";
};
exports.errorLength = errorLength;
const validateSize = (size, value) => {
    if (!value)
        return false;
    return value.length >= size;
};
exports.validateSize = validateSize;
const errorSize = (size, fieldName, errorMessage) => {
    if (errorMessage)
        return errorMessage;
    return fieldName + " needs at least " + size + " characters";
};
exports.errorSize = errorSize;
//# sourceMappingURL=StoreBeanUtils.js.map