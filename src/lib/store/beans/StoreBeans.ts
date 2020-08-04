export enum StoreMessage {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    STORE_UPDATE = "STORE_UPDATE",
}

export type StoreUpdateBean = {
    payload: Map<string,any>,
    id: string,
}

export type ConnectPayload = {
    path: Array<string>,
}

export type NullBean = {
}

export type DisconnectPayload = {
    storeId: string,
}

export enum Comparator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    GREATER = "GREATER",
    GREATER_OR_EQUAL = "GREATER_OR_EQUAL",
    SMALLER = "SMALLER",
    SMALLER_OR_EQUAL = "SMALLER_OR_EQUAL",
}

