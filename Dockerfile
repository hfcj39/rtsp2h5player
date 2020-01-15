FROM node:lts-alpine

COPY --from=mwader/static-ffmpeg /ffmpeg /ffprobe /usr/local/bin/
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
ADD . /usr/src/app
RUN npx tsc

ENV NODE_ENV=production

EXPOSE 80
CMD [ "node", "dist/server.js" ]
