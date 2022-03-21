#Stage 1 build
FROM node:16.14-alpine as node

WORKDIR /usr/local/Frontend

COPY . .

RUN npm install

RUN npm run build --prod

#Stage 2 run
FROM nginx:alpine

COPY --from=node /usr/local/Frontend/dist/Frontend /usr/share/nginx/html



