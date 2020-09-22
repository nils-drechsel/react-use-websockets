import { Comparator } from "./StoreBeans";
import { WebSocketManager } from "../../client/WebSocketManager";

export const createStoreId = (path: Array<string>) => {
    return path.join("/");
}

export interface SetFunction<TYPE> {
    (f: StateSetFunction<TYPE>): void;
}

export interface StateSetFunction<TYPE> {
    (old: TYPE): TYPE;
}

export interface UpdateFunction<TYPE> {
    (changeset: Partial<TYPE>): void
}

export const updateBean = <TYPE>(setBean: SetFunction<TYPE>): UpdateFunction<TYPE> => {

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

export const errorNotEmpty = (fieldName: string): string => {
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

export const errorComparison = (cmp: Comparator, baseValue: number, fieldName: string): string => {
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

export const errorRegex = (fieldName: string): string => {
    return fieldName + " is not valid";
}

export const validateLength = (length: number, value?: string): boolean => {
    if (!value) return false;
    return value.length >= length;
}

export const errorLength = (length: number, fieldName: string): string => {
    return fieldName + " needs at least " + length + " characters";
}

export const validateSize = (size: number, value?: Array<any>): boolean => {
    if (!value) return false;
    return value.length >= size;
}

export const errorSize = (size: number, fieldName: string): string => {
    return fieldName + " needs at least " + size + " characters";
}

export interface ValidationType {
    originId?: string | null,
    success?: boolean | null
}

export interface ValidationCallback<BEAN_TYPE, VALIDATION_TYPE extends ValidationType> {
    (bean: BEAN_TYPE): VALIDATION_TYPE
}

export interface FailureCallback<BEAN_TYPE, VALIDATION_TYPE extends ValidationType> {
    (validation: VALIDATION_TYPE, bean: BEAN_TYPE): void
}

export interface SuccessCallback<BEAN_TYPE, VALIDATION_TYPE extends ValidationType> {
    (validation: VALIDATION_TYPE, bean: BEAN_TYPE): void
}
