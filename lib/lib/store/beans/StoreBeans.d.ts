export declare enum StoreMessage {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    STORE_UPDATE = "STORE_UPDATE"
}
export declare type StoreUpdateBean = {
    payload: {
        [key: string]: any;
    };
    id: string;
};
export declare type ConnectPayload = {
    path: Array<string>;
};
export declare type NullBean = {};
export declare type DisconnectPayload = {
    path: Array<string>;
};
export declare enum Comparator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    GREATER = "GREATER",
    GREATER_OR_EQUAL = "GREATER_OR_EQUAL",
    SMALLER = "SMALLER",
    SMALLER_OR_EQUAL = "SMALLER_OR_EQUAL"
}