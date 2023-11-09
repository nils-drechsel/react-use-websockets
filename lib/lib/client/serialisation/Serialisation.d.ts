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
export type BeanSerialisationSignature = Array<SingleSerialisationSignature>;
export declare class Serialiser {
    resolvers: Map<string, BeanResolver>;
    constructor(signatures?: Map<string, BeanSerialisationSignature>);
    serialise(bean: any): string;
    resolve(bean: any): any;
}
export declare class BeanResolver {
    private signature;
    constructor(signature: BeanSerialisationSignature);
    resolve(bean: any): any;
}
export default Serialiser;
