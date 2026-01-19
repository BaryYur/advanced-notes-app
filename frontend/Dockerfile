# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN npm install

COPY . .
WORKDIR /app/frontend
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS runner
# Copy built files from builder stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
# Custom nginx config might be needed for SPA routing, but let's keep it simple first
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
