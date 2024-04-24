FROM node:10-alpine
#USER node

COPY . .

RUN mkdir -p /home/node/app/node_modules
RUN mkdir -p /home/node/app/profile_pics
#RUN mkdir -p /home/node/app/profile_pics && chown -R node:node /home/node/app/profile_pics
#RUN chmod 777 -R /home/node/

WORKDIR /home/node/app

COPY package*.json ./


RUN npm install
RUN npm install jsdom --save
RUN npm install ws
RUN npm install http
RUN npm install https
RUN npm install url
RUN npm install cors
RUN npm install multer

#RUN chown -R node:node /home/node/app/public/
EXPOSE 3000

CMD [ "node", "app.js" ]