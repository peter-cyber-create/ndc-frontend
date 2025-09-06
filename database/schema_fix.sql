-- Database Schema Fix Script for Older MySQL Versions
-- This script ensures the database schema matches the application requirements

USE conf;

-- Add missing columns to contacts table
ALTER TABLE contacts ADD COLUMN phone VARCHAR(20) AFTER email;

-- Add missing columns to sponsorships table  
ALTER TABLE sponsorships ADD COLUMN payment_proof_url VARCHAR(500) AFTER selected_package;
ALTER TABLE sponsorships ADD COLUMN submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER payment_proof_url;

-- Add missing columns to abstracts table
ALTER TABLE abstracts ADD COLUMN cross_cutting_themes TEXT AFTER subcategory;
ALTER TABLE abstracts ADD COLUMN author_phone VARCHAR(20) AFTER file_url;
ALTER TABLE abstracts ADD COLUMN author_address TEXT AFTER author_phone;
ALTER TABLE abstracts ADD COLUMN corresponding_author VARCHAR(255) AFTER author_address;
ALTER TABLE abstracts ADD COLUMN corresponding_email VARCHAR(255) AFTER corresponding_author;
ALTER TABLE abstracts ADD COLUMN corresponding_phone VARCHAR(20) AFTER corresponding_email;
ALTER TABLE abstracts ADD COLUMN organization VARCHAR(255) AFTER corresponding_phone;
ALTER TABLE abstracts ADD COLUMN admin_notes TEXT AFTER status;
ALTER TABLE abstracts ADD COLUMN reviewer_comments TEXT AFTER admin_notes;
ALTER TABLE abstracts ADD COLUMN reviewed_by VARCHAR(255) AFTER reviewer_comments;
ALTER TABLE abstracts ADD COLUMN reviewed_at TIMESTAMP AFTER reviewed_by;

-- Add missing columns to exhibitors table
ALTER TABLE exhibitors ADD COLUMN address VARCHAR(255) AFTER phone;
ALTER TABLE exhibitors ADD COLUMN city VARCHAR(100) AFTER address;
ALTER TABLE exhibitors ADD COLUMN country VARCHAR(100) AFTER city;
ALTER TABLE exhibitors ADD COLUMN booth_preference VARCHAR(100) AFTER selected_package;
ALTER TABLE exhibitors ADD COLUMN special_requirements TEXT AFTER booth_preference;
ALTER TABLE exhibitors ADD COLUMN additional_info TEXT AFTER special_requirements;
ALTER TABLE exhibitors ADD COLUMN payment_proof_url VARCHAR(500) AFTER additional_info;
ALTER TABLE exhibitors ADD COLUMN submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER payment_proof_url;

-- Update column types if needed
ALTER TABLE abstracts MODIFY COLUMN conflict_of_interest TEXT;
ALTER TABLE abstracts MODIFY COLUMN ethical_approval VARCHAR(10);
ALTER TABLE abstracts MODIFY COLUMN consent_to_publish VARCHAR(10);

-- Create indexes for better performance
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_sponsorships_submitted_at ON sponsorships(submitted_at);
CREATE INDEX idx_abstracts_cross_cutting_themes ON abstracts(cross_cutting_themes);
CREATE INDEX idx_exhibitors_address ON exhibitors(address);

-- Show final table structures
DESCRIBE contacts;
DESCRIBE sponsorships;
DESCRIBE abstracts;
DESCRIBE exhibitors;
DESCRIBE registrations;
