import { BeanSerialisationSignature } from "./Serialisation";
export declare class Deserialiser {
    resolvers: Map<string, BeanResolver>;
    constructor(signatures?: Map<string, BeanSerialisationSignature>);
    deserialise(json: string): any;
    resolve(bean: any): any;
}
export declare class BeanResolver {
    private signature;
    constructor(signature: BeanSerialisationSignature);
    resolve(bean: any): any;
}
export default Deserialiser;
