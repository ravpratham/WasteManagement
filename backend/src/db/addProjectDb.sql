CREATE DATABASE IF NOT EXISTS waste_management;

USE waste_management;

CREATE TABLE IF NOT EXISTS waste_management_projects (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE,
    location VARCHAR(255),
    status ENUM('Planned', 'Ongoing', 'Completed') DEFAULT 'Planned',
    wasteType VARCHAR(50),
    houses INT,
    weight DECIMAL(5,2),  -- allows values like 999.99
    image VARCHAR(512),
    featured BOOLEAN
);

