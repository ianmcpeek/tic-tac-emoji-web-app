import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animateDuration } from '../../utils/animate';
import allowedEmoji from '../../allowed-emoji';
import useWebsocket from '../../websocket-client/web-socket-hook';
import './Invite.css';

// https://thenable.io/building-a-use-socket-hook-in-react

  function Invite() {
    const { id } = useParams();
    const navigate = useNavigate();
    console.log('roomId is ', id);

    const [iconRows, setIconRows] = useState(() => {
        const generateRow = (length) => {
          const icons = [];
          for(let i = 0; i < length; i++) {
            icons.push(allowedEmoji[Math.floor(Math.random() * allowedEmoji.length)]);
          }
          return icons;
        }
        const rows = [];
        rows.push(generateRow(13));
        rows.push(generateRow(13));
        rows.push(generateRow(13));
        rows.push(generateRow(13));
        rows.push(generateRow(13));
        rows.push(generateRow(13));
        rows.push(generateRow(13));
        rows.push(generateRow(13));
    
        return rows;
    });

    // const [open, message, send] = useWebsocket();
    // const [recentMessage, setRecentMessage] = useState(null);
    // const [processedRecent, setProcessedRecent] = useState(false);

    // useEffect(() => {
    //   if (open) {
    //     if (message !== recentMessage) {
    //       setRecentMessage(message);
    //       setProcessedRecent(false);
    //     }
    //   }

    // }, [open, message, recentMessage]);

    // useEffect(() => {
    //   if (recentMessage !== null && !processedRecent) {
    //     processMessage(recentMessage);
    //     setProcessedRecent(true);
    //   }
    // }, [recentMessage, send]);

    // function processMessage(message) {
    //   console.log('message');
    //   console.log(message);
    //   if (message.type === 'join-room') {
    //       if (id !== undefined) {
    //         send(JSON.stringify({
    //           type: 'join-room',
    //           code: id,
    //           participantId: message.data.participantId
    //         }));
    //       }
    //       send(message.data)
    //   } else if (message.type === 'lobby-created') {
    //       console.log('all players joined, moving to lobby');
    //       navigate('/select');
    //   }
    // }

    return (
        <div className='invite'>
            <h1>Tic-Tac-Emoji</h1>
            <div className='scroller'>
              <Carousel availableEmoji={iconRows[0]}></Carousel>
              <Carousel availableEmoji={iconRows[1]}></Carousel>
              <Carousel availableEmoji={iconRows[2]}></Carousel>
              <Carousel availableEmoji={iconRows[3]}></Carousel>
              <Carousel availableEmoji={iconRows[4]}></Carousel>
              <Carousel availableEmoji={iconRows[5]}></Carousel>
              <Carousel availableEmoji={iconRows[6]}></Carousel>
              <Carousel availableEmoji={iconRows[7]}></Carousel>
            </div>
            <div className='footer'>
                <span className='footer-label'>share link to play</span>
                <input className='link' value={'tic-tac-toe-emoji.io/sda789q'} disabled />
                <button className='copy-button'>💾</button>
                <span className='copy-notification'>copied!</span>
            </div>
        </div>
    );
}

function Carousel({ availableEmoji }) {
    const [emojis, setEmojis] = useState(availableEmoji);
    const [style, setStyle] = useState({ transform: `translateX(0px)` });
    useEffect(() => {
      animateDuration(
        8000,
        (t) => {
          const newStyle = `translateX(${Math.min(t * 41, 41)}px)`;
          if (newStyle !== style.transform) setStyle({ transform: newStyle });
        },
        () => {
          setStyle({ transform: `translateX(0px)` });
          const emo = [...emojis];
          emo.unshift(emo.pop());
          setEmojis(emo);
        }
      )();
    }, [emojis]);
  
    const renderEmoji = useMemo(() => {
      return emojis.map((emoji, index) => {
        return (<span className='emoji-icon' key={emoji + index}>{emoji}</span>)
      })
    }, [emojis]);
    return (
      <div className='carosel'>
        <div className='bumper--left'></div>
        <div className='bumper--right'></div>
        <div className='content' style={style}>
          { renderEmoji }
        </div>
      </div>
    );
  }

  export default Invite;