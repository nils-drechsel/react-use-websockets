import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { RemoteStore } from "./RemoteStore";
import RemoteStoreContext from "./RemoteStoreContext";
import { useWebSocket } from "../client/useWebSocket";
import { BeanSerialisationSignature } from "../client/serialisation/Serialisation";

interface Props {
    id: string;
    serialisationSignatures?: Map<string, BeanSerialisationSignature>;
    serialisationPairs?: Map<string, string>;
    deserialisationPairs?: Map<string, string>;
}

export const RemoteStoreProvider: FunctionComponent<Props> = ({
    id,
    children,
    serialisationSignatures,
    serialisationPairs,
    deserialisationPairs,
}) => {
    const remoteStoreMap: Map<string, RemoteStore> = useContext(RemoteStoreContext);

    const { manager } = useWebSocket(id);

    const [store, setStore] = useState<RemoteStore | null>(null);

    useEffect(() => {
        const store = new RemoteStore(manager, serialisationSignatures, serialisationPairs, deserialisationPairs);

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

    return <RemoteStoreContext.Provider value={map}>{children}</RemoteStoreContext.Provider>;
};
