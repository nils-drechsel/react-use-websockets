import { Comparator, ValidationBean, AbstractWebSocketBean, StoreParametersBean } from "./Beans";
import { Dispatch, SetStateAction } from "react";
export declare const createStoreId: (path: string[], params: StoreParametersBean | null) => string;
export interface UpdateFunction<TYPE extends AbstractWebSocketBean> {
    (changeset: Partial<TYPE>): void;
}
export declare const updateBean: <TYPE extends AbstractWebSocketBean>(setBean: Dispatch<SetStateAction<TYPE>>) => UpdateFunction<TYPE>;
export declare const validateNotEmpty: (value?: any) => boolean;
export declare const errorNotEmpty: (fieldName: string, errorMessage: string | null) => string;
export declare const validateComparison: (cmp: Comparator, baseValue: number, value?: number | undefined) => boolean;
export declare const errorComparison: (cmp: Comparator, baseValue: number, fieldName: string, errorMessage: string | null) => string;
export declare const validateRegex: (regex: string, value?: string | undefined) => boolean;
export declare const errorRegex: (fieldName: string, errorMessage: string | null) => string;
export declare const validateLength: (length: number, value?: string | undefined) => boolean;
export declare const errorLength: (length: number, fieldName: string, errorMessage: string | null) => string;
export declare const validateSize: (size: number, value?: any[] | undefined) => boolean;
export declare const errorSize: (size: number, fieldName: string, errorMessage: string | null) => string;
export interface FailureCallback<BEAN_TYPE, VALIDATION_TYPE extends ValidationBean> {
    (validation: VALIDATION_TYPE, bean: BEAN_TYPE): void;
}
export interface SuccessCallback<BEAN_TYPE, VALIDATION_TYPE extends ValidationBean> {
    (validation: VALIDATION_TYPE, bean: BEAN_TYPE): void;
}
export interface ValidationCallback<BEAN_TYPE, VALIDATION_TYPE extends ValidationBean> {
    (bean: BEAN_TYPE): VALIDATION_TYPE;
}
export interface EditRemoteStoreFunction<BEAN_TYPE extends AbstractWebSocketBean> {
    (payload: BEAN_TYPE): void;
}
export interface PostValidationCallback<VALIDATION_TYPE extends ValidationBean> {
    (validationBean: VALIDATION_TYPE): void;
}
