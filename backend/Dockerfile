# Use the official Node.js image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]