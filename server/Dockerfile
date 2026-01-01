FROM oven/bun:latest AS build
WORKDIR /app
COPY . .
RUN bun run build

FROM debian:bookworm-slim AS prod
WORKDIR /app
COPY --from=build /app/app ./app
EXPOSE 4000
ENTRYPOINT ["./app"]
