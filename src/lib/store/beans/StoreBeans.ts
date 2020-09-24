// This file is auto-generated. Do not modify

// @ts-ignore: unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { validateNotEmpty, errorNotEmpty, validateRegex, errorRegex, validateLength, errorLength, validateSize, errorSize, validateComparison, errorComparison } from "react-use-websockets/lib/lib/store/beans/StoreBeanUtils"


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

export enum CoreMessage {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    STORE_UPDATE = "STORE_UPDATE",
    VALIDATION = "VALIDATION",
}

export enum Comparator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    GREATER = "GREATER",
    GREATER_OR_EQUAL = "GREATER_OR_EQUAL",
    SMALLER = "SMALLER",
    SMALLER_OR_EQUAL = "SMALLER_OR_EQUAL",
}

