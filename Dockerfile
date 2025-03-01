FROM node:23.7.0

WORKDIR /usr/local/app

COPY package.json ./
COPY tsconfig.json ./

RUN yarn install

COPY src ./src
RUN yarn global add typescript && yarn build && yarn add cors

RUN apt-get install fontconfig && fc-cache -f -v

EXPOSE 3000

RUN useradd api
USER api

CMD ["yarn", "start"]