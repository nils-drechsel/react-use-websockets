import { UnsubscribeCallback } from './WebSocketManager';
export declare const useListenEffect: (message: string, callback: (payload: any, fromSid?: string | null | undefined) => void) => void;
export declare const useListen: (message: string) => (callback: (payload: any, fromSid?: string | null | undefined) => void) => UnsubscribeCallback;
export declare const useValidation: (componentId: string, setValidation: (validation: any) => void, onSuccess?: (() => void) | undefined, onFailure?: (() => void) | undefined) => void;
