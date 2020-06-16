# react-use-websockets custom hook


React hook to facilitate connections to a WebSocket server running a specific protocol. Normal Javascript WebSockets created via `new WebSocket(url)` allow the sending and receiving of raw data packets. This WebSockets client works on top of that and assumes that the server understands a protocol based on messages, where each message has a name, an optional payload, and an optional receiver. Such as server is e.g. implemented in java here: [Java WebSockets](https://github.com/nils-drechsel/java-websockets).
Messages are sent using a delimiter between the name, followed by the receiver, followed by the payload




## Install

```bash
npm install react-use-websockets
```

## Usage

In order to utilise the useWebSocket hook, a context has to be created:

```js
import React from 'react';
import { WebSocketProvider } from "react-use-websockets";

export const Index: FunctionComponent = () => {

    return(
        <WebSocketProvider
            url="wss://websocketserver:1234"
            delimiter="\t"
            logging={true}
        >
            <App />
        </WebSocketProvider>
    )

}
```

Now, the hook can be used in child components:

```js
import React, {useEffect} from 'react';
import { useWebSocket } from "react-use-websockets";

export const Component: FunctionComponent = () => {

    const {listen, send, isConnected, connectivity, setDefaultCallback}  = useWebSocket();

    useEffect(() => {

        const unsubscribeListener = listen("SOME_MESSAGE_NAME", (payload: any, fromSid? string) => {
            console.log("I have received this payload:",payload,"from this client:",fromSid);

            send("SOME_MESSAGE_WAS_RECEIVED", "some kind of payload");
        })

        setDefaultCallback((message: string, payload: any, _fromSid?: string | null) => {
            console.log("I have received a message to which no listener exist:", message);
        })        

        const unsubscribeConnectivityListener = connectivity((isOnline: boolean) => {
            console.log("My connectivity state has changed. I'm now online?", isOnline);
        });


        return () => {
            unsubscribeListener();
            unsubscribeConnectivityListener();
        }

    }, []);


    if (!isConnected) return null; // wait until we are connected

    return (
        ....
    );


}
```

