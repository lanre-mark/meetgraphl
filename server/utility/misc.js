/**
 * https://github.com/gouch/to-title-case/blob/master/to-title-case.js
 * https://daringfireball.net/2008/05/title_case
 */
String.prototype.toTitleCase = function() {
  'use strict';
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
  var alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/;
  var wordSeparators = /([ :–—-])/;

  return this.split(wordSeparators)
    .map(function(current, index, array) {
      if (
        /* Check for small words */
        current.search(smallWords) > -1 &&
        /* Skip first and last word */
        index !== 0 &&
        index !== array.length - 1 &&
        /* Ignore title end and subtitle start */
        array[index - 3] !== ':' &&
        array[index + 1] !== ':' &&
        /* Ignore small words that start a hyphenated phrase */
        (array[index + 1] !== '-' ||
          (array[index - 1] === '-' && array[index + 1] === '-'))
      ) {
        return current.toLowerCase();
      }

      /* Ignore intentional capitalization */
      if (current.substr(1).search(/[A-Z]|\../) > -1) {
        return current;
      }

      /* Ignore URLs */
      if (array[index + 1] === ':' && array[index + 2] !== '') {
        return current;
      }

      /* Capitalize the first letter */
      return current.replace(alphanumericPattern, function(match) {
        return match.toUpperCase();
      });
    })
    .join('');
};

/**
 * Returns a date <minutes> after the given <date>.
 * @param date
 * @param minutes
 */
const addMInutes = ({ date, minutes = 0 }) => {
  const newDate = new Date(date.valueOf());
  newDate.setTime(date.getTime() + minutes * 1000);
  return newDate;
};

const NextKeyInSequence = (currentKey) => {
  const keys = JSON.parse(process.env.WEATHER_API_KEY_OWM);
  return !currentKey
    ? keys[0]
    : (function(ky) {
        let ndx = keys.findIndex((k) => k === ky);
        return ndx < 0 || ndx + 1 > keys.length - 1 ? keys[0] : keys[ndx + 1];
      })(currentKey);
};

const generateApiKeysData = async (modelComponent) => {
  JSON.parse(process.env.WEATHER_API_KEY_OWM)
    .map((k) => {
      return [k, Math.round(Math.random() * 60 + 1, 0)];
    })
    .forEach(async (keyset, ndx) => {
      for (let ii = 1; ii <= keyset[1]; ii++) {
        await new modelComponent({
          apiKey: keyset[0],
        }).save();
      }
    });
};

const requireNextKey = async (modelComponent) => {
  return await modelComponent.nextAPIKey();
};

module.exports = {
  NextKeyInSequence,
  generateApiKeysData,
  requireNextKey,
};
