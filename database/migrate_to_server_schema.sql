-- Migration script to match server database schema
-- This updates the local database to match the server configuration

USE conf;

-- Update registrations table to match server schema
ALTER TABLE registrations 
CHANGE COLUMN first_name firstName VARCHAR(100) NOT NULL,
CHANGE COLUMN last_name lastName VARCHAR(100) NOT NULL,
CHANGE COLUMN registration_type registrationType ENUM('undergrad', 'grad', 'local', 'international', 'online') NOT NULL,
CHANGE COLUMN payment_proof_url paymentProofUrl VARCHAR(500),
CHANGE COLUMN status status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
CHANGE COLUMN created_at createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CHANGE COLUMN updated_at updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
DROP COLUMN country,
DROP COLUMN special_requirements,
DROP COLUMN admin_notes,
DROP COLUMN reviewed_by,
DROP COLUMN reviewed_at;

-- Update abstracts table to match server schema
ALTER TABLE abstracts 
CHANGE COLUMN created_at created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CHANGE COLUMN updated_at updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update contacts table to match server schema
ALTER TABLE contacts 
CHANGE COLUMN created_at created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CHANGE COLUMN updated_at updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update sponsorships table to match server schema
ALTER TABLE sponsorships 
CHANGE COLUMN created_at created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CHANGE COLUMN updated_at updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Drop file_uploads table if it exists (not needed in server schema)
DROP TABLE IF EXISTS file_uploads;

-- Insert sample data for testing
INSERT IGNORE INTO registrations (firstName, lastName, email, phone, organization, position, registrationType, status) VALUES
('John', 'Doe', 'john.doe@example.com', '+256700000001', 'Makerere University', 'Student', 'undergrad', 'approved'),
('Jane', 'Smith', 'jane.smith@example.com', '+256700000002', 'Ministry of Health', 'Health Officer', 'local', 'pending'),
('Dr. Michael', 'Johnson', 'michael.johnson@example.com', '+256700000003', 'International Health Organization', 'Director', 'international', 'approved');

INSERT IGNORE INTO abstracts (title, primary_author, corresponding_email, organization, abstract_summary, keywords, category, status) VALUES
('Digital Health Solutions for Rural Communities', 'Dr. Sarah Wilson', 'sarah.wilson@example.com', 'Makerere University', 'This study explores the implementation of digital health solutions in rural communities...', 'digital health, rural communities, telemedicine', 'research', 'submitted'),
('Policy Framework for Health Data Management', 'Prof. David Brown', 'david.brown@example.com', 'Ministry of Health', 'A comprehensive policy framework for managing health data in Uganda...', 'health policy, data management, governance', 'policy', 'approved');

INSERT IGNORE INTO contacts (name, email, phone, organization, inquiry_type, message, status) VALUES
('Alice Johnson', 'alice.johnson@example.com', '+256700000004', 'Health NGO', 'general', 'I would like to know more about the conference program.', 'new'),
('Bob Wilson', 'bob.wilson@example.com', '+256700000005', 'University', 'abstract', 'I have questions about abstract submission guidelines.', 'responded');

INSERT IGNORE INTO sponsorships (company_name, contact_person, email, phone, selected_package, status) VALUES
('Tech Solutions Ltd', 'Mary Davis', 'mary.davis@techsolutions.com', '+256700000006', 'gold', 'pending'),
('Health Innovations Inc', 'Tom Anderson', 'tom.anderson@healthinnov.com', '+256700000007', 'platinum', 'approved');



