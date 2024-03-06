import { AbstractIOBean } from "../store/beans/Beans";


export interface ClientToServerCoreBean {
    endpoint?: string,
    toSid?: string,
    payloadObject?: AbstractIOBean,
    payloadJSON?: string,
    origin?: string,
    message?: string,
}

export const clientToServerCoreBeanBuilder = () => {
    return new ClientToServerCoreBeanBuilder();
}

export class ClientToServerCoreBeanBuilder {

    private coreBean: ClientToServerCoreBean = {};


    public endpoint(endpoint: string): ClientToServerCoreBeanBuilder {
        this.coreBean.endpoint = endpoint;
        return this;
    }

    public payload(payload: AbstractIOBean): ClientToServerCoreBeanBuilder {
        this.coreBean.payloadObject = payload;
        return this;
    }

    public payloadJSON(payload: string): ClientToServerCoreBeanBuilder {
        this.coreBean.payloadJSON = payload;
        return this;
    }


    public message(message: string): ClientToServerCoreBeanBuilder {
        this.coreBean.message = message;
        return this;
    }

    public origin(origin: string): ClientToServerCoreBeanBuilder {
        this.coreBean.origin = origin;
        return this;
    }

    public toSid(toSid: string): ClientToServerCoreBeanBuilder {
        this.coreBean.toSid = toSid;
        return this;
    }

    public build(): ClientToServerCoreBean {
        this.sanityCheck();
        return this.coreBean;
    }

    private sanityCheck() {
        if (!this.coreBean.endpoint) throw new Error("endpoint cannot be undefined");
        if (!this.coreBean.message) throw new Error("message cannot be undefined");
        if (!this.coreBean.payloadObject && !this.coreBean.payloadJSON) throw new Error("payload cannot be undefined");
    }


}