import { useEffect, useState } from "react";
import { useWebSocket } from "../client/useWebSocket";
import {
    EditRemoteStoreFunction,
    PartialEditRemoteStoreFunction,
    PostValidationCallback,
    ValidationCallback,
} from "./beans/StoreBeanUtils";
import {
    ValidationBean,
    StoreValidationBean,
    CoreMessage,
    AbstractWebSocketBean,
    WritableStoreParametersBean,
} from "./beans/Beans";
import { v4 as uuidv4 } from "uuid";
import { useGetRemoteStore } from "./useGetRemoteStore";

export const usePartialRemoteStoreUpdate = <
    BEAN_TYPE extends AbstractWebSocketBean,
    SERVER_VALIDATION_TYPE extends StoreValidationBean,
    CLIENT_VALIDATION_TYPE extends ValidationBean
>(
    id: string | null,
    path: Array<string>,
    params?: WritableStoreParametersBean | null,
    validationFunction?: ValidationCallback<BEAN_TYPE, CLIENT_VALIDATION_TYPE>,
    postServerValidationCallback?: PostValidationCallback<SERVER_VALIDATION_TYPE>,
    postClientValidationCallback?: PostValidationCallback<CLIENT_VALIDATION_TYPE>,
    onInitCallback?: () => void,
    beanType?: string
): [PartialEditRemoteStoreFunction<Partial<BEAN_TYPE>>, CLIENT_VALIDATION_TYPE | SERVER_VALIDATION_TYPE | null] => {
    return useRemoteStoreUpdate<BEAN_TYPE, SERVER_VALIDATION_TYPE, CLIENT_VALIDATION_TYPE>(
        id,
        path,
        params,
        validationFunction,
        postServerValidationCallback,
        postClientValidationCallback,
        onInitCallback,
        beanType,
        true
    ) as [PartialEditRemoteStoreFunction<Partial<BEAN_TYPE>>, CLIENT_VALIDATION_TYPE | SERVER_VALIDATION_TYPE | null];
};

export const useRemoteStoreUpdate = <
    BEAN_TYPE extends AbstractWebSocketBean,
    SERVER_VALIDATION_TYPE extends StoreValidationBean,
    CLIENT_VALIDATION_TYPE extends ValidationBean
>(
    id: string | null,
    path: Array<string>,
    params?: WritableStoreParametersBean | null,
    validationFunction?: ValidationCallback<BEAN_TYPE, CLIENT_VALIDATION_TYPE>,
    postServerValidationCallback?: PostValidationCallback<SERVER_VALIDATION_TYPE>,
    postClientValidationCallback?: PostValidationCallback<CLIENT_VALIDATION_TYPE>,
    onInitCallback?: () => void,
    beanType?: string,
    partial?: boolean
): [EditRemoteStoreFunction<BEAN_TYPE>, CLIENT_VALIDATION_TYPE | SERVER_VALIDATION_TYPE | null] => {
    const [componentId] = useState(uuidv4());
    const remoteStore = useGetRemoteStore(id);
    const { listen } = useWebSocket();

    const [validation, setValidation] = useState(null as CLIENT_VALIDATION_TYPE | SERVER_VALIDATION_TYPE | null);

    const pathId = path.join("/");

    const editRemoteBean = (payload: BEAN_TYPE): void => {
        if (validationFunction) {
            const validationBean = validationFunction(payload, partial);
            setValidation(validationBean);
            if (postClientValidationCallback) postClientValidationCallback(validationBean);
            if (!validationBean.success) return;
        }

        if (payload) {
            payload._t = beanType;
        }

        if (!params || !params.key) {
            remoteStore.editRemoteStore(CoreMessage.STORE_CREATE, path, params || null, payload, componentId);
        } else {
            remoteStore.editRemoteStore(CoreMessage.STORE_EDIT, path, params, payload, componentId);
        }
    };

    useEffect(() => {
        const deregisterValidationListener = listen(
            CoreMessage.VALIDATION,
            (payload: SERVER_VALIDATION_TYPE, _fromSid?: string | null) => {
                if (payload.originId !== componentId) return;
                setValidation(payload);
                if (postServerValidationCallback) postServerValidationCallback(payload);
            }
        );

        if (onInitCallback) onInitCallback();

        return () => {
            deregisterValidationListener();
        };
    }, [pathId]);

    return [editRemoteBean, validation];
};

export default useRemoteStoreUpdate;
