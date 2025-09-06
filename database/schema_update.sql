-- Database Schema Update Script
-- This script ensures the database schema matches the application requirements

USE conf;

-- Add missing columns to contacts table if they don't exist
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS phone VARCHAR(20) AFTER email;

-- Add missing columns to sponsorships table if they don't exist
ALTER TABLE sponsorships ADD COLUMN IF NOT EXISTS payment_proof_url VARCHAR(500) AFTER selected_package;
ALTER TABLE sponsorships ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER payment_proof_url;

-- Add missing columns to abstracts table if they don't exist
ALTER TABLE abstracts ADD COLUMN IF NOT EXISTS cross_cutting_themes TEXT AFTER subcategory;
ALTER TABLE abstracts ADD COLUMN IF NOT EXISTS author_phone VARCHAR(20) AFTER file_url;
ALTER TABLE abstracts ADD COLUMN IF NOT EXISTS author_address TEXT AFTER author_phone;
ALTER TABLE abstracts ADD COLUMN IF NOT EXISTS corresponding_author VARCHAR(255) AFTER author_address;
ALTER TABLE abstracts ADD COLUMN IF NOT EXISTS corresponding_email VARCHAR(255) AFTER corresponding_author;
ALTER TABLE abstracts ADD COLUMN IF NOT EXISTS corresponding_phone VARCHAR(20) AFTER corresponding_email;
ALTER TABLE abstracts ADD COLUMN IF NOT EXISTS organization VARCHAR(255) AFTER corresponding_phone;
ALTER TABLE abstracts ADD COLUMN IF NOT EXISTS admin_notes TEXT AFTER status;
ALTER TABLE abstracts ADD COLUMN IF NOT EXISTS reviewer_comments TEXT AFTER admin_notes;
ALTER TABLE abstracts ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(255) AFTER reviewer_comments;
ALTER TABLE abstracts ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP AFTER reviewed_by;

-- Add missing columns to exhibitors table if they don't exist
ALTER TABLE exhibitors ADD COLUMN IF NOT EXISTS address VARCHAR(255) AFTER phone;
ALTER TABLE exhibitors ADD COLUMN IF NOT EXISTS city VARCHAR(100) AFTER address;
ALTER TABLE exhibitors ADD COLUMN IF NOT EXISTS country VARCHAR(100) AFTER city;
ALTER TABLE exhibitors ADD COLUMN IF NOT EXISTS booth_preference VARCHAR(100) AFTER selected_package;
ALTER TABLE exhibitors ADD COLUMN IF NOT EXISTS special_requirements TEXT AFTER booth_preference;
ALTER TABLE exhibitors ADD COLUMN IF NOT EXISTS additional_info TEXT AFTER special_requirements;
ALTER TABLE exhibitors ADD COLUMN IF NOT EXISTS payment_proof_url VARCHAR(500) AFTER additional_info;
ALTER TABLE exhibitors ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER payment_proof_url;

-- Update column types if needed
ALTER TABLE abstracts MODIFY COLUMN conflict_of_interest TEXT;
ALTER TABLE abstracts MODIFY COLUMN ethical_approval VARCHAR(10);
ALTER TABLE abstracts MODIFY COLUMN consent_to_publish VARCHAR(10);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
CREATE INDEX IF NOT EXISTS idx_sponsorships_submitted_at ON sponsorships(submitted_at);
CREATE INDEX IF NOT EXISTS idx_abstracts_cross_cutting_themes ON abstracts(cross_cutting_themes);
CREATE INDEX IF NOT EXISTS idx_exhibitors_address ON exhibitors(address);

-- Show final table structures
DESCRIBE contacts;
DESCRIBE sponsorships;
DESCRIBE abstracts;
DESCRIBE exhibitors;
DESCRIBE registrations;
