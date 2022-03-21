FROM node:16.14-alpine as node

EXPOSE 4200

WORKDIR /usr/local/Frontend

COPY ./Frontend .

RUN npm install

RUN npm run build --prod


FROM nginx:alpine

COPY --from=node /usr/local/Frontend/dist/Frontend /usr/share/nginx/html

FROM node:16.14-alpine as build
EXPOSE 8080
WORKDIR /usr/local/Backend/

COPY ./Backend/js-mysql/package*.json ./

RUN npm install

COPY ./Backend/js-mysql/ ./

CMD ["node","endpoint.js"]


