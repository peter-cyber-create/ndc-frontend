-- Recreate tables to match server schema exactly
USE conf;

-- Drop existing tables
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS abstracts;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS sponsorships;
DROP TABLE IF EXISTS file_uploads;

-- Create registrations table with server schema
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    registrationType ENUM('undergrad', 'grad', 'local', 'international', 'online') NOT NULL,
    paymentProofUrl VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create abstracts table with server schema
CREATE TABLE abstracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    presentation_type VARCHAR(100),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    cross_cutting_themes TEXT,
    primary_author VARCHAR(255) NOT NULL,
    co_authors TEXT,
    abstract_summary TEXT NOT NULL,
    keywords VARCHAR(500),
    background TEXT,
    methods TEXT,
    findings TEXT,
    conclusion TEXT,
    implications TEXT,
    conflict_of_interest TEXT,
    ethical_approval VARCHAR(10),
    consent_to_publish VARCHAR(10),
    file_url VARCHAR(500),
    author_phone VARCHAR(20),
    author_address TEXT,
    corresponding_author VARCHAR(255),
    corresponding_email VARCHAR(255),
    corresponding_phone VARCHAR(20),
    status ENUM('submitted', 'approved', 'rejected') DEFAULT 'submitted',
    admin_notes TEXT,
    reviewer_comments TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create contacts table with server schema
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    organization VARCHAR(255),
    inquiry_type ENUM('general', 'registration', 'abstract', 'sponsorship') NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'responded') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create sponsorships table with server schema
CREATE TABLE sponsorships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    selected_package ENUM('platinum', 'gold', 'silver', 'bronze') NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_abstracts_status ON abstracts(status);
CREATE INDEX idx_abstracts_category ON abstracts(category);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_inquiry_type ON contacts(inquiry_type);
CREATE INDEX idx_sponsorships_status ON sponsorships(status);
CREATE INDEX idx_sponsorships_package ON sponsorships(selected_package);

-- Insert sample data for testing
INSERT INTO registrations (firstName, lastName, email, phone, organization, position, registrationType, status) VALUES
('John', 'Doe', 'john.doe@example.com', '+256700000001', 'Makerere University', 'Student', 'undergrad', 'approved'),
('Jane', 'Smith', 'jane.smith@example.com', '+256700000002', 'Ministry of Health', 'Health Officer', 'local', 'pending'),
('Dr. Michael', 'Johnson', 'michael.johnson@example.com', '+256700000003', 'International Health Organization', 'Director', 'international', 'approved');

INSERT INTO abstracts (title, primary_author, corresponding_email, organization, abstract_summary, keywords, category, status) VALUES
('Digital Health Solutions for Rural Communities', 'Dr. Sarah Wilson', 'sarah.wilson@example.com', 'Makerere University', 'This study explores the implementation of digital health solutions in rural communities...', 'digital health, rural communities, telemedicine', 'research', 'submitted'),
('Policy Framework for Health Data Management', 'Prof. David Brown', 'david.brown@example.com', 'Ministry of Health', 'A comprehensive policy framework for managing health data in Uganda...', 'health policy, data management, governance', 'policy', 'approved');

INSERT INTO contacts (name, email, phone, organization, inquiry_type, message, status) VALUES
('Alice Johnson', 'alice.johnson@example.com', '+256700000004', 'Health NGO', 'general', 'I would like to know more about the conference program.', 'new'),
('Bob Wilson', 'bob.wilson@example.com', '+256700000005', 'University', 'abstract', 'I have questions about abstract submission guidelines.', 'responded');

INSERT INTO sponsorships (company_name, contact_person, email, phone, selected_package, status) VALUES
('Tech Solutions Ltd', 'Mary Davis', 'mary.davis@techsolutions.com', '+256700000006', 'gold', 'pending'),
('Health Innovations Inc', 'Tom Anderson', 'tom.anderson@healthinnov.com', '+256700000007', 'platinum', 'approved');



