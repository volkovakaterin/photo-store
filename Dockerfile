# Базовый образ для сборки
FROM node:18.20.2-alpine as base

# Объявляем build-аргумент, который придёт от docker-compose
ARG PAYLOAD_SECRET
ARG DATABASE_URI

# Далее, если нужно, прокидываем его в ENV, чтобы npm run build его "увидел"
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI

# Этап сборки
FROM base as builder
WORKDIR /home/node/app
COPY package*.json ./
# COPY yarn.lock ./
COPY . .

RUN npm install
RUN npm run build

# Этап выполнения
FROM base as runtime
ENV NODE_ENV=production
ARG PAYLOAD_SECRET
ARG DATABASE_URI


ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI

WORKDIR /home/node/app
COPY package*.json ./
# COPY yarn.lock ./
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/public ./public # Если используете Next.js

RUN npm install --production --frozen-lockfile

# Настройка пользователя
RUN chown -R node:node /home/node/app
USER node

# Открытие порта и запуск сервера
EXPOSE 3000
CMD ["node", "dist/server.js"]




