import { useEffect, useState, useContext } from "react"
import RemoteStoreContext from "./RemoteStoreContext";
import { RemoteStore } from "./RemoteStore";
import { useWebSocket } from "../client/useWebSocket";
import { EditRemoteStoreFunction, PostValidationCallback, ValidationCallback } from "./beans/StoreBeanUtils";
import { ValidationBean, CoreMessage, AbstractWebSocketBean } from "./beans/StoreBeans";
import { v4 as uuidv4 } from 'uuid';





export const useRemoteStoreUpdate = <BEAN_TYPE extends AbstractWebSocketBean, VALIDATION_TYPE extends ValidationBean>(path: Array<string>, params: Array<string>, validationFunction?: ValidationCallback<BEAN_TYPE, VALIDATION_TYPE>, postValidationCallback?: PostValidationCallback<VALIDATION_TYPE>):
    [EditRemoteStoreFunction<BEAN_TYPE>, VALIDATION_TYPE | null] => {
    
    if (params.length === 0) throw new Error("params must contain at least one item (the key)");

    const [componentId] = useState(uuidv4());
    const remoteStore = useContext(RemoteStoreContext) as unknown as RemoteStore;
    const { listen, send } = useWebSocket();

    const [validation, setValidation] = useState(null as VALIDATION_TYPE | null);

    const pathId = path.join("/");

    const editRemoteStore = (payload: BEAN_TYPE) => {
        if (validationFunction) {
            const validationBean = validationFunction(payload);
            setValidation(validationBean);
            if (!validationBean.success) return;
        }

        remoteStore.editRemoteStore(path, params, payload, componentId);
    }

    useEffect(() => {

            const deregisterValidationListener = listen(CoreMessage.VALIDATION, (payload: VALIDATION_TYPE, fromSid?: string | null) => {
                if (payload.originId !== componentId) return;
                setValidation(payload);
                if (postValidationCallback) postValidationCallback(payload);
            });

            return () => {
                deregisterValidationListener();
            }

    }, [pathId]);


    return [editRemoteStore, validation];

}

export default useRemoteStoreUpdate;








