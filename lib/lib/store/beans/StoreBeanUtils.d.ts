import { Comparator } from "./StoreBeans";
export declare const createStoreId: (path: string[]) => string;
export interface SetFunction<TYPE> {
    (f: StateSetFunction<TYPE>): void;
}
export interface StateSetFunction<TYPE> {
    (old: TYPE): TYPE;
}
export interface UpdateFunction<TYPE> {
    (changeset: Partial<TYPE>): void;
}
export declare const updateBean: <TYPE>(setBean: SetFunction<TYPE>) => UpdateFunction<TYPE>;
export declare const validateNotEmpty: (value?: any) => boolean;
export declare const errorNotEmpty: (fieldName: string) => string;
export declare const validateComparison: (cmp: Comparator, baseValue: number, value?: number | undefined) => boolean;
export declare const errorComparison: (cmp: Comparator, baseValue: number, fieldName: string) => string;
export declare const validateRegex: (regex: string, value?: string | undefined) => boolean;
export declare const errorRegex: (fieldName: string) => string;
export declare const validateLength: (length: number, value?: string | undefined) => boolean;
export declare const errorLength: (length: number, fieldName: string) => string;
export declare const validateSize: (size: number, value?: any[] | undefined) => boolean;
export declare const errorSize: (size: number, fieldName: string) => string;
export interface ValidationCallback<TYPE> {
    (bean: TYPE): any;
}
export interface ErrorCallback {
    (validation: any): void;
}
export interface SuccessCallback<TYPE> {
    (validation: any, bean: TYPE): void;
}
export declare const validate: <TYPE>(bean: TYPE, validationCallback: ValidationCallback<TYPE>, onError: ErrorCallback, onSuccess: SuccessCallback<TYPE>) => any;
