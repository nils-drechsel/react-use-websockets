import { useEffect, useState, useContext } from "react"
import RemoteStoreContext from "./RemoteStoreContext";
import { RemoteStore } from "./RemoteStore";
import { useWebSocket } from "../client/useWebSocket";
import { EditRemoteStoreFunction, PostValidationCallback, ValidationCallback } from "./beans/StoreBeanUtils";
import { ValidationBean, CoreMessage, AbstractWebSocketBean, StoreParametersBean } from "./beans/StoreBeans";
import { v4 as uuidv4 } from 'uuid';





export const useRemoteStoreUpdate = <BEAN_TYPE extends AbstractWebSocketBean, VALIDATION_TYPE extends ValidationBean>(path: Array<string>, params?: StoreParametersBean | null, validationFunction?: ValidationCallback<BEAN_TYPE, VALIDATION_TYPE>, postServerValidationCallback?: PostValidationCallback<VALIDATION_TYPE>, postClientValidationCallback?: PostValidationCallback<VALIDATION_TYPE>):
    [EditRemoteStoreFunction<BEAN_TYPE>, VALIDATION_TYPE | null] => {
    
    const [componentId] = useState(uuidv4());
    const remoteStore = useContext(RemoteStoreContext) as unknown as RemoteStore;
    const { listen, send } = useWebSocket();

    const [validation, setValidation] = useState(null as VALIDATION_TYPE | null);

    const pathId = path.join("/");

    const editRemoteBean = (payload: BEAN_TYPE) : void => {
        if (validationFunction) {
            const validationBean = validationFunction(payload);
            setValidation(validationBean);
            if (postClientValidationCallback) postClientValidationCallback(validationBean);
            if (!validationBean.success) return;
        }

        if (!params || !params.key) {
            remoteStore.editRemoteStore(CoreMessage.STORE_CREATE, path, params || null, payload, componentId);
        } else {
            remoteStore.editRemoteStore(CoreMessage.STORE_EDIT, path, params, payload, componentId);
        }

        
    }

    useEffect(() => {

            const deregisterValidationListener = listen(CoreMessage.VALIDATION, (payload: VALIDATION_TYPE, fromSid?: string | null) => {
                if (payload.originId !== componentId) return;
                setValidation(payload);
                if (postServerValidationCallback) postServerValidationCallback(payload);
            });

            return () => {
                deregisterValidationListener();
            }

    }, [pathId]);


    return [editRemoteBean, validation];

}

export default useRemoteStoreUpdate;








