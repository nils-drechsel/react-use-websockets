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

export const createKeyParametersBean = () => ({_t: "KeyParametersBean"})

export interface Fragment extends AbstractIOBean {
    path: Array<string>,
    _t: string,
    jsonPayload?: string | null,
    type: FragmentType,
}

export const createFragment = () => ({_t: "Fragment"})

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

export const createNoParametersBean = () => ({_t: "NoParametersBean"})

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

export const createStoreValidationMessageBean = () => ({_t: "StoreValidationMessageBean"})

export interface FragmentList extends AbstractIOBean {
    _t: string,
    fragments: Array<Fragment>,
}

export const createFragmentList = () => ({_t: "FragmentList"})

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

export const createStoreConnectedBean = () => ({_t: "StoreConnectedBean"})

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

export const createConcretisedArrayBean = () => ({_t: "ConcretisedArrayBean"})

export interface IOServerToClientStoreBean extends AbstractIOBean {
    secondaryId: string,
    _t: string,
    payload: string,
    primaryId: string,
}

export const createIOServerToClientStoreBean = () => ({_t: "IOServerToClientStoreBean"})

export interface IOClientToServerStoreBean extends AbstractIOBean {
    payloadJson?: string | null,
    _t: string,
    secondaryPath: Array<string>,
    parametersJson: string,
    transactionId?: string | null,
    key?: string | null,
    primaryPath: Array<string>,
}

export const createIOClientToServerStoreBean = () => ({_t: "IOClientToServerStoreBean"})

export interface ClientErrorBean extends AbstractIOBean {
    _t: string,
    message: string,
    componentStack?: string | null,
}

export const createClientErrorBean = () => ({_t: "ClientErrorBean"})

export interface AbstractIOBean {
    _t?: string,
}

export interface CoreConfig extends AbstractIOBean {
    _t: string,
    timezone: string,
}

export const createCoreConfig = () => ({_t: "CoreConfig"})

export interface NullBean extends AbstractIOBean {
    _t: string,
}

export const createNullBean = () => ({_t: "NullBean"})

export interface TimestampBean extends AbstractIOBean {
    touched: number,
    _t: string,
    created: number,
    modified: number,
}

export const createTimestampBean = () => ({_t: "TimestampBean"})

export interface TemplateMasterBean extends AbstractIOBean {
    _t: string,
}

export const createTemplateMasterBean = () => ({_t: "TemplateMasterBean"})

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

export const createIOClientToServerCoreBean = () => ({_t: "IOClientToServerCoreBean"})

export interface ClientMessageBean {
}

export interface StoreConnectionErrorBean extends AbstractIOBean {
    _t: string,
    accessDenied: boolean,
    errors: Array<string>,
}

export const createStoreConnectionErrorBean = () => ({_t: "StoreConnectionErrorBean"})

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

export const createStoreUpdateBean = () => ({_t: "StoreUpdateBean"})

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

export const createServerToClientAuthenticationBean = () => ({_t: "ServerToClientAuthenticationBean"})

export interface MessageBean extends AbstractIOBean {
    _t: string,
    type: MessageType,
    message: string,
}

export const createMessageBean = () => ({_t: "MessageBean"})

export interface StoreFragment {
}

export interface IOPingPongBean extends AbstractIOBean {
    _t: string,
}

export const createIOPingPongBean = () => ({_t: "IOPingPongBean"})

export interface TimestampContainingBean {
}

export interface ClientToServerAuthenticationBean extends AbstractIOBean {
    _t: string,
    token0: string | null,
    token1: string | null,
}

export const createClientToServerAuthenticationBean = () => ({_t: "ClientToServerAuthenticationBean"})

export interface FolderPseudoBean extends AbstractIOBean {
    _t: string,
}

export const createFolderPseudoBean = () => ({_t: "FolderPseudoBean"})

export interface IOServerToClientCoreBean extends AbstractIOBean {
    endpoint: string,
    _t: string,
    payload: string,
    fromSid: string | null,
    origin: string | null,
    message: string,
}

export const createIOServerToClientCoreBean = () => ({_t: "IOServerToClientCoreBean"})

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

export const createArrayBean = () => ({_t: "ArrayBean"})

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

