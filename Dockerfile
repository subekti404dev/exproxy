FROM node:latest as build
RUN npm i -g bun

WORKDIR /tmp
COPY . .

RUN bun i
RUN cd dashboard && bun i && cd .. 
RUN bun run build



FROM ubuntu:latest
WORKDIR /app
COPY --from=build /tmp/app/exproxy /app/exproxy
COPY --from=build /tmp/app/_dashboard /app/_dashboard
RUN chmod +x /app/exproxy

EXPOSE 3000

CMD [ "./exproxy" ]