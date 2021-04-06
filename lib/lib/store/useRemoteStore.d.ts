import { Dispatch, SetStateAction } from "react";
import { AbstractWebSocketBean, ReadableStoreParametersBean } from "./beans/Beans";
export declare const useRemoteStore: (id: string | null, path: Array<string>, params?: ReadableStoreParametersBean | null | undefined, callback?: ((data: Map<string, AbstractWebSocketBean> | undefined) => void) | undefined, dependency?: any) => Map<string, any>;
export declare const useRemoteSingleStore: (id: string | null, path: Array<string>, params?: ReadableStoreParametersBean | null | undefined, updateDependent?: Dispatch<SetStateAction<AbstractWebSocketBean>> | undefined, dependency?: any) => any;
export declare const useRemoteStoreArray: (id: string | null, path: Array<string>, params?: ReadableStoreParametersBean | null | undefined, dependency?: any) => Array<any>;
export default useRemoteStore;
