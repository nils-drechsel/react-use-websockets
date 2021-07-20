"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorSize = exports.validateSize = exports.errorLength = exports.validateLength = exports.errorPassword = exports.validatePassword = exports.errorRegex = exports.validateRegex = exports.errorComparison = exports.validateComparison = exports.errorNotEmpty = exports.validateNotEmpty = exports.updatePartialBean = exports.updateBean = exports.createStoreId = void 0;
const Beans_1 = require("./Beans");
const ClientUtils_1 = require("../../client/ClientUtils");
const debounce_1 = __importDefault(require("lodash/debounce"));
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
const updatePartialBean = (setBean, remoteStore, debounceTime) => {
    const remoteStoreFunction = debounceTime ? debounce_1.default(remoteStore, debounceTime) : remoteStore;
    const result = (changeset, store) => {
        setBean((old) => {
            const res = Object.assign({}, old, changeset);
            return res;
        });
        if (store)
            remoteStoreFunction(changeset);
    };
    return result;
};
exports.updatePartialBean = updatePartialBean;
const validateNotEmpty = (value, partial) => {
    if (partial && value === undefined)
        return true;
    return !!value;
};
exports.validateNotEmpty = validateNotEmpty;
const errorNotEmpty = (fieldName, errorMessage) => {
    if (errorMessage)
        return errorMessage;
    return fieldName + " cannot be left empty";
};
exports.errorNotEmpty = errorNotEmpty;
const validateComparison = (cmp, baseValue, value, partial) => {
    if (partial && value === undefined)
        return true;
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
const validateRegex = (regex, value, partial) => {
    if (partial && value === undefined)
        return true;
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
const validatePassword = (pw, minEntropy, partial) => {
    if (partial && pw === undefined)
        return true;
    if (!pw)
        return false;
    return ClientUtils_1.passwordConformsToEntropy(pw, minEntropy);
};
exports.validatePassword = validatePassword;
const errorPassword = (fieldName, errorMessage) => {
    if (errorMessage)
        return errorMessage;
    return fieldName + " is not strong enough";
};
exports.errorPassword = errorPassword;
const validateLength = (length, value, partial) => {
    if (partial && value === undefined)
        return true;
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
const validateSize = (size, value, partial) => {
    if (partial && value === undefined)
        return true;
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