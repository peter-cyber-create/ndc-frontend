-- Fix Registration Table Schema
-- Add missing organization column and fix status column

USE conf;

-- Add organization column if it doesn't exist
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS organization VARCHAR(255) AFTER position;

-- Fix status column to allow proper values
ALTER TABLE registrations 
MODIFY COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';

-- Add country and city columns if they don't exist
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS country VARCHAR(100) AFTER city;

ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS city VARCHAR(100) AFTER position;

-- Verify the table structure
DESCRIBE registrations;
