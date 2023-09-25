FROM oven/bun:latest as build

WORKDIR /app
COPY . .

RUN bun i

FROM oven/bun:latest
WORKDIR /app
COPY --from=build /app/ /app/

EXPOSE 3000

CMD [ "bun", "run", "start" ]