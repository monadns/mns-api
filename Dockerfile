FROM node:23.7.0

WORKDIR /usr/local/app

COPY package.json ./
COPY tsconfig.json ./

RUN yarn install

COPY src ./src
RUN yarn global add typescript && yarn build && yarn add cors


USER root
RUN apt-get update; apt-get install -y fontconfig
RUN fc-cache -f -v && fc-cache -f -v --really-force
RUN chmod a+rw -R /usr/local/app

EXPOSE 3000

RUN useradd api
USER api

CMD ["yarn", "start"]