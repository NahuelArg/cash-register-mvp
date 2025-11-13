# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine AS builder

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma/
COPY schema.prisma ./
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/schema.prisma ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port (Railway sets PORT env variable)
EXPOSE ${PORT:-3000}

# Run migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
