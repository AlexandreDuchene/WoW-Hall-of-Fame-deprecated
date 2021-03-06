const path = require('path');

const Axe = require('axe');
const Boom = require('@hapi/boom');
const _ = require('lodash');
const consolidate = require('consolidate');
const manifestRev = require('manifest-rev');
const ms = require('ms');
const pino = require('pino');
const strength = require('strength');
const { Signale } = require('signale');
const { boolean } = require('boolean');

const pkg = require('../package');
const env = require('./env');
const meta = require('./meta');
const phrases = require('./phrases');
const polyfills = require('./polyfills');
const utilities = require('./utilities');

const config = {
  // package.json
  pkg,

  // server
  env: env.NODE_ENV,
  urls: {
    web: env.WEB_URL,
    api: env.API_URL
  },

  // app
  supportRequestMaxLength: env.SUPPORT_REQUEST_MAX_LENGTH,
  logger: {
    showStack: env.SHOW_STACK,
    showMeta: env.SHOW_META,
    name: env.APP_NAME,
    level: 'debug',
    capture: false,
    logger:
      env.NODE_ENV === 'production'
        ? pino({
            customLevels: {
              log: 30
            }
          })
        : new Signale()
  },
  livereload: {
    port: env.LIVERELOAD_PORT
  },
  appName: env.APP_NAME,
  appColor: env.APP_COLOR,
  twitter: env.TWITTER,
  i18n: {
    // see @ladjs/i18n for a list of defaults
    // <https://github.com/ladjs/i18n>
    // but for complete configuration reference please see:
    // <https://github.com/mashpie/i18n-node#list-of-all-configuration-options>
    phrases,
    directory: path.join(__dirname, '..', 'locales'),
    ignoredRedirectGlobs: ['/auth/**/*']
  },

  // <https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property>
  aws: {},

  // build directory
  buildBase: 'build',

  // templating
  views: {
    // root is required by `koa-views`
    root: path.join(__dirname, '..', 'app', 'views'),
    // These are options passed to `koa-views`
    // <https://github.com/queckezz/koa-views>
    // They are also used by the email job rendering
    options: {
      extension: 'pug',
      map: {},
      engineSource: consolidate
    },
    // A complete reference of options for Pug (default):
    // <https://pugjs.org/api/reference.html>
    locals: {
      // Even though pug deprecates this, we've added `pretty`
      // in `koa-views` package, so this option STILL works
      // <https://github.com/queckezz/koa-views/pull/111>
      pretty: true,
      cache: env.NODE_ENV !== 'development',
      // debug: env.NODE_ENV === 'development',
      // compileDebug: env.NODE_ENV === 'development',
      ...utilities,
      polyfills,
      filters: {}
    }
  },
  // store IP address
  // <https://github.com/ladjs/store-ip-address>
  storeIPAddress: {
    ip: 'ip',
    lastIps: 'last_ips'
  },

  // field name for a user's last locale
  // (this gets re-used by @ladjs/i18n; see below)
  lastLocaleField: 'last_locale'
};

// set build dir based off build base dir name
config.buildDir = path.join(__dirname, '..', config.buildBase);

// add lastLocale configuration path name to i18n
config.i18n.lastLocaleField = config.lastLocaleField;

// meta support for SEO
config.meta = meta(config);

// add i18n api to views
const logger = new Axe(config.logger);

// add manifest helper for rev-manifest.json support
config.manifest = path.join(config.buildDir, 'rev-manifest.json');
config.views.locals.manifest = manifestRev({
  prepend:
    env.AWS_CLOUDFRONT_DOMAIN && env.NODE_ENV === 'production'
      ? `//${env.AWS_CLOUDFRONT_DOMAIN}/`
      : '/',
  manifest: config.manifest
});

// add global `config` object to be used by views
config.views.locals.config = config;

module.exports = config;
