import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useWebsocket from '../../websocket-client/web-socket-hook';
import './EmojiSelect.css';

const iconBank = [
    { id: 0, name: 'alien', icon: '👽', color: 'green' },
    { id: 1, name: 'oni', icon: '👹', color: 'red' },
    { id: 2, name: 'poo', icon: '💩', color: 'brown' },
    { id: 3, name: 'skull', icon: '💀', color: 'grey' },
    { id: 4, name: 'robot', icon: '🤖', color: 'grey' },
    { id: 5, name: 'pumpkin', icon: '🎃', color: 'orange' },
    { id: 6, name: 'hot', icon: '🥵', color: 'red' },
    { id: 7, name: 'cold', icon: '🥶', color: 'blue' },

    { id: 8, name: 'brain', icon: '🧠', color: 'pink' },
    { id: 9, name: 'heart', icon: '🫀', color: 'pink' },
    { id: 10, name: 'clown', icon: '🤡', color: 'red' },
    { id: 11, name: 'octopus', icon: '🐙', color: 'red' },
    { id: 12, name: 'Tyranno', icon: '🦖', color: 'green' },
    { id: 13, name: 'shrimp', icon: '🦐', color: 'red' },
    { id: 14, name: 'wizard', icon: '🧙‍♂️', color: 'blue' },
    { id: 15, name: 'dolphin', icon: '🐬', color: 'blue' },

    { id: 16, name: 'joker', icon: '🃏', color: 'purple' },
    { id: 17, name: 'crayon', icon: '🖍️', color: 'red' },
    { id: 18, name: 'megaphone', icon: '📣', color: 'gold' },
    { id: 19, name: 'scissors', icon: '✂️', color: 'red' },
    { id: 20, name: 'pen', icon: '✒️', color: 'grey' },
    { id: 21, name: 'pencil', icon: '✏️', color: 'orange' },
    { id: 22, name: 'tombstone', icon: '🪦', color: 'black' },
    { id: 23, name: 'teddybear', icon: '🧸', color: 'brown' },
    // '🏴‍☠️',
    // '🏁',
    // '🃏',
    // '📢',
    // '📣',
    // '✂️',
    // '📌',
    // '📍',
    // '🖊️',
    // '🖋️',
    // '✒️',
    // '🖌️',
    // '🖍️',
    // '🧮',
    // '📏',
    // '📐',
    // '🖇️',
    // '✏️',
    // '🔑',
    // '🗝️',
    // '🌡️',
    // '🧪',
    // '⚱️',
    // '🏺',
    // '🪦',
    // '🪄',
    // '🔮',
    // '🧱',
    // '🧽',
    // '🧸',
    // '🚗',
    // '🏍️',
    // '🏄‍♀️',
    // '⚽',
    // '🏀',
    // '🏈',
    // '⚾',
    // '🥎',
    // '🎾',
    // '🏐',
    // '🏉',
    // '🥏',
    // '🪃',
    // '🎱',
    // '🪀',
    // '🏓',
    // '🏸',
    // '🏒',
    // '🏑',
    // '🥍',
    // '🏏',
    // '⛳',
    // '🪁',
    // '🏹',
    // '🎣',
    // '🤿',
    // '🥊',
    // '🥋',
    // '🎽',
    // '🛹',
    // '🛼',
    // '🛷',
    // '⛸️',
    // '🐅',
    // '🥌',
    // '🎿',
  ];

function EmojiSelect({ lobbyState, fnOnAvatarChanged, fnOnReadyChanged }) {

    const [playerAvatar, setPlayerAvater] = useState(null);
    const [opponentAvatar, setOpponentAvatar] = useState(null);

    useEffect(() => {
        if (lobbyState) {
            const _playerAvatar = lobbyState.player.avatar === -1 ? null : iconBank[lobbyState.player.avatar];
            if (playerAvatar !== _playerAvatar) setPlayerAvater(_playerAvatar);
            const _opponentAvatar = lobbyState.opponent.avatar === -1 ? null : iconBank[lobbyState.opponent.avatar];
            if (opponentAvatar !== _opponentAvatar) setOpponentAvatar(_opponentAvatar);
        }
    }, [lobbyState, playerAvatar, opponentAvatar]);

    function getIcons() {
        return iconBank.map(emoji => {
            return (
                <span
                    style={{ backgroundColor: playerAvatar && playerAvatar === emoji ? playerAvatar.color : 'white' }}
                    className={'emoji-button' + (playerAvatar === emoji ? ' selected': '')}
                    key={emoji.id}
                    onClick={() => fnOnAvatarChanged(emoji)}>
                    {emoji.icon}
                </span>
            );
        });
    }

    return (
        !lobbyState ? null :
        <div className="emoji-select">
            <div className="versus">
                <div className="player" style={{ backgroundColor: playerAvatar ? playerAvatar.color : 'black'}}>
                    <div className='content'>
                        <span className="label">{playerAvatar ? playerAvatar.name : '???'}</span>
                        <span className="icon">{playerAvatar && playerAvatar.icon}</span>
                    </div>
                </div>
                <span className="vs-label">vs</span>
                <div className="player opponent" style={{ backgroundColor: opponentAvatar ? opponentAvatar.color : 'black'}}>
                    <div className='content'>
                        <span className="icon">{opponentAvatar && opponentAvatar.icon}</span>
                        <span className="label">{opponentAvatar ? opponentAvatar.name : '???'}</span>
                    </div>
                </div>
            </div>
            <div className="scorecard">
                <div className="score">
                    <label>win</label>
                    <span>{lobbyState.player.wins}</span>
                </div>
                <div className="score">
                    <label>tie</label>
                    <span>{lobbyState.ties}</span>
                </div>
                <div className="score">
                    <label>win</label>
                    <span>{lobbyState.opponent.wins}</span>
                </div>
            </div>
            <div className="instruction">
                choose your avatar
            </div>
            <div className="icon-bank">
                <div className='content'>
                    { getIcons() }
                </div>
            </div>
            <button className="ready-button" onClick={() => fnOnReadyChanged(!lobbyState.player.ready)}>
                <span className='checkbox'>{ lobbyState.player.ready ? '✔️' : null}</span><span>Ready</span>
            </button>
        </div>
    );
}

export default EmojiSelect;