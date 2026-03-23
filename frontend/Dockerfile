FROM node:22-alpine

WORKDIR /app

# Install Angular CLI matching the project's likely needs
RUN npm install -g @angular/cli

# Copy dependency files
COPY package*.json ./

RUN npm install

# Copy all project files
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# Serve with host 0.0.0.0 to enable access from outside the container
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
