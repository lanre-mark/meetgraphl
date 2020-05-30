import React from 'react';
import DisplayClock, { Themes } from './components/index';

const WIDTH = 125;

const customTheme = {
  background: 'transparent',
  border: 'transparent',
  center: 'transparent',
  seconds: '#000',
  minutes: '#000',
  hour: '#000',
  tick: '#000',
  smallTickWidth: 1,
  largeTickWidth: 1,
  secondHandWidth: 1,
  minuteHandWidth: 1,
  hourHandWidth: 1,
};

const App = () => {
  return (
    <div>
      <span>
        <DisplayClock
          width={WIDTH}
          theme={Themes.darkPreset}
          timezone={{ label: 'London', value: 'Europe/London' }}
        />
      </span>
      <span>
        <DisplayClock
          width={WIDTH}
          theme={Themes.aquaPreset}
          timezone={{ label: 'London', value: 'Europe/London' }}
        />
      </span>
      <span>
        <DisplayClock
          width={WIDTH}
          theme={Themes.sherbertPreset}
          timezone={{ label: 'London', value: 'Europe/London' }}
        />
      </span>
      <span>
        <DisplayClock
          width={WIDTH}
          theme={Themes.navyPreset}
          timezone={{ label: 'London', value: 'Europe/London' }}
        />
      </span>
      <span>
        <DisplayClock
          width={WIDTH}
          theme={customTheme}
          timezone={{ label: 'London', value: 'Europe/London' }}
        />
      </span>
      <span>
        <DisplayClock
          timezone={{ label: 'London', value: 'Europe/London' }}
          width={WIDTH}
          theme={Themes.limePreset}
        ></DisplayClock>
      </span>
    </div>
  );
};

export default App;
