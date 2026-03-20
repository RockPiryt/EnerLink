# ----------- STAGE 1: BUILD -----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build produkcyjny
RUN npm run build

# ----------- STAGE 2: NGINX -----------
FROM nginx:alpine

# Usuń default config
RUN rm -rf /usr/share/nginx/html/*

# Skopiuj build z poprzedniego etapu
COPY --from=builder /app/build /usr/share/nginx/html

# (opcjonalnie) custom config nginx dla SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]