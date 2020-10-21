import { EditRemoteStoreFunction, PostValidationCallback, ValidationCallback } from "./beans/StoreBeanUtils";
import { ValidationBean, AbstractWebSocketBean } from "./beans/StoreBeans";
export declare const useRemoteStoreUpdate: <BEAN_TYPE extends AbstractWebSocketBean, VALIDATION_TYPE extends ValidationBean>(path: string[], params: string[], validationFunction?: ValidationCallback<BEAN_TYPE, VALIDATION_TYPE> | undefined, postValidationCallback?: PostValidationCallback<VALIDATION_TYPE> | undefined) => [EditRemoteStoreFunction<BEAN_TYPE>, VALIDATION_TYPE | null];
export default useRemoteStoreUpdate;
