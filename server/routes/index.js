const router = require('express').Router(),
  useragent = require('express-useragent'),
  requestIp = require('request-ip'),
  { resolveip } = require('../utility');

router.get('/hey', async (req, res, next) => {
  const clientIp = requestIp.getClientIp(req);
  const rspcoordgeo = await resolveip(clientIp);
  console.log(rspcoordgeo);
  const ua = await useragent.parse(req.headers['user-agent']);
  // console.log(ua);
  res.status(200).send(JSON.stringify(req.headers));
});

module.exports = router;
