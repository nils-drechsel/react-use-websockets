import { FunctionComponent, ReactElement } from "react";
interface Props {
    id: string;
    url: string;
    domain: string;
    delimiter?: string;
    logging?: boolean;
    showElementWhileConnecting?: ReactElement | null;
}
export declare const WebSocketProvider: FunctionComponent<Props>;
export {};
