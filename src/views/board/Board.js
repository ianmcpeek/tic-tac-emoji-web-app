import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { animateDuration, EasingFunctions } from '../../utils/animate';
import './Board.css';

const iconBank = [
    { id: 0, name: 'alien', icon: '๐ฝ', color: 'green' },
    { id: 1, name: 'oni', icon: '๐น', color: 'red' },
    { id: 2, name: 'poo', icon: '๐ฉ', color: 'brown' },
    { id: 3, name: 'skull', icon: '๐', color: 'grey' },
    { id: 4, name: 'robot', icon: '๐ค', color: 'grey' },
    { id: 5, name: 'pumpkin', icon: '๐', color: 'orange' },
    { id: 6, name: 'hot', icon: '๐ฅต', color: 'red' },
    { id: 7, name: 'cold', icon: '๐ฅถ', color: 'blue' },

    { id: 8, name: 'brain', icon: '๐ง ', color: 'pink' },
    { id: 9, name: 'heart', icon: '๐ซ', color: 'pink' },
    { id: 10, name: 'clown', icon: '๐คก', color: 'red' },
    { id: 11, name: 'octopus', icon: '๐', color: 'red' },
    { id: 12, name: 'Tyranno', icon: '๐ฆ', color: 'green' },
    { id: 13, name: 'shrimp', icon: '๐ฆ', color: 'red' },
    { id: 14, name: 'wizard', icon: '๐งโโ๏ธ', color: 'blue' },
    { id: 15, name: 'dolphin', icon: '๐ฌ', color: 'blue' },

    { id: 16, name: 'joker', icon: '๐', color: 'purple' },
    { id: 17, name: 'crayon', icon: '๐๏ธ', color: 'red' },
    { id: 18, name: 'megaphone', icon: '๐ฃ', color: 'gold' },
    { id: 19, name: 'scissors', icon: 'โ๏ธ', color: 'red' },
    { id: 20, name: 'pen', icon: 'โ๏ธ', color: 'grey' },
    { id: 21, name: 'pencil', icon: 'โ๏ธ', color: 'orange' },
    { id: 22, name: 'tombstone', icon: '๐ชฆ', color: 'black' },
    { id: 23, name: 'teddybear', icon: '๐งธ', color: 'brown' },
    // '๐ดโโ ๏ธ',
    // '๐',
    // '๐',
    // '๐ข',
    // '๐ฃ',
    // 'โ๏ธ',
    // '๐',
    // '๐',
    // '๐๏ธ',
    // '๐๏ธ',
    // 'โ๏ธ',
    // '๐๏ธ',
    // '๐๏ธ',
    // '๐งฎ',
    // '๐',
    // '๐',
    // '๐๏ธ',
    // 'โ๏ธ',
    // '๐',
    // '๐๏ธ',
    // '๐ก๏ธ',
    // '๐งช',
    // 'โฑ๏ธ',
    // '๐บ',
    // '๐ชฆ',
    // '๐ช',
    // '๐ฎ',
    // '๐งฑ',
    // '๐งฝ',
    // '๐งธ',
    // '๐',
    // '๐๏ธ',
    // '๐โโ๏ธ',
    // 'โฝ',
    // '๐',
    // '๐',
    // 'โพ',
    // '๐ฅ',
    // '๐พ',
    // '๐',
    // '๐',
    // '๐ฅ',
    // '๐ช',
    // '๐ฑ',
    // '๐ช',
    // '๐',
    // '๐ธ',
    // '๐',
    // '๐',
    // '๐ฅ',
    // '๐',
    // 'โณ',
    // '๐ช',
    // '๐น',
    // '๐ฃ',
    // '๐คฟ',
    // '๐ฅ',
    // '๐ฅ',
    // '๐ฝ',
    // '๐น',
    // '๐ผ',
    // '๐ท',
    // 'โธ๏ธ',
    // '๐',
    // '๐ฅ',
    // '๐ฟ',
  ];

