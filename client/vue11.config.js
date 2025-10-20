const env = require('./.env.js');

module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	devServer: {
		port: env.clientPort
	},
	pluginOptions: {
		i18n: {
		  locale: 'fr',
		  fallbackLocale: 'fr',
		  localeDir: 'locales',
		  enableInSFC: true
		}
	  }
}