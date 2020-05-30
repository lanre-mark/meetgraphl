const validateSetting = (value, defaultValue) => {
  if (value === null || value === undefined) return defaultValue;
  return value;
};

const Base = {
  background: (s) => s.theme.background,
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: "100%",
  border: (s) => `${s.width / 20}px solid ${s.theme.border}`,
  height: (s) => s.width,
  position: "relative",
  width: (s) => s.width,
};

const Center = {
  background: (s) => s.theme.center,
  borderRadius: "100%",
  height: "12px",
  left: "50%",
  position: "absolute",
  top: "50%",
  transform: "translateX(-50%) translateY(-50%)",
  width: "12px",
};

const Hand = {
  left: "50%",
  position: "absolute",
  top: "50%",
  transformOrigin: "50% 100%",
};

const SecondHand = Object.assign({}, Hand, {
  background: (s) => s.theme.seconds,
  height: (s) => Math.floor(s.width * 0.425),
  width: (s) => validateSetting(s.theme.secondHandWidth, 3),
});

const MinuteHand = Object.assign({}, Hand, {
  background: (s) => s.theme.minutes,
  height: (s) => Math.floor(s.width * 0.35),
  width: (s) => validateSetting(s.theme.minuteHandWidth, 6),
});

const HourHand = Object.assign({}, Hand, {
  background: (s) => s.theme.hour,
  height: (s) => Math.floor(s.width * 0.2),
  width: (s) => validateSetting(s.theme.hourHandWidth, 8),
});

const SmallTick = {
  background: (s) => s.theme.tick,
  height: 6,
  left: "50%",
  position: "absolute",
  top: 6,
  transformOrigin: (s) => `0 ${Math.ceil(s.width / 2)}px`,
  width: (s) => validateSetting(s.theme.smallTickWidth, 2),
};

const LargeTick = {
  background: (s) => s.theme.tick,
  height: 10,
  left: (s) => Math.ceil(s.width / 2) + 2,
  position: "absolute",
  top: 10,
  transformOrigin: (s) => `0 ${Math.ceil(s.width / 2)}px`,
  width: (s) => validateSetting(s.theme.largeTickWidth, 4),
};

export default {
  base: Base,
  center: Center,
  second: SecondHand,
  minute: MinuteHand,
  hour: HourHand,
  smallTick: SmallTick,
  largeTick: LargeTick,
};
