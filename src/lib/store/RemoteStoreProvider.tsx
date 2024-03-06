import React, { FunctionComponent, ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { BeanSerialisationSignature } from "../client/serialisation/Serialisation";
import { useWebSocket } from "../client/useWebSocket";
import { RemoteStore } from "./RemoteStore";
import RemoteStoreContext from "./RemoteStoreContext";

interface Props {
    id: string;
    serialisationSignatures?: Map<string, BeanSerialisationSignature>;
    showElementWhileConnecting?: ReactElement | null;
    children: ReactNode;
}

export const RemoteStoreProvider: FunctionComponent<Props> = ({ id, children, serialisationSignatures, showElementWhileConnecting }) => {
    const remoteStoreMap: Map<string, RemoteStore<any>> = useContext(RemoteStoreContext);

    const { manager } = useWebSocket(id);

    const [store, setStore] = useState<RemoteStore<any> | null>(null);

    useEffect(() => {
        const store = new RemoteStore(manager, serialisationSignatures);

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
