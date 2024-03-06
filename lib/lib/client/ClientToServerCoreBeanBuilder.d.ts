import { AbstractIOBean } from "../store/beans/Beans";
export interface ClientToServerCoreBean {
    endpoint?: string;
    toSid?: string;
    payloadObject?: AbstractIOBean;
    payloadJSON?: string;
    origin?: string;
    message?: string;
}
export declare const clientToServerCoreBeanBuilder: () => ClientToServerCoreBeanBuilder;
export declare class ClientToServerCoreBeanBuilder {
    private coreBean;
    endpoint(endpoint: string): ClientToServerCoreBeanBuilder;
    payload(payload: AbstractIOBean): ClientToServerCoreBeanBuilder;
    payloadJSON(payload: string): ClientToServerCoreBeanBuilder;
    message(message: string): ClientToServerCoreBeanBuilder;
    origin(origin: string): ClientToServerCoreBeanBuilder;
    toSid(toSid: string): ClientToServerCoreBeanBuilder;
    build(): ClientToServerCoreBean;
    private sanityCheck;
}
