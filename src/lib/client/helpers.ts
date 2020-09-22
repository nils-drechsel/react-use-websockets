import { useEffect, Dispatch, SetStateAction } from 'react';
import { FailureCallback, SuccessCallback, ValidationCallback, ValidationType } from '../store/beans/StoreBeanUtils';
import { useWebSocket } from './useWebSocket';
import { UnsubscribeCallback } from './WebSocketManager';

export const useListenEffect = (message: string, callback: (payload: any, fromSid?: string | null) => void, onInit?: () => void): void => {
    const { listen } = useWebSocket();

    useEffect(() => {
        const unsubscribe = listen(message, callback);

        if (onInit) onInit();

        () => {
            unsubscribe();
        }
    }, []);

}

export const useListen = (message: string): ((callback: (payload: any, fromSid?: string | null) => void) => UnsubscribeCallback) => {
    const { listen } = useWebSocket();

    return (callback: (payload: any, fromSid?: string | null) => void) => {
        const unsubscribe = listen(message, callback);
        return unsubscribe;
    };

}

export const useServerValidation = <VALIDATION_TYPE extends ValidationType>(componentId: string, setValidation: Dispatch<SetStateAction<VALIDATION_TYPE>>, onSuccess?: (validation: VALIDATION_TYPE) => void, onFailure?: (validation: VALIDATION_TYPE) => void, onInit?: () => void) => {

    useListenEffect("VALIDATION",

        (validationBean: VALIDATION_TYPE) => {
            if (validationBean.originId !== componentId) return;
            setValidation(validationBean);
            if (!validationBean.success) {
                if (onFailure) onFailure(validationBean);
            } else {
                if (onSuccess) onSuccess(validationBean);
            }
        }, onInit);

}


export const useClientValidation = <BEAN_TYPE, VALIDATION_TYPE extends ValidationType>(bean: BEAN_TYPE, validationCallback: ValidationCallback<BEAN_TYPE, VALIDATION_TYPE>, setValidation: Dispatch<SetStateAction<VALIDATION_TYPE>>, onSuccess: SuccessCallback<BEAN_TYPE, VALIDATION_TYPE>, onFailure: FailureCallback<BEAN_TYPE, VALIDATION_TYPE>): void => {
    const validation = validationCallback(bean);
    setValidation(validation);
    if (validation?.success) {
        onSuccess(validation, bean);
    } else {
        onFailure(validation, bean);
    }
}