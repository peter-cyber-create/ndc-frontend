-- =====================================================
-- NDC Conference 2025 - Complete Database Setup Script
-- =====================================================
-- This script creates the complete database structure
-- for the NDC Conference 2025 application
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS `conf` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create user and grant permissions
CREATE USER IF NOT EXISTS 'user'@'localhost' IDENTIFIED BY 'toor';
GRANT ALL PRIVILEGES ON `conf`.* TO 'user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE `conf`;

-- =====================================================
-- REGISTRATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `registrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `country` varchar(100) NOT NULL,
  `registration_type` enum('undergrad','grad','local','international','online') NOT NULL,
  `special_requirements` text DEFAULT NULL,
  `payment_proof_url` varchar(500) DEFAULT NULL,
  `status` enum('submitted','under_review','approved','rejected','cancelled') DEFAULT 'submitted',
  `admin_notes` text DEFAULT NULL,
  `reviewed_by` int(10) unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`registration_type`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ABSTRACTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `abstracts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(500) NOT NULL,
  `presentation_type` enum('oral','poster') NOT NULL,
  `category` varchar(255) NOT NULL,
  `subcategory` varchar(255) DEFAULT NULL,
  `cross_cutting_themes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cross_cutting_themes`)),
  `primary_author` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`primary_author`)),
  `co_authors` text DEFAULT NULL,
  `abstract_summary` text NOT NULL,
  `keywords` varchar(500) DEFAULT NULL,
  `background` text DEFAULT NULL,
  `methods` text DEFAULT NULL,
  `findings` text DEFAULT NULL,
  `conclusion` text DEFAULT NULL,
  `implications` text DEFAULT NULL,
  `conflict_of_interest` tinyint(1) DEFAULT 0,
  `ethical_approval` tinyint(1) DEFAULT 0,
  `consent_to_publish` tinyint(1) DEFAULT 0,
  `file_url` varchar(500) DEFAULT NULL,
  `status` enum('submitted','under_review','accepted','rejected','revision_required') DEFAULT 'submitted',
  `admin_notes` text DEFAULT NULL,
  `reviewer_comments` text DEFAULT NULL,
  `reviewed_by` int(10) unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_category` (`category`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CONTACTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `inquiry_type` varchar(100) DEFAULT NULL,
  `status` enum('submitted','under_review','responded','closed') DEFAULT 'submitted',
  `admin_notes` text DEFAULT NULL,
  `response` text DEFAULT NULL,
  `responded_by` int(10) unsigned DEFAULT NULL,
  `responded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_email` (`email`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SPONSORSHIPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `sponsorships` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) NOT NULL,
  `contact_person` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `sponsorship_history` text DEFAULT NULL,
  `target_audience` text DEFAULT NULL,
  `specific_requests` text DEFAULT NULL,
  `industry` varchar(100) DEFAULT NULL,
  `special_requirements` text DEFAULT NULL,
  `selected_package` enum('platinum','gold','silver','bronze','custom') NOT NULL,
  `budget_range` varchar(50) DEFAULT NULL,
  `additional_benefits` text DEFAULT NULL,
  `marketing_materials` text DEFAULT NULL,
  `company_description` text NOT NULL,
  `message` text DEFAULT NULL,
  `status` enum('submitted','under_review','approved','rejected','negotiating') DEFAULT 'submitted',
  `admin_notes` text DEFAULT NULL,
  `reviewed_by` int(10) unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_package` (`selected_package`),
  KEY `idx_created` (`created_at`),
  KEY `idx_budget_range` (`budget_range`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- FILE_UPLOADS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `file_uploads` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int(10) unsigned NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` varchar(50) NOT NULL,
  `uploaded_by` varchar(255) NOT NULL,
  `upload_status` enum('pending','completed','failed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_uploaded_by` (`uploaded_by`),
  KEY `idx_status` (`upload_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample registration
INSERT IGNORE INTO `registrations` (
  `first_name`, `last_name`, `email`, `phone`, `organization`, 
  `position`, `country`, `registration_type`, `status`
) VALUES (
  'Admin', 'User', 'admin@conference.health.go.ug', '+256700000000', 
  'Ministry of Health Uganda', 'Administrator', 'Uganda', 'local', 'approved'
);

-- Sample contact
INSERT IGNORE INTO `contacts` (
  `name`, `email`, `organization`, `subject`, `message`, `inquiry_type`, `status`
) VALUES (
  'System Admin', 'admin@conference.health.go.ug', 'Ministry of Health Uganda',
  'System Setup Complete', 'Database and application setup completed successfully.', 'technical', 'responded'
);

-- Sample abstract
INSERT IGNORE INTO `abstracts` (
  `title`, `presentation_type`, `category`, `primary_author`, 
  `abstract_summary`, `keywords`, `status`
) VALUES (
  'Welcome to NDC Conference 2025', 'oral', 'One Health',
  '{"firstName":"System","lastName":"Admin","email":"admin@conference.health.go.ug","institution":"Ministry of Health Uganda"}',
  'This is a sample abstract to demonstrate the system functionality.',
  '["conference","welcome","sample"]',
  'accepted'
);

-- Sample sponsorship
INSERT IGNORE INTO `sponsorships` (
  `company_name`, `contact_person`, `email`, `selected_package`, 
  `company_description`, `status`
) VALUES (
  'Ministry of Health Uganda', 'System Administrator', 'admin@conference.health.go.ug',
  'platinum', 'Official government sponsor for the NDC Conference 2025.', 'approved'
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Show all tables
SHOW TABLES;

-- Show table structures
DESCRIBE registrations;
DESCRIBE abstracts;
DESCRIBE contacts;
DESCRIBE sponsorships;
DESCRIBE file_uploads;

-- Show sample data counts
SELECT 'registrations' as table_name, COUNT(*) as record_count FROM registrations
UNION ALL
SELECT 'abstracts', COUNT(*) FROM abstracts
UNION ALL
SELECT 'contacts', COUNT(*) FROM contacts
UNION ALL
SELECT 'sponsorships', COUNT(*) FROM sponsorships
UNION ALL
SELECT 'file_uploads', COUNT(*) FROM file_uploads;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
SELECT 'Database setup completed successfully!' as status;
