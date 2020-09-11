import { SetFunction } from "./beans/StoreBeanUtils";
export declare const useRemoteStore: (path: string[], callback?: ((data: Map<string, any>) => void) | undefined, dependency?: any) => Map<string, any> | undefined;
export declare const useRemoteSingleStore: (path: string[], updateDependent?: SetFunction<any> | undefined, dependency?: any) => any;
export declare const useRemoteStoreArray: (path: string[], dependency?: any) => any[] | undefined;
export default useRemoteStore;
