module.exports = {
  apps: [{
    name: 'ndc-conference',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/ndc',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
