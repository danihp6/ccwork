FROM node:18

ARG PORT
ENV PORT $PORT

WORKDIR /app

COPY src/ /app/src/
COPY package*.json /app/
COPY tsconfig.json /app/

RUN npm ci && npm run build

EXPOSE $PORT

CMD ["npm", "run", "start"]
