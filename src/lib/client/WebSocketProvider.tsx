import React, { FunctionComponent, useEffect, useState, cloneElement, ReactElement, useContext } from "react";
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
    ping?: number;
}

export const WebSocketProvider: FunctionComponent<Props> = ({
    id,
    url,
    domain,
    delimiter,
    ping,
    logging,
    reconnect,
    showElementWhileConnecting,
    children,
}) => {
    const managerMap: Map<string, WebSocketManager> = useContext(WebSocketContext);

    const [manager] = useState<WebSocketManager>(
        new WebSocketManager(url, domain, delimiter || "\t", reconnect, ping, logging || false)
    );

    useEffect(() => {
        return () => {
            manager.destroy();
        };
    }, [manager]);

    const [, setUid] = useState(null as string | null);

    const onError = (error: any, info: any) => {
        const errorBean: ClientErrorBean = {
            message: "" + error,
            componentStack: info?.componentStack,
        };
        if (manager) manager.send(CoreMessage.CLIENT_ERROR, errorBean);
    };

    const errorFallback = ({}: FallbackProps) => {
        return <div>An error has occurred and was registered</div>;
    };

    const [isSocketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        const unsubscribe = manager.addConnectivityListener((_isConnected, isReady, _sid, uid) => {
            if (logging) console.log("setting connectivity for uid:", uid, "ready:", isReady);
            setSocketConnected(isReady);
            setUid(uid);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if ((!manager || !isSocketConnected) && showElementWhileConnecting) {
        return <div>{cloneElement(showElementWhileConnecting)}</div>;
    }

    const map = new Map();
    if (managerMap) {
        managerMap.forEach((value, key) => map.set(key, value));
    }
    map.set(id, manager);

    return (
        <WebSocketContext.Provider value={map}>
            <ErrorBoundary onError={onError} fallbackRender={errorFallback}>
                {children}
            </ErrorBoundary>
        </WebSocketContext.Provider>
    );
};
