FROM node:8
COPY . /usr/src/app
WORKDIR /usr/src/app
EXPOSE 1337
ENTRYPOINT node forever.js --prod 