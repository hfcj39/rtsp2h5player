FROM node:lts-alpine
ENV NODE_ENV=production
COPY --from=mwader/static-ffmpeg /ffmpeg /ffprobe /usr/local/bin/
WORKDIR /app
COPY package*.json ./
#RUN npm install -g pm2
RUN npm install
COPY . .
RUN npm run build

EXPOSE 80
CMD [ "npx", "pm2", "start", "--no-daemon" ]
