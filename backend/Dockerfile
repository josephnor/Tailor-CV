FROM node:22-alpine

WORKDIR /app

# Optimize by copying dependency files first
COPY package*.json ./

RUN npm install

# Copy all project files
COPY . .

# Express default port
EXPOSE 3000

CMD ["npm", "start"]
