import React, { FunctionComponent, useRef } from "react";
import { WebSocketManager } from "./WebSocketManager";
import { WebSocketContext } from "./WebSocketContext";

type Props = {
    url: string,
    delimiter?: string,
    logging?: boolean,
}


export const WebSocketProvider: FunctionComponent<Props> = ({ url, delimiter, logging, children }) => {

    const managerRef = useRef<WebSocketManager>();

    if (!managerRef.current) {
        managerRef.current = new WebSocketManager(url, delimiter || "\t", logging || false);
    }


    return (
        <WebSocketContext.Provider value={managerRef.current as any}>
            {children}
        </WebSocketContext.Provider>
    )
}