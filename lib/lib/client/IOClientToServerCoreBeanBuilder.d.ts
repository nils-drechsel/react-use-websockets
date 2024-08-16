import { AbstractIOBean, IOClientToServerCoreBean } from "../beans/Beans";
export declare const clientToServerCoreBeanBuilder: () => IOClientToServerCoreBeanBuilder;
export declare class IOClientToServerCoreBeanBuilder {
    private coreBean;
    endpoint(endpoint: string): IOClientToServerCoreBeanBuilder;
    payload(payload: AbstractIOBean): IOClientToServerCoreBeanBuilder;
    message(message: string): IOClientToServerCoreBeanBuilder;
    origin(origin: string): IOClientToServerCoreBeanBuilder;
    toSid(toSid: string): IOClientToServerCoreBeanBuilder;
    build(): IOClientToServerCoreBean;
    private sanityCheck;
}
