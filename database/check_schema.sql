-- Check Database Schema Script
-- This script checks what columns exist in each table

USE conf;

-- Check contacts table
SELECT 'CONTACTS TABLE:' as table_name;
SHOW COLUMNS FROM contacts;

-- Check sponsorships table  
SELECT 'SPONSORSHIPS TABLE:' as table_name;
SHOW COLUMNS FROM sponsorships;

-- Check abstracts table
SELECT 'ABSTRACTS TABLE:' as table_name;
SHOW COLUMNS FROM abstracts;

-- Check exhibitors table
SELECT 'EXHIBITORS TABLE:' as table_name;
SHOW COLUMNS FROM exhibitors;

-- Check registrations table
SELECT 'REGISTRATIONS TABLE:' as table_name;
SHOW COLUMNS FROM registrations;
