import React, { cloneElement, FunctionComponent, ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { ClientErrorBean, CoreMessage, createClientErrorBean, IOCoreEndpoints } from "../beans/Beans";
import { clientToServerCoreBeanBuilder } from "./IOClientToServerCoreBeanBuilder";
import { WebSocketContext } from "./WebSocketContext";
import { WebSocketManager } from "./WebSocketManager";

interface Props {
    id: string;
    url: string;
    domain: string;
    delimiter?: string;
    logging?: boolean;
    reconnect?: boolean;
    showElementWhileConnecting?: ReactElement | null;
    ping?: number;
    children: ReactNode;
}

export const WebSocketProvider: FunctionComponent<Props> = ({
    id,
    url,
    domain,
    ping,
    logging,
    reconnect,
    showElementWhileConnecting,
    children,
}) => {
    const managerMap: Map<string, WebSocketManager> = useContext(WebSocketContext);

    const [manager, setManager] = useState<WebSocketManager | null>(null);

    useEffect(() => {
        const manager = new WebSocketManager(
            url,
            domain,
            reconnect,
            ping,
            logging || false,
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
        const errorBean: ClientErrorBean = createClientErrorBean({
            message: "" + error,
            componentStack: info?.componentStack,
        });
        if (manager) manager.send(
            clientToServerCoreBeanBuilder()
                .endpoint(IOCoreEndpoints.CORE)
                .message(CoreMessage.CLIENT_ERROR)
                .payload(errorBean)
                .build());
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
