import { useState, useEffect } from 'react';

const AnimatedNumber = ({ value, decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 1500; // 1.5 seconds

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOut effect
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(easeProgress * value);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    if (value > 0) {
      window.requestAnimationFrame(step);
    } else {
      setDisplayValue(0);
    }
  }, [value]);

  return <>{displayValue.toFixed(decimals)}</>;
};

export default AnimatedNumber;
