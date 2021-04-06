import { Dispatch, SetStateAction, MutableRefObject } from "react";
import { AbstractWebSocketBean, ReadableStoreParametersBean } from "./beans/Beans";
import { ConnectionStateRef, ConnectionStateSetter } from "./connectStore";
export declare const useRemoteStoreRef: (id: string | null, path: Array<string>, params?: ReadableStoreParametersBean | null | undefined, callback?: ((data: Map<string, AbstractWebSocketBean> | undefined) => void) | undefined, dependency?: any, connectionStateRef?: ConnectionStateRef | undefined, setConnectionState?: ConnectionStateSetter | undefined) => MutableRefObject<Map<string, any>>;
export declare const useRemoteSingleStoreRef: (id: string | null, path: Array<string>, params?: ReadableStoreParametersBean | null | undefined, updateDependent?: Dispatch<SetStateAction<AbstractWebSocketBean>> | undefined, dependency?: any, connectionStateRef?: ConnectionStateRef | undefined, setConnectionState?: ConnectionStateSetter | undefined) => MutableRefObject<any>;
export declare const useRemoteStoreArrayRef: (id: string | null, path: Array<string>, params?: ReadableStoreParametersBean | null | undefined, dependency?: any, connectionStateRef?: ConnectionStateRef | undefined, setConnectionState?: ConnectionStateSetter | undefined) => MutableRefObject<Array<any>>;
export default useRemoteStoreRef;
