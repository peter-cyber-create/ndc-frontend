# 🚀 Registration System Deployment Guide

## **Step-by-Step Server Deployment Instructions**

### **Phase 1: Pull Latest Changes**
```bash
cd /var/www/ndc-frontend
git pull origin main
```

### **Phase 2: Fix Database Schema**
```bash
# Connect to MySQL and run the schema fix
mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; SOURCE /var/www/ndc-frontend/database/fix_registration_schema.sql;"
```

**Alternative method if the above doesn't work:**
```bash
mysql -h 127.0.0.1 -u user -ptoor conf < /var/www/ndc-frontend/database/fix_registration_schema.sql
```

### **Phase 3: Verify Database Schema**
```bash
mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; DESCRIBE registrations;"
```

**Expected output should include:**
- `organization` column
- `country` column  
- `city` column
- `status` as ENUM('pending','approved','rejected')

### **Phase 4: Test Database Connection**
```bash
cd /var/www/ndc-frontend
node test_db_connection.js
```

### **Phase 5: Test Registration API**
```bash
cd /var/www/ndc-frontend
node test_registration_api.js
```

### **Phase 6: Restart Application**
```bash
# Restart PM2 to pick up new changes
pm2 restart ndc-frontend

# Check PM2 status
pm2 status

# Check logs for any errors
pm2 logs ndc-frontend --lines 20
```

### **Phase 7: Test File Uploads**
```bash
# Test if upload directories exist and have proper permissions
ls -la /var/www/ndc-frontend/uploads/
ls -la /var/www/ndc-frontend/uploads/payment-proofs/
ls -la /var/www/ndc-frontend/uploads/passport-photos/

# Fix permissions if needed
sudo chown -R conf:conf /var/www/ndc-frontend/uploads/
sudo chmod -R 755 /var/www/ndc-frontend/uploads/
```

### **Phase 8: Test Registration Form**
1. **Open browser:** `https://conference.health.go.ug/register`
2. **Fill out the form** with test data
3. **Upload test files** (small PDF and JPG)
4. **Submit the form**
5. **Check for success message**

### **Phase 9: Verify Admin Panel**
1. **Open admin panel:** `https://conference.health.go.ug/admin/registrations`
2. **Check if new registration appears**
3. **Test passport photo download**
4. **Test payment proof download**

## **🔧 Troubleshooting Commands**

### **Check Application Status**
```bash
pm2 status
pm2 logs ndc-frontend --lines 50
```

### **Check Nginx Status**
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### **Check Database Connection**
```bash
mysql -h 127.0.0.1 -u user -ptoor -e "SELECT 1;"
```

### **Test API Endpoints**
```bash
# Test registration API
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: multipart/form-data" \
  -F "firstName=Test" \
  -F "lastName=User" \
  -F "email=test@example.com" \
  -F "phone=+256123456789" \
  -F "institution=Test Org" \
  -F "position=Test Position" \
  -F "country=Uganda" \
  -F "city=Kampala" \
  -F "registrationType=local"
```

## **📋 Expected Results After Deployment**

✅ **Registration form submissions work without errors**
✅ **No more "Could not connect to server" messages**
✅ **File uploads work properly (payment proof + passport photo)**
✅ **Admin panel shows new registrations**
✅ **Passport photo downloads work**
✅ **Payment proof downloads work**
✅ **Database saves all registration data correctly**

## **🚨 If Issues Persist**

### **Check PM2 Logs**
```bash
pm2 logs ndc-frontend --lines 100
```

### **Check Nginx Logs**
```bash
sudo tail -f /var/log/nginx/error.log
```

### **Check Database Logs**
```bash
sudo tail -f /var/log/mysql/error.log
```

### **Restart All Services**
```bash
sudo systemctl restart nginx
pm2 restart ndc-frontend
```

## **📞 Support Commands**

### **Full System Check**
```bash
cd /var/www/ndc-frontend
./test_registration_api.js
```

### **Database Schema Verification**
```bash
mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; SHOW COLUMNS FROM registrations;"
```

### **File Permissions Fix**
```bash
sudo chown -R conf:conf /var/www/ndc-frontend/
sudo chmod -R 755 /var/www/ndc-frontend/uploads/
```

---

**🎯 After completing all steps, the registration system should work perfectly!**
