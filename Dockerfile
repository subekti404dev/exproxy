FROM node:16-alpine as build

WORKDIR /app
COPY . .

RUN npm i

FROM node:16-alpine
WORKDIR /app
COPY --from=build /app/ /app/

EXPOSE 3000

CMD [ "npm", "run", "start" ]