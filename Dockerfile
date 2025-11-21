FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Передаем переменные окружения в билд как аргументы
ARG NEXT_PUBLIC_HOST
ARG NEXT_PUBLIC_PORT
ARG NEXT_PUBLIC_SOCKET_HOST
ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_DOMAIN

ARG NEXT_PUBLIC_BACKEND_HOST
ARG NEXT_PUBLIC_BACKEND_PORT
ARG NEXT_PUBLIC_CDN_URL
ARG NEXT_IMAGE_HOST

# Устанавливаем их как ENV, чтобы Next.js подхватил при сборке
ENV NEXT_PUBLIC_HOST=$NEXT_PUBLIC_HOST
ENV NEXT_PUBLIC_PORT=$NEXT_PUBLIC_PORT
ENV NEXT_PUBLIC_SOCKET_HOST=$NEXT_PUBLIC_SOCKET_HOST
ENV NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV
ENV NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN

ENV NEXT_PUBLIC_BACKEND_HOST=$NEXT_PUBLIC_BACKEND_HOST
ENV NEXT_PUBLIC_BACKEND_PORT=$NEXT_PUBLIC_BACKEND_PORT
ENV NEXT_PUBLIC_CDN_URL=$NEXT_PUBLIC_CDN_URL
ENV NEXT_IMAGE_HOST=$NEXT_IMAGE_HOST

RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/next.config.mjs ./

EXPOSE 3000

CMD ["npm", "start"]
