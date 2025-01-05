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

export const isKeyParametersBean = (bean: IOBean) => !!bean && bean._t === "KeyParametersBean";

export interface StoreParametersBean {
}

export const isStoreParametersBean = (bean: IOBean) => !!bean && bean._t === "StoreParametersBean";

export interface Fragment extends IOBean {
    path: Array<string>,
    _t: string,
    jsonPayload?: string | null,
    type: FragmentType,
}

export const createFragment = (content?: Omit<Fragment, "_t">) => (Object.assign({_t: "Fragment"}, content));

export const isFragment = (bean: IOBean) => !!bean && bean._t === "Fragment";

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

export const isNoParametersBean = (bean: IOBean) => !!bean && bean._t === "NoParametersBean";

export interface AbstractStoreParametersBean extends IOBean {
    getPathElements: () => Array<string>,
    _t: string,
}

export const isAbstractStoreParametersBean = (bean: IOBean) => !!bean && bean._t === "AbstractStoreParametersBean";

export interface FragmentList extends IOBean {
    fromVersion: string | null,
    _t: string,
    fragments: Array<Fragment>,
    toVersion: string | null,
}

export const createFragmentList = (content?: Omit<FragmentList, "_t">) => (Object.assign({_t: "FragmentList"}, content));

export const isFragmentList = (bean: IOBean) => !!bean && bean._t === "FragmentList";

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

export interface AbstractStoreBean extends IOBean {
    uid: string,
    _t: string,
    version: string,
}

export const isAbstractStoreBean = (bean: IOBean) => !!bean && bean._t === "AbstractStoreBean";

export interface TransactionItem extends IOBean {
    payload: IOClientToServerStoreBean,
    _t: string,
    action: TransactionItemAction,
}

export const createTransactionItem = (content?: Omit<TransactionItem, "_t">) => (Object.assign({_t: "TransactionItem"}, content));

export const isTransactionItem = (bean: IOBean) => !!bean && bean._t === "TransactionItem";

export interface StoreConnectedBean extends IOBean {
    _t: string,
}

export const createStoreConnectedBean = (content?: Omit<StoreConnectedBean, "_t">) => (Object.assign({_t: "StoreConnectedBean"}, content));

export const isStoreConnectedBean = (bean: IOBean) => !!bean && bean._t === "StoreConnectedBean";

export enum IOCoreEndpoints {
    CORE = "CORE",
    STORE = "STORE",
}

export enum ServerStoreMessage {
    UPDATE = "UPDATE",
}

export interface ConcretisedArrayBean extends IOBean {
    _t: string,
}

export const createConcretisedArrayBean = (content?: Omit<ConcretisedArrayBean, "_t">) => (Object.assign({_t: "ConcretisedArrayBean"}, content));

export const isConcretisedArrayBean = (bean: IOBean) => !!bean && bean._t === "ConcretisedArrayBean";

export interface IOServerToClientStoreBean extends IOBean {
    storeSessionId: string,
    payload: IOBean,
    _t: string,
    primaryId: string,
}

export const createIOServerToClientStoreBean = (content?: Omit<IOServerToClientStoreBean, "_t">) => (Object.assign({_t: "IOServerToClientStoreBean"}, content));

export const isIOServerToClientStoreBean = (bean: IOBean) => !!bean && bean._t === "IOServerToClientStoreBean";

export interface IOClientToServerStoreBean extends IOBean {
    storeSessionId: string,
    payload?: IOBean | null,
    _t: string,
    parameters: IOBean,
    key?: string | null,
    primaryPath: Array<string>,
}

export const createIOClientToServerStoreBean = (content?: Omit<IOClientToServerStoreBean, "_t">) => (Object.assign({_t: "IOClientToServerStoreBean"}, content));

export const isIOClientToServerStoreBean = (bean: IOBean) => !!bean && bean._t === "IOClientToServerStoreBean";

export interface ClientErrorBean extends IOBean {
    _t: string,
    message: string,
    componentStack?: string | null,
}

export const createClientErrorBean = (content?: Omit<ClientErrorBean, "_t">) => (Object.assign({_t: "ClientErrorBean"}, content));

