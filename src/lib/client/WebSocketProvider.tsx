import React, { FunctionComponent, useRef } from "react";
import { WebSocketManager } from "./WebSocketManager";
import { WebSocketContext } from "./WebSocketContext";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { ClientErrorBean, CoreMessage } from "../store/beans/Beans";

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


    const onError = (error: any, info: any) => {
        const errorBean: ClientErrorBean = {
            message: "" + error,
            componentStack: info?.componentStack
        }
        managerRef.current!.send(CoreMessage.CLIENT_ERROR, errorBean);
    };

    const errorFallback = ({}: FallbackProps) => {
        return <div>An error has occurred and was submitted to the helpdesk</div>;
    };    

    return (
        <WebSocketContext.Provider value= { managerRef.current as any } >
            <ErrorBoundary onError={onError} fallbackRender={errorFallback}>
                { children }
            </ErrorBoundary>
        </WebSocketContext.Provider>
    )
}