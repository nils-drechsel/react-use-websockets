import { FunctionComponent, ReactElement, ReactNode } from "react";
interface Props {
    id: string;
    showElementWhileConnecting?: ReactElement | null;
    children: ReactNode;
}
export declare const RemoteStoreProvider: FunctionComponent<Props>;
export {};
