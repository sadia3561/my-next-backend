# =========================
# 1. Builder stage
# =========================
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first
COPY package.json package-lock.json* ./

# Copy Prisma schema BEFORE installing deps (required for prisma generate)
COPY prisma ./prisma

# Install dependencies (legacy peer deps just in case)
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Explicitly generate Prisma client


# Build the app (optional if you have build step)
RUN npm run build

# =========================
# 2. Production stage
# =========================
FROM node:22-alpine

WORKDIR /app

# Copy built app + node_modules + prisma client from builder
COPY --from=builder /app ./

#environment setup
ENV NODE_ENV=production

# Expose port (adjust to your NestJS port, default 3000)
EXPOSE 3000

#generate prisma client
CMD ["sh", "-c", "npx prisma generate && npm run start -- -p $PORT"]

# Start the application

