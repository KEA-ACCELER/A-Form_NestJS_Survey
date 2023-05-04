FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

ENV NODE_ENV=prod

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]
