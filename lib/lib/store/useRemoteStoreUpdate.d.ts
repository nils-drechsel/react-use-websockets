import { EditRemoteStoreFunction, PostValidationCallback, ValidationCallback } from "./beans/StoreBeanUtils";
import { ValidationBean, AbstractWebSocketBean, StoreParametersBean } from "./beans/Beans";
export declare const useRemoteStoreUpdate: <BEAN_TYPE extends AbstractWebSocketBean, VALIDATION_TYPE extends ValidationBean>(path: string[], params?: StoreParametersBean | null | undefined, validationFunction?: ValidationCallback<BEAN_TYPE, VALIDATION_TYPE> | undefined, postServerValidationCallback?: PostValidationCallback<VALIDATION_TYPE> | undefined, postClientValidationCallback?: PostValidationCallback<VALIDATION_TYPE> | undefined, onInitCallback?: (() => void) | undefined) => [EditRemoteStoreFunction<BEAN_TYPE>, VALIDATION_TYPE | null];
export default useRemoteStoreUpdate;
