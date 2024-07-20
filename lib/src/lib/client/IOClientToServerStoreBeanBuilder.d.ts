import { AbstractIOBean, AbstractStoreParametersBean, IOClientToServerStoreBean } from "../beans/Beans";
export declare const clientToServerStoreBeanBuilder: () => ClientToServerStoreBeanBuilder;
export declare class ClientToServerStoreBeanBuilder {
    private coreBean;
    primaryPath(primaryPath: Array<string>): ClientToServerStoreBeanBuilder;
    payload(payload: string | AbstractIOBean): ClientToServerStoreBeanBuilder;
    parameters(payload: string | AbstractStoreParametersBean): ClientToServerStoreBeanBuilder;
    key(key: string): ClientToServerStoreBeanBuilder;
    build(): IOClientToServerStoreBean;
    private sanityCheck;
}
