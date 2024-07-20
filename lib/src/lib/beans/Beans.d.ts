export declare enum PasswordStrengthCriterium {
    LOWERCASE = "LOWERCASE",
    UPPERCASE = "UPPERCASE",
    NUMBERS = "NUMBERS",
    SPECIAL_CHARACTERS = "SPECIAL_CHARACTERS"
}
export interface ClientErrorBean extends AbstractIOBean {
    _t: string;
    message: string;
    componentStack?: string | null;
}
export declare const createClientErrorBean: (content?: Omit<ClientErrorBean, "_t">) => {
    _t: string;
} & Omit<ClientErrorBean, "_t">;
export interface AbstractIOBean {
    _t: string;
}
export interface CoreConfig extends AbstractIOBean {
    _t: string;
    timezone: string;
}
export declare const createCoreConfig: (content?: Omit<CoreConfig, "_t">) => {
    _t: string;
} & Omit<CoreConfig, "_t">;
export interface KeyParametersBean extends AbstractStoreParametersBean {
    getPathElements: () => Array<string>;
    _t: string;
    key: string | null;
}
export declare const createKeyParametersBean: (content?: Omit<KeyParametersBean, "_t">) => {
    _t: string;
} & Omit<KeyParametersBean, "_t">;
export interface NullBean extends AbstractIOBean {
    _t: string;
}
export declare const createNullBean: (content?: Omit<NullBean, "_t">) => {
    _t: string;
} & Omit<NullBean, "_t">;
export interface TimestampBean extends AbstractIOBean {
    touched: number;
    _t: string;
    created: number;
    modified: number;
}
export declare const createTimestampBean: (content?: Omit<TimestampBean, "_t">) => {
    _t: string;
} & Omit<TimestampBean, "_t">;
export interface TemplateMasterBean extends AbstractIOBean {
    _t: string;
}
export declare const createTemplateMasterBean: (content?: Omit<TemplateMasterBean, "_t">) => {
    _t: string;
} & Omit<TemplateMasterBean, "_t">;
export interface DataBaseBean extends AbstractStoreBean {
    uid: string;
    _t: string;
    version: string;
}
export interface IOClientToServerCoreBean extends AbstractIOBean {
    endpoint: string;
    payload: string;
    toSid?: string | null;
    _t: string;
    origin?: string | null;
    message: string;
}
export declare const createIOClientToServerCoreBean: (content?: Omit<IOClientToServerCoreBean, "_t">) => {
    _t: string;
} & Omit<IOClientToServerCoreBean, "_t">;
export interface Fragment extends AbstractIOBean {
    path: Array<string>;
    _t: string;
    jsonPayload?: string | null;
    type: FragmentType;
}
export declare const createFragment: (content?: Omit<Fragment, "_t">) => {
    _t: string;
} & Omit<Fragment, "_t">;
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
    _t: string;
}
export declare const createNoParametersBean: (content?: Omit<NoParametersBean, "_t">) => {
    _t: string;
} & Omit<NoParametersBean, "_t">;
export interface AbstractStoreParametersBean extends AbstractIOBean {
    getPathElements: () => Array<string>;
    _t: string;
}
export interface StoreConnectionErrorBean extends AbstractIOBean {
    _t: string;
    accessDenied: boolean;
    errors: Array<string>;
}
export declare const createStoreConnectionErrorBean: (content?: Omit<StoreConnectionErrorBean, "_t">) => {
    _t: string;
} & Omit<StoreConnectionErrorBean, "_t">;
export interface StoreBean {
}
export declare enum ClientToServerStoreMessage {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    INSERT = "INSERT",
    REMOVE = "REMOVE",
    UPDATE = "UPDATE"
}
export interface FragmentList extends AbstractIOBean {
    fromVersion: string | null;
    _t: string;
    fragments: Array<Fragment>;
    toVersion: string | null;
}
export declare const createFragmentList: (content?: Omit<FragmentList, "_t">) => {
    _t: string;
} & Omit<FragmentList, "_t">;
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
export interface ServerToClientAuthenticationBean extends AbstractIOBean {
    uid: string;
    _t: string;
    token0: string;
    token1: string;
    validity: number;
    sid: string;
}
export declare const createServerToClientAuthenticationBean: (content?: Omit<ServerToClientAuthenticationBean, "_t">) => {
    _t: string;
} & Omit<ServerToClientAuthenticationBean, "_t">;
export interface MessageBean extends AbstractIOBean {
    _t: string;
    message: string;
    type: MessageType;
}
export declare const createMessageBean: (content?: Omit<MessageBean, "_t">) => {
    _t: string;
} & Omit<MessageBean, "_t">;
export interface AbstractStoreBean extends AbstractIOBean {
    uid: string;
    _t: string;
    version: string;
}
export interface StoreConnectedBean extends AbstractIOBean {
    _t: string;
}
export declare const createStoreConnectedBean: (content?: Omit<StoreConnectedBean, "_t">) => {
    _t: string;
} & Omit<StoreConnectedBean, "_t">;
export interface IOPingPongBean extends AbstractIOBean {
    _t: string;
}
export declare const createIOPingPongBean: (content?: Omit<IOPingPongBean, "_t">) => {
    _t: string;
} & Omit<IOPingPongBean, "_t">;
export interface ClientToServerAuthenticationBean extends AbstractIOBean {
    _t: string;
    token0: string | null;
    token1: string | null;
}
export declare const createClientToServerAuthenticationBean: (content?: Omit<ClientToServerAuthenticationBean, "_t">) => {
    _t: string;
} & Omit<ClientToServerAuthenticationBean, "_t">;
export interface FolderPseudoBean extends AbstractIOBean {
    _t: string;
}
export declare const createFolderPseudoBean: (content?: Omit<FolderPseudoBean, "_t">) => {
    _t: string;
} & Omit<FolderPseudoBean, "_t">;
export interface IOServerToClientCoreBean extends AbstractIOBean {
    endpoint: string;
    payload: string;
    _t: string;
    origin: string | null;
    fromSid: string | null;
    message: string;
}
export declare const createIOServerToClientCoreBean: (content?: Omit<IOServerToClientCoreBean, "_t">) => {
    _t: string;
} & Omit<IOServerToClientCoreBean, "_t">;
export interface GTest extends AbstractIOBean {
    _t: string;
    testset: Set<number>;
}
export declare const createGTest: (content?: Omit<GTest, "_t">) => {
    _t: string;
} & Omit<GTest, "_t">;
export declare enum IOCoreEndpoints {
    CORE = "CORE",
    STORE = "STORE"
}
export interface AbstractTimestampStoreBean extends AbstractStoreBean {
    uid: string;
    _t: string;
    createdTimestamp: number;
    modifiedTimestamp: number;
    version: string;
    touchedTimestamp: number;
}
export interface AbstractConfigBean extends AbstractIOBean {
    uid: string;
    _t: string;
    timestamp: TimestampBean;
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
export interface ConcretisedArrayBean extends AbstractIOBean {
    _t: string;
}
export declare const createConcretisedArrayBean: (content?: Omit<ConcretisedArrayBean, "_t">) => {
    _t: string;
} & Omit<ConcretisedArrayBean, "_t">;
export interface ArrayBean extends AbstractIOBean {
    _t: string;
    items: Array<AbstractIOBean>;
}
export declare const createArrayBean: (content?: Omit<ArrayBean, "_t">) => {
    _t: string;
} & Omit<ArrayBean, "_t">;
export declare enum ServerToClientStoreMessage {
    CONNECTED = "CONNECTED",
    CONNECTION_ERROR = "CONNECTION_ERROR",
    POPULATE = "POPULATE",
    UPDATE = "UPDATE",
    DISCONNECT_FORCEFULLY = "DISCONNECT_FORCEFULLY",
    VALIDATION = "VALIDATION"
}
export declare enum ServerIdents {
    MAIN = "MAIN"
}
export declare enum FragmentType {
    CREATE_ITEM = "c",
    MODIFY_ITEM = "m",
    REMOVE_ITEM = "r",
    CREATE_BEAN = "b",
    REMOVE_BEAN = "d"
}
export interface IOServerToClientStoreBean extends AbstractIOBean {
    payload: string;
    _t: string;
    primaryId: string;
}
export declare const createIOServerToClientStoreBean: (content?: Omit<IOServerToClientStoreBean, "_t">) => {
    _t: string;
} & Omit<IOServerToClientStoreBean, "_t">;
export interface IOClientToServerStoreBean extends AbstractIOBean {
    payloadJson?: string | null;
    _t: string;
    parametersJson: string;
    key?: string | null;
    primaryPath: Array<string>;
}
export declare const createIOClientToServerStoreBean: (content?: Omit<IOClientToServerStoreBean, "_t">) => {
    _t: string;
} & Omit<IOClientToServerStoreBean, "_t">;
export interface FragmentAction extends AbstractIOBean {
    _t: string;
    fragments?: FragmentList | null;
    type: FragmentActionType;
    bean?: AbstractIOBean | null;
}
export declare const createFragmentAction: (content?: Omit<FragmentAction, "_t">) => {
    _t: string;
} & Omit<FragmentAction, "_t">;
export interface FragmentUpdateBean extends AbstractIOBean {
    _t: string;
    items: Map<string, FragmentList>;
}
export declare const createFragmentUpdateBean: (content?: Omit<FragmentUpdateBean, "_t">) => {
    _t: string;
} & Omit<FragmentUpdateBean, "_t">;
export declare enum FragmentActionType {
    ADD = "ADD",
    UPDATE = "UPDATE",
    REMOVE = "REMOVE"
}
