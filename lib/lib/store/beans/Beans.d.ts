export declare enum PasswordStrengthCriterium {
    LOWERCASE = "LOWERCASE",
    UPPERCASE = "UPPERCASE",
    NUMBERS = "NUMBERS",
    SPECIAL_CHARACTERS = "SPECIAL_CHARACTERS"
}
export interface KeyParametersBean extends AbstractStoreParametersBean {
    getPathElements: () => Array<string>;
    _t?: string | null;
    key: string | null;
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
export interface StoreValidationMessageBean extends AbstractIOBean {
    validationBean: ValidationBean;
    _t?: string | null;
    action: StoreAction;
    transactionId: string;
}
export interface AnnotationContainingBean {
}
export declare enum StoreAction {
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    REMOVE = "REMOVE"
}
export declare enum MessageType {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO",
    SUCCESS = "SUCCESS"
}
export interface AbstractStoreBean extends AbstractIOBean {
    uid?: string;
    _t?: string | null;
    timestamp?: TimestampBean;
}
export interface StoreConnectedBean extends AbstractIOBean {
    _t?: string | null;
}
export interface AbstractStoreFragment extends AbstractIOBean {
    _t?: string | null;
}
export declare enum IOCoreEndpoints {
    CORE = "CORE",
    STORE = "STORE"
}
export declare enum ServerStoreMessage {
    UPDATE = "UPDATE"
}
export interface ConcretisedArrayBean extends AbstractIOBean {
    _t?: string | null;
}
export interface IOServerToClientStoreBean extends AbstractIOBean {
    secondaryId: string;
    _t?: string | null;
    payload: string;
    primaryId: string;
}
export interface IOClientToServerStoreBean extends AbstractIOBean {
    payloadJson?: string | null;
    _t?: string | null;
    secondaryPath: Array<string>;
    parametersJson: string;
    transactionId?: string | null;
    key?: string | null;
    primaryPath: Array<string>;
}
export interface ClientErrorBean extends AbstractIOBean {
    _t?: string | null;
    message: string;
    componentStack?: string | null;
}
export interface AbstractIOBean {
    _t?: string | null;
}
export interface CoreConfig extends AbstractIOBean {
    _t?: string | null;
    timezone: string;
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
    origin: string | null;
    message: string;
}
export interface ClientMessageBean {
}
export interface StoreConnectionErrorBean extends AbstractIOBean {
    _t?: string | null;
    accessDenied: boolean;
    errors: Array<string>;
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
    payload: Map<string, AbstractIOBean>;
}
export interface OwnerContainingBean {
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
export interface StoreFragment {
}
export interface IOPingPongBean extends AbstractIOBean {
    _t?: string | null;
}
export interface TimestampContainingBean {
}
export interface ClientToServerAuthenticationBean extends AbstractIOBean {
    _t?: string | null;
    token0: string | null;
    token1: string | null;
}
export interface FolderPseudoBean extends AbstractIOBean {
    _t?: string | null;
}
export interface IOServerToClientCoreBean extends AbstractIOBean {
    endpoint: string;
    _t?: string | null;
    payload: string;
    fromSid: string | null;
    origin: string | null;
    message: string;
}
export interface AbstractConfigBean extends AbstractIOBean {
    uid?: string;
    _t?: string | null;
    timestamp?: TimestampBean;
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
    items: Array<AbstractIOBean>;
}
export declare enum ServerToClientStoreMessage {
    CONNECTED = "CONNECTED",
    CONNECTION_ERROR = "CONNECTION_ERROR",
    UPDATE = "UPDATE",
    DISCONNECT_FORCEFULLY = "DISCONNECT_FORCEFULLY",
    VALIDATION = "VALIDATION"
}
export declare enum ServerIdents {
    MAIN = "MAIN"
}
export interface UidContainingBean {
}
export interface ValidationBean extends AbstractIOBean {
    _t?: string | null;
    success?: boolean;
}
export interface StoreValidationBean extends ValidationBean {
    _t?: string | null;
    success?: boolean;
    storeUid?: string;
}
