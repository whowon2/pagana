FROM oven/bun:1 AS build
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

FROM debian:bookworm-slim AS prod
WORKDIR /app
COPY --from=build /app/app ./app
EXPOSE 4000
ENTRYPOINT ["./app"]
