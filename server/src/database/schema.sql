-- database/schema.sql
CREATE DATABASE IF NOT EXISTS zennix_db;
USE zennix_db;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hero Section
CREATE TABLE hero_section (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tag VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    button_text VARCHAR(50),
    button_link VARCHAR(255),
    bg_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About Section
CREATE TABLE about_section (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    icon VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    role VARCHAR(100),
    company VARCHAR(100),
    review TEXT,
    rating INT DEFAULT 5,
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact Info
CREATE TABLE contact_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    facebook VARCHAR(255),
    twitter VARCHAR(255),
    linkedin VARCHAR(255),
    instagram VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact Messages
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(255),
    message TEXT,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123)
INSERT INTO users (username, email, password) 
VALUES ('admin', 'admin@zennix.com', '$2a$10$E5w9HvZ3dW1eL2M3nO4pQ5r6s7t8u9v0w1x2y3z4A5B6C7D8E9F0G1H2I');

-- Insert default data
INSERT INTO hero_section (tag, title, description, button_text, button_link) 
VALUES ('🚀 Best Digital Agency', 'Build Amazing Digital Experiences', 
        'We are a creative digital agency building modern web solutions that help businesses grow.', 
        'Get Started', '/contact');

INSERT INTO about_section (title, description, icon) VALUES 
('Creative Design', 'Beautiful UI/UX for modern businesses.', '🎨'),
('Development', 'Fast React applications with clean code.', '💻'),
('Marketing', 'Data-driven strategies for business growth.', '📊');

INSERT INTO contact_info (phone, email, address) VALUES 
('+1 (555) 123-4567', 'info@zennix.com', '123 Tech Park, Silicon Valley, CA 94025');