// Refresh the page synchronously when the react next js file changes
module.exports = {
    webpack: (config) => {
      config.watchOptions.poll = 300;
      return config;
    },
};