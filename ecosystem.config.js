module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    args: "['--prod']",
    env: {
      NODE_ENV: "production",
    }
  }]
};
