# Manual Server Deployment Guide

## Prerequisites
- Access to the server via SSH or direct console access
- Server IP: 172.27.0.9
- Username: root (or the correct username for your server)

## Step-by-Step Deployment

### 1. Connect to Server
```bash
# Try different connection methods:
ssh root@172.27.0.9
# OR if you have a different username:
ssh your_username@172.27.0.9
# OR if you have SSH key:
ssh -i /path/to/your/key root@172.27.0.9
```

### 2. Navigate to Project Directory
```bash
cd /var/www/ndc-frontend
# OR if the directory is different:
cd /var/www/ndc
```

### 3. Stop Current Application
```bash
pm2 stop all
pm2 delete all
pkill -f "node"
pkill -f "next"
```

### 4. Handle Git Conflicts and Pull Latest Changes
```bash
git stash
git pull origin main
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Fix Database Schema (Run these commands one by one)
```bash
# Add missing columns to contacts table
mysql -u user -p conf -e "ALTER TABLE contacts ADD COLUMN phone VARCHAR(20) AFTER email;"

# Add missing columns to sponsorships table
mysql -u user -p conf -e "ALTER TABLE sponsorships ADD COLUMN submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER payment_proof_url;"

# Add missing columns to abstracts table
mysql -u user -p conf -e "ALTER TABLE abstracts ADD COLUMN cross_cutting_themes TEXT AFTER subcategory;"
```

### 7. Build Application
```bash
npm run build
```

### 8. Start Application
```bash
pm2 start npm --name "ndc-frontend" -- run start
pm2 save
```

### 9. Verify Deployment
```bash
# Check PM2 status
pm2 status

# Test API endpoints
curl http://localhost:3000/api/admin/dashboard
curl http://localhost:3000/api/admin/registrations
curl http://localhost:3000/api/admin/abstracts
curl http://localhost:3000/api/admin/exhibitors
curl http://localhost:3000/api/admin/sponsorships
curl http://localhost:3000/api/admin/contacts
```

### 10. Check Application Logs
```bash
pm2 logs ndc-frontend --lines 20
```

## Troubleshooting

### If SSH Connection Fails:
1. Check if the server is running: `ping 172.27.0.9`
2. Try different username or port: `ssh -p 22 username@172.27.0.9`
3. Check if you have the correct SSH key or password

### If Database Commands Fail:
1. Check MySQL is running: `systemctl status mysql`
2. Try different user: `mysql -u root -p conf`
3. Check database exists: `mysql -u user -p -e "SHOW DATABASES;"`

### If Build Fails:
1. Check Node.js version: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### If Application Won't Start:
1. Check port 3000 is free: `lsof -i :3000`
2. Kill processes on port 3000: `sudo fuser -k 3000/tcp`
3. Check PM2 logs: `pm2 logs ndc-frontend`

## Expected Results

After successful deployment:
- ✅ All admin pages load data correctly
- ✅ All forms submit successfully
- ✅ Toast notifications work
- ✅ File downloads work properly
- ✅ Live site at https://conference.health.go.ug is fully functional

## Contact Information

If you need help with any step, please provide:
1. The exact error message you're seeing
2. Which step you're stuck on
3. The output of `pm2 status` and `pm2 logs ndc-frontend --lines 10`
