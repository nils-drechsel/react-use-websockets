import { useEffect, Dispatch, SetStateAction } from 'react';
import { AbstractWebSocketBean, CoreMessage, ValidationBean } from '../store/beans/Beans';
import { FailureCallback, SuccessCallback, ValidationCallback } from '../store/beans/StoreBeanUtils';
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

export const useServerValidationEffect = <VALIDATION_TYPE extends ValidationBean>(componentId: string, setValidation: Dispatch<SetStateAction<VALIDATION_TYPE>>, onSuccess?: (validation: VALIDATION_TYPE) => void, onFailure?: (validation: VALIDATION_TYPE) => void, onInit?: () => void) => {

    useListenEffect(CoreMessage.VALIDATION,

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


export const useServerValidation = <VALIDATION_TYPE extends ValidationBean>(componentId: string, setValidation: Dispatch<SetStateAction<VALIDATION_TYPE>>): ((onSuccess?: (validation: VALIDATION_TYPE) => void, onFailure?: (validation: VALIDATION_TYPE) => void) => UnsubscribeCallback) => {
    const { listen } = useWebSocket();

    return (onSuccess?: (validation: VALIDATION_TYPE) => void, onFailure?: (validation: VALIDATION_TYPE) => void) => {

        const unsubscribe = listen(CoreMessage.VALIDATION, (validationBean: VALIDATION_TYPE, _fromSid?: string | null) => {

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


export const performClientValidation = <BEAN_TYPE extends AbstractWebSocketBean, VALIDATION_TYPE extends ValidationBean>(bean: BEAN_TYPE, validationCallback: ValidationCallback<BEAN_TYPE, VALIDATION_TYPE>, setValidation: Dispatch<SetStateAction<VALIDATION_TYPE>>, onSuccess: SuccessCallback<BEAN_TYPE, VALIDATION_TYPE>, onFailure: FailureCallback<BEAN_TYPE, VALIDATION_TYPE>): void => {
    const validation = validationCallback(bean);
    setValidation(validation);
    if (validation?.success) {
        onSuccess(validation, bean);
    } else {
        onFailure(validation, bean);
    }
}
