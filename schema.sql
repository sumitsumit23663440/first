CREATE DATABASE IF NOT EXISTS checkmate_event
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE checkmate_event;

CREATE TABLE IF NOT EXISTS registrations (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  branch VARCHAR(50) NOT NULL,
  scholar_number VARCHAR(50) NOT NULL,
  sport ENUM('Chess') NOT NULL DEFAULT 'Chess',
  experience_level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
  registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_scholar_number (scholar_number)
);
