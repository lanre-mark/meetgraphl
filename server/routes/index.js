const router = require('express').Router(),
  requestIp = require('request-ip'),
  userparser = require('ua-parser-js'),
  { resolveip } = require('../utility');

const models = require('../models');
const controller = require('../controllers')(models);

const miscUtilities = require('../utility/misc');
// await miscUtilities.generateApiKeysData(models.WeatherKeyController);
// console.log('Completed faked data');
// const nxtApiKey = await miscUtilities.requireNextKey(
//   models.WeatherKeyController
// );
// console.log('Next data :: ', nxtApiKey);

const meet1 = [
  {
    instance: 'kId',
    name: 'Lanre Omomat',
    avatar:
      'https://lh4.googleusercontent.com/-tpn4s-0Q6XI/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnUERTERKULYXtOPbNQrielF4t3ZA/s192-c-mo/photo.jpg',
    isHost: false,
    isLocal: false,
    id: 'spaces/oq2_SosFiJUB/devices/ad3e3a78-1486-4fd0-bb3a-087c397eee8d',
  },
  {
    instance: 'XV',
    name: 'olanrewaju Mark',
    avatar:
      'https://lh3.googleusercontent.com/a-/AOh14Gjhby_af4Ml6LhVGn4dapmIWWU5IcASCBmFNOUr=s192-c-mo',
    isHost: false,
    isLocal: true,
    id: 'spaces/oq2_SosFiJUB/devices/ef8a1924-2a56-4aeb-bf2d-a1e146e92d1d',
  },
  {
    instance: 'kId',
    name: 'Fliptop Consulting',
    avatar:
      'https://lh3.googleusercontent.com/-BZpQh7biwzA/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclhNKHC8ceCkG8Yev6S7qGmvxHGxw/s192-c-mo/photo.jpg',
    isHost: false,
    isLocal: false,
    id: 'spaces/oq2_SosFiJUB/devices/9847dcf5-e337-4848-b37d-f98c8680fe23',
  },
];
const meet2 = [
  {
    instance: 'kId',
    name: 'Lanre Omomat',
    avatar:
      'https://lh4.googleusercontent.com/-tpn4s-0Q6XI/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnUERTERKULYXtOPbNQrielF4t3ZA/s192-c-mo/photo.jpg',
    isHost: false,
    isLocal: false,
    id: 'spaces/oq2_SosFiJUB/devices/ad3e3a78-1486-4fd0-bb3a-087c397eee8d',
  },
  {
    instance: 'XV',
    name: 'olanrewaju Mark',
    avatar:
      'https://lh3.googleusercontent.com/a-/AOh14Gjhby_af4Ml6LhVGn4dapmIWWU5IcASCBmFNOUr=s192-c-mo',
    isHost: false,
    isLocal: true,
    id: 'spaces/oq2_SosFiJUB/devices/ef8a1924-2a56-4aeb-bf2d-a1e146e92d1d',
  },
];
const meet3 = [
  {
    instance: 'kId',
    name: 'Lanre Omomat',
    avatar:
      'https://lh4.googleusercontent.com/-tpn4s-0Q6XI/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnUERTERKULYXtOPbNQrielF4t3ZA/s192-c-mo/photo.jpg',
    isHost: false,
    isLocal: false,
    id: 'spaces/oq2_SosFiJUB/devices/ad3e3a78-1486-4fd0-bb3a-087c397eee8d',
  },
  {
    instance: 'XV',
    name: 'olanrewaju Mark',
    avatar:
      'https://lh3.googleusercontent.com/a-/AOh14Gjhby_af4Ml6LhVGn4dapmIWWU5IcASCBmFNOUr=s192-c-mo',
    isHost: false,
    isLocal: true,
    id: 'spaces/oq2_SosFiJUB/devices/ef8a1924-2a56-4aeb-bf2d-a1e146e92d1d',
  },
  {
    instance: 'kId',
    name: 'Fliptop Consulting',
    avatar:
      'https://lh3.googleusercontent.com/-BZpQh7biwzA/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclhNKHC8ceCkG8Yev6S7qGmvxHGxw/s192-c-mo/photo.jpg',
    isHost: false,
    isLocal: false,
    id: 'spaces/oq2_SosFiJUB/devices/50b64b2b-9cab-4a24-90da-8b1ff17bb5ce',
  },
];
const meet4 = [
  {
    instance: 'kId',
    name: 'Lanre Omomat',
    avatar:
      'https://lh4.googleusercontent.com/-tpn4s-0Q6XI/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnUERTERKULYXtOPbNQrielF4t3ZA/s192-c-mo/photo.jpg',
    isHost: false,
    isLocal: false,
    id: 'spaces/oq2_SosFiJUB/devices/ad3e3a78-1486-4fd0-bb3a-087c397eee8d',
  },
  {
    instance: 'XV',
    name: 'olanrewaju Mark',
    avatar:
      'https://lh3.googleusercontent.com/a-/AOh14Gjhby_af4Ml6LhVGn4dapmIWWU5IcASCBmFNOUr=s192-c-mo',
    isHost: false,
    isLocal: true,
    id: 'spaces/oq2_SosFiJUB/devices/ef8a1924-2a56-4aeb-bf2d-a1e146e92d1d',
  },
  {
    instance: 'kId',
    name: 'Fliptop Consulting',
    avatar:
      'https://lh3.googleusercontent.com/-BZpQh7biwzA/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclhNKHC8ceCkG8Yev6S7qGmvxHGxw/s192-c-mo/photo.jpg',
    isHost: false,
    isLocal: false,
    id: 'spaces/oq2_SosFiJUB/devices/50b64b2b-9cab-4a24-90da-8b1ff17bb5ce',
  },
  {
    instance: 'kId',
    name: 'Oluwatosin Makinde',
    avatar:
      'https://lh5.googleusercontent.com/-BM8VM62lC5A/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmsGilLhCMvAUBwZ9wANmF7wN3U-Q/s192-c-mo/photo.jpg',
    isHost: false,
    isLocal: false,
    id: 'spaces/oq2_SosFiJUB/devices/e832d873-d0a5-427e-9f77-e3dd8f267b74',
  },
];
const meet5 = [
  {
    instance: 'XV',
    name: 'olanrewaju Mark',
    avatar:
      'https://lh3.googleusercontent.com/a-/AOh14Gjhby_af4Ml6LhVGn4dapmIWWU5IcASCBmFNOUr=s192-c-mo',
    isHost: false,
    isLocal: true,
    id: 'spaces/oq2_SosFiJUB/devices/ef8a1924-2a56-4aeb-bf2d-a1e146e92d1d',
  },
  {
    instance: 'kId',
    name: 'Fliptop Consulting',
    avatar:
      'https://lh3.googleusercontent.com/-BZpQh7biwzA/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclhNKHC8ceCkG8Yev6S7qGmvxHGxw/s192-c-mo/photo.jpg',
    isHost: false,
    isLocal: false,
    id: 'spaces/oq2_SosFiJUB/devices/50b64b2b-9cab-4a24-90da-8b1ff17bb5ce',
  },
  {
    instance: 'kId',
    name: 'Oluwatosin Makinde',
    avatar:
      'https://lh5.googleusercontent.com/-BM8VM62lC5A/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmsGilLhCMvAUBwZ9wANmF7wN3U-Q/s192-c-mo/photo.jpg',
    isHost: false,
    isLocal: false,
    id: 'spaces/oq2_SosFiJUB/devices/e832d873-d0a5-427e-9f77-e3dd8f267b74',
  },
];

