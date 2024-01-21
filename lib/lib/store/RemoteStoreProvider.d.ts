import { FunctionComponent, ReactElement, ReactNode } from "react";
import { BeanSerialisationSignature } from "../client/serialisation/Serialisation";
interface Props {
    id: string;
    serialisationSignatures?: Map<string, BeanSerialisationSignature>;
    showElementWhileConnecting?: ReactElement | null;
    children: ReactNode;
}
export declare const RemoteStoreProvider: FunctionComponent<Props>;
export {};
