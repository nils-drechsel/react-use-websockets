import { BeanSerialisationSignature } from "./Serialisation";
export declare class Deserialiser {
    deserialisers: Map<string, BeanDeserialiser>;
    constructor(signatures?: Map<string, BeanSerialisationSignature>);
    deserialise(bean: any): any;
}
export declare class BeanDeserialiser {
    private signature;
    constructor(signature: BeanSerialisationSignature);
    deserialise(bean: any): any;
}
export default Deserialiser;
