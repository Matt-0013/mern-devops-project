FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Ensure .env is available at build time
COPY .env . 

# Build React app
RUN npm run build

# ---------------------
FROM nginx:alpine
# Copy built React app to nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Replace default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
