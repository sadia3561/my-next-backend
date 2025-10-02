FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all source code
COPY . .

# Prisma generate (required because generated client is gitignored)
RUN npx prisma generate

# NestJS build
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/src/main.js"]
