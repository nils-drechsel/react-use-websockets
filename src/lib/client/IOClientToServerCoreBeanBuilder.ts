import { AbstractIOBean, createIOClientToServerCoreBean, IOClientToServerCoreBean } from "../beans/Beans";
import { serialise } from "./serialisation/Serialisation";



export const clientToServerCoreBeanBuilder = () => {
    return new IOClientToServerCoreBeanBuilder();
}

export class IOClientToServerCoreBeanBuilder {

    private coreBean: Partial<IOClientToServerCoreBean> = createIOClientToServerCoreBean({} as any);


    public endpoint(endpoint: string): IOClientToServerCoreBeanBuilder {
        this.coreBean.endpoint = endpoint;
        return this;
    }

    public payload(payload: string | AbstractIOBean): IOClientToServerCoreBeanBuilder {
        if (typeof(payload) == "string") {
            this.coreBean.payload = payload;
        } else {
            this.coreBean.payload = serialise(payload);
        }
        
        return this;
    }



    public message(message: string): IOClientToServerCoreBeanBuilder {
        this.coreBean.message = message;
        return this;
    }

    public origin(origin: string): IOClientToServerCoreBeanBuilder {
        this.coreBean.origin = origin;
        return this;
    }

    public toSid(toSid: string): IOClientToServerCoreBeanBuilder {
        this.coreBean.toSid = toSid;
        return this;
    }

    public build(): IOClientToServerCoreBean {
        this.sanityCheck();
        return this.coreBean as IOClientToServerCoreBean;
    }

    private sanityCheck() {
        if (!this.coreBean.endpoint) throw new Error("endpoint cannot be undefined");
        if (!this.coreBean.message) throw new Error("message cannot be undefined");
        if (!this.coreBean.payload) throw new Error("payload cannot be undefined");
    }


}