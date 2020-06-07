const router = require('express').Router(),
  requestIp = require('request-ip'),
  userparser = require('ua-parser-js'),
  { resolveip } = require('../utility');

const models = require('../models');
const controller = require('../controllers')(models);

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

  const deviceinfo1 = userparser(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'
  );
  const deviceinfo2 = userparser(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.2 (KHTML, like Gecko) Ubuntu/11.10 Chromium/15.0.874.106 Chrome/15.0.874.106 Safari/535.2'
  );
  const deviceinfo3 = userparser(
    'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.11 (KHTML, like Gecko) Version/7.1.0.7 Safari/534.11'
  );

  console.log(controller.parseDeviceInfo(deviceinfo1));
  console.log(controller.parseDeviceInfo(deviceinfo2));
  console.log(controller.parseDeviceInfo(deviceinfo3));

  // console.log(ths);
  //   ,
  //   clientIp,
  //   await resolveip(clientIp),
  //   await useragent.parse(req.headers['user-agent'])
  // );

  res.status(200).send(JSON.stringify(req.headers));
});

module.exports = router;
