FROM node:18

WORKDIR /app

COPY package.json /app

RUN npm install

RUN npm install -g typescript

COPY . /app

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "start"]
