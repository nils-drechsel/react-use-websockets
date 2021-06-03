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
    private signature;
    constructor(signature: BeanSerialisationSignature);
    serialise(bean: any): any;
}
export default Serialiser;
