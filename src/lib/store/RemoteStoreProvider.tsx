import React, { FunctionComponent, useRef, useContext, useEffect } from "react";
import { WebSocketManager } from "../client/WebSocketManager";
import { WebSocketContext } from "../client/WebSocketContext";
import { RemoteStore } from "./RemoteStore";
import RemoteStoreContext from "./RemoteStoreContext";

type Props = {
}


export const RemoteStoreProvider: FunctionComponent<Props> = ({ children }) => {

    const manager = useContext(WebSocketContext) as unknown as WebSocketManager;

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


    return (
        <RemoteStoreContext.Provider value={storeRef.current as any}>
            {children}
        </RemoteStoreContext.Provider>
    )
}