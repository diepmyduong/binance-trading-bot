var pjson = require('../package.json');
var config = require('config');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
    publicRuntimeConfig: {
        version: pjson.version,
        firebaseView: config.get('firebase.webConfig'),
        seo: {
            title: "MCOM",
            siteName: "mcom-app"
        }
    },
})