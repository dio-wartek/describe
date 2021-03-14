FROM node:14-alpine

WORKDIR /app
COPY . .
ADD https://wartek-id.gitlab.io/api/image.bin image.bin
RUN yarn --production
CMD ["node", "server"]
