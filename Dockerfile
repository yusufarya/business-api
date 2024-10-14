# Use the official Node.js image as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app/backend

# Copy package.json and package-lock.json
# COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# RUN npx tsc

# Expose the port the app runs on
EXPOSE 3000

# Start the application
# CMD ["node", "dist/main.js"]
CMD ["npm", "start"]
