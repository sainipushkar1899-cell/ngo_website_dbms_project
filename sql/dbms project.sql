CREATE DATABASE IF NOT EXISTS ngo_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ngo_db;

CREATE TABLE donors (
  donor_id    INT AUTO_INCREMENT PRIMARY KEY,
  donor_name  VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  phone       VARCHAR(15)
);

CREATE TABLE projects (
  project_id    INT AUTO_INCREMENT PRIMARY KEY,
  project_name  VARCHAR(150) NOT NULL,
  category      ENUM('Education','Health','Environment','Food','Other') NOT NULL,
  budget        DECIMAL(12,2) NOT NULL CHECK (budget >= 0)
);

CREATE TABLE donations (
  donation_id    INT AUTO_INCREMENT PRIMARY KEY,
  donor_id       INT NOT NULL,
  project_id     INT NOT NULL,
  donation_date  DATE NOT NULL,
  amount         DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  FOREIGN KEY (donor_id)   REFERENCES donors(donor_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(project_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE beneficiaries (
  beneficiary_id    INT AUTO_INCREMENT PRIMARY KEY,
  beneficiary_name  VARCHAR(100) NOT NULL,
  location          VARCHAR(100) NOT NULL,
  project_id        INT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(project_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- sample data
INSERT INTO donors (donor_name, email, phone) VALUES
 ('Aarav Sharma','aarav@example.com','9876543210'),
 ('Priya Verma','priya@example.com','9123456780'),
 ('Rohan Mehta','rohan@example.com','9988776655');

INSERT INTO projects (project_name, category, budget) VALUES
 ('School Kits for Rural Kids','Education',200000),
 ('Free Health Camp','Health',150000),
 ('Plant 10,000 Trees','Environment',100000);

INSERT INTO donations (donor_id, project_id, donation_date, amount) VALUES
 (1,1,'2026-09-01',5000),
 (2,1,'2026-09-05',2500),
 (1,2,'2026-09-10',7500),
 (3,3,'2026-10-02',3000);

INSERT INTO beneficiaries (beneficiary_name, location, project_id) VALUES
 ('Ramesh Kumar','Sehore, MP',1),
 ('Sunita Devi','Bhopal, MP',2),
 ('Mohan Lal','Raisen, MP',3);

-- a dedicated user for PHP (don't use root)
CREATE USER IF NOT EXISTS 'ngo_user'@'localhost' IDENTIFIED BY 'ngo_pass123';
GRANT ALL PRIVILEGES ON ngo_db.* TO 'ngo_user'@'localhost';
FLUSH PRIVILEGES;
SELECT * FROM donations;