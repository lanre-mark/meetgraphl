import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import ClockLayout from "./clocklayout";
import Styles from "../utility/styling";
import { cssTransform } from "../utility/helpers";
import { darkPreset } from "../theming/presets";
import useClockTicker from "./clockticker";

export const DisplayClock = ({ timezone, width, theme, showSmallTicks }) => {
  const date = useClockTicker(timezone);
  const [displayStyles, setDisplayStyles] = useState(
    cssTransform(Styles, { width, theme, showSmallTicks })
  );

  useEffect(() => {
    setDisplayStyles(cssTransform(Styles, { width, theme, showSmallTicks }));
    // eslint-disable-next-line
  }, [theme, width]);

  return (
    <ClockLayout
      {...{
        seconds: date.seconds(),
        minutes: date.minutes(),
        hour: date.hours() % 12,
      }}
      styles={displayStyles}
      showSmallTicks={showSmallTicks}
    />
  );
};

DisplayClock.propTypes = {
  theme: PropTypes.shape({
    background: PropTypes.string.isRequired,
    border: PropTypes.string.isRequired,
    center: PropTypes.string.isRequired,
    seconds: PropTypes.string.isRequired,
    minutes: PropTypes.string.isRequired,
    hour: PropTypes.string.isRequired,
    tick: PropTypes.string.isRequired,
  }),
  width: PropTypes.number,
  timezone: PropTypes.object,
  showSmallTicks: PropTypes.bool,
};

DisplayClock.defaultProps = {
  theme: darkPreset,
  showSmallTicks: true,
};
