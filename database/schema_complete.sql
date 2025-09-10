-- Create database if not exists
CREATE DATABASE IF NOT EXISTS conf;
USE conf;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS abstracts;
DROP TABLE IF EXISTS exhibitors;
DROP TABLE IF EXISTS sponsorships;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS registrations;

-- Create registrations table
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    registrationType ENUM('individual', 'group', 'student', 'international') NOT NULL,
    paymentProofUrl VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create abstracts table
CREATE TABLE abstracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    presentation_type ENUM('oral', 'poster', 'workshop') NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    primary_author TEXT NOT NULL,
    co_authors TEXT,
    abstract_summary TEXT NOT NULL,
    keywords VARCHAR(500),
    background TEXT NOT NULL,
    methods TEXT NOT NULL,
    findings TEXT NOT NULL,
    conclusion TEXT NOT NULL,
    implications TEXT,
    file_url VARCHAR(500),
    conflict_of_interest BOOLEAN DEFAULT FALSE,
    ethical_approval BOOLEAN DEFAULT FALSE,
    consent_to_publish BOOLEAN DEFAULT FALSE,
    author_phone VARCHAR(20),
    corresponding_author VARCHAR(255),
    corresponding_email VARCHAR(255),
    corresponding_phone VARCHAR(20),
    organization VARCHAR(255),
    status ENUM('submitted', 'under_review', 'accepted', 'rejected') DEFAULT 'submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create exhibitors table
CREATE TABLE exhibitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    selected_package ENUM('platinum', 'gold', 'silver', 'bronze', 'non-profit') NOT NULL,
    booth_preference VARCHAR(100),
    special_requirements TEXT,
    additional_info TEXT,
    address VARCHAR(500),
    city VARCHAR(100),
    country VARCHAR(100),
    payment_proof_url VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create sponsorships table
CREATE TABLE sponsorships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    selected_package ENUM('platinum', 'gold', 'silver', 'bronze') NOT NULL,
    amount DECIMAL(10,2),
    payment_proof_url VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create contacts table
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'responded') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_abstracts_status ON abstracts(status);
CREATE INDEX idx_abstracts_category ON abstracts(category);
CREATE INDEX idx_exhibitors_status ON exhibitors(status);
CREATE INDEX idx_exhibitors_package ON exhibitors(selected_package);
CREATE INDEX idx_sponsorships_status ON sponsorships(status);
CREATE INDEX idx_contacts_status ON contacts(status);
