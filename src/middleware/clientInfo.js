const geoip = require("geoip-lite");
const requestIp = require("request-ip");

// Middleware to attach client info
function clientInfoMiddleware(req, res, next) {
  console.log('dfgsdgg')
  const ip = requestIp.getClientIp(req) || "";
  const geo = geoip.lookup(ip);
  console.log('here')

  // const locale = new Intl.Locale("und", { region: clientInfo.country });
  // const language = locale.maximize().language;
  // console.log("reuested language is: ", language)

  req.clientInfo = {
    ip,
    city: geo?.city || null,
    region: geo?.region || null,
    country: geo?.country || null,
    timezone: geo?.timezone || null,

    // latitude: geo?.ll ? geo.ll[0] : null,
    // longitude: geo?.ll ? geo.ll[1] : null,
    // metroCode: geo?.metro || null,
    // areaCode: geo?.area || null,
  };

  next();
}

// // Use the middleware globally
// app.use(requestIp.mw()); // optional, if you want request-ip mw
// app.use(clientInfoMiddleware);

// // Example route
// app.get('/location', (req, res) => {
//   res.json(req.clientInfo);
// });

module.exports = clientInfoMiddleware;
