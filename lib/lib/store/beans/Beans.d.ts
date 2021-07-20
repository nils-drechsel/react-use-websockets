export declare enum PasswordStrengthCriterium {
    LOWERCASE = "LOWERCASE",
    UPPERCASE = "UPPERCASE",
    NUMBERS = "NUMBERS",
    SPECIAL_CHARACTERS = "SPECIAL_CHARACTERS"
}
export interface ClientErrorBean extends AbstractWebSocketBean {
    _t?: string;
    message: string;
    componentStack?: string | null;
}
export interface AssignedKeyContainingBean {
}
export interface StoreEditFragment extends StoreBean {
    _t?: string;
    timestamp?: TimestampBean;
}
export interface NullBean extends AbstractWebSocketBean {
    _t?: string;
}
export interface ServerMessageBean extends AbstractWebSocketBean {
    originId?: string | null;
    _t?: string;
    bean?: string;
}
export interface TimestampBean extends AbstractWebSocketBean {
    touched: number;
    _t?: string;
    created: number;
    modified: number;
}
export interface DataBaseBean extends StoreBean {
    _t?: string;
    timestamp?: TimestampBean;
}
export interface WritableStoreParametersBean extends AbstractStoreParametersBean {
    _t?: string;
    key: string | null;
}
export interface ClientMessageBean {
}
export interface DisconnectPayload extends AbstractConnectionBean {
    path: Array<string>;
    _t?: string;
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
    _t?: string;
}
export interface AbstractStoreParametersBean extends AbstractWebSocketBean {
    _t?: string;
}
export interface ClientOriginatedBean extends AbstractWebSocketBean {
    originId?: string;
    _t?: string;
}
export interface StoreBean extends AbstractWebSocketBean {
    _t?: string;
    timestamp?: TimestampBean;
}
export interface ReadableStoreParametersBean extends AbstractStoreParametersBean {
    _t?: string;
}
export interface StoreUpdateBean extends AbstractWebSocketBean {
    _t?: string;
    initial?: boolean | null;
    payload: {
        [key: string]: AbstractWebSocketBean;
    };
    id: string;
}
export interface AbstractConnectionBean extends AbstractWebSocketBean {
    path: Array<string>;
    _t?: string;
    params?: ReadableStoreParametersBean | null;
}
export interface AbstractWebSocketBean extends Object {
    _t?: string;
}
export interface AnnotationContainingBean {
}
export interface OwnerContainingBean {
}
export interface StoreEditBean extends AbstractWebSocketBean {
    path: Array<string>;
    originId: string;
    _t?: string;
    payload: StoreBean;
    params?: WritableStoreParametersBean | null;
}
export declare enum MessageType {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO",
    SUCCESS = "SUCCESS"
}
export interface ServerToClientAuthenticationBean extends AbstractWebSocketBean {
    uid: string;
    _t?: string;
    token0: string;
    token1: string;
    validity: number;
    sid: string;
}
export interface MessageBean extends AbstractWebSocketBean {
    _t?: string;
    type: MessageType;
    message: string;
}
export interface ConnectPayload extends AbstractConnectionBean {
    path: Array<string>;
    _t?: string;
    params?: ReadableStoreParametersBean | null;
}
export interface StoreReconnectBean extends AbstractWebSocketBean {
    _t?: string;
    ids: Array<string>;
}
export interface ClientToServerAuthenticationBean extends AbstractWebSocketBean {
    _t?: string;
    token0: string | null;
    token1: string | null;
}
export interface StoreForcefulDisconnectBean extends AbstractWebSocketBean {
    _t?: string;
    ids: Array<string>;
}
export declare enum CoreMessage {
    PING = "PING",
    PONG = "PONG",
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
    _t?: string;
    key: string | null;
}
export interface UidContainingBean {
}
export interface ValidationBean extends ServerMessageBean {
    originId?: string | null;
    _t?: string;
    success?: boolean;
    bean?: string;
}
export interface StoreValidationBean extends ValidationBean {
    originId?: string | null;
    _t?: string;
    success?: boolean;
    storeUid?: string;
    bean?: string;
}
