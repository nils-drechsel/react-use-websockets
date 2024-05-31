// This file is auto-generated. Do not modify

export enum PasswordStrengthCriterium {
    LOWERCASE = "LOWERCASE",
    UPPERCASE = "UPPERCASE",
    NUMBERS = "NUMBERS",
    SPECIAL_CHARACTERS = "SPECIAL_CHARACTERS",
}

export interface KeyParametersBean extends AbstractStoreParametersBean {
    getPathElements: () => Array<string>,
    _t: string,
    key: string | null,
}

export const createKeyParametersBean = (content?: Omit<KeyParametersBean, "_t">) => (Object.assign({_t: "KeyParametersBean"}, content));

export interface Fragment extends AbstractIOBean {
    path: Array<string>,
    _t: string,
    jsonPayload?: string | null,
    type: FragmentType,
}

export const createFragment = (content?: Omit<Fragment, "_t">) => (Object.assign({_t: "Fragment"}, content));

export enum Comparator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    GREATER = "GREATER",
    GREATER_OR_EQUAL = "GREATER_OR_EQUAL",
    SMALLER = "SMALLER",
    SMALLER_OR_EQUAL = "SMALLER_OR_EQUAL",
}

export interface NoParametersBean extends AbstractStoreParametersBean {
    getPathElements: () => Array<string>,
    _t: string,
}

export const createNoParametersBean = (content?: Omit<NoParametersBean, "_t">) => (Object.assign({_t: "NoParametersBean"}, content));

export interface AbstractStoreParametersBean extends AbstractIOBean {
    getPathElements?: () => Array<string>,
    _t?: string,
}

export interface StoreValidationMessageBean extends AbstractIOBean {
    validationBean: ValidationBean,
    _t: string,
    action: StoreAction,
    transactionId: string,
}

export const createStoreValidationMessageBean = (content?: Omit<StoreValidationMessageBean, "_t">) => (Object.assign({_t: "StoreValidationMessageBean"}, content));

export interface FragmentList extends AbstractIOBean {
    _t: string,
    fragments: Array<Fragment>,
}

export const createFragmentList = (content?: Omit<FragmentList, "_t">) => (Object.assign({_t: "FragmentList"}, content));

export interface AnnotationContainingBean {
}

export enum StoreAction {
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    REMOVE = "REMOVE",
}

export enum MessageType {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO",
    SUCCESS = "SUCCESS",
}

export interface AbstractStoreBean extends AbstractIOBean {
    uid?: string,
    _t?: string,
    createdTimestamp?: number,
    modifiedTimestamp?: number,
    touchedTimestamp?: number,
}

export interface StoreConnectedBean extends AbstractIOBean {
    _t: string,
}

export const createStoreConnectedBean = (content?: Omit<StoreConnectedBean, "_t">) => (Object.assign({_t: "StoreConnectedBean"}, content));

export interface AbstractStoreFragment extends AbstractIOBean {
    _t?: string,
}

export enum IOCoreEndpoints {
    CORE = "CORE",
    STORE = "STORE",
}

export enum ServerStoreMessage {
    UPDATE = "UPDATE",
}

export interface ConcretisedArrayBean extends AbstractIOBean {
    _t: string,
}

export const createConcretisedArrayBean = (content?: Omit<ConcretisedArrayBean, "_t">) => (Object.assign({_t: "ConcretisedArrayBean"}, content));

export interface IOServerToClientStoreBean extends AbstractIOBean {
    secondaryId: string,
    _t: string,
    payload: string,
    primaryId: string,
}

export const createIOServerToClientStoreBean = (content?: Omit<IOServerToClientStoreBean, "_t">) => (Object.assign({_t: "IOServerToClientStoreBean"}, content));

export interface IOClientToServerStoreBean extends AbstractIOBean {
    payloadJson?: string | null,
    _t: string,
    secondaryPath: Array<string>,
    parametersJson: string,
    transactionId?: string | null,
    key?: string | null,
    primaryPath: Array<string>,
}

export const createIOClientToServerStoreBean = (content?: Omit<IOClientToServerStoreBean, "_t">) => (Object.assign({_t: "IOClientToServerStoreBean"}, content));

export interface ClientErrorBean extends AbstractIOBean {
    _t: string,
    message: string,
    componentStack?: string | null,
}

export const createClientErrorBean = (content?: Omit<ClientErrorBean, "_t">) => (Object.assign({_t: "ClientErrorBean"}, content));

export interface AbstractIOBean {
    _t?: string,
}

export interface CoreConfig extends AbstractIOBean {
    _t: string,
    timezone: string,
}

export const createCoreConfig = (content?: Omit<CoreConfig, "_t">) => (Object.assign({_t: "CoreConfig"}, content));

export interface NullBean extends AbstractIOBean {
    _t: string,
}

export const createNullBean = (content?: Omit<NullBean, "_t">) => (Object.assign({_t: "NullBean"}, content));

export interface TimestampBean extends AbstractIOBean {
    touched: number,
    _t: string,
    created: number,
    modified: number,
}

export const createTimestampBean = (content?: Omit<TimestampBean, "_t">) => (Object.assign({_t: "TimestampBean"}, content));

