import { useContext } from "react";
import { RemoteStore } from "./RemoteStore";
import RemoteStoreContext from "./RemoteStoreContext";

export const useGetRemoteStore = (id: string | null): RemoteStore => {

    const remoteStoreMap: Map<string, RemoteStore> = useContext(RemoteStoreContext);

    let store: RemoteStore | undefined = undefined;
    if (id) {
        store = remoteStoreMap.get(id);
    } else {
        if (remoteStoreMap.size > 0) store = Array.from(remoteStoreMap.values())[0];
    }

    if (!store) throw Error("store is null, did you provide a <RemoteStoreProvider> element with the correct id (" + id + ") ?");    
    
    return store;
}
