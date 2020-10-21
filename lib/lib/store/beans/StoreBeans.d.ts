export interface ConnectPayload extends AbstractWebSocketBean {
    path: Array<string>;
    params: Array<string>;
}
export interface NullBean extends AbstractWebSocketBean {
}
export interface ServerMessageBean extends AbstractWebSocketBean {
    originId?: string | null;
    bean?: string;
}
export interface DataBaseBean extends AbstractWebSocketBean {
}
export interface ClientMessageBean extends AbstractWebSocketBean {
    originId?: string;
}
export interface DisconnectPayload extends AbstractWebSocketBean {
    path: Array<string>;
    params: Array<string>;
}
export declare enum CoreMessage {
    STORE_CONNECT = "STORE_CONNECT",
    STORE_DISCONNECT = "STORE_DISCONNECT",
    STORE_UPDATE = "STORE_UPDATE",
    VALIDATION = "VALIDATION",
    STORE_EDIT = "STORE_EDIT"
}
export declare enum Comparator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    GREATER = "GREATER",
    GREATER_OR_EQUAL = "GREATER_OR_EQUAL",
    SMALLER = "SMALLER",
    SMALLER_OR_EQUAL = "SMALLER_OR_EQUAL"
}
export interface StoreUpdateBean extends AbstractWebSocketBean {
    initial?: boolean | null;
    payload: {
        [key: string]: any;
    };
    id: string;
}
export interface AbstractWebSocketBean extends Object {
}
export interface ValidationBean extends ServerMessageBean {
    originId?: string | null;
    success?: boolean;
    bean?: string;
}
export interface StoreEditBean extends AbstractWebSocketBean {
    path: Array<string>;
    originId: string;
    payload: any;
    params: Array<string>;
}
