
import { useState, useRef, useEffect } from 'react';

// optionally pass in URL
function useWebsocket() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const ws = useRef(null);

    useEffect(() => {
        // local config
        // const socket = new WebSocket('ws://ec2-52-11-88-27.us-west-2.compute.amazonaws.com:8080');
        const socket = new WebSocket('ws://localhost:3000');

                
        socket.onopen = () => setOpen(true);
        socket.onclose = () => setOpen(false);
        socket.onmessage = (message) => {
            let json = null;
            try {
                json = JSON.parse(message.data);
            } catch (e) {
                console.log('invalid JSON: ', message.data);
                return;
            }
            setMessage(json);
        };

        ws.current = socket;

        return () => {
            socket.close();
        };
    }, []);

    return [open, message, ws.current?.send.bind(ws.current)];
}

export default useWebsocket;