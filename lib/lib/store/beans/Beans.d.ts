export interface AssignedKeyContainingBean {
}
export interface StoreEditFragment extends StoreBean {
    timestamp?: TimestampBean;
}
export interface ClientErrorBean extends AbstractWebSocketBean {
    message: string;
    componentStack?: string | null;
}
export interface NullBean extends AbstractWebSocketBean {
}
export interface TimestampBean extends AbstractWebSocketBean {
    touched: number;
    created: number;
    modified: number;
}
export interface ServerMessageBean extends AbstractWebSocketBean {
    originId?: string | null;
    bean?: string;
}
export interface DataBaseBean extends StoreBean {
    timestamp?: TimestampBean;
}
export interface WritableStoreParametersBean extends AbstractStoreParametersBean {
    key: string | null;
}
export interface ClientMessageBean {
}
export interface DisconnectPayload extends AbstractConnectionBean {
    path: Array<string>;
    params?: ReadableStoreParametersBean | null;
}
export declare enum Comparator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    GREATER = "GREATER",
    GREATER_OR_EQUAL = "GREATER_OR_EQUAL",
    SMALLER = "SMALLER",
    SMALLER_OR_EQUAL = "SMALLER_OR_EQUAL"
}
export interface NoParametersBean extends ReadableStoreParametersBean {
}
export interface AbstractStoreParametersBean extends AbstractWebSocketBean {
}
export interface StoreBean extends AbstractWebSocketBean {
    timestamp?: TimestampBean;
}
export interface ClientOriginatedBean extends AbstractWebSocketBean {
    originId?: string;
}
export interface ReadableStoreParametersBean extends AbstractStoreParametersBean {
}
export interface StoreUpdateBean extends AbstractWebSocketBean {
    initial?: boolean | null;
    payload: {
        [key: string]: AbstractWebSocketBean;
    };
    id: string;
}
export interface AbstractConnectionBean extends AbstractWebSocketBean {
    path: Array<string>;
    params?: ReadableStoreParametersBean | null;
}
export interface AbstractWebSocketBean extends Object {
}
export interface OwnerContainingBean {
}
export interface AnnotationContainingBean {
}
export interface StoreEditBean extends AbstractWebSocketBean {
    path: Array<string>;
    originId: string;
    payload: StoreBean;
    params?: WritableStoreParametersBean | null;
}
export declare enum MessageType {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO",
    SUCCESS = "SUCCESS"
}
export interface MessageBean extends AbstractWebSocketBean {
    type: MessageType;
    message: string;
}
export interface ServerToClientAuthenticationBean extends AbstractWebSocketBean {
    uid: string;
    token0: string;
    token1: string;
    validity: number;
    sid: string;
}
export interface ConnectPayload extends AbstractConnectionBean {
    path: Array<string>;
    params?: ReadableStoreParametersBean | null;
}
export interface StoreReconnectBean extends AbstractWebSocketBean {
    ids: Array<string>;
}
export interface ClientToServerAuthenticationBean extends AbstractWebSocketBean {
    token0: string | null;
    token1: string | null;
}
export interface StoreForcefulDisconnectBean extends AbstractWebSocketBean {
    ids: Array<string>;
}
export declare enum CoreMessage {
    AUTHENTICATE = "AUTHENTICATE",
    STORE_CONNECT = "STORE_CONNECT",
    STORE_RECONNECT = "STORE_RECONNECT",
    STORE_DISCONNECT = "STORE_DISCONNECT",
    STORE_UPDATE = "STORE_UPDATE",
    VALIDATION = "VALIDATION",
    STORE_EDIT = "STORE_EDIT",
    STORE_CREATE = "STORE_CREATE",
    MESSAGE = "MESSAGE",
    CLIENT_ERROR = "CLIENT_ERROR"
}
export interface ReadableKeyStoreParametersBean extends ReadableStoreParametersBean {
    key: string | null;
}
export interface UidContainingBean {
}
export interface ValidationBean extends ServerMessageBean {
    originId?: string | null;
    success?: boolean;
    bean?: string;
}
export interface StoreValidationBean extends ValidationBean {
    originId?: string | null;
    success?: boolean;
    storeUid?: string;
    bean?: string;
}
