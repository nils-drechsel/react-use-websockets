import { AbstractIOBean } from '../store/beans/Beans';
import { ClientToServerCoreBean } from './ClientToServerCoreBeanBuilder';
import { ConnectivityCallback, DefaultListenerCallback, ListenerCallback, UnsubscribeCallback, WebSocketManager } from './WebSocketManager';
export type SendFunction = (coreBean: ClientToServerCoreBean) => void;
export type ListenFunction = <BEAN extends AbstractIOBean>(endpoint: string, message: string, callback: ListenerCallback<BEAN>) => UnsubscribeCallback;
export declare const useWebSocket: (id?: string | null) => {
    manager: WebSocketManager;
    send: SendFunction;
    listen: ListenFunction;
    isConnected: () => boolean;
    connectivity: (callback: ConnectivityCallback) => UnsubscribeCallback;
    setDefaultCallback: (callback: DefaultListenerCallback) => void;
};
export declare const useSocket: (id?: string | null) => [string, string];
