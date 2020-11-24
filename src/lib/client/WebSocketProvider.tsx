import React, { FunctionComponent, useEffect, useRef, useState, cloneElement, ReactElement } from "react";
import { WebSocketManager } from "./WebSocketManager";
import { WebSocketContext } from "./WebSocketContext";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { ClientErrorBean, CoreMessage } from "../store/beans/Beans";

interface Props {
    url: string;
    delimiter?: string;
    logging?: boolean;
    ElementWhileConnecting?: ReactElement<any, any>;
}


export const WebSocketProvider: FunctionComponent<Props> = ({ url, delimiter, logging, ElementWhileConnecting, children }) => {

    const managerRef = useRef<WebSocketManager>();

    if (!managerRef.current) {
        managerRef.current = new WebSocketManager(url, delimiter || "\t", logging || false);
    }

    // window.onerror = (message: string | Event, source: string | undefined, lineno: number | undefined, colno: number | undefined, error: Error | undefined) => {
    //     if (typeof(message) === "string" && message.startsWith("ResizeObserver")) return;
    //     const errorBean: ClientErrorBean = {
    //         message: "message: " + message + "\n"
    //             + "source: "+ source + "\n"
    //             + "lineno: "+ source + "\n"
    //             + "colno: "+ source + "\n"
    //             + "error name : "+ error?.name
    //             + "error message: " + error?.message,
    //         componentStack: error?.stack
    //     }
    //     managerRef.current!.send(CoreMessage.CLIENT_ERROR, errorBean);
    // }


    const onError = (error: any, info: any) => {
        const errorBean: ClientErrorBean = {
            message: "" + error,
            componentStack: info?.componentStack
        }
        managerRef.current!.send(CoreMessage.CLIENT_ERROR, errorBean);
    };

    const errorFallback = ({}: FallbackProps) => {
        return <div>An error has occurred and was registered</div>;
    };    

    const [isSocketConnected, setSocketConnected] = useState(false);
    
    useEffect(() => {
        const unsubscribe = managerRef.current!.addConnectivityListener((isConnected, isReady, sid) => {
            setSocketConnected(isReady);
        });

        return () => {
            unsubscribe();
        }

    }, []);

    if (!isSocketConnected && ElementWhileConnecting) {
        return (<div>{cloneElement(ElementWhileConnecting)}</div>);
    }

    return (
        <WebSocketContext.Provider value= { managerRef.current as any } >
            <ErrorBoundary onError={onError} fallbackRender={errorFallback}>
                { children }
            </ErrorBoundary>
        </WebSocketContext.Provider>
    )
}