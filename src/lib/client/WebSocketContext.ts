import { createContext } from 'react';
import { WebSocketManager } from "./WebSocketManager";

export const WebSocketContext = createContext<Map<string, WebSocketManager>>(new Map());

export default WebSocketContext;

