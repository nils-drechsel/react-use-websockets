import { useEffect, useState, useContext } from "react"
import RemoteStoreContext from "./RemoteStoreContext";
import { RemoteStore } from "./RemoteStore";
import { useWebSocket } from "../client/useWebSocket";
import { EditRemoteStoreFunction, PostValidationCallback, ValidationCallback } from "./beans/StoreBeanUtils";
import { ValidationBean, StoreValidationBean, CoreMessage, AbstractWebSocketBean, StoreParametersBean } from "./beans/Beans";
import { v4 as uuidv4 } from 'uuid';





export const useRemoteStoreUpdate = <BEAN_TYPE extends AbstractWebSocketBean, SERVER_VALIDATION_TYPE extends StoreValidationBean, CLIENT_VALIDATION_TYPE extends ValidationBean>(path: Array<string>, params?: StoreParametersBean | null, validationFunction?: ValidationCallback<BEAN_TYPE, CLIENT_VALIDATION_TYPE>, postServerValidationCallback?: PostValidationCallback<SERVER_VALIDATION_TYPE>, postClientValidationCallback?: PostValidationCallback<CLIENT_VALIDATION_TYPE>, onInitCallback?: () => void):
    [EditRemoteStoreFunction<BEAN_TYPE>, CLIENT_VALIDATION_TYPE | SERVER_VALIDATION_TYPE | null] => {
    
    const [componentId] = useState(uuidv4());
    const remoteStore = useContext(RemoteStoreContext) as unknown as RemoteStore;
    const { listen } = useWebSocket();

    const [validation, setValidation] = useState(null as CLIENT_VALIDATION_TYPE | SERVER_VALIDATION_TYPE | null);

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

        const deregisterValidationListener = listen(CoreMessage.VALIDATION, (payload: SERVER_VALIDATION_TYPE, _fromSid?: string | null) => {
            if (payload.originId !== componentId) return;
            setValidation(payload);
            if (postServerValidationCallback) postServerValidationCallback(payload);
        });
        
        if (onInitCallback) onInitCallback();

            return () => {
                deregisterValidationListener();
        }

    }, [pathId]);


    return [editRemoteBean, validation];

}

export default useRemoteStoreUpdate;








