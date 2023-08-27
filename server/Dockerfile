FROM node:18-bullseye

ENV HOME_DIR /home/app
ENV API_DIR $HOME_DIR/crypto_x_server

ENV TZ=Europe/Kiev

RUN apt-get update -y && \
    apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

WORKDIR $API_DIR

COPY ./server/package*.json ./
RUN npm install

COPY ./server $API_DIR

EXPOSE $PORT