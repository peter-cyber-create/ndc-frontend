-- Pre-Conference Meetings Table Schema
-- Date: 2025-01-27

USE conf;

-- Create pre_conference_meetings table
CREATE TABLE IF NOT EXISTS pre_conference_meetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_title VARCHAR(500) NOT NULL,
    session_description TEXT NOT NULL,
    meeting_type ENUM('symposium', 'meeting', 'workshop') DEFAULT 'meeting',
    organizer_name VARCHAR(255) NOT NULL,
    organizer_email VARCHAR(255) NOT NULL,
    organizer_phone VARCHAR(20) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    co_organizers TEXT,
    meeting_date ENUM('november_3', 'november_4', 'both_days') NOT NULL,
    meeting_time_start TIME NOT NULL,
    meeting_time_end TIME NOT NULL,
    expected_attendees INT NOT NULL,
    room_size ENUM('small', 'medium', 'large') NOT NULL,
    location_preference ENUM('physical', 'virtual', 'hybrid') DEFAULT 'physical',
    abstract_text TEXT NOT NULL,
    keywords VARCHAR(500) NOT NULL,
    special_requirements TEXT,
    payment_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    cancellation_fee_applied BOOLEAN DEFAULT FALSE,
    admin_notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    payment_received_at TIMESTAMP NULL
);

-- Add indexes for better performance
CREATE INDEX idx_pre_conference_organizer_email ON pre_conference_meetings(organizer_email);
CREATE INDEX idx_pre_conference_meeting_date ON pre_conference_meetings(meeting_date);
CREATE INDEX idx_pre_conference_approval_status ON pre_conference_meetings(approval_status);
CREATE INDEX idx_pre_conference_payment_status ON pre_conference_meetings(payment_status);
CREATE INDEX idx_pre_conference_submitted_at ON pre_conference_meetings(submitted_at);

-- Insert sample data
INSERT INTO pre_conference_meetings (
    session_title, session_description, meeting_type, organizer_name, organizer_email, 
    organizer_phone, organization, meeting_date, meeting_time_start, meeting_time_end,
    expected_attendees, room_size, location_preference, abstract_text, keywords,
    payment_amount, approval_status, payment_status
) VALUES 
(
    'Advancing Primary Healthcare in Rural Uganda',
    'This symposium will explore innovative approaches to strengthening primary healthcare delivery in rural communities across Uganda, focusing on sustainable models and community-based interventions.',
    'symposium',
    'Dr. Sarah Nakimuli',
    'sarah.nakimuli@health.go.ug',
    '0800-100-066',
    'Ministry of Health Uganda',
    'november_3',
    '09:00:00',
    '12:00:00',
    150,
    'large',
    'physical',
    'Primary healthcare remains a critical foundation for achieving universal health coverage in Uganda. This symposium will examine evidence-based strategies for improving access, quality, and sustainability of primary healthcare services in rural settings. We will discuss innovative models including telemedicine integration, community health worker programs, and public-private partnerships that have shown promise in addressing healthcare gaps in underserved areas.',
    'primary healthcare, rural health, community health workers, telemedicine, universal health coverage',
    500.00,
    'approved',
    'paid'
),
(
    'Mental Health Integration Workshop',
    'Interactive workshop focusing on integrating mental health services into general healthcare settings, with practical training components for healthcare providers.',
    'workshop', 
    'Dr. James Okello',
    'james.okello@mubarak.ac.ug',
    '0800-100-066',
    'Mubarak Medical University',
    'november_4',
    '14:00:00',
    '17:00:00',
    80,
    'medium',
    'hybrid',
    'Mental health disorders affect millions of Ugandans, yet integration of mental health services into primary healthcare remains limited. This hands-on workshop will provide healthcare providers with practical skills and tools for screening, basic counseling, and referral protocols. Participants will engage in role-playing exercises, case studies, and develop action plans for implementing mental health services in their respective facilities.',
    'mental health, healthcare integration, primary care, training, screening protocols',
    300.00,
    'pending',
    'pending'
);
