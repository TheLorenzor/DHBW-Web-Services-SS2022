FROM node:latest as build

WORKDIR /usr/local/WG-Sport

COPY ./Frontend /usr/local/WG-Sport

RUN npm install

RUN npm run build

FROM nginx:latest

COPY --from=build /usr/local/WG-Sport/dist/Frontend /usr/share/nginx/html

EXPOSE 4200




