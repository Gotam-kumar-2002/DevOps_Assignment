# Dockerfile

# Use the Node.js LTS image
FROM node:18

# Create a working directory
WORKDIR /Form_validation

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 8081
EXPOSE 8081

# Start the server
CMD ["node", "server.js"]
