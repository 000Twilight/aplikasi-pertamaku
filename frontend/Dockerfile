# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Expose port 5173 (default for Vite development)
EXPOSE 5173

# Start the Vite server
CMD ["npm", "run", "dev"]