export const isClientErrorBean = (bean: IOBean) => !!bean && bean._t === "ClientErrorBean";

export interface IOBean {
    _t: string,
}

export const isIOBean = (bean: IOBean) => !!bean && bean._t === "IOBean";

export interface CoreConfig extends IOBean {
    _t: string,
    timezone: string,
}

export const createCoreConfig = (content?: Omit<CoreConfig, "_t">) => (Object.assign({_t: "CoreConfig"}, content));

export const isCoreConfig = (bean: IOBean) => !!bean && bean._t === "CoreConfig";

export interface NullBean extends IOBean {
    _t: string,
}

export const createNullBean = (content?: Omit<NullBean, "_t">) => (Object.assign({_t: "NullBean"}, content));

export const isNullBean = (bean: IOBean) => !!bean && bean._t === "NullBean";

export interface TimestampBean extends AbstractStoreBean {
    uid: string,
    _t: string,
    created: number,
    modified: number,
    version: string,
}

export const createTimestampBean = (content?: Omit<TimestampBean, "_t">) => (Object.assign({_t: "TimestampBean"}, content));

export const isTimestampBean = (bean: IOBean) => !!bean && bean._t === "TimestampBean";

export interface TemplateMasterBean extends IOBean {
    _t: string,
}

export const createTemplateMasterBean = (content?: Omit<TemplateMasterBean, "_t">) => (Object.assign({_t: "TemplateMasterBean"}, content));

export const isTemplateMasterBean = (bean: IOBean) => !!bean && bean._t === "TemplateMasterBean";

export interface DataBaseBean extends AbstractStoreBean {
    uid: string,
    _t: string,
    version: string,
}

export const isDataBaseBean = (bean: IOBean) => !!bean && bean._t === "DataBaseBean";

export interface IOClientToServerCoreBean extends IOBean {
    endpoint: string,
    payload: IOBean,
    toSid?: string | null,
    _t: string,
    origin?: string | null,
    message: string,
}

export const createIOClientToServerCoreBean = (content?: Omit<IOClientToServerCoreBean, "_t">) => (Object.assign({_t: "IOClientToServerCoreBean"}, content));

export const isIOClientToServerCoreBean = (bean: IOBean) => !!bean && bean._t === "IOClientToServerCoreBean";

export interface StoreConnectionErrorBean extends IOBean {
    _t: string,
    accessDenied: boolean,
    errors: Array<string>,
}

export const createStoreConnectionErrorBean = (content?: Omit<StoreConnectionErrorBean, "_t">) => (Object.assign({_t: "StoreConnectionErrorBean"}, content));

export const isStoreConnectionErrorBean = (bean: IOBean) => !!bean && bean._t === "StoreConnectionErrorBean";

export interface StoreBean {
}

export const isStoreBean = (bean: IOBean) => !!bean && bean._t === "StoreBean";

export enum ClientToServerStoreMessage {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    INSERT = "INSERT",
    REMOVE = "REMOVE",
    UPDATE = "UPDATE",
    TRANSACTION = "TRANSACTION",
}

export enum TransactionItemAction {
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    REMOVE = "REMOVE",
}

export interface TransactionBean extends IOBean {
    _t: string,
    id: string,
    items: Array<TransactionItem>,
}

export const createTransactionBean = (content?: Omit<TransactionBean, "_t">) => (Object.assign({_t: "TransactionBean"}, content));

export const isTransactionBean = (bean: IOBean) => !!bean && bean._t === "TransactionBean";

export interface ServerToClientAuthenticationBean extends IOBean {
    uid: string,
    _t: string,
    token0: string,
    token1: string,
    validity: number,
    sid: string,
}

export const createServerToClientAuthenticationBean = (content?: Omit<ServerToClientAuthenticationBean, "_t">) => (Object.assign({_t: "ServerToClientAuthenticationBean"}, content));

export const isServerToClientAuthenticationBean = (bean: IOBean) => !!bean && bean._t === "ServerToClientAuthenticationBean";

export interface MessageBean extends IOBean {
    _t: string,
    message: string,
    type: MessageType,
}

export const createMessageBean = (content?: Omit<MessageBean, "_t">) => (Object.assign({_t: "MessageBean"}, content));

