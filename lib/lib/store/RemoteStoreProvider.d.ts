import { FunctionComponent } from "react";
import { BeanSerialisationSignature } from "../client/serialisation/Serialisation";
interface Props {
    id: string;
    serialisationSignatures?: Map<string, BeanSerialisationSignature>;
}
export declare const RemoteStoreProvider: FunctionComponent<Props>;
export {};
