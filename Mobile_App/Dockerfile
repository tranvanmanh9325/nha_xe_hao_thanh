FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Expose Metro Bundler port
EXPOSE 8081

# Command to run Expo start on LAN
CMD ["npx", "expo", "start", "--host", "lan"]