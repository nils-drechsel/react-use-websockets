import { useContext } from "react";
import { AbstractStoreBean } from "../beans/Beans";
import { RemoteStore } from "./RemoteStore";
import RemoteStoreContext from "./RemoteStoreContext";

export const useGetRemoteStore = <BEAN extends AbstractStoreBean>(id: string | null): RemoteStore<BEAN> => {

    const remoteStoreMap: Map<string, RemoteStore<BEAN>> = useContext(RemoteStoreContext);

    let store: RemoteStore<BEAN> | undefined = undefined;
    if (id) {
        store = remoteStoreMap.get(id);
    } else {
        if (remoteStoreMap.size > 0) store = Array.from(remoteStoreMap.values())[0];
    }

    if (!store) throw Error("store is null, did you provide a <RemoteStoreProvider> element with the correct id (" + id + ") ?");    
    
    return store;
}
