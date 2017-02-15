const homeworks = require('./routers/homeworks');
const papers = require('./routers/papers');
const sections = require('./routers/sections')

module.exports = (app) => {
  app.use('/homeworks', homeworks);
  app.use('/sections', sections);
  app.use('/papers',papers);
}