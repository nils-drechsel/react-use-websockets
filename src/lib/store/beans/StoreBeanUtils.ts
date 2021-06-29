import { Comparator, ValidationBean, AbstractWebSocketBean, AbstractStoreParametersBean } from "./Beans";
import { Dispatch, SetStateAction } from "react";
import { passwordConformsToEntropy } from "../../client/ClientUtils";


export const createStoreId = (path: Array<string>, params?: AbstractStoreParametersBean | null) => {
    path = [...path];
    if (params && (params as any).key) path.push((params as any).key);
    return path.join("/");
}

export interface UpdateFunction<TYPE extends AbstractWebSocketBean> {
    (changeset: Partial<TYPE>): void
}

export const updateBean = <TYPE extends AbstractWebSocketBean>(setBean: Dispatch<SetStateAction<TYPE>>): UpdateFunction<TYPE> => {

    const result: UpdateFunction<TYPE> = (changeset: Partial<TYPE>): void => {
        setBean((old: TYPE) => {
            const res: TYPE = Object.assign({}, old, changeset);
            return res;
        })
    }

    return result;
}



export const validateNotEmpty = (value?: any): boolean => {
    return !!value;
}

export const errorNotEmpty = (fieldName: string, errorMessage: string | null): string => {
    if (errorMessage) return errorMessage;
    return fieldName + " cannot be left empty";
}

export const validateComparison = (cmp: Comparator, baseValue: number, value?: number): boolean => {
    if (value === null || value === undefined) return false;

    switch (cmp) {
        case Comparator.EQUAL:
            return baseValue == value;
        case Comparator.NOT_EQUAL:
            return baseValue != value;
        case Comparator.GREATER:
            return value > baseValue;
        case Comparator.GREATER_OR_EQUAL:
            return value >= baseValue;
        case Comparator.SMALLER:
            return value < baseValue;
        case Comparator.SMALLER_OR_EQUAL:
            return value <= baseValue;
        default:
            throw new Error("unknown comparator " + cmp);
    }
}

export const errorComparison = (cmp: Comparator, baseValue: number, fieldName: string, errorMessage: string | null): string => {
    if (errorMessage) return errorMessage;
    switch (cmp) {
        case Comparator.EQUAL:
            return fieldName + " must be equal to " + baseValue;
        case Comparator.NOT_EQUAL:
            return fieldName + " must not be equal to " + baseValue;
        case Comparator.GREATER:
            return fieldName + " must be greater than " + baseValue;
        case Comparator.GREATER_OR_EQUAL:
            return fieldName + " must be greater than or equal to " + baseValue;
        case Comparator.SMALLER:
            return fieldName + " must be smaller than " + baseValue;
        case Comparator.SMALLER_OR_EQUAL:
            return fieldName + " must be smaller than or equal to " + baseValue;
        default:
            throw new Error("unknown comparator " + cmp);
    }
}


export const validateRegex = (regex: string, value?: string): boolean => {
    if (!value) return false;
    const expr = new RegExp(regex);
    return expr.test(value);
}

export const errorRegex = (fieldName: string, errorMessage: string | null): string => {
    if (errorMessage) return errorMessage;
    return fieldName + " is not valid";
}

export const validatePassword = (pw: string | undefined | null, minEntropy: number): boolean => {
    if (!pw) return false;
    return passwordConformsToEntropy(pw, minEntropy);
}

export const errorPassword = (fieldName: string, errorMessage: string | null): string => {
    if (errorMessage) return errorMessage;
    return fieldName + " is not strong enough";
}

export const validateLength = (length: number, value?: string): boolean => {
    if (!value) return false;
    return value.length >= length;
}

export const errorLength = (length: number, fieldName: string, errorMessage: string | null): string => {
    if (errorMessage) return errorMessage;
    return fieldName + " needs at least " + length + " characters";
}

export const validateSize = (size: number, value?: Array<any>): boolean => {
    if (!value) return false;
    return value.length >= size;
}

export const errorSize = (size: number, fieldName: string, errorMessage: string | null): string => {
    if (errorMessage) return errorMessage;
    return fieldName + " needs at least " + size + " characters";
}

export interface FailureCallback<BEAN_TYPE, VALIDATION_TYPE extends ValidationBean> {
    (validation: VALIDATION_TYPE, bean: BEAN_TYPE): void
}

export interface SuccessCallback<BEAN_TYPE, VALIDATION_TYPE extends ValidationBean> {
    (validation: VALIDATION_TYPE, bean: BEAN_TYPE): void
}



export interface ValidationCallback<BEAN_TYPE, VALIDATION_TYPE extends ValidationBean> {
    (bean: BEAN_TYPE): VALIDATION_TYPE
}

export interface EditRemoteStoreFunction<BEAN_TYPE extends AbstractWebSocketBean> {
    (payload: BEAN_TYPE) : void
}

export interface PostValidationCallback<VALIDATION_TYPE extends ValidationBean> {
    (validationBean: VALIDATION_TYPE): void
}

