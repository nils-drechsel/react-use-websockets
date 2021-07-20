export declare enum SerialisationEntity {
    SET = 0,
    MAP = 1
}
export declare enum SerialisationTarget {
    SET = "<set>",
    MAP = "<map>"
}
export interface SingleSerialisationSignature {
    path: Array<string>;
    type: SerialisationEntity;
}
export declare type BeanSerialisationSignature = Array<SingleSerialisationSignature>;
export declare class Serialiser {
    serialisers: Map<string, BeanSerialiser>;
    constructor(signatures?: Map<string, BeanSerialisationSignature>);
    serialise(bean: any): any;
}
export declare class BeanSerialiser {
    private signature;
    constructor(signature: BeanSerialisationSignature);
    serialise(bean: any): any;
}
export default Serialiser;
