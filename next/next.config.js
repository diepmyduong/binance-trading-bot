const dotenv = require("dotenv");
dotenv.config();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
    publicRuntimeConfig: {
        firebaseView: process.env.FIREBASE_VIEW,
        version: "0.1.0"
    },
})