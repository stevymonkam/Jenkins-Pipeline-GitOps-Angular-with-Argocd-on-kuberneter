FROM node:20.19.0-alpine as build
WORKDIR /app

RUN npm install -g @angular/cli

COPY ./package.json .
COPY . .
RUN npm install --force
#RUN export NODE_OPTIONS=--openssl-legacy-provider && yarn build && yarn install --production --ignore-scripts --prefer-offline

RUN ng build
#RUN node_modules/.bin/ng build --prod

FROM nginx as runtime
COPY --from=build /app/dist/EcomerceFinal /usr/share/nginx/html
