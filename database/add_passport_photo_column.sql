-- Migration: Add passport photo column to registrations table
-- Date: 2025-01-27

USE conf;

-- Add passportPhotoUrl column to registrations table
ALTER TABLE registrations 
ADD COLUMN passportPhotoUrl VARCHAR(500) AFTER paymentProofUrl;

-- Update the column comment
ALTER TABLE registrations 
MODIFY COLUMN passportPhotoUrl VARCHAR(500) COMMENT 'URL to uploaded passport photo';