export const isMessageBean = (bean: IOBean) => !!bean && bean._t === "MessageBean";

export interface IOPingPongBean extends IOBean {
    _t: string,
}

export const createIOPingPongBean = (content?: Omit<IOPingPongBean, "_t">) => (Object.assign({_t: "IOPingPongBean"}, content));

export const isIOPingPongBean = (bean: IOBean) => !!bean && bean._t === "IOPingPongBean";

export interface ClientToServerAuthenticationBean extends IOBean {
    _t: string,
    token0: string | null,
    token1: string | null,
}

export const createClientToServerAuthenticationBean = (content?: Omit<ClientToServerAuthenticationBean, "_t">) => (Object.assign({_t: "ClientToServerAuthenticationBean"}, content));

export const isClientToServerAuthenticationBean = (bean: IOBean) => !!bean && bean._t === "ClientToServerAuthenticationBean";

export interface FolderPseudoBean extends IOBean {
    _t: string,
}

export const createFolderPseudoBean = (content?: Omit<FolderPseudoBean, "_t">) => (Object.assign({_t: "FolderPseudoBean"}, content));

export const isFolderPseudoBean = (bean: IOBean) => !!bean && bean._t === "FolderPseudoBean";

export interface IOServerToClientCoreBean extends IOBean {
    endpoint: string,
    payload: IOBean,
    _t: string,
    origin: string | null,
    fromSid: string | null,
    message: string,
}

export const createIOServerToClientCoreBean = (content?: Omit<IOServerToClientCoreBean, "_t">) => (Object.assign({_t: "IOServerToClientCoreBean"}, content));

export const isIOServerToClientCoreBean = (bean: IOBean) => !!bean && bean._t === "IOServerToClientCoreBean";

export interface GTest extends IOBean {
    _t: string,
    testset: Set<number>,
}

export const createGTest = (content?: Omit<GTest, "_t">) => (Object.assign({_t: "GTest"}, content));

export const isGTest = (bean: IOBean) => !!bean && bean._t === "GTest";

export interface AbstractTimestampStoreBean extends AbstractStoreBean {
    uid: string,
    _t: string,
    createdTimestamp: number,
    modifiedTimestamp: number,
    version: string,
    touchedTimestamp: number,
}

export const isAbstractTimestampStoreBean = (bean: IOBean) => !!bean && bean._t === "AbstractTimestampStoreBean";

export interface AbstractConfigBean extends AbstractStoreBean {
    uid: string,
    _t: string,
    version: string,
}

export const isAbstractConfigBean = (bean: IOBean) => !!bean && bean._t === "AbstractConfigBean";

export enum CoreMessage {
    PING = "PING",
    PONG = "PONG",
    AUTHENTICATE = "AUTHENTICATE",
    VALIDATION = "VALIDATION",
    MESSAGE = "MESSAGE",
    CLIENT_ERROR = "CLIENT_ERROR",
}

export interface ArrayBean extends IOBean {
    _t: string,
    items: Array<IOBean>,
}

export const createArrayBean = (content?: Omit<ArrayBean, "_t">) => (Object.assign({_t: "ArrayBean"}, content));

export const isArrayBean = (bean: IOBean) => !!bean && bean._t === "ArrayBean";

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

export interface FragmentAction extends IOBean {
    _t: string,
    fragments?: FragmentList | null,
    type: FragmentActionType,
    bean?: IOBean | null,
}

export const createFragmentAction = (content?: Omit<FragmentAction, "_t">) => (Object.assign({_t: "FragmentAction"}, content));

export const isFragmentAction = (bean: IOBean) => !!bean && bean._t === "FragmentAction";

export interface FragmentUpdateBean extends IOBean {
    _t: string,
    items: Map<string,FragmentList>,
}

export const createFragmentUpdateBean = (content?: Omit<FragmentUpdateBean, "_t">) => (Object.assign({_t: "FragmentUpdateBean"}, content));

export const isFragmentUpdateBean = (bean: IOBean) => !!bean && bean._t === "FragmentUpdateBean";

export enum FragmentActionType {
    ADD = "ADD",
    UPDATE = "UPDATE",
    REMOVE = "REMOVE",
}

