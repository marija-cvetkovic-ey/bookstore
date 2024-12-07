FROM node:14-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN mkdir -p data && echo '[]' > data/users.json

EXPOSE 8080

CMD [ "node", "users-app.js" ]