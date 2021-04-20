module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    instances: "max",
    args: "['--prod']",
    env: {
      NODE_ENV: "production",
    }
  }]
};
