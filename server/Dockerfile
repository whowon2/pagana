FROM oven/bun:1 AS build
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

FROM debian:bookworm-slim AS prod
WORKDIR /app
COPY --from=build /app/app ./app
COPY --from=build /app/drizzle ./drizzle

EXPOSE 4000
ENTRYPOINT ["./app"]
