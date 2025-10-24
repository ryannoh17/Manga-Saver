FROM node:25
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx tsc

ENV NODE_ENV=production
EXPOSE 3000

CMD [ "npm", "start" ]