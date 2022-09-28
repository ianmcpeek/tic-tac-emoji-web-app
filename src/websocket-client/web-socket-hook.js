
import { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

// optionally pass in URL
function useWebsocket() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const ws = useRef(null);

    useEffect(() => {
        // local config
        const socket = io();
        socket.on('connect', () => {
            console.log('I connected!');
            setOpen(true);
        });
        socket.on('message', message => {
            setMessage(message);
        });

        ws.current = socket;

        return () => {
            socket.close();
        };
    }, []);

    return [open, message, ws.current?.send.bind(ws.current)];
}

export default useWebsocket;