# 1. Base image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy source & Prisma schema
COPY . .

# Generate Prisma client before build
RUN npx prisma generate

# Build NestJS app
RUN npm run build

# 2. Production image
FROM node:18-alpine

WORKDIR /app

# Copy package.json & node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy dist & Prisma files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4000
CMD ["npm", "run", "start:prod"]

