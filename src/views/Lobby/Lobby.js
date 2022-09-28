import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWebsocket from '../../websocket-client/web-socket-hook';
import Board from '../board/Board';
import EmojiSelect from '../emoji-select/EmojiSelect';


function inviteState(initialState) {
    return {
        state: 'INVITE',
        roomCode: initialState.roomCode,
        playerId: initialState.participantId
    };
}

function invitedState(initialState) {
    return {
        state: 'INVITED',
        roomCode: initialState.roomCode,
        playerId: initialState.participantId
    }
}

function lobbyReadyState(playerId, roomCode, participants) {
    return {
        state: 'LOBBY',
        roomCode: roomCode,
        player: {
            id: playerId,
            avatar: -1,
            ready: false,
            wins: 0
        },
        opponent: {
            id: participants.filter(id => id !== playerId)[0],
            avatar: -1,
            ready: false,
            wins: 0
        },
        ties: 0
    }
}

function gameState(player, opponent, roomCode, ties, turnId) {
    return {
        state: 'GAME',
        roomCode,
        player,
        opponent,
        ties,
        turnId,
        board: [-1, -1, -1,
                -1, -1, -1,
                -1, -1, -1],
        ended: false,
        winner: -1,
        winningTiles: []
    }
}

// https://thenable.io/building-a-use-socket-hook-in-react


// parent container responsible for websocket connection
// updates internal state based on messages
// and renders sub-components
function Lobby() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [open, message, send] = useWebsocket();
    const [recentMessage, setRecentMessage] = useState(null);
    const [processedRecent, setProcessedRecent] = useState(false);
    const [lobbyState, setLobbyState] = useState(null);

    useEffect(() => {
        if (open) {
            if (message !== recentMessage) {
                setRecentMessage(message);
                setProcessedRecent(false);
            }
        }

    }, [open, message, recentMessage]);

    useEffect(() => {
        if (recentMessage !== null && !processedRecent) {
            processMessage(recentMessage);
            setProcessedRecent(true);
        }
    }, [recentMessage, send]);

    function processMessage(message) {
        console.log('processing message');
        console.log(message);
        if (message.type === 'join-room') {
            // update state
            if (id !== undefined) {
                setLobbyState(invitedState(message.data));
                send(JSON.stringify({
                    type: 'join-room',
                    code: id,
                    participantId: message.data.participantId
                }));
            } else {
                setLobbyState(inviteState(message.data));
            }
        } else if (message.type === 'lobby-created') {
            console.log('all players joined, moving to lobby');
            //   navigate('/select');
            setLobbyState(lobbyReadyState(lobbyState.playerId, message.roomCode, message.participants));
        } else if (message.type === 'ready-changed') {
            // update lobby state
            const state = { ...lobbyState };
            // ignore messages of this type that match player Id
            // client is already aware of those changes
            if (message.participantId !== state.player.id) {
                state.opponent.ready = message.ready;
                setLobbyState(state);
            }
        } else if (message.type === 'avatar-changed') {
            // update lobby state
            const state = { ...lobbyState };
            // ignore messages of this type that match player Id
            // client is already aware of those changes
            if (message.participantId !== state.player.id) {
                state.opponent.avatar = message.avatar;
                setLobbyState(state);
            }
        } else if (message.type === 'game-created') {
            const state = { ...lobbyState };
            console.log('previous game state');
            console.log(state);
            setLobbyState(
                gameState(
                    state.player,
                    state.opponent,
                    state.roomCode,
                    state.ties,
                    message.turnId
                )
            );
        } else if (message.type === 'make-move') {
            const state = { ...lobbyState };
            state.board = message.board;
            state.turnId = message.turnId;
            state.winningTiles = message.winningTiles;
            state.winner = message.winner;
            state.player.wins += message.winner === state.player.id ? 1 : 0;
            state.opponent.wins += message.winner === state.opponent.id ? 1 : 0;
            state.ties = message.ties;
            state.ended = message.ended;
            setLobbyState(
                state
            );
        } else if (message.type === 'game-reset') {
            console.log('game has been reset ');
            const state = { ...lobbyState };
            state.player.ready = false;
            state.opponent.ready = false;
            state.state = 'LOBBY';
            setLobbyState(state);
        }
    }

    function onReady(ready) {
        // immediately update own state and send message
        const state = { ...lobbyState };
        state.player.ready = ready;
        setLobbyState(state);
        // send
        send(JSON.stringify({
            type: 'ready-changed',
            code: state.roomCode,
            participantId: state.player.id,
            ready
        }));
    }

    function onAvatarChanged(avatar) {
        // immediately update own state and send message
        const state = { ...lobbyState };
        state.player.avatar = avatar.id;
        setLobbyState(state);
        // send

        send(JSON.stringify({
            type: 'avatar-changed',
            code: state.roomCode,
            participantId: state.player.id,
            avatar: avatar.id
        }));
    }

    function onTileClicked(position) {
        const state = { ...lobbyState };

        send(JSON.stringify({
            type: 'make-move',
            code: state.roomCode,
            participantId: state.player.id,
            position
        }));
    }

    function onPlayAgain() {
        const state = { ...lobbyState };

        send(JSON.stringify({
            type: 'game-reset',
            code: state.roomCode
        }))
    }

    return (
        <div className='lobby'>
            <h1>I am the lobby {lobbyState ? lobbyState.roomCode : null}</h1>
            <div>{lobbyState ? lobbyState.state : 'UNSET'}</div>
            <span>{(id !== undefined) ? `I was invited to room ${id}` : ''}</span>
            <div className='content'>
                {
                    (lobbyState && lobbyState.state === 'INVITE') ?
                        <div>Share this roomCode with a friend to play {lobbyState.roomCode}</div> : null
                }
                {
                    (lobbyState && lobbyState.state === 'INVITED') ?
                        <div>You've been invited to play {lobbyState.roomCode}</div> : null
                }
                {
                    (lobbyState && lobbyState.state === 'LOBBY') ?
                        <EmojiSelect lobbyState={lobbyState} fnOnAvatarChanged={onAvatarChanged} fnOnReadyChanged={onReady}></EmojiSelect> : null
                }
                {
                    (lobbyState && lobbyState.state === 'GAME') ?
                        <Board lobbyState={lobbyState} fnOnClickTile={onTileClicked} fnOnPlayAgain={onPlayAgain}></Board> : null
                }
            </div>
        </div>
    );
}

export default Lobby;