import React, { useCallback, useEffect, useState, useRef } from "react";
// const ws = new WebSocket('ws://127.0.0.1:4501');
// can provide callback to call, or expose functions
function useWebsocketClient(fnOnMessage) {
    const [connection, setConnection] = useState(null);

    const ws = useRef(null);

    useEffect(() => {
        if (!window.WebSocket) {
            console.log('no web sockets supported');
            return;
        }

        
        ws.onopen = () => {
            console.log('connected to websocket');
        };
        ws.onerror = (error) => {};
        ws.onmessage = (message) => {
            let json = null;
            try {
                json = JSON.parse(message.data);
            } catch (e) {
                console.log('invalid JSON: ', message.data);
                return;
            }
            fnOnMessage(json);
        };

        setConnection(ws);

        return () => {
            ws.close();
        }
    }, []);
    
    return connection;
}

export default useWebsocketClient;