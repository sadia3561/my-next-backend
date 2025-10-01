# 1. Base image
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first
COPY package.json package-lock.json* ./

# Copy Prisma schema early (so postinstall can run)
COPY prisma ./prisma

RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

RUN npm run build

# 2. Production image
FROM node:22-alpine


WORKDIR /app

COPY --from=builder /app ./

CMD ["node", "dist/src/main.js"]
