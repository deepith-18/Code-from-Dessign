# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if you use yarn)
# to leverage Docker cache for npm install.
COPY package.json ./
# COPY yarn.lock ./ # Uncomment if you use yarn
RUN npm install

# Copy the rest of your frontend code
COPY . .

# CRITICAL FOR VITE ENV VARS:
# 1. Declare a build argument to receive the backend URL from docker-compose.
ARG VITE_APP_BACKEND_URL_ARG

# 2. Set an environment variable with the Vite-specific prefix during the build stage.
# Vite reads ENV variables prefixed with VITE_ (or VITE_APP_ if configured) at build time.
ENV VITE_APP_BACKEND_URL=${VITE_APP_BACKEND_URL_ARG}

# IMPORTANT: During `npm run build`, Vite will embed the value of VITE_APP_BACKEND_URL
# directly into your JavaScript bundle.
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built React app from the build stage to Nginx's default HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# EXPOSE port 80 - the port Nginx will listen on inside the container
EXPOSE 80

# Command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]