FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build   # NestJS build

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
