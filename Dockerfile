FROM node:12-alpine AS BUILD_IMAGE

RUN apk add --no-cache \
        sudo \
        curl \
        build-base \
        g++ \
        libpng \
        libpng-dev \
        jpeg-dev \
        pango-dev \
        cairo-dev \
        giflib-dev \
        python \
        ;

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
ARG MONGODB_URI
ARG FIREBASE_VIEW
RUN npm run build-ts
RUN MONGODB_URI=$MONGODB_URI FIREBASE_VIEW=$FIREBASE_VIEW npm run next:build

RUN npm prune --production

WORKDIR /usr/src/app

FROM node:12-alpine

RUN apk add --no-cache \
        sudo \
        curl \
        build-base \
        g++ \
        libpng \
        libpng-dev \
        jpeg-dev \
        pango-dev \
        cairo-dev \
        giflib-dev \
        python \
        ;

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/docs ./docs
COPY --from=BUILD_IMAGE /usr/src/app/public ./public
COPY --from=BUILD_IMAGE /usr/src/app/next/public ./next/public
COPY --from=BUILD_IMAGE /usr/src/app/package.json ./package.json
COPY --from=BUILD_IMAGE /usr/src/app/next/.next ./next/.next
COPY --from=BUILD_IMAGE /usr/src/app/next/next.config.js ./next/next.config.js

RUN npm i canvas --build-from-source

RUN npm i canvas --build-from-source

EXPOSE 5555

CMD [ "node", "dist/server.js"]