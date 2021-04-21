FROM node:latest as build-stage
ARG FRONT_VERSION
ARG API_HOST

RUN echo $FRONT_VERSION
RUN echo $API_HOST

WORKDIR /app
COPY package*.json ./
RUN sed -i -e "s+{{VERSION}}+$FRONT_VERSION+g" "package.json"

RUN npm install
RUN npm install --save @antv/g6 chart.js gridjs gridjs-vue moment vue-fullscreen mika

COPY ./ .
RUN sed -i -e "s+{{VERSION}}+$FRONT_VERSION+g" "package.json"
RUN sed -i -e "s+{{API_HOST}}+$API_HOST+g" "src/assets/config.json"

RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
