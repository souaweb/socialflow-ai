# Configuração de Banco de Dados

## PostgreSQL (Dados estruturados)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  avatar_url TEXT,
  plan VARCHAR(50) DEFAULT 'free', -- free, starter, pro, consultancy
  identity_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Connected Accounts
CREATE TABLE connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- instagram, facebook, whatsapp, tiktok, youtube, kwai
  platform_account_id VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  business_name VARCHAR(255),
  business_avatar TEXT,
  is_verified BOOLEAN DEFAULT false,
  connected_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, platform, platform_account_id)
);

-- Conversations (conversas sincronizadas)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES connected_accounts(id) ON DELETE CASCADE,
  platform_conversation_id VARCHAR(255) NOT NULL,
  remote_user_id VARCHAR(255) NOT NULL,
  remote_user_name VARCHAR(255),
  remote_user_avatar TEXT,
  platform VARCHAR(50) NOT NULL,
  last_message_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active', -- active, archived, muted
  lead_quality VARCHAR(50), -- cold, warm, hot
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_platform (user_id, platform),
  INDEX idx_last_message (last_message_at)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  platform_message_id VARCHAR(255),
  sender VARCHAR(50) NOT NULL, -- 'user' ou 'remote'
  message_text TEXT,
  message_type VARCHAR(50) DEFAULT 'text', -- text, image, video, audio, file
  media_url TEXT,
  is_automated BOOLEAN DEFAULT false,
  automation_rule_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_conversation (conversation_id),
  INDEX idx_created_at (created_at)
);

-- Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES connected_accounts(id) ON DELETE SET NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, published, failed
  published_at TIMESTAMP,
  scheduled_for TIMESTAMP,
  engagement_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_status (user_id, status),
  INDEX idx_scheduled_for (scheduled_for)
);

-- Post Synchronization (para sincronizar posts entre plataformas)
CREATE TABLE post_syncs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  account_id UUID REFERENCES connected_accounts(id) ON DELETE CASCADE,
  platform_post_id VARCHAR(255),
  platform VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, published, failed
  error_message TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, account_id)
);

-- CRM Leads
CREATE TABLE crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  remote_user_id VARCHAR(255) NOT NULL,
  remote_user_name VARCHAR(255),
  platform VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  quality VARCHAR(50) DEFAULT 'cold', -- cold, warm, hot
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, lost
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  last_interaction TIMESTAMP,
  next_followup TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_quality (user_id, quality),
  INDEX idx_next_followup (next_followup)
);

-- Automation Rules
CREATE TABLE automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  trigger VARCHAR(50) NOT NULL, -- follow, like, comment, message, story_view
  platform VARCHAR(50) NOT NULL,
  condition JSONB, -- Condições customizadas
  action VARCHAR(50) NOT NULL, -- send_message, tag_lead, send_template
  action_data JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Templates de Mensagens (WhatsApp, Instagram)
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT ARRAY[]::TEXT[],
  meta_template_name VARCHAR(255), -- Para WhatsApp
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Redis (Cache e Filas)

- Conversas ativas
- Tokens de acesso
- Rate limiting
- Fila de processamento de posts
- Fila de respostas automáticas

## MongoDB (Logs e Analytics)

```javascript
// analytics_logs
{
  _id: ObjectId,
  user_id: UUID,
  event_type: "message_sent|post_published|lead_qualified",
  platform: "instagram|whatsapp|tiktok",
  data: {
    conversation_id: UUID,
    message_count: Int,
    engagement: Int,
    lead_quality: "cold|warm|hot"
  },
  created_at: Date
}

// ai_interactions
{
  _id: ObjectId,
  user_id: UUID,
  conversation_id: UUID,
  platform: String,
  user_message: String,
  ai_response: String,
  sentiment: "positive|neutral|negative",
  intent: "question|complaint|purchase|info",
  lead_score: Float,
  created_at: Date
}
```
