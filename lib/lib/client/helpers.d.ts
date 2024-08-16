import { UnsubscribeCallback } from './WebSocketManager';
export declare const updateSet: <T>(set: Set<T> | null | undefined, value: T, state: boolean) => Set<T>;
export declare const useListenEffect: (id: string | null, endpoint: string, message: string, callback: (payload: any, fromSid?: string | null) => void, onInit?: () => void) => void;
export declare const useListen: (id: string | null, endpoint: string, message: string) => (callback: (payload: any, fromSid?: string | null) => void) => UnsubscribeCallback;
