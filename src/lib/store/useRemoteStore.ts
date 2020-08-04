import { useEffect, useState, useContext } from "react"
import RemoteStoreContext from "./RemoteStoreContext";
import { RemoteStore } from "./RemoteStore";
import { useWebSocket } from "../client/useWebSocket";


export const useRemoteStore = (path: Array<string>): any => {

    const remoteStore = useContext(RemoteStoreContext) as unknown as RemoteStore;
    const { listen, send } = useWebSocket();

    const [data, setData] = useState(null);


    useEffect(() => {

        const deregister = remoteStore.register(path, setData);

        return () => {
            deregister();
        }

    }, [])


    return data;

}

export default useRemoteStore;