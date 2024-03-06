import { RemoteStore } from "./RemoteStore";
import { AbstractIOBean } from "./beans/Beans";
export declare const useGetRemoteStore: <FRAGMENT extends AbstractIOBean>(id: string | null) => RemoteStore<FRAGMENT>;
