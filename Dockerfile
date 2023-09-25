FROM node:latest as build
RUN npm i -g bun

WORKDIR /app
COPY . .

RUN bun i && bun run build


FROM ubuntu:latest
WORKDIR /app
COPY --from=build /app/exproxy /app/exproxy
RUN chmod +x /app/exproxy

EXPOSE 3000

CMD [ "/app/exproxy" ]