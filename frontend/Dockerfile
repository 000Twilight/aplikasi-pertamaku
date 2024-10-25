# Stage 1: Build the frontend app
FROM node:22 AS build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code and build it
COPY . .
RUN pnpm run build

# Stage 2: Serve the built frontend using Nginx
FROM nginx:alpine

# Copy the built files to Nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
