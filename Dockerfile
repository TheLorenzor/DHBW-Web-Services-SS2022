FROM node:latest as build

WORKDIR /usr/local/Frontend

COPY ./Frontend /usr/local/Frontend

RUN npm install

RUN npm run build --prod

FROM nginx:latest

COPY --from=build /usr/local/Frontend/dist/Frontend /usr/share/nginx/html

EXPOSE 4200


FROM node:latest as build

WORKDIR /usr/local/Backend

COPY ./Backend/js-mysql/package*.json ./

RUN npm install

COPY ./Backend/js-mysql/ ./

EXPOSE 8080
CMD ["node","endpoint.js"]


