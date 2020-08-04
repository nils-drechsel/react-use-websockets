import { createContext } from 'react';
import { RemoteStore } from "./RemoteStore";

export const RemoteStoreContext = createContext<RemoteStore | null>(null);

export default RemoteStoreContext;

