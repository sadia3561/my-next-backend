FROM node:22-alpine AS builder

WORKDIR /app

# Copy everything first
COPY . .

# Install dependencies
RUN npm install --legacy-peer-deps

# Prisma generate
RUN npx prisma generate

# Build NestJS
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
