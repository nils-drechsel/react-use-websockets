import { Dispatch, SetStateAction, MutableRefObject } from "react";
import { AbstractWebSocketBean, StoreParametersBean } from "./beans/Beans";
import { ConnectionStateRef } from "./connectStore";
export declare const useRemoteStoreRef: (path: string[], params?: StoreParametersBean | null | undefined, callback?: ((data: Map<string, AbstractWebSocketBean> | undefined) => void) | undefined, dependency?: any, connectionStateRef?: ConnectionStateRef | undefined, setConnectionState?: Dispatch<SetStateAction<import("./connectStore").ConnectionState>> | undefined) => MutableRefObject<Map<string, any>>;
export declare const useRemoteSingleStoreRef: (path: string[], params?: StoreParametersBean | null | undefined, updateDependent?: Dispatch<SetStateAction<AbstractWebSocketBean>> | undefined, dependency?: any, connectionStateRef?: ConnectionStateRef | undefined, setConnectionState?: Dispatch<SetStateAction<import("./connectStore").ConnectionState>> | undefined) => MutableRefObject<any>;
export declare const useRemoteStoreArrayRef: (path: string[], params?: StoreParametersBean | null | undefined, dependency?: any, connectionStateRef?: ConnectionStateRef | undefined, setConnectionState?: Dispatch<SetStateAction<import("./connectStore").ConnectionState>> | undefined) => MutableRefObject<any[]>;
export default useRemoteStoreRef;