function Board({ lobbyState, fnOnClickTile, fnOnPlayAgain }) {
    const[count, setCount] = useState(0);

    // extract for animateSway hook
    const [style, setStyle] = useState({ transform: `rotate(0)` });
    useEffect(() => {
      animateDuration(
        2000,
        (t) => {
            // Break down animation
            // sway left -> slow - fast
            // sway back to center -> fast - slow
            if (t < 0.5) {
                // diff zero is apex of curve
                // sway should enter/exit slow
                // normalize result to percent
                let diff = Math.abs(0.25 - t) * 4;
                diff = EasingFunctions.easeInQuad(diff);
                const newStyle = `rotate(-${40 * (1-diff)}deg)`;
                setStyle({transform: newStyle});
            } else {
                // sway right -> slow - fast
                // sway back to center -> fast - slow
                let diff = Math.abs(0.75 - t) * 4;
                diff = EasingFunctions.easeInQuad(diff);
                const newStyle = `rotate(${40 * (1-diff)}deg)`;
                setStyle({transform: newStyle});

            }
        },
        () => {
          setStyle({ transform: `rotate(0)` });
          setCount(count + 1);
        }
      )();
    }, [count]);


    function clickTile(position) {
        // dont do anything if not currently players turn
        if (!lobbyState.ended && lobbyState.turnId === lobbyState.player.id && lobbyState.board[position] === -1) fnOnClickTile(position);
    }

    function getTile(position) {
        return lobbyState.board[position] === -1 ? null : (
            lobbyState.board[position] === lobbyState.player.id ? <div style={(lobbyState.winningTiles.includes(position) ? style : {})}>{iconBank[lobbyState.player.avatar].icon}</div> : <div style={(lobbyState.winningTiles.includes(position) ? style : {})}>{iconBank[lobbyState.opponent.avatar].icon}</div>
        );
    };

    function getBanner() {
        if (lobbyState.ended) {
            if (lobbyState.winner != null && (lobbyState.winner === lobbyState.player.id || lobbyState.winner === lobbyState.opponent.id)) {
                return <div className="turn-label" style={{ backgroundColor: lobbyState.winner=== lobbyState.player.id ? iconBank[lobbyState.player.avatar].color : iconBank[lobbyState.opponent.avatar].color}}>
                    {lobbyState.winner=== lobbyState.player.id ? iconBank[lobbyState.player.avatar].icon : iconBank[lobbyState.opponent.avatar].icon} winner
                </div>;
            } else {
                return <div className="turn-label" style={{ backgroundColor: 'black' }}>
                    no winner
                </div>;
            }
        } else {
            return <div className="turn-label" style={{ backgroundColor: lobbyState.turnId === lobbyState.player.id ? iconBank[lobbyState.player.avatar].color : iconBank[lobbyState.opponent.avatar].color}}>
                {lobbyState.turnId === lobbyState.player.id ? iconBank[lobbyState.player.avatar].icon : iconBank[lobbyState.opponent.avatar].icon}'s Turn
            </div>;
        }
    }

    return (
        !lobbyState ? null :
        <div className="emoji-select">
            <div className="versus">
                <div className="player" style={{ backgroundColor: lobbyState.player ? iconBank[lobbyState.player.avatar].color : 'black'}}>
                    <div className='content'>
                        <span className="label">{lobbyState.player ? iconBank[lobbyState.player.avatar].name : '???'}</span>
                        <span className="icon">{lobbyState.player && iconBank[lobbyState.player.avatar].icon}</span>
                    </div>
                </div>
                <span className="vs-label">vs</span>
                <div className="player opponent" style={{ backgroundColor: lobbyState.opponent ? iconBank[lobbyState.opponent.avatar].color : 'black'}}>
                    <div className='content'>
                        <span className="label">{lobbyState.opponent ? iconBank[lobbyState.opponent.avatar].name : '???'}</span>
                        <span className="icon">{lobbyState.opponent && iconBank[lobbyState.opponent.avatar].icon}</span>
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
            { getBanner() }
            <div className="board">
                <div className='content'>
                    <span className='tile' onClick={() => { clickTile(0)}}>{getTile(0)}</span>
                    <span className='tile' onClick={() => { clickTile(1)}}>{getTile(1)}</span>
                    <span className='tile' onClick={() => { clickTile(2)}}>{getTile(2)}</span>
                    <span className='tile' onClick={() => { clickTile(3)}}>{getTile(3)}</span>
                    <span className='tile' onClick={() => { clickTile(4)}}>{getTile(4)}</span>
                    <span className='tile' onClick={() => { clickTile(5)}}>{getTile(5)}</span>
                    <span className='tile' onClick={() => { clickTile(6)}}>{getTile(6)}</span>
                    <span className='tile' onClick={() => { clickTile(7)}}>{getTile(7)}</span>
                    <span className='tile' onClick={() => { clickTile(8)}}>{getTile(8)}</span>
                </div>
            </div>
            { (!lobbyState.ended) ?
                null :
                <button className="ready-button" onClick={fnOnPlayAgain}>
                    <span>play again?</span>
                </button>
            }
            
        </div>
    );
}

export default Board;