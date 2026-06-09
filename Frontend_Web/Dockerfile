# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
# Clean install dependencies
RUN npm ci
COPY . .
# Build the application for production
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*
# Copy static assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html
# Provide custom nginx config if necessary, or let default handle it.
# For React/Vite router (SPA), we need a custom configuration to fallback to index.html
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80 (internal to container)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
