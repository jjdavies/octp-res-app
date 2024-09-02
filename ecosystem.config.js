module.exports = {
  apps: [
    {
      name: 'OCTP Local Run',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000', //running on port 3000
      watch: false,
    },
  ],
};
