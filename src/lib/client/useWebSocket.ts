import { useContext, useEffect, useState } from 'react';
import { AbstractIOBean, IOClientToServerCoreBean } from '../beans/Beans';
import { WebSocketContext } from "./WebSocketContext";
import { ConnectivityCallback, DefaultListenerCallback, ListenerCallback, UnsubscribeCallback, WebSocketManager } from './WebSocketManager';

export type SendFunction = (coreBean: IOClientToServerCoreBean) => void;

export type ListenFunction = <BEAN extends AbstractIOBean>(endpoint: string, message: string, callback: ListenerCallback<BEAN>) => UnsubscribeCallback;


export const useWebSocket = (id?: string | null) => {
    const managerMap: Map<string, WebSocketManager> = useContext(WebSocketContext);

    let manager: WebSocketManager | undefined = undefined;
    if (id) {
        manager = managerMap.get(id);
    } else {
        if (managerMap.size > 0) manager = Array.from(managerMap.values())[0];
    }

    if (!manager) throw Error("manager is null, did you provide a <WebSocketProvider> element with the correct id ("+id+") ?");

    const send: SendFunction = (coreBean: IOClientToServerCoreBean) => {
        manager!.send(coreBean);
    };
    const listen: ListenFunction = <BEAN extends AbstractIOBean>(endpoint: string, message: string, callback: ListenerCallback<BEAN>): UnsubscribeCallback => {
        return manager!.addListener(endpoint, message, callback);
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

export const useSocket = (id?: string | null): [string, string] => {
    
    const { connectivity, manager } = useWebSocket(id);
    const [sid, setSid] = useState(manager.getSid());
    const [uid, setUid] = useState(manager.getUid());

    useEffect(() => {
        const unsubscribe = connectivity((_isConnected, _isReady, sid, uid) => {
            if (sid) setSid(sid);
            if (uid) setUid(uid);
        });

        return () => {
            unsubscribe();
        }
    });

    return [sid, uid];

}