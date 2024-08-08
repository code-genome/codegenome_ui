import { defineConfig } from "cypress";
const webpackConfig = require('./webpack.config.js');

export default defineConfig({
  chromeWebSecurity: false,
  video: false,
  defaultCommandTimeout: 25000,
  responseTimeout: 30000,
  screenshotOnRunFailure: false,
  viewportWidth: 1728,
  viewportHeight: 1117,
  fileServerFolder: '',
  retries: 2,
  env: {
    experimentalStudio: true,
    codeCoverage: {
      url: '/api/__coverage__',
      exclude: 'cypress/**/*.*'
    },
  },
  component: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig: webpackConfig[3]
    },
  },
});
