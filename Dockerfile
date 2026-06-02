# syntax=docker/dockerfile:1

FROM node:24-bookworm AS build
WORKDIR /app

COPY package.json ./
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
RUN npm install --omit=dev --no-audit --no-fund \
  && npm cache clean --force

FROM node:24-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9422
ENV APP_DATA=/app/data

RUN apt-get update \
  && apt-get install -y --no-install-recommends libvips \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
COPY . .
RUN mkdir -p /app/data \
  && chown -R node:node /app

EXPOSE 9422

USER node
CMD ["npm", "start"]
