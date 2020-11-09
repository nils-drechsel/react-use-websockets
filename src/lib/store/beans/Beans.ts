// This file is auto-generated. Do not modify

// @ts-ignore: unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { validateNotEmpty, errorNotEmpty, validateRegex, errorRegex, validateLength, errorLength, validateSize, errorSize, validateComparison, errorComparison } from "react-use-websockets/lib/lib/store/beans/StoreBeanUtils"


export interface ClientErrorBean extends AbstractWebSocketBean {
    message: string,
    componentStack?: string | null,
}

export interface MessageBean extends AbstractWebSocketBean {
    message: string,
    type: MessageType,
}

export interface StoreEditFragment extends StoreBean {
}

export interface AbstractStoreBean extends AbstractWebSocketBean {
    path: Array<string>,
    params?: StoreParametersBean | null,
}

export interface ConnectPayload extends AbstractStoreBean {
    path: Array<string>,
    params?: StoreParametersBean | null,
}

export interface NullBean extends AbstractWebSocketBean {
}

export interface ServerMessageBean extends AbstractWebSocketBean {
    originId?: string | null,
    bean?: string,
}

export interface StoreParametersBean extends AbstractWebSocketBean {
    key: string | null,
}

export interface DataBaseBean extends StoreBean {
    uid?: string,
}

export interface ClientMessageBean {
}

export interface DisconnectPayload extends AbstractStoreBean {
    path: Array<string>,
    params?: StoreParametersBean | null,
}

export enum CoreMessage {
    STORE_CONNECT = "STORE_CONNECT",
    STORE_DISCONNECT = "STORE_DISCONNECT",
    STORE_UPDATE = "STORE_UPDATE",
    VALIDATION = "VALIDATION",
    STORE_EDIT = "STORE_EDIT",
    STORE_CREATE = "STORE_CREATE",
    MESSAGE = "MESSAGE",
    CLIENT_ERROR = "CLIENT_ERROR",
}

export enum Comparator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    GREATER = "GREATER",
    GREATER_OR_EQUAL = "GREATER_OR_EQUAL",
    SMALLER = "SMALLER",
    SMALLER_OR_EQUAL = "SMALLER_OR_EQUAL",
}

export interface StoreBean extends AbstractWebSocketBean {
    uid?: string,
}

export interface ClientOriginatedBean extends AbstractWebSocketBean {
    originId?: string,
}

export interface StoreUpdateBean extends AbstractWebSocketBean {
    payload: { [key: string]: AbstractWebSocketBean; },
    initial?: boolean | null,
    id: string,
}

export interface AbstractWebSocketBean extends Object {
}

export interface UidContainingBean {
}

export interface OwnerContainingBean {
}

export interface ValidationBean extends ServerMessageBean {
    originId?: string | null,
    success?: boolean,
    bean?: string,
}

export interface AnnotationContainingBean {
}

export interface StoreEditBean extends AbstractStoreBean {
    path: Array<string>,
    originId: string,
    payload: StoreBean,
    params?: StoreParametersBean | null,
}

export interface StoreValidationBean extends ValidationBean {
    originId?: string | null,
    storeUid?: string,
    success?: boolean,
    bean?: string,
}

export enum MessageType {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO",
    SUCCESS = "SUCCESS",
}

