const chrome =
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
const firefox =
  'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20150101 Firefox/47.0 (Chrome)';
const safari =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7';

const userbrowsers = [chrome, firefox, safari];

const randomizeType = (rangeSize) => {
  return Number((Math.random() * (Math.floor(rangeSize) - 1)).toFixed(0));
};

const randomBrowserChoice = () => {
  return userbrowsers[randomizeType(userbrowsers.length)];
};

module.exports = {
  randomBrowserChoice,
  randomizeType,
};
