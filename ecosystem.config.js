module.exports = {
  apps: [
    {
      name: 'ndc-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/ndc-frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Add any other env variables you need here, for example:
        DB_HOST: 'localhost',
        DB_USER: 'user',
        DB_PASSWORD: 'toor',
        DB_NAME: 'conf',
        NEXT_PUBLIC_API_URL: '172.27.0.9',
        NEXT_PUBLIC_SITE_URL: '172.27.0.9',
        NEXT_PUBLIC_ENVIRONMENT: 'production',
        NEXT_PUBLIC_HOST: '172.27.0.9',
        SMTP_HOST: 'smtp.umcs.go.ug',
        SMTP_PORT: 587,
        SMTP_USER: 'moh.conference@health.go.ug',
        SMTP_PASSWORD: 'Ministry@2025',
        SMTP_FROM_NAME: 'Conference 2025'
      }
      // Optional: uncomment if you want to run multiple instances
      // instances: 1,
      // exec_mode: 'fork',
      // watch: false,
    }
  ]
}
