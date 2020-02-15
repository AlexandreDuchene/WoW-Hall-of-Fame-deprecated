const Router = require('@koa/router');
const render = require('koa-views-render');

const config = require('../../config');
const { web } = require('../../app/controllers');

const router = new Router();

const localeRouter = new Router({ prefix: '/:locale' });

localeRouter
  .get('/', render('home'))
  .get('/404', render('404'))
  .get('/500', render('500'))
;

router.use(localeRouter.routes());

module.exports = router;
