import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const clock = setInterval(() => setTime(s => s + 1), 1000);
    return () => clearInterval(clock);
  }, []);
  const min = String(Math.trunc(time/60)).padStart(2, '0');
  const sec = String(time % 60).padStart(2, '0');
  return <div className="timer">{min}:{sec}</div>;
};
export default Timer;