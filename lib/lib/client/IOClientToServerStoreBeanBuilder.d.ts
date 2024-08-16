import { AbstractIOBean, AbstractStoreParametersBean, IOClientToServerStoreBean } from "../beans/Beans";
export declare const clientToServerStoreBeanBuilder: () => ClientToServerStoreBeanBuilder;
export declare class ClientToServerStoreBeanBuilder {
    private coreBean;
    primaryPath(primaryPath: Array<string>): ClientToServerStoreBeanBuilder;
    storeSessionId(storeSessionId: string): ClientToServerStoreBeanBuilder;
    payload(payload: AbstractIOBean): ClientToServerStoreBeanBuilder;
    parameters(payload: AbstractStoreParametersBean): ClientToServerStoreBeanBuilder;
    key(key: string): ClientToServerStoreBeanBuilder;
    build(): IOClientToServerStoreBean;
    private sanityCheck;
}
