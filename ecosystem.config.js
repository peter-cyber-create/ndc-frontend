module.exports = {
  apps: [
    {
      name: 'ndc-conference',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/ndc/ndc-frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/ndc-conference-error.log',
      out_file: '/var/log/pm2/ndc-conference-out.log',
      log_file: '/var/log/pm2/ndc-conference.log',
      time: true
    }
  ]
};