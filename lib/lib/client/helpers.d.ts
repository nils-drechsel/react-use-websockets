import { Dispatch, SetStateAction } from 'react';
import { FailureCallback, SuccessCallback, ValidationCallback, ValidationType } from '../store/beans/StoreBeanUtils';
import { UnsubscribeCallback } from './WebSocketManager';
export declare const useListenEffect: (message: string, callback: (payload: any, fromSid?: string | null | undefined) => void, onInit?: (() => void) | undefined) => void;
export declare const useListen: (message: string) => (callback: (payload: any, fromSid?: string | null | undefined) => void) => UnsubscribeCallback;
export declare const useServerValidationEffect: <VALIDATION_TYPE extends ValidationType>(componentId: string, setValidation: Dispatch<SetStateAction<VALIDATION_TYPE>>, onSuccess?: ((validation: VALIDATION_TYPE) => void) | undefined, onFailure?: ((validation: VALIDATION_TYPE) => void) | undefined, onInit?: (() => void) | undefined) => void;
export declare const useServerValidation: <VALIDATION_TYPE extends ValidationType>(componentId: string, setValidation: Dispatch<SetStateAction<VALIDATION_TYPE>>) => (onSuccess?: ((validation: VALIDATION_TYPE) => void) | undefined, onFailure?: ((validation: VALIDATION_TYPE) => void) | undefined) => UnsubscribeCallback;
export declare const performClientValidation: <BEAN_TYPE, VALIDATION_TYPE extends ValidationType>(bean: BEAN_TYPE, validationCallback: ValidationCallback<BEAN_TYPE, VALIDATION_TYPE>, setValidation: Dispatch<SetStateAction<VALIDATION_TYPE>>, onSuccess: SuccessCallback<BEAN_TYPE, VALIDATION_TYPE>, onFailure: FailureCallback<BEAN_TYPE, VALIDATION_TYPE>) => void;
