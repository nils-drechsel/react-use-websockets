import React, { FunctionComponent, useEffect, useState, cloneElement, ReactElement, useContext } from "react";
import { WebSocketManager } from "./WebSocketManager";
import { WebSocketContext } from "./WebSocketContext";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { ClientErrorBean, CoreMessage } from "../store/beans/Beans";
import { BeanSerialisationSignature } from "./serialisation/Serialisation";

interface Props {
    id: string;
    url: string;
    domain: string;
    delimiter?: string;
    logging?: boolean;
    reconnect?: boolean;
    showElementWhileConnecting?: ReactElement | null;
    ping?: number;
    serialisationSignatures?: Map<string, BeanSerialisationSignature>;
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
    serialisationSignatures,
}) => {
    const managerMap: Map<string, WebSocketManager> = useContext(WebSocketContext);

    const [manager, setManager] = useState<WebSocketManager | null>(null);

    useEffect(() => {
        const manager = new WebSocketManager(
            url,
            domain,
            delimiter || "\t",
            reconnect,
            ping,
            logging || false,
            serialisationSignatures
        );

        setManager(manager);

        const unsubscribe = manager.addConnectivityListener((_isConnected, isReady, _sid, uid) => {
            if (logging) console.log("setting connectivity for uid:", uid, "ready:", isReady);
            setSocketConnected(isReady);
            setUid(uid);
        });

        return () => {
            if (logging) console.log("destroying websocket manager");
            unsubscribe();
            manager.destroy();
        };
    }, []);

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
