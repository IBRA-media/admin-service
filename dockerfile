FROM node:16-alpine3.13

COPY ./app /app 
WORKDIR /app
RUN npm i
EXPOSE 3000
CMD node index.js