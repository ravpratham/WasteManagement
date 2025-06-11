-- Check for any errors before dropping the database
-- ... (Add error handling here, if needed) ...

-- Try to drop the database if it exists (if it doesn't exist, no error)
DROP DATABASE IF EXISTS waste_management;

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS waste_management;

-- Use the database
USE waste_management;

-- Try to drop the table if it exists (if it doesn't exist, no error)
DROP TABLE IF EXISTS waste_collection_entry;

-- Create the table
CREATE TABLE IF NOT EXISTS waste_collection_entry (
    id VARCHAR(64) PRIMARY KEY,
    date DATE NOT NULL,
    society VARCHAR(128) NOT NULL,
    location VARCHAR(128) NOT NULL,
    driveType VARCHAR(64) NOT NULL,
    houses INT NOT NULL,
    weight DECIMAL(8,2) NOT NULL,
    vehicle VARCHAR(64) NOT NULL,
    remarks TEXT
);

-- Try to drop the table if it exists (if it doesn't exist, no error)
DROP TABLE IF EXISTS waste_management_projects;

CREATE TABLE IF NOT EXISTS waste_management_projects (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE,
    location VARCHAR(255),
    status VARCHAR(50),
    wasteType VARCHAR(50),
    houses INT,
    weight DECIMAL(5,2),  -- allows values like 999.99
    image VARCHAR(512),
    featured BOOLEAN
);