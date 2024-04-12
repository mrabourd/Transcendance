FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/profile_pics && chown -R node:node /home/node/app
RUN chmod 777 -R /home/node/app/profile_pics

WORKDIR /home/node/app

COPY package*.json ./

USER node


RUN npm install
RUN npm install jsdom --save
RUN npm install ws
RUN npm install http
RUN npm install https
RUN npm install url
RUN npm install cors
RUN npm install multer

COPY --chown=node:node . .
RUN chown -R node:node /home/node/app/public/
EXPOSE 3000

CMD [ "node", "app.js" ]