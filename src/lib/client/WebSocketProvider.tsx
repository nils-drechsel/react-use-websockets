import React, { FunctionComponent, useEffect, useRef, useState, cloneElement, ReactElement, useContext } from "react";
import { WebSocketManager } from "./WebSocketManager";
import { WebSocketContext } from "./WebSocketContext";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { ClientErrorBean, CoreMessage } from "../store/beans/Beans";

interface Props {
    id: string;
    url: string;
    domain: string;
    delimiter?: string;
    logging?: boolean;
    reconnect?: boolean;
    showElementWhileConnecting?: ReactElement | null;
}


export const WebSocketProvider: FunctionComponent<Props> = ({ id, url, domain, delimiter, logging, reconnect, showElementWhileConnecting, children }) => {

    const managerMap: Map<string, WebSocketManager> = useContext(WebSocketContext);

    const managerRef = useRef<WebSocketManager>();

    if (!managerRef.current) {
        managerRef.current = new WebSocketManager(url, domain, delimiter || "\t", reconnect, logging || false);
    }

    useEffect(() => {
        return () => {
            if (managerRef.current) managerRef.current.destroy();
        }
    }, []);

    const [, setUid] = useState(null as string | null);

  
    const onError = (error: any, info: any) => {
        const errorBean: ClientErrorBean = {
            message: "" + error,
            componentStack: info?.componentStack
        }
        managerRef.current!.send(CoreMessage.CLIENT_ERROR, errorBean);
    };

    const errorFallback = ({}: FallbackProps) => {
        return <div>An error has occurred and was registered</div>;
    };    

    const [isSocketConnected, setSocketConnected] = useState(false);
    
    useEffect(() => {
        const unsubscribe = managerRef.current!.addConnectivityListener((_isConnected, isReady, _sid, uid) => {
            if (logging) console.log("setting connectivity for uid:", uid, "ready:", isReady);
            setSocketConnected(isReady);
            setUid(uid);
        });

        return () => {
            unsubscribe();
        }

    }, []);

    if (!isSocketConnected && showElementWhileConnecting) {
        return (<div>{cloneElement(showElementWhileConnecting)}</div>);
    }

    const map = new Map();
    if (managerMap) {
        managerMap.forEach((value, key) => map.set(key, value));
    }
    map.set(id, managerRef.current);

    return (
        <WebSocketContext.Provider value={map}>
            <ErrorBoundary onError={onError} fallbackRender={errorFallback}>
                { children }
            </ErrorBoundary>
        </WebSocketContext.Provider>
    )
}