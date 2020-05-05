import { useContext } from 'react';
import WebSocketContext from "./WebSocketContext";



export const useWebSocket = () => {
    const manager = useContext(WebSocketContext);
    const send = (message: string, payload: any) => manager.send(message, payload);
    const listen = (message: string, callback: any) => manager.addListener(message, callback);

    return { send, listen };
}


export default useSocket;