import { Dispatch, SetStateAction, useEffect } from 'react';
import { AbstractIOBean, CoreMessage, ValidationBean } from '../store/beans/Beans';
import { FailureCallback, SuccessCallback, ValidationCallback } from '../store/beans/StoreBeanUtils';
import { UnsubscribeCallback } from './WebSocketManager';
import { useWebSocket } from './useWebSocket';


export const updateSet = <T>(set: Set<T> | undefined | null, value: T, state: boolean): Set<T> => {
    const result = new Set(set);
    if (state) {
        result.add(value);
    } else {
        result.delete(value);
    }
    return result;
}

export const useListenEffect = (id: string | null, endpoint: string, message: string, callback: (payload: any, fromSid?: string | null) => void, onInit?: () => void): void => {
    const { listen } = useWebSocket(id);

    useEffect(() => {
        const unsubscribe = listen(endpoint, message, callback);

        if (onInit) onInit();

        return () => {
            unsubscribe();
        }
    }, []);

}

export const useListen = (id: string | null, endpoint: string, message: string): ((callback: (payload: any, fromSid?: string | null) => void) => UnsubscribeCallback) => {
    const { listen } = useWebSocket(id);

    return (callback: (payload: any, fromSid?: string | null) => void) => {
        const unsubscribe = listen(endpoint, message, callback);
        return unsubscribe;
    };

}

export const useServerValidationEffect = <VALIDATION_TYPE extends ValidationBean>(id: string | null, endpoint: string, componentId: string, setValidation: Dispatch<SetStateAction<VALIDATION_TYPE>>, onSuccess?: (validation: VALIDATION_TYPE) => void, onFailure?: (validation: VALIDATION_TYPE) => void, onInit?: () => void) => {

    useListenEffect(id, endpoint, CoreMessage.VALIDATION,

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


export const useServerValidation = <VALIDATION_TYPE extends ValidationBean>(id: string | null, endpoint: string, componentId: string, setValidation: Dispatch<SetStateAction<VALIDATION_TYPE>>): ((onSuccess?: (validation: VALIDATION_TYPE) => void, onFailure?: (validation: VALIDATION_TYPE) => void) => UnsubscribeCallback) => {
    const { listen } = useWebSocket(id);

    return (onSuccess?: (validation: VALIDATION_TYPE) => void, onFailure?: (validation: VALIDATION_TYPE) => void) => {

        const unsubscribe = listen(endpoint, CoreMessage.VALIDATION, (validationBean: VALIDATION_TYPE, _fromSid?: string | null) => {

            if (validationBean.originId !== componentId) return;
            setValidation(validationBean);
            if (!validationBean.success) {
                if (onFailure) onFailure(validationBean);
            } else {
                if (onSuccess) onSuccess(validationBean);
            }

        });

        return unsubscribe;

    };

};


export const performClientValidation = <BEAN_TYPE extends AbstractIOBean, VALIDATION_TYPE extends ValidationBean>(bean: BEAN_TYPE, validationCallback: ValidationCallback<BEAN_TYPE, VALIDATION_TYPE>, setValidation: Dispatch<SetStateAction<VALIDATION_TYPE>>, onSuccess: SuccessCallback<BEAN_TYPE, VALIDATION_TYPE>, onFailure: FailureCallback<BEAN_TYPE, VALIDATION_TYPE>): void => {
    const validation = validationCallback(bean);
    setValidation(validation);
    if (validation?.success) {
        onSuccess(validation, bean);
    } else {
        onFailure(validation, bean);
    }
}
