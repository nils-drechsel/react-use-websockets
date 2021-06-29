import { BeanSerialisationSignature } from "./Serialisation";
export declare class Deserialiser {
    private signature;
    constructor(signature: BeanSerialisationSignature);
    deserialise(bean: any): any;
}
export default Deserialiser;
