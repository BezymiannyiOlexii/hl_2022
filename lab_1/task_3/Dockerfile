FROM node

WORKDIR /usr/src/app

RUN npm install -g --production json-server 

EXPOSE 3000	

WORKDIR /context

CMD json-server --watch db.json --host 0.0.0.0
