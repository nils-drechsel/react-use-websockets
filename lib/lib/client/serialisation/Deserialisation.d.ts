import { SerialisationEntitySignature } from "./Serialisation";
export declare class Deserialiser {
    private signature;
    constructor(signature: SerialisationEntitySignature);
    deserialise(bean: any): void;
}
export default Deserialiser;
