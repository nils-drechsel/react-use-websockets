import { Dispatch, SetStateAction } from 'react';
import { AbstractIOBean, ValidationBean } from '../store/beans/Beans';
import { FailureCallback, SuccessCallback, ValidationCallback } from '../store/beans/StoreBeanUtils';
import { UnsubscribeCallback } from './WebSocketManager';
export declare const updateSet: <T>(set: Set<T> | null | undefined, value: T, state: boolean) => Set<T>;
export declare const useListenEffect: (id: string | null, endpoint: string, message: string, callback: (payload: any, fromSid?: string | null) => void, onInit?: () => void) => void;
export declare const useListen: (id: string | null, endpoint: string, message: string) => (callback: (payload: any, fromSid?: string | null) => void) => UnsubscribeCallback;
export declare const performClientValidation: <BEAN_TYPE extends AbstractIOBean, VALIDATION_TYPE extends ValidationBean>(bean: BEAN_TYPE, validationCallback: ValidationCallback<BEAN_TYPE, VALIDATION_TYPE>, setValidation: Dispatch<SetStateAction<VALIDATION_TYPE>>, onSuccess: SuccessCallback<BEAN_TYPE, VALIDATION_TYPE>, onFailure: FailureCallback<BEAN_TYPE, VALIDATION_TYPE>) => void;
