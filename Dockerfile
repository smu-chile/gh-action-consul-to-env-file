FROM node:lts-alpine

COPY package.json ./

ADD src ./src

ADD entrypoint.sh /entrypoint.sh

RUN npm install -g pkg && npm install --quiet --production && \
    pkg -c package.json --output ./release/drone-consul src/index.js && \
    rm -rf ./src node_modules package.json package-lock.json

RUN ["chmod", "+x", "/entrypoint.sh"]

ENTRYPOINT ["/entrypoint.sh"]


