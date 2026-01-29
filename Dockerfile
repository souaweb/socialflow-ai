# Use official Node.js runtime
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend
COPY backend ./backend
WORKDIR /app/backend
RUN npm install
RUN npm run build

# Go back to root
WORKDIR /app

# Copy frontend source
COPY components ./components
COPY services ./services
COPY public ./public
COPY index.html index.tsx index.css tsconfig.json vite.config.ts ./

# Build frontend
RUN npm run build

# Expose ports
EXPOSE 3001 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start both backend and frontend
CMD ["sh", "-c", "cd /app/backend && npm run start & npm run start"]
