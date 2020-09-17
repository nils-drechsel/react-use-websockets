// This file is auto-generated. Do not modify

// @ts-ignore: unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { validateNotEmpty, errorNotEmpty, validateRegex, errorRegex, validateLength, errorLength, validateSize, errorSize, validateComparison, errorComparison } from "react-use-websockets/lib/lib/store/beans/StoreBeanUtils"
export enum StoreMessage {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    STORE_UPDATE = "STORE_UPDATE",
}

export type StoreUpdateBean = {
    payload: { [key: string]: any; },
    id: string,
}

export type ConnectPayload = {
    path: Array<string>,
}

export type NullBean = {
}

export type DisconnectPayload = {
    path: Array<string>,
}

export enum Comparator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    GREATER = "GREATER",
    GREATER_OR_EQUAL = "GREATER_OR_EQUAL",
    SMALLER = "SMALLER",
    SMALLER_OR_EQUAL = "SMALLER_OR_EQUAL",
}

