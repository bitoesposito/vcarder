# Stage 1: Build
FROM node:23-slim AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application for production
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine-slim

# Copy built files from the build stage
COPY --from=build /app/dist/vcarder-fe /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
