import React, { FunctionComponent, useRef } from "react";
import { WebSocketManager } from "./WebSocketManager";
import { WebSocketContext } from "./WebSocketContext";

type Props = {
    url: string,
}


export const WebSocketProvider: FunctionComponent<Props> = ({ url, children }) => {

    const managerRef = useRef<WebSocketManager>();

    if (!managerRef.current) {
        managerRef.current = new WebSocketManager(url);
    }


    return (
        <WebSocketContext.Provider value={managerRef.current as any}>
            {children}
        </WebSocketContext.Provider>
    )
}