router.get('/hey', async (req, res, next) => {
  // const clientIp = requestIp.getClientIp(req);
  // const rspcoordgeo = await resolveip(clientIp);
  // console.log(rspcoordgeo);
  // const ua = await useragent.parse(req.headers['user-agent']);
  // console.log(controller);

  // const ths = await controller.addConferenceInfo(meet4);

  // const nxtApiKey = await miscUtilities.requireNextKey(
  //   models.WeatherKeyController
  // );
  // console.log('Next data :: ', nxtApiKey);

  /* 
  cityName: 'Lagos',
  latitide: 6.4474,
  longitude: 3.3903,
  */

  /* 
  cityName: 'Los Angeles',
  latitide: 34.0531,
  longitude: -118.242,
  */

  /* 
  cityName: 'Newent',
  latitide: 51.9417,
  longitude: -2.4149,
  */

  // check all APIKEYs used
  // const nxtApiKey = await miscUtilities.requireNextKey(models.WeatherKeyController);
  // console.log('Next data :: ', nxtApiKey);

  // const weatherDetails = await miscUtilities.fetchWeatherDetails(
  //   await miscUtilities.requireNextKey(models.WeatherKeyController),
  //   34.0531,
  //   -118.242
  // );
  // console.log('weatherDetails :: ', weatherDetails);

  // // GeoData Searches
  // const weatherTestCheck = miscUtilities.weatherTestVerificationCallGeoCoordsForAPI();
  // const dataIndex = Math.round(Math.random() * weatherTestCheck.length - 1);
  // console.log(weatherTestCheck.length);
  // console.log(dataIndex);
  // console.log(weatherTestCheck[dataIndex]);
  // const weatherTestGeoCoordsData = await miscUtilities.queryCheck(models, [
  //   weatherTestCheck[dataIndex].longitude,
  //   weatherTestCheck[dataIndex].latitude,
  // ]);
  //{ latitude: 6.444016135322083, longitude: 3.486587581246014 }
  const checkGeoinWeather = await models.WeatherRepo.retrieveWeatherDetails(
    models.WeatherKeyController,
    6.444016135322083, //6.4331444433491285,
    3.486587581246014 //3.3477178950871185
  );
  console.log(checkGeoinWeather);
  // // GeoData Loader

  // const weatherTestGeoCoordsData = miscUtilities.weatherTestDataGeoCoordsForAPI();
  // for (let ii = 0; ii < weatherTestGeoCoordsData.length; ii++) {
  //   const weatherDetails = await miscUtilities.fetchWeatherDetails(
  //     models,
  //     await miscUtilities.requireNextKey(models.WeatherKeyController),
  //     weatherTestGeoCoordsData[ii].latitude,
  //     weatherTestGeoCoordsData[ii].longitude
  //   );
  //   await miscUtilities.asyncDelay(0.05);
  // }

  // console.log(weatherTestGeoCoordsData.length);

  // const ipadd1 = '105.112.55.239';

  // const ipadd = '105.112.55.239';
  // const myLocPayload = await models.IpLocation.ipAddressResolve(ipadd);
  // console.log(myLocPayload);

  // console.log(ths);
  // console.log(ths.participants[3].deviceinfo);

  // const deviceinfo1 = userparser(
  //   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'
  // );
  // const deviceinfo2 = userparser(
  //   'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.2 (KHTML, like Gecko) Ubuntu/11.10 Chromium/15.0.874.106 Chrome/15.0.874.106 Safari/535.2'
  // );
  // const deviceinfo3 = userparser(
  //   'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.11 (KHTML, like Gecko) Version/7.1.0.7 Safari/534.11'
  // );

  // console.log(controller.parseDeviceInfo(deviceinfo1));
  // console.log(controller.parseDeviceInfo(deviceinfo2));
  // console.log(controller.parseDeviceInfo(deviceinfo3));

  // console.log(ths);
  //   ,
  //   clientIp,
  //   await resolveip(clientIp),
  //   await useragent.parse(req.headers['user-agent'])
  // );

  res.status(200).send(JSON.stringify(req.headers));
});

module.exports = router;
