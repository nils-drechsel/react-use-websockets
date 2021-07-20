import { Comparator, ValidationBean, AbstractWebSocketBean, AbstractStoreParametersBean } from "./Beans";
import { Dispatch, SetStateAction } from "react";
export declare const createStoreId: (path: Array<string>, params?: AbstractStoreParametersBean | null | undefined) => string;
export interface UpdateFunction<TYPE extends AbstractWebSocketBean> {
    (changeset: Partial<TYPE>): void;
}
export interface PartialUpdateFunction<TYPE extends Partial<AbstractWebSocketBean>> {
    (changeset: Partial<TYPE>, store: boolean): void;
}
export declare const updateBean: <TYPE extends AbstractWebSocketBean>(setBean: Dispatch<SetStateAction<TYPE>>) => UpdateFunction<TYPE>;
export declare const updatePartialBean: <TYPE extends AbstractWebSocketBean>(setBean: Dispatch<SetStateAction<TYPE>>, remoteStore: PartialEditRemoteStoreFunction<Partial<TYPE>>, debounceTime?: number | undefined) => PartialUpdateFunction<Partial<TYPE>>;
export declare const validateNotEmpty: (value: any, partial: boolean) => boolean;
export declare const errorNotEmpty: (fieldName: string, errorMessage: string | null) => string;
export declare const validateComparison: (cmp: Comparator, baseValue: number, value: number, partial: boolean) => boolean;
export declare const errorComparison: (cmp: Comparator, baseValue: number, fieldName: string, errorMessage: string | null) => string;
export declare const validateRegex: (regex: string, value: string | undefined, partial: boolean) => boolean;
export declare const errorRegex: (fieldName: string, errorMessage: string | null) => string;
export declare const validatePassword: (pw: string | undefined | null, minEntropy: number, partial: boolean) => boolean;
export declare const errorPassword: (fieldName: string, errorMessage: string | null) => string;
export declare const validateLength: (length: number, value: string | undefined, partial: boolean) => boolean;
export declare const errorLength: (length: number, fieldName: string, errorMessage: string | null) => string;
export declare const validateSize: (size: number, value: Array<any> | undefined, partial: boolean) => boolean;
export declare const errorSize: (size: number, fieldName: string, errorMessage: string | null) => string;
export interface FailureCallback<BEAN_TYPE, VALIDATION_TYPE extends ValidationBean> {
    (validation: VALIDATION_TYPE, bean: BEAN_TYPE): void;
}
export interface SuccessCallback<BEAN_TYPE, VALIDATION_TYPE extends ValidationBean> {
    (validation: VALIDATION_TYPE, bean: BEAN_TYPE): void;
}
export interface ValidationCallback<BEAN_TYPE, VALIDATION_TYPE extends ValidationBean> {
    (bean: BEAN_TYPE, partial?: boolean): VALIDATION_TYPE;
}
export interface EditRemoteStoreFunction<BEAN_TYPE extends AbstractWebSocketBean> {
    (payload: BEAN_TYPE): void;
}
export interface PartialEditRemoteStoreFunction<BEAN_TYPE extends Partial<AbstractWebSocketBean>> {
    (payload: BEAN_TYPE): void;
}
export interface PostValidationCallback<VALIDATION_TYPE extends ValidationBean> {
    (validationBean: VALIDATION_TYPE): void;
}
