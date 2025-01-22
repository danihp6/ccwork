FROM node:18-alpine

WORKDIR /app

COPY src/ /app/src/
COPY package*.json /app/
COPY tsconfig.json /app/

RUN npm ci && npm run build

CMD ["npm", "run", "start"]
