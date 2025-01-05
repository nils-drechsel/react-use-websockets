import { useGetRemoteStore } from "./useGetRemoteStore";

export const useTransaction = (id: string, fn: () => void) => {

    const remoteStore = useGetRemoteStore(id);

    remoteStore.startTransaction();
    try {

        fn();

    } catch (e) {

        remoteStore.cancelTransaction();
        console.error("transaction cancelled");
        return;

    }

    remoteStore.endTransaction();

}