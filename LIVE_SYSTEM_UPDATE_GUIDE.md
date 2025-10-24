# 🚀 Live System Update Guide

## **Step-by-Step Instructions to Update the Live Server**

### **Phase 1: Connect to Your Server**
```bash
# SSH into your server (replace with your actual server details)
ssh conf@your-server-ip
# or
ssh conf@conference.health.go.ug
```

### **Phase 2: Navigate to Project Directory**
```bash
cd /var/www/ndc-frontend
```

### **Phase 3: Pull Latest Changes**
```bash
# Pull all the latest fixes from the repository
git pull origin main
```

### **Phase 4: Fix Database Schema (CRITICAL)**
```bash
# Fix the status column first
mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; ALTER TABLE registrations MODIFY COLUMN status ENUM('pending','approved','rejected') DEFAULT 'pending';"

# Add missing columns (run these one by one)
mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; ALTER TABLE registrations ADD COLUMN organization VARCHAR(255) AFTER position;" 2>/dev/null || echo "Column organization already exists"

mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; ALTER TABLE registrations ADD COLUMN country VARCHAR(100) AFTER city;" 2>/dev/null || echo "Column country already exists"

mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; ALTER TABLE registrations ADD COLUMN city VARCHAR(100) AFTER position;" 2>/dev/null || echo "Column city already exists"
```

### **Phase 5: Verify Database Schema**
```bash
# Check that all columns exist
mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; DESCRIBE registrations;"
```

**Expected output should show:**
- `organization` column
- `country` column  
- `city` column
- `status` as `enum('pending','approved','rejected')`

### **Phase 6: Test Database Connection**
```bash
# Test the database connection
node test_db_connection.js
```

### **Phase 7: Fix File Permissions**
```bash
# Ensure upload directories have proper permissions
sudo chown -R conf:conf /var/www/ndc-frontend/uploads/
sudo chmod -R 755 /var/www/ndc-frontend/uploads/
```

### **Phase 8: Restart Application**
```bash
# Restart PM2 to pick up all changes
pm2 restart ndc-frontend

# Check PM2 status
pm2 status
```

### **Phase 9: Test Complete System**
```bash
# Run comprehensive system test
node test_registration_api.js
```

### **Phase 10: Verify Everything Works**
1. **Test Registration Form:**
   - Go to `https://conference.health.go.ug/register`
   - Fill out the form with test data
   - Upload test files (small PDF and JPG)
   - Submit the form
   - Should see success message (no more "Could not connect to server")

2. **Test Admin Panel:**
   - Go to `https://conference.health.go.ug/admin/registrations`
   - Check if new registration appears
   - Test passport photo download
   - Test payment proof download

## **🔧 Troubleshooting Commands**

### **If Database Issues Persist:**
```bash
# Check MySQL status
sudo systemctl status mysql

# Check database connection
mysql -h 127.0.0.1 -u user -ptoor -e "SELECT 1;"
```

### **If Application Issues Persist:**
```bash
# Check PM2 logs
pm2 logs ndc-frontend --lines 50

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

### **If File Upload Issues Persist:**
```bash
# Check upload directories
ls -la /var/www/ndc-frontend/uploads/
ls -la /var/www/ndc-frontend/uploads/payment-proofs/
ls -la /var/www/ndc-frontend/uploads/passport-photos/

# Fix permissions
sudo chown -R conf:conf /var/www/ndc-frontend/uploads/
sudo chmod -R 755 /var/www/ndc-frontend/uploads/
```

## **📋 Expected Results After Update**

✅ **Registration form submissions work without errors**
✅ **No more "Could not connect to server" messages**
✅ **File uploads work properly (payment proof + passport photo)**
✅ **Admin panel shows new registrations**
✅ **Passport photo downloads work**
✅ **Payment proof downloads work**
✅ **Database saves all registration data correctly**

## **🚨 Emergency Rollback (If Needed)**

If anything goes wrong:
```bash
# Revert to previous version
git reset --hard HEAD~1

# Restart application
pm2 restart ndc-frontend
```

## **📞 Support Commands**

### **Full System Status Check:**
```bash
# Check all services
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql

# Check logs
pm2 logs ndc-frontend --lines 20
sudo tail -f /var/log/nginx/error.log
```

### **Database Verification:**
```bash
# Check table structure
mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; SHOW COLUMNS FROM registrations;"

# Check recent registrations
mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; SELECT COUNT(*) FROM registrations;"
```

---

**🎯 After completing all steps, the registration system should work perfectly!**

**Total estimated time: 10-15 minutes**
