import { MessageBean } from './Beans';
export declare const useListenForMessage: () => (callback: (payload: MessageBean, fromSid?: string | null | undefined) => void) => any;
export declare const useListenForMessageEffect: (callback: (payload: MessageBean, fromSid?: string | null | undefined) => void) => void;
