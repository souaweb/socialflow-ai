-- Script de criação para MySQL/MariaDB (Hostinger)

CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'owner',
  plan VARCHAR(50) DEFAULT 'free',
  affiliate_code VARCHAR(50) UNIQUE,
  referred_by VARCHAR(50),
  identity_verified TINYINT(1) DEFAULT 0,
  identity_type VARCHAR(10),
  identity_number VARCHAR(50),
  permissions TEXT,
  subscription_active TINYINT(1) DEFAULT 1,
  subscription_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS businesses (
  id VARCHAR(50) PRIMARY KEY,
  owner_id VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  knowledge_base TEXT,
  verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS accounts (
  id VARCHAR(50) PRIMARY KEY,
  business_id VARCHAR(50),
  platform VARCHAR(50) NOT NULL,
  username VARCHAR(255),
  status VARCHAR(50) DEFAULT 'connected',
  last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(50) PRIMARY KEY,
  business_id VARCHAR(50),
  name VARCHAR(255),
  platform VARCHAR(50),
  status VARCHAR(20) DEFAULT 'warm',
  summary TEXT,
  last_interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(50) PRIMARY KEY,
  business_id VARCHAR(50),
  platform VARCHAR(50),
  user_name VARCHAR(255),
  content TEXT,
  ai_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(50) PRIMARY KEY,
  amount DECIMAL(10,2),
  status VARCHAR(20),
  method VARCHAR(20),
  gateway VARCHAR(50),
  plan VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);