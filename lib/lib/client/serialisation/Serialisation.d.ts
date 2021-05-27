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
export declare type SerialisationEntitySignature = Array<SingleSerialisationSignature>;
export interface SerialisationSignature {
    incoming: boolean;
    message: string;
    signature: SerialisationEntitySignature;
}
export declare class Serialiser {
    private signature;
    constructor(signature: SerialisationEntitySignature);
    serialise(bean: any): any;
}
export default Serialiser;
