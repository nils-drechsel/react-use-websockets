import { createContext } from 'react';
import { WebSocketManager } from "./WebSocketManager";

export const WebSocketContext = createContext<WebSocketManager | null>(null);

export default WebSocketContext;

