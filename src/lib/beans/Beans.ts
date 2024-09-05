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

export interface StoreParametersBean {
}

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

export const createNoParametersBean = (content?: Omit<NoParametersBean, "_t">): NoParametersBean => (Object.assign({_t: "NoParametersBean"}, content));

export interface AbstractStoreParametersBean extends AbstractIOBean {
    getPathElements: () => Array<string>,
    _t: string,
}

export interface FragmentList extends AbstractIOBean {
    fromVersion: string | null,
    _t: string,
    fragments: Array<Fragment>,
    toVersion: string | null,
}

export const createFragmentList = (content?: Omit<FragmentList, "_t">) => (Object.assign({_t: "FragmentList"}, content));

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
    uid: string,
    _t: string,
    version: string,
}

export interface StoreConnectedBean extends AbstractIOBean {
    _t: string,
}

export const createStoreConnectedBean = (content?: Omit<StoreConnectedBean, "_t">) => (Object.assign({_t: "StoreConnectedBean"}, content));

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
    storeSessionId: string,
    payload: AbstractIOBean,
    _t: string,
    primaryId: string,
}

export const createIOServerToClientStoreBean = (content?: Omit<IOServerToClientStoreBean, "_t">) => (Object.assign({_t: "IOServerToClientStoreBean"}, content));

export interface IOClientToServerStoreBean extends AbstractIOBean {
    storeSessionId: string,
    payload?: AbstractIOBean | null,
    _t: string,
    parameters: AbstractIOBean,
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
    _t: string,
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

export interface TimestampBean extends AbstractStoreBean {
    uid: string,
    _t: string,
    created: number,
    modified: number,
    version: string,
}

export const createTimestampBean = (content?: Omit<TimestampBean, "_t">) => (Object.assign({_t: "TimestampBean"}, content));

export interface TemplateMasterBean extends AbstractIOBean {
    _t: string,
}

export const createTemplateMasterBean = (content?: Omit<TemplateMasterBean, "_t">) => (Object.assign({_t: "TemplateMasterBean"}, content));

export interface DataBaseBean extends AbstractStoreBean {
    uid: string,
    _t: string,
    version: string,
}

export interface IOClientToServerCoreBean extends AbstractIOBean {
    endpoint: string,
    payload: AbstractIOBean,
    toSid?: string | null,
    _t: string,
    origin?: string | null,
    message: string,
}

export const createIOClientToServerCoreBean = (content?: Omit<IOClientToServerCoreBean, "_t">) => (Object.assign({_t: "IOClientToServerCoreBean"}, content));

export interface StoreConnectionErrorBean extends AbstractIOBean {
    _t: string,
    accessDenied: boolean,
    errors: Array<string>,
}

export const createStoreConnectionErrorBean = (content?: Omit<StoreConnectionErrorBean, "_t">) => (Object.assign({_t: "StoreConnectionErrorBean"}, content));

export interface StoreBean {
}

export enum ClientToServerStoreMessage {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    INSERT = "INSERT",
    REMOVE = "REMOVE",
    UPDATE = "UPDATE",
}

export interface MessageBean extends AbstractIOBean {
    _t: string,
    message: string,
    type: MessageType,
}

export const createMessageBean = (content?: Omit<MessageBean, "_t">) => (Object.assign({_t: "MessageBean"}, content));

export interface ServerToClientAuthenticationBean extends AbstractIOBean {
    uid: string,
    _t: string,
    token0: string,
    token1: string,
    validity: number,
    sid: string,
}

export const createServerToClientAuthenticationBean = (content?: Omit<ServerToClientAuthenticationBean, "_t">) => (Object.assign({_t: "ServerToClientAuthenticationBean"}, content));

export interface IOPingPongBean extends AbstractIOBean {
    _t: string,
}

export const createIOPingPongBean = (content?: Omit<IOPingPongBean, "_t">) => (Object.assign({_t: "IOPingPongBean"}, content));

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
    payload: AbstractIOBean,
    _t: string,
    origin: string | null,
    fromSid: string | null,
    message: string,
}

export const createIOServerToClientCoreBean = (content?: Omit<IOServerToClientCoreBean, "_t">) => (Object.assign({_t: "IOServerToClientCoreBean"}, content));

export interface GTest extends AbstractIOBean {
    _t: string,
    testset: Set<number>,
}

export const createGTest = (content?: Omit<GTest, "_t">) => (Object.assign({_t: "GTest"}, content));

export interface AbstractTimestampStoreBean extends AbstractStoreBean {
    uid: string,
    _t: string,
    createdTimestamp: number,
    modifiedTimestamp: number,
    version: string,
    touchedTimestamp: number,
}

export interface AbstractConfigBean extends AbstractStoreBean {
    uid: string,
    _t: string,
    version: string,
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
    POPULATE = "POPULATE",
    UPDATE = "UPDATE",
    DISCONNECT_FORCEFULLY = "DISCONNECT_FORCEFULLY",
    VALIDATION = "VALIDATION",
}

export enum ServerIdents {
    MAIN = "MAIN",
}

export enum FragmentType {
    CREATE_ITEM = "c",
    MODIFY_ITEM = "m",
    REMOVE_ITEM = "r",
    CREATE_BEAN = "b",
    REMOVE_BEAN = "d",
}

export interface FragmentAction extends AbstractIOBean {
    _t: string,
    fragments?: FragmentList | null,
    type: FragmentActionType,
    bean?: AbstractIOBean | null,
}

export const createFragmentAction = (content?: Omit<FragmentAction, "_t">) => (Object.assign({_t: "FragmentAction"}, content));

export interface FragmentUpdateBean extends AbstractIOBean {
    _t: string,
    items: Map<string,FragmentList>,
}

export const createFragmentUpdateBean = (content?: Omit<FragmentUpdateBean, "_t">) => (Object.assign({_t: "FragmentUpdateBean"}, content));

export enum FragmentActionType {
    ADD = "ADD",
    UPDATE = "UPDATE",
    REMOVE = "REMOVE",
}

