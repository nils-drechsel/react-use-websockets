import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { UnsubscribeCallback } from './WebSocketManager';

export const useListenEffect = (message: string, callback: (payload: any, fromSid?: string | null) => void): void => {
    const { listen } = useWebSocket();

    useEffect(() => {
        const unsubscribe = listen(message, callback);

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

export const useValidation = (componentId: string, setValidation: (validation: any) => void, onSuccess?: () => void, onFailure?: () => void) => {

    useListenEffect("VALIDATION",

        (validationBean: any) => {
            if (validationBean.originId !== componentId) return;
            setValidation(validationBean);
            if (!validationBean.success) {
                if (onFailure) onFailure();
            } else {
                if (onSuccess) onSuccess();
            }
        });

}