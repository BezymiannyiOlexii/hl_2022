FROM node

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
RUN npm install --global lite-server
COPY . .

EXPOSE 3000