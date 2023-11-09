export declare enum PasswordStrengthCriterium {
    LOWERCASE = "LOWERCASE",
    UPPERCASE = "UPPERCASE",
    NUMBERS = "NUMBERS",
    SPECIAL_CHARACTERS = "SPECIAL_CHARACTERS"
}
export interface ClientErrorBean extends AbstractIOBean {
    _t?: string | null;
    message: string;
    componentStack?: string | null;
}
export interface AssignedKeyContainingBean {
}
export interface AbstractIOBean extends Object {
    _t?: string | null;
}
export interface KeyParametersBean extends AbstractStoreParametersBean {
    getPathElements: () => Array<string>;
    _t?: string | null;
    key: string | null;
}
export interface NullBean extends AbstractIOBean {
    _t?: string | null;
}
export interface TimestampBean extends AbstractIOBean {
    touched: number;
    _t?: string | null;
    created: number;
    modified: number;
}
export interface ServerMessageBean extends AbstractIOBean {
    originId?: string | null;
    _t?: string | null;
    bean?: string;
}
export interface TemplateMasterBean extends AbstractIOBean {
    _t?: string | null;
}
export interface DataBaseBean extends AbstractStoreBean {
    uid?: string;
    _t?: string | null;
    timestamp?: TimestampBean;
}
export interface IOClientToServerCoreBean extends AbstractIOBean {
    endpoint: string;
    _t?: string | null;
    toSid: string | null;
    payload: string;
    message: string;
}
export interface ClientMessageBean {
}
export declare enum Comparator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    GREATER = "GREATER",
    GREATER_OR_EQUAL = "GREATER_OR_EQUAL",
    SMALLER = "SMALLER",
    SMALLER_OR_EQUAL = "SMALLER_OR_EQUAL"
}
export interface NoParametersBean extends AbstractStoreParametersBean {
    getPathElements: () => Array<string>;
    _t?: string | null;
}
export interface AbstractStoreParametersBean extends AbstractIOBean {
    getPathElements?: () => Array<string>;
    _t?: string | null;
}
export interface StoreBean {
}
export interface ClientOriginatedBean extends AbstractIOBean {
    originId?: string;
    _t?: string | null;
}
export declare enum ClientToServerStoreMessage {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    INSERT = "INSERT",
    REMOVE = "REMOVE",
    UPDATE = "UPDATE"
}
export interface StoreUpdateBean extends AbstractIOBean {
    _t?: string | null;
    initial?: boolean | null;
    payload: {
        [key: string]: AbstractIOBean;
    };
}
export interface AnnotationContainingBean {
}
export interface OwnerContainingBean {
}
export declare enum MessageType {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO",
    SUCCESS = "SUCCESS"
}
export interface ServerToClientAuthenticationBean extends AbstractIOBean {
    uid: string;
    _t?: string | null;
    token0: string;
    token1: string;
    validity: number;
    sid: string;
}
export interface MessageBean extends AbstractIOBean {
    _t?: string | null;
    type: MessageType;
    message: string;
}
export interface AbstractStoreBean extends AbstractIOBean {
    uid?: string;
    _t?: string | null;
    timestamp?: TimestampBean;
}
export interface StoreFragment {
}
export interface IOPingPongBean extends AbstractIOBean {
    _t?: string | null;
}
export interface ClientToServerAuthenticationBean extends AbstractIOBean {
    _t?: string | null;
    token0: string | null;
    token1: string | null;
}
export interface AbstractStoreFragment extends AbstractIOBean {
    _t?: string | null;
}
export interface TimestampContainingBean {
}
export interface IOServerToClientCoreBean extends AbstractIOBean {
    endpoint: string;
    _t?: string | null;
    payload: string;
    fromSid: string;
    message: string;
}
export declare enum ServerStoreMessage {
    UPDATE = "UPDATE"
}
export declare enum CoreMessage {
    PING = "PING",
    PONG = "PONG",
    AUTHENTICATE = "AUTHENTICATE",
    VALIDATION = "VALIDATION",
    MESSAGE = "MESSAGE",
    CLIENT_ERROR = "CLIENT_ERROR"
}
export interface ArrayBean extends AbstractIOBean {
    _t?: string | null;
    beans: Array<AbstractIOBean>;
}
export declare enum ServerToClientStoreMessage {
    UPDATE = "UPDATE",
    DISCONNECT_FORCEFULLY = "DISCONNECT_FORCEFULLY"
}
export interface UidContainingBean {
}
export interface IOClientToServerStoreBean extends AbstractIOBean {
    payloadJson?: string | null;
    _t?: string | null;
    secondaryPath: Array<string>;
    parametersJson: string;
    origin?: string | null;
    key?: string | null;
    primaryPath: Array<string>;
}
export interface IOServerToClientStoreBean extends AbstractIOBean {
    secondaryId: string;
    _t?: string | null;
    payload: string;
    primaryId: string;
}
export interface ValidationBean extends ServerMessageBean {
    originId?: string | null;
    _t?: string | null;
    success?: boolean;
    bean?: string;
}
export interface StoreValidationBean extends ValidationBean {
    originId?: string | null;
    _t?: string | null;
    success?: boolean;
    storeUid?: string;
    bean?: string;
}
