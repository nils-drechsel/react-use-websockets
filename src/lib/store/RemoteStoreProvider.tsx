import React, { FunctionComponent, ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { useWebSocket } from "../client/useWebSocket";
import { RemoteStore } from "./RemoteStore";
import RemoteStoreContext from "./RemoteStoreContext";

interface Props {
    id: string;
    showElementWhileConnecting?: ReactElement | null;
    children: ReactNode;
}

export const RemoteStoreProvider: FunctionComponent<Props> = ({ id, children, showElementWhileConnecting }) => {
    const remoteStoreMap: Map<string, RemoteStore<any>> = useContext(RemoteStoreContext);

    const { manager } = useWebSocket(id);

    const [store, setStore] = useState<RemoteStore<any> | null>(null);

    useEffect(() => {
        const store = new RemoteStore(manager);

        setStore(store);

        return () => {
            store.releaseRemoteStore();
        };
    }, []);

    const map = new Map();
    if (remoteStoreMap) {
        remoteStoreMap.forEach((value, key) => map.set(key, value));
    }
    map.set(id, store);

    if (!store) return (showElementWhileConnecting as any) || null;

    return <RemoteStoreContext.Provider value={map}>{children}</RemoteStoreContext.Provider>;
};
