// Inicialização do MongoDB - SocialFlow
// Cria collections para analytics e logs

// Conectar ao banco
db = db.getSiblingDB('socialflow_analytics');

// Criar collections com schema validation
db.createCollection('analytics_posts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['businessId', 'postId', 'timestamp'],
      properties: {
        _id: { bsonType: 'objectId' },
        businessId: { bsonType: 'string' },
        postId: { bsonType: 'string' },
        platform: { bsonType: 'string' },
        engagement: {
          bsonType: 'object',
          properties: {
            likes: { bsonType: 'int' },
            comments: { bsonType: 'int' },
            shares: { bsonType: 'int' },
            saves: { bsonType: 'int' },
            reach: { bsonType: 'int' },
            impressions: { bsonType: 'int' }
          }
        },
        timestamp: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('analytics_accounts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['businessId', 'accountId', 'platform'],
      properties: {
        _id: { bsonType: 'objectId' },
        businessId: { bsonType: 'string' },
        accountId: { bsonType: 'string' },
        platform: { bsonType: 'string' },
        followers: { bsonType: 'int' },
        engagement_rate: { bsonType: 'double' },
        growth: {
          bsonType: 'object',
          properties: {
            daily: { bsonType: 'int' },
            weekly: { bsonType: 'int' },
            monthly: { bsonType: 'int' }
          }
        },
        timestamp: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('audit_logs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'action', 'timestamp'],
      properties: {
        _id: { bsonType: 'objectId' },
        businessId: { bsonType: 'string' },
        userId: { bsonType: 'string' },
        action: { bsonType: 'string' },
        resource: { bsonType: 'string' },
        resourceId: { bsonType: 'string' },
        changes: { bsonType: 'object' },
        ipAddress: { bsonType: 'string' },
        userAgent: { bsonType: 'string' },
        timestamp: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('notifications', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'type', 'createdAt'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'string' },
        type: { bsonType: 'string' },
        title: { bsonType: 'string' },
        message: { bsonType: 'string' },
        data: { bsonType: 'object' },
        read: { bsonType: 'bool' },
        createdAt: { bsonType: 'date' },
        readAt: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('api_logs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['method', 'path', 'timestamp'],
      properties: {
        _id: { bsonType: 'objectId' },
        method: { bsonType: 'string' },
        path: { bsonType: 'string' },
        statusCode: { bsonType: 'int' },
        duration: { bsonType: 'int' },
        userId: { bsonType: 'string' },
        ipAddress: { bsonType: 'string' },
        error: { bsonType: 'string' },
        timestamp: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('webhooks_log', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['provider', 'event', 'timestamp'],
      properties: {
        _id: { bsonType: 'objectId' },
        businessId: { bsonType: 'string' },
        provider: { bsonType: 'string' },
        event: { bsonType: 'string' },
        payload: { bsonType: 'object' },
        status: { bsonType: 'string' },
        error: { bsonType: 'string' },
        timestamp: { bsonType: 'date' },
        processedAt: { bsonType: 'date' }
      }
    }
  }
});

// Criar índices
db.analytics_posts.createIndex({ businessId: 1, timestamp: -1 });
db.analytics_posts.createIndex({ platform: 1 });
db.analytics_accounts.createIndex({ businessId: 1, timestamp: -1 });
db.audit_logs.createIndex({ businessId: 1, userId: 1, timestamp: -1 });
db.audit_logs.createIndex({ action: 1 });
db.notifications.createIndex({ userId: 1, createdAt: -1 });
db.notifications.createIndex({ read: 1 });
db.api_logs.createIndex({ timestamp: -1 });
db.api_logs.createIndex({ userId: 1, timestamp: -1 });
db.webhooks_log.createIndex({ businessId: 1, timestamp: -1 });
db.webhooks_log.createIndex({ provider: 1, event: 1 });

// Criar usuário
db.createUser({
  user: 'socialflow',
  pwd: 'socialflow123',
  roles: [
    { role: 'readWrite', db: 'socialflow_analytics' }
  ]
});

print('MongoDB initialization complete!');
