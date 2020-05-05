import React, { FunctionComponent, useRef } from 'react';
import WebSocketManager from './WebSocketManager';
import WebSocketContext from "./WebSocketContext";

type Props = {
    url: string
    children: any
}


const WebSocketProvider: FunctionComponent<Props> = ({ url, children }) => {

    const managerRef = useRef(new WebSocketManager(url));

    return (
        <WebSocketContext.Provider value={managerRef.current}>
            {children}
        </WebSocketContext.Provider>
    )
}


export default WebSocketProvider;