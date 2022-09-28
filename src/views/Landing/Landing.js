import React, { useEffect, useMemo, useState } from 'react';
import allowedEmoji from '../../allowed-emoji';
import { animateDuration } from '../../utils/animate';
import '../invite/Invite.css';

// https://thenable.io/building-a-use-socket-hook-in-react

  function Landing() {
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

    return (
        <div className='invite'>
            <h1>Tic-Tac-Emote</h1>
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
            <span className='footer-label'>tic-tac-toe with emoticons</span>
                <button className="ready-button">
                    <span>play Now</span>
                </button>
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

  export default Landing;