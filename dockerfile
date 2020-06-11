FROM node:14.4.0-alpine
WORKDIR /app
COPY . /app
RUN npm install
CMD npm start
