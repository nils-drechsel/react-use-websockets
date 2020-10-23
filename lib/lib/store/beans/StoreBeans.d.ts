export interface ConnectPayload extends AbstractWebSocketBean {
    path: Array<string>;
    params?: StoreParametersBean | null;
}
export interface NullBean extends AbstractWebSocketBean {
}
export interface ServerMessageBean extends AbstractWebSocketBean {
    originId?: string | null;
    bean?: string;
}
export interface StoreParametersBean extends AbstractWebSocketBean {
    key: string | null;
}
export interface DataBaseBean extends AbstractWebSocketBean {
}
export interface ClientMessageBean extends AbstractWebSocketBean {
    originId?: string;
}
export interface DisconnectPayload extends AbstractWebSocketBean {
    path: Array<string>;
    params?: StoreParametersBean | null;
}
export declare enum CoreMessage {
    STORE_CONNECT = "STORE_CONNECT",
    STORE_DISCONNECT = "STORE_DISCONNECT",
    STORE_UPDATE = "STORE_UPDATE",
    VALIDATION = "VALIDATION",
    STORE_EDIT = "STORE_EDIT",
    STORE_CREATE = "STORE_CREATE"
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
        [key: string]: AbstractWebSocketBean;
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
    payload: AbstractWebSocketBean;
    params?: StoreParametersBean | null;
}
