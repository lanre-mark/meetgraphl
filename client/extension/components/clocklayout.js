import React from 'react';
import PropTypes from 'prop-types';

function animateClockTicks({ smallTick, largeTick }, showSmallTicks) {
  const clockTicks = [];
  for (let ii = 0; ii < 60; ii++) {
    let style = Object.assign({}, ii % 5 === 0 ? largeTick : smallTick, {
      transform: `translateX(-50%) translateY(-100%) rotate(${ii * 6}deg)`,
    });
    if (ii % 5 !== 0 && !showSmallTicks) continue;
    clockTicks.push(<span key={ii} style={style} />);
  }
  return clockTicks;
}

export default function ClockLayout({
  hour,
  minutes,
  seconds,
  styles,
  showSmallTicks,
}) {
  const secondHandStyle = Object.assign({}, styles.second, {
    transform: `translateX(-50%) translateY(-100%) rotate(${seconds * 6 +
      1}deg)`,
  });
  const minuteHandStyle = Object.assign({}, styles.minute, {
    transform: `translateX(-50%) translateY(-100%) rotate(${minutes * 6 +
      1}deg)`,
  });
  const hourHandStyle = Object.assign({}, styles.hour, {
    transform: `translateX(-50%) translateY(-100%) rotate(${hour * 30 +
      1.5}deg)`,
  });
  return (
    <div style={styles.base}>
      <div data-time-id='seconds' style={secondHandStyle}></div>
      <div data-time-id='minutes' style={minuteHandStyle}></div>
      <div data-time-id='hour' style={hourHandStyle}></div>
      <div style={styles.center}></div>
      {animateClockTicks(styles, showSmallTicks)}
    </div>
  );
}

ClockLayout.propTypes = {
  hour: PropTypes.number.isRequired,
  minutes: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  styles: PropTypes.shape({
    second: PropTypes.object.isRequired,
    minute: PropTypes.object.isRequired,
    hour: PropTypes.object.isRequired,
  }).isRequired,
  showSmallTicks: PropTypes.bool.isRequired,
};
