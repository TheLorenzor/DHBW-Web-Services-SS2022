FROM node:16.14-alpine as build

RUN mkdir -p /usr/local/Backend
WORKDIR /usr/local/Backend

COPY ./js-mysql/package.json /usr/local/Backend
RUN npm install

COPY ./js-mysql/* ./

RUN npm install

EXPOSE 8080

CMD ["node","./endpoints.js"]
