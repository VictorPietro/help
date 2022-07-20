FROM node

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .

# ${APP_PORT}
EXPOSE 3334

CMD ["npm","run","dev"]
