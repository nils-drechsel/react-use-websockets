import { AbstractIOBean } from "../store/beans/Beans";
export interface ServerToClientCoreBean<BEAN extends AbstractIOBean> {
    endpoint: string;
    message: string;
    payload: BEAN;
    origin?: string;
    fromSid?: string;
}
export declare const serverToClientCoreBeanBuilder: () => ServerToClientCoreBeanBuilder<AbstractIOBean>;
export declare class ServerToClientCoreBeanBuilder<BEAN extends AbstractIOBean> {
    private coreBean;
    endpoint(endpoint: string): ServerToClientCoreBeanBuilder<BEAN>;
    payload(payload: BEAN): ServerToClientCoreBeanBuilder<BEAN>;
    message(message: string): ServerToClientCoreBeanBuilder<BEAN>;
    origin(origin?: string): ServerToClientCoreBeanBuilder<BEAN>;
    fromSid(fromSid?: string): ServerToClientCoreBeanBuilder<BEAN>;
    build(): ServerToClientCoreBean<BEAN>;
    private sanityCheck;
}
