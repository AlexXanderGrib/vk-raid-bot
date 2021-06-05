FROM node:16-alpine
WORKDIR /app
VOLUME [ "/app/configs" ]

COPY ./package.json /app/package.json
COPY ./src  /app/src

RUN npm install --only=prod

CMD [ "npm", "start" ]