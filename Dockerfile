FROM node:10
COPY . /usr/src/app
WORKDIR /usr/src/app
EXPOSE 1337
ENTRYPOINT node forever.js --prod 