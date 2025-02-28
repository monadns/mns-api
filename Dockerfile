FROM node:23.7.0

WORKDIR /usr/local/app

COPY package.json ./
COPY tsconfig.json ./

RUN yarn install

COPY src ./src
RUN yarn build && yarn add cors

EXPOSE 3000

RUN useradd api
USER api

CMD ["yarn", "start"]