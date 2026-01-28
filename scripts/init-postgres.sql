-- Inicialização do PostgreSQL - SocialFlow
-- Cria todas as tabelas necessárias

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  cpf_cnpj VARCHAR(20),
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Tabela: businesses
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  industry VARCHAR(100),
  size VARCHAR(50),
  logo_url TEXT,
  banner_url TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  address_street VARCHAR(255),
  address_city VARCHAR(100),
  address_state VARCHAR(50),
  address_zip VARCHAR(20),
  address_country VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Tabela: platform_accounts
CREATE TABLE platform_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'instagram', 'facebook', 'tiktok', 'youtube', 'whatsapp'
  platform_account_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255),
  display_name VARCHAR(255),
  profile_image_url TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  scope VARCHAR(500),
  connected BOOLEAN DEFAULT TRUE,
  verified BOOLEAN DEFAULT FALSE,
  followers_count INTEGER DEFAULT 0,
  engagement_rate FLOAT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  disconnected_at TIMESTAMP
);

-- Tabela: posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'video', 'carousel'
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
  scheduled_at TIMESTAMP,
  published_at TIMESTAMP,
  edited_at TIMESTAMP,
  deleted_at TIMESTAMP,
  ai_generated BOOLEAN DEFAULT FALSE,
  engagement_score FLOAT DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: post_media
CREATE TABLE post_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type VARCHAR(50), -- 'image', 'video'
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- para videos, em segundos
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: post_platform_mapping
CREATE TABLE post_platform_mapping (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  platform_account_id UUID NOT NULL REFERENCES platform_accounts(id) ON DELETE CASCADE,
  platform_post_id VARCHAR(255) UNIQUE,
  platform VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'published', 'failed'
  url TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  published_at TIMESTAMP,
  failed_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: multipost
CREATE TABLE multipost (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  original_content TEXT NOT NULL,
  target_channels VARCHAR[] DEFAULT ARRAY[]::varchar[],
  content_type VARCHAR(50), -- 'post', 'reel', 'story', 'carousel', 'video'
  adapted_content JSONB,
  media_urls TEXT[],
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'publishing', 'published', 'failed'
  scheduled_at TIMESTAMP,
  ai_generated BOOLEAN DEFAULT FALSE,
  optimization_score FLOAT,
  publish_results JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: content_template
CREATE TABLE content_template (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  template_content TEXT NOT NULL,
  content_type VARCHAR(50),
  applicable_channels VARCHAR[],
  placeholders JSONB,
  usage_count INTEGER DEFAULT 0,
  success_rate FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  mercadopago_subscription_id VARCHAR(255) UNIQUE,
  mercadopago_plan_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL, -- 'free', 'starter', 'pro', 'enterprise'
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'cancelled', 'expired', 'pending'
  billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly'
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  payer_email VARCHAR(255),
  payer_name VARCHAR(255),
  payment_method_id VARCHAR(100),
  card_last_four_digits VARCHAR(4),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  next_billing_date TIMESTAMP,
  last_billing_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT TRUE,
  trial_end_date TIMESTAMP,
  billing_retries INTEGER DEFAULT 0,
  cancellation_reason TEXT,
  cancellation_date TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  mercadopago_payment_id VARCHAR(255) UNIQUE NOT NULL,
  preference_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'refunded', etc
  status_detail TEXT,
  plan_id VARCHAR(100),
  plan_name VARCHAR(255),
  payment_method_id VARCHAR(100),
  card_last_four_digits VARCHAR(4),
  card_brand VARCHAR(50),
  payer_email VARCHAR(255),
  payer_name VARCHAR(255),
  payer_cpf VARCHAR(20),
  installments INTEGER,
  installment_amount DECIMAL(10, 2),
  transaction_id VARCHAR(255),
  receipt_url TEXT,
  invoice_number VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  approved_at TIMESTAMP,
  refunded_at TIMESTAMP,
  refund_reason TEXT,
  refund_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: billing_history
CREATE TABLE billing_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(20) DEFAULT 'paid', -- 'paid', 'pending', 'failed', 'refunded'
  invoice_number VARCHAR(100),
  receipt_url TEXT,
  billing_date TIMESTAMP NOT NULL,
  due_date TIMESTAMP,
  paid_at TIMESTAMP,
  failure_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: training_data
CREATE TABLE training_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  training_type VARCHAR(50), -- 'text', 'voice', 'file'
  content TEXT,
  file_url TEXT,
  business_type VARCHAR(100),
  keywords VARCHAR[],
  sentiment VARCHAR(50),
  tone VARCHAR(50),
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: crm_leads
CREATE TABLE crm_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  position VARCHAR(100),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
  score INTEGER DEFAULT 0,
  tags VARCHAR[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_contact TIMESTAMP
);

-- Tabela: automations
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(100), -- 'schedule', 'keyword', 'engagement', 'time_based'
  trigger_config JSONB,
  action_type VARCHAR(100), -- 'send_message', 'create_post', 'assign_lead'
  action_config JSONB,
  enabled BOOLEAN DEFAULT TRUE,
  run_count INTEGER DEFAULT 0,
  last_run TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: team_members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50), -- 'admin', 'manager', 'editor', 'viewer'
  permissions VARCHAR[],
  invited_at TIMESTAMP,
  joined_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Tabela: affiliates
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  affiliate_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  commission_rate FLOAT DEFAULT 0.1, -- 10%
  commission_type VARCHAR(50) DEFAULT 'percentage', -- 'percentage', 'fixed'
  status VARCHAR(20) DEFAULT 'active',
  total_referrals INTEGER DEFAULT 0,
  total_earned DECIMAL(10, 2) DEFAULT 0,
  balance DECIMAL(10, 2) DEFAULT 0,
  last_payout TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: affiliate_referrals
CREATE TABLE affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'converted', 'expired'
  commission_amount DECIMAL(10, 2),
  paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  converted_at TIMESTAMP,
  paid_at TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_platform_accounts_business_id ON platform_accounts(business_id);
CREATE INDEX idx_posts_business_id ON posts(business_id);
CREATE INDEX idx_post_platform_mapping_post_id ON post_platform_mapping(post_id);
CREATE INDEX idx_multipost_business_id ON multipost(business_id);
CREATE INDEX idx_subscriptions_business_id ON subscriptions(business_id);
CREATE INDEX idx_payments_business_id ON payments(business_id);
CREATE INDEX idx_payments_mercadopago_id ON payments(mercadopago_payment_id);
CREATE INDEX idx_billing_history_business_id ON billing_history(business_id);
CREATE INDEX idx_crm_leads_business_id ON crm_leads(business_id);
CREATE INDEX idx_automations_business_id ON automations(business_id);
CREATE INDEX idx_team_members_business_id ON team_members(business_id);
CREATE INDEX idx_training_data_business_id ON training_data(business_id);

-- Usuário de teste
INSERT INTO users (email, name, password_hash) VALUES
  ('admin@socialflow.com', 'Admin SocialFlow', 'hashed_password_here'),
  ('test@socialflow.com', 'Test User', 'hashed_password_here')
ON CONFLICT (email) DO NOTHING;

-- Negócio de teste
INSERT INTO businesses (user_id, name, industry) 
SELECT id, 'Test Business', 'Technology' FROM users WHERE email = 'admin@socialflow.com'
ON CONFLICT DO NOTHING;
