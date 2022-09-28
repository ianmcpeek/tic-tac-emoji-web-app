
// add way to immediately abort animation
function animateDuration(duration, fnOngoing, fnEnded) {
    let start, previousTimeStamp;
    let done = false;
  
    const step = (timestamp) => {
      if (start === undefined) {
        start = timestamp;
      }
      const elapsed = timestamp - start;
      if (previousTimeStamp !== timestamp) {
        fnOngoing(elapsed / duration);
      }
  
      if (elapsed < duration) {
        previousTimeStamp = timestamp;
      } else {
        done = true;
      }
  
      if(done) {
        fnEnded();
      } else {
        window.requestAnimationFrame(step);
      }
    };
  
    return () => {
      window.requestAnimationFrame(step);
    }
  
  }

  // https://easings.net/
  const EasingFunctions = {
    easeInCubic: (x) => x * x * x,
    easeInQuad: (x) => x * x * x,
    easeOutBack: (x) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
  }

  export {
    animateDuration,
    EasingFunctions
  }