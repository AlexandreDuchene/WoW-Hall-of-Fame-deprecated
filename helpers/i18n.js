const I18N = require('@ladjs/i18n');

const config = require('../config');

const i18n = new I18N({
  ...config.i18n
});

module.exports = i18n;
