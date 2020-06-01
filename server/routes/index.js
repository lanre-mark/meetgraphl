var router = require('express').Router(),
  useragent = require('express-useragent');

router.get('/hey', async (req, res, next) => {
  var source = req.headers['user-agent'];
  console.log(
    'x-appengine-citylatlong ',
    req.headers['x-appengine-citylatlong']
  );
  //
  console.log('x-appengine-user-ip ', req.headers['x-appengine-user-ip']);
  console.log('x-forwarded-for ', req.headers['x-forwarded-for']);
  console.log('x-real-ip ', req.headers['x-real-ip']);
  const ua = await useragent.parse(source);
  res.status(200).send(JSON.stringify(req.headers));
});

module.exports = router;
