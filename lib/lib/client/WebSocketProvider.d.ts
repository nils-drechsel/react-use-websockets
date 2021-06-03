import { FunctionComponent, ReactElement } from "react";
import { BeanSerialisationSignature } from "./serialisation/Serialisation";
interface Props {
    id: string;
    url: string;
    domain: string;
    delimiter?: string;
    logging?: boolean;
    reconnect?: boolean;
    showElementWhileConnecting?: ReactElement | null;
    ping?: number;
    serialisationSignatures?: Map<string, BeanSerialisationSignature>;
    serialisationPairs?: Map<string, string>;
    deserialisationPairs?: Map<string, string>;
}
export declare const WebSocketProvider: FunctionComponent<Props>;
export {};