export interface TemplateMasterBean extends AbstractIOBean {
    _t: string,
}

export const createTemplateMasterBean = (content?: Omit<TemplateMasterBean, "_t">) => (Object.assign({_t: "TemplateMasterBean"}, content));

export interface DataBaseBean extends AbstractStoreBean {
    uid?: string,
    _t?: string,
    createdTimestamp?: number,
    modifiedTimestamp?: number,
    touchedTimestamp?: number,
}

export interface IOClientToServerCoreBean extends AbstractIOBean {
    endpoint: string,
    _t: string,
    toSid: string | null,
    payload: string,
    origin: string | null,
    message: string,
}

export const createIOClientToServerCoreBean = (content?: Omit<IOClientToServerCoreBean, "_t">) => (Object.assign({_t: "IOClientToServerCoreBean"}, content));

export interface ClientMessageBean {
}

export interface StoreConnectionErrorBean extends AbstractIOBean {
    _t: string,
    accessDenied: boolean,
    errors: Array<string>,
}

export const createStoreConnectionErrorBean = (content?: Omit<StoreConnectionErrorBean, "_t">) => (Object.assign({_t: "StoreConnectionErrorBean"}, content));

export interface StoreBean {
}

export interface ClientOriginatedBean extends AbstractIOBean {
    originId?: string,
    _t?: string,
}

export enum ClientToServerStoreMessage {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    INSERT = "INSERT",
    REMOVE = "REMOVE",
    UPDATE = "UPDATE",
}

export interface StoreUpdateBean extends AbstractIOBean {
    _t: string,
    initial?: boolean | null,
    payload: Map<string,AbstractIOBean>,
}

export const createStoreUpdateBean = (content?: Omit<StoreUpdateBean, "_t">) => (Object.assign({_t: "StoreUpdateBean"}, content));

export interface OwnerContainingBean {
}

export interface ServerToClientAuthenticationBean extends AbstractIOBean {
    uid: string,
    _t: string,
    token0: string,
    token1: string,
    validity: number,
    sid: string,
}

export const createServerToClientAuthenticationBean = (content?: Omit<ServerToClientAuthenticationBean, "_t">) => (Object.assign({_t: "ServerToClientAuthenticationBean"}, content));

export interface MessageBean extends AbstractIOBean {
    _t: string,
    type: MessageType,
    message: string,
}

export const createMessageBean = (content?: Omit<MessageBean, "_t">) => (Object.assign({_t: "MessageBean"}, content));

export interface StoreFragment {
}

export interface IOPingPongBean extends AbstractIOBean {
    _t: string,
}

export const createIOPingPongBean = (content?: Omit<IOPingPongBean, "_t">) => (Object.assign({_t: "IOPingPongBean"}, content));

export interface TimestampContainingBean {
}

export interface ClientToServerAuthenticationBean extends AbstractIOBean {
    _t: string,
    token0: string | null,
    token1: string | null,
}

export const createClientToServerAuthenticationBean = (content?: Omit<ClientToServerAuthenticationBean, "_t">) => (Object.assign({_t: "ClientToServerAuthenticationBean"}, content));

export interface FolderPseudoBean extends AbstractIOBean {
    _t: string,
}

export const createFolderPseudoBean = (content?: Omit<FolderPseudoBean, "_t">) => (Object.assign({_t: "FolderPseudoBean"}, content));

export interface IOServerToClientCoreBean extends AbstractIOBean {
    endpoint: string,
    _t: string,
    payload: string,
    fromSid: string | null,
    origin: string | null,
    message: string,
}

export const createIOServerToClientCoreBean = (content?: Omit<IOServerToClientCoreBean, "_t">) => (Object.assign({_t: "IOServerToClientCoreBean"}, content));

export interface AbstractConfigBean extends AbstractIOBean {
    uid?: string,
    _t?: string,
    timestamp?: TimestampBean,
}

export enum CoreMessage {
    PING = "PING",
    PONG = "PONG",
    AUTHENTICATE = "AUTHENTICATE",
    VALIDATION = "VALIDATION",
    MESSAGE = "MESSAGE",
    CLIENT_ERROR = "CLIENT_ERROR",
}

export interface ArrayBean extends AbstractIOBean {
    _t: string,
    items: Array<AbstractIOBean>,
}

export const createArrayBean = (content?: Omit<ArrayBean, "_t">) => (Object.assign({_t: "ArrayBean"}, content));

export enum ServerToClientStoreMessage {
    CONNECTED = "CONNECTED",
    CONNECTION_ERROR = "CONNECTION_ERROR",
    UPDATE = "UPDATE",
    DISCONNECT_FORCEFULLY = "DISCONNECT_FORCEFULLY",
    VALIDATION = "VALIDATION",
}

export enum ServerIdents {
    MAIN = "MAIN",
}

export enum FragmentType {
    CREATE = "c",
    MODIFY = "m",
    REMOVE = "r",
}

export interface UidContainingBean {
}

export interface ValidationBean extends AbstractIOBean {
    _t?: string,
    success?: boolean,
}

