import { AbstractIOBean, AbstractStoreParametersBean, createIOClientToServerStoreBean, IOClientToServerStoreBean } from "../beans/Beans";
import { serialise } from "./serialisation/Serialisation";



export const clientToServerStoreBeanBuilder = () => {
    return new ClientToServerStoreBeanBuilder();
}

export class ClientToServerStoreBeanBuilder {

    private coreBean: Partial<IOClientToServerStoreBean> = createIOClientToServerStoreBean({} as any);


    public primaryPath(primaryPath: Array<string>): ClientToServerStoreBeanBuilder {
        this.coreBean.primaryPath = primaryPath;
        return this;
    }

    public payload(payload: string | AbstractIOBean): ClientToServerStoreBeanBuilder {
        if (typeof(payload) == "string") {
            this.coreBean.payloadJson = payload;
        } else {
            this.coreBean.payloadJson = serialise(payload);
        }
        
        return this;
    }

    public parameters(payload: string | AbstractStoreParametersBean): ClientToServerStoreBeanBuilder {
        if (typeof(payload) == "string") {
            this.coreBean.parametersJson = payload;
        } else {
            this.coreBean.parametersJson = serialise(payload);
        }
        
        return this;
    }



    public key(key: string): ClientToServerStoreBeanBuilder {
        this.coreBean.key = key;
        return this;
    }

    public build(): IOClientToServerStoreBean {
        this.sanityCheck();
        return this.coreBean as IOClientToServerStoreBean;
    }

    private sanityCheck() {
        if (!this.coreBean.primaryPath) throw new Error("primaryPath cannot be undefined");
        if (!this.coreBean.parametersJson) throw new Error("parameters cannot be undefined");
    }


}