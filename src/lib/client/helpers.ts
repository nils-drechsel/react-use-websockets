import { useEffect } from 'react';
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
