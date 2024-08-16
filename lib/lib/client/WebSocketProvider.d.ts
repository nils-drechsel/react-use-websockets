import { FunctionComponent, ReactElement, ReactNode } from "react";
interface Props {
    id: string;
    url: string;
    domain: string;
    delimiter?: string;
    logging?: boolean;
    reconnect?: boolean;
    showElementWhileConnecting?: ReactElement | null;
    ping?: number;
    children: ReactNode;
}
export declare const WebSocketProvider: FunctionComponent<Props>;
export {};
