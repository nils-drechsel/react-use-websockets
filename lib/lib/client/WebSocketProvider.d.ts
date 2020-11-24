import { FunctionComponent, ReactElement } from "react";
interface Props {
    url: string;
    delimiter?: string;
    logging?: boolean;
    ElementWhileConnecting?: ReactElement<any, any>;
}
export declare const WebSocketProvider: FunctionComponent<Props>;
export {};
