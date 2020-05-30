import { useState, useEffect } from 'react';
import moment from 'moment-timezone';

const useClockTicker = (timezone) => {
  const [date, setDate] = useState(moment());

  useEffect(() => {
    const tickClock = () => {
      setDate(moment().tz(timezone.value));
    };

    let clockTickerId = setInterval(() => tickClock(), 1000);
    return () => clearInterval(clockTickerId);
  }, [timezone]);

  return date;
};

export default useClockTicker;
