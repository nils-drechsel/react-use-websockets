import { createContext } from 'react';
import { RemoteStore } from "./RemoteStore";

export const RemoteStoreContext = createContext<Map<string, RemoteStore>>(new Map());

export default RemoteStoreContext;

