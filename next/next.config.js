const dotenv = require("dotenv");
dotenv.config();
console.log('process.env.FIREBASE_VIEW', process.env.FIREBASE_VIEW);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
    publicRuntimeConfig: {
        firebaseView: process.env.FIREBASE_VIEW,
        version: "0.1.0"
    },
})