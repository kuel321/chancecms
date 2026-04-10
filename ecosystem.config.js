module.exports = {
  apps: [
    {
      name: 'chancecms',
      script: 'npm',
      args: 'start',
      cwd: '/opt/services/clients/chasingachance/chancecms',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
}
