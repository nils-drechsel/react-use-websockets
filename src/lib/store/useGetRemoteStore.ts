import { useContext } from "react";
import { RemoteStore } from "./RemoteStore";
import RemoteStoreContext from "./RemoteStoreContext";
import { AbstractIOBean } from "./beans/Beans";

export const useGetRemoteStore = <FRAGMENT extends AbstractIOBean>(id: string | null): RemoteStore<FRAGMENT> => {

    const remoteStoreMap: Map<string, RemoteStore<FRAGMENT>> = useContext(RemoteStoreContext);

    let store: RemoteStore<FRAGMENT> | undefined = undefined;
    if (id) {
        store = remoteStoreMap.get(id);
    } else {
        if (remoteStoreMap.size > 0) store = Array.from(remoteStoreMap.values())[0];
    }

    if (!store) throw Error("store is null, did you provide a <RemoteStoreProvider> element with the correct id (" + id + ") ?");    
    
    return store;
}
