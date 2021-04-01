import { useContext } from 'react';
import { WebSocketContext } from "./WebSocketContext";
import { WebSocketManager, ListenerCallback, UnsubscribeCallback, ConnectivityCallback, DefaultListenerCallback } from './WebSocketManager';

export type SendFunction = (message: string, payload: any, toSid?: string | null) => void;

export const useWebSocket = (id?: string | null) => {
    const managerMap: Map<string, WebSocketManager> = useContext(WebSocketContext);

    let manager: WebSocketManager | undefined = undefined;
    if (id) {
        manager = managerMap.get(id);
    } else {
        if (managerMap.size > 0) manager = Array.from(managerMap.values())[0];
    }

    if (!manager) throw Error("manager is null, did you provide a <WebSocketProvider> element with the correct id ("+id+") ?");

    const send: SendFunction = (message: string, payload: any, toSid: string | null = null) => {
        manager!.send(message, payload, toSid);
    };
    const listen = (message: string, callback: ListenerCallback): UnsubscribeCallback => {
        return manager!.addListener(message, callback);
    }
    const isConnected = (): boolean => {
        return manager!.isConnected();
    }
    const connectivity = (callback: ConnectivityCallback): UnsubscribeCallback => {
        return manager!.addConnectivityListener(callback);
    }
    const setDefaultCallback = (callback: DefaultListenerCallback): void => {
        return manager!.setDefaultCallback(callback);
    }

    return { manager, send, listen, isConnected, connectivity, setDefaultCallback };
}
