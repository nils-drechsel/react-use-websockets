import React, { FunctionComponent, useRef, useContext, useEffect } from "react";
import { RemoteStore } from "./RemoteStore";
import RemoteStoreContext from "./RemoteStoreContext";
import { useWebSocket } from "../client/useWebSocket";

type Props = {
    id: string
}


export const RemoteStoreProvider: FunctionComponent<Props> = ({ id, children }) => {

    const remoteStoreMap: Map<string, RemoteStore> = useContext(RemoteStoreContext);

    const { manager } = useWebSocket(id);

    const storeRef = useRef<RemoteStore>();

    if (!storeRef.current && manager) {
        storeRef.current = new RemoteStore(manager);
    }

    useEffect(() => {

        return () => {
            if (storeRef.current) {
                storeRef.current.releaseRemoteStore();
                storeRef.current = undefined;
            }
        }

    }, []);


    const map = new Map();
    if (remoteStoreMap) {
        remoteStoreMap.forEach((value, key) => map.set(key, value));
    }
    map.set(id, storeRef.current);


    return (
        <RemoteStoreContext.Provider value={map}>
            {children}
        </RemoteStoreContext.Provider>
    )
}