var apiMaker = require('./lib/api');

module.exports = exports = {
  koastModule: apiMaker.makeKoastModule({
    useEnvelope: false
  })
};