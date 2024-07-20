import { AbstractStoreBean } from "../beans/Beans";
import { RemoteStore } from "./RemoteStore";
export declare const useGetRemoteStore: <BEAN extends AbstractStoreBean>(id: string | null) => RemoteStore<BEAN>;
