FROM node:12
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install pm2 -g
RUN npm install
EXPOSE 1337
ENTRYPOINT pm2 start app.js -x -- --prod