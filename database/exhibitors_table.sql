-- Create exhibitors table
CREATE TABLE IF NOT EXISTS exhibitors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  website VARCHAR(255),
  organization_type VARCHAR(100),
  description TEXT,
  products_services TEXT,
  target_audience TEXT,
  previous_exhibitions TEXT,
  collaboration_interest TEXT,
  selected_package ENUM('platinum', 'gold', 'silver', 'bronze', 'nonprofit') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_proof_url VARCHAR(500),
  status ENUM('submitted', 'approved', 'rejected') DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_exhibitors_status ON exhibitors(status);
CREATE INDEX idx_exhibitors_package ON exhibitors(selected_package);
CREATE INDEX idx_exhibitors_created_at ON exhibitors(created_at);

