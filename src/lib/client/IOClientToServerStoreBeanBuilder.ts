import { AbstractIOBean, AbstractStoreParametersBean, createIOClientToServerStoreBean, IOClientToServerStoreBean } from "../beans/Beans";



export const clientToServerStoreBeanBuilder = () => {
    return new ClientToServerStoreBeanBuilder();
}

export class ClientToServerStoreBeanBuilder {

    private coreBean: Partial<IOClientToServerStoreBean> = createIOClientToServerStoreBean({} as any);


    public primaryPath(primaryPath: Array<string>): ClientToServerStoreBeanBuilder {
        this.coreBean.primaryPath = primaryPath;
        return this;
    }
    public storeSessionId(storeSessionId: string): ClientToServerStoreBeanBuilder {
        this.coreBean.storeSessionId = storeSessionId;
        return this;
    }

    public payload(payload: AbstractIOBean): ClientToServerStoreBeanBuilder {
        if (typeof(payload) == "string") {
            this.coreBean.payload = payload;
        } 
        
        return this;
    }

    public parameters(payload: AbstractStoreParametersBean): ClientToServerStoreBeanBuilder {
        this.coreBean.parameters = payload;
        
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
        if (!this.coreBean.storeSessionId) throw new Error("storeSessionId cannot be undefined");
        if (!this.coreBean.primaryPath) throw new Error("primaryPath cannot be undefined");
        if (!this.coreBean.parameters) throw new Error("parameters cannot be undefined");
    }


}