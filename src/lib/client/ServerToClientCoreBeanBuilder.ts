import { AbstractIOBean } from "../store/beans/Beans";


export interface ServerToClientCoreBean<BEAN extends AbstractIOBean> {
    endpoint: string,
    message: string,
    payload: BEAN,
    origin?: string,
    fromSid?: string,
}

export const serverToClientCoreBeanBuilder = () => {
    return new ServerToClientCoreBeanBuilder();
}

export class ServerToClientCoreBeanBuilder<BEAN extends AbstractIOBean> {

    private coreBean: Partial<ServerToClientCoreBean<BEAN>> = {};


    public endpoint(endpoint: string): ServerToClientCoreBeanBuilder<BEAN> {
        this.coreBean.endpoint = endpoint;
        return this;
    }

    public payload(payload: BEAN): ServerToClientCoreBeanBuilder<BEAN> {
        this.coreBean.payload = payload;
        return this;
    }

    public message(message: string): ServerToClientCoreBeanBuilder<BEAN> {
        this.coreBean.message = message;
        return this;
    }

    public origin(origin?: string): ServerToClientCoreBeanBuilder<BEAN> {
        if (origin) this.coreBean.origin = origin;
        return this;
    }

    public fromSid(fromSid?: string): ServerToClientCoreBeanBuilder<BEAN> {
        if (fromSid) this.coreBean.fromSid = fromSid;
        return this;
    }

    public build(): ServerToClientCoreBean<BEAN> {
        this.sanityCheck();
        return this.coreBean as ServerToClientCoreBean<BEAN>;
    }

    private sanityCheck() {
        if (!this.coreBean.endpoint) throw new Error("endpoint cannot be undefined");
        if (!this.coreBean.message) throw new Error("message cannot be undefined");
        if (!this.coreBean.payload) throw new Error("payload cannot be undefined");
    }


}