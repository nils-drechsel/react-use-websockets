"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StoreBeans_1 = require("./StoreBeans");
exports.createStoreId = (path) => {
    return path.join("/");
};
exports.updateBean = (setBean) => {
    const result = (changeset) => {
        setBean((old) => {
            const res = Object.assign({}, old, changeset);
            return res;
        });
    };
    return result;
};
exports.validateNotEmpty = (value) => {
    return !!value;
};
exports.errorNotEmpty = (fieldName) => {
    return fieldName + " cannot be left empty";
};
exports.validateComparison = (cmp, baseValue, value) => {
    if (value === null || value === undefined)
        return false;
    switch (cmp) {
        case StoreBeans_1.Comparator.EQUAL:
            return baseValue == value;
        case StoreBeans_1.Comparator.NOT_EQUAL:
            return baseValue != value;
        case StoreBeans_1.Comparator.GREATER:
            return value > baseValue;
        case StoreBeans_1.Comparator.GREATER_OR_EQUAL:
            return value >= baseValue;
        case StoreBeans_1.Comparator.SMALLER:
            return value < baseValue;
        case StoreBeans_1.Comparator.SMALLER_OR_EQUAL:
            return value <= baseValue;
        default:
            throw new Error("unknown comparator " + cmp);
    }
};
exports.errorComparison = (cmp, baseValue, fieldName) => {
    switch (cmp) {
        case StoreBeans_1.Comparator.EQUAL:
            return fieldName + " must be equal to " + baseValue;
        case StoreBeans_1.Comparator.NOT_EQUAL:
            return fieldName + " must not be equal to " + baseValue;
        case StoreBeans_1.Comparator.GREATER:
            return fieldName + " must be greater than " + baseValue;
        case StoreBeans_1.Comparator.GREATER_OR_EQUAL:
            return fieldName + " must be greater than or equal to " + baseValue;
        case StoreBeans_1.Comparator.SMALLER:
            return fieldName + " must be smaller than " + baseValue;
        case StoreBeans_1.Comparator.SMALLER_OR_EQUAL:
            return fieldName + " must be smaller than or equal to " + baseValue;
        default:
            throw new Error("unknown comparator " + cmp);
    }
};
exports.validateRegex = (regex, value) => {
    if (!value)
        return false;
    const expr = new RegExp(regex);
    return expr.test(value);
};
exports.errorRegex = (fieldName) => {
    return fieldName + " is not valid";
};
exports.validateLength = (length, value) => {
    if (!value)
        return false;
    return value.length >= length;
};
exports.errorLength = (length, fieldName) => {
    return fieldName + " needs at least " + length + " characters";
};
exports.validateSize = (size, value) => {
    if (!value)
        return false;
    return value.length >= size;
};
exports.errorSize = (size, fieldName) => {
    return fieldName + " needs at least " + size + " characters";
};
exports.validate = (bean, validationCallback, onError, onSuccess) => {
    const validation = validationCallback(bean);
    if (validation === null || validation === void 0 ? void 0 : validation.success) {
        onSuccess(validation, bean);
    }
    else {
        onError(validation);
    }
    return validation;
};
