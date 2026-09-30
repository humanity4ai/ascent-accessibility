# Build context MUST be the repository root:
#   docker build -f mcp/Dockerfile -t ascent-accessibility-mcp .
#
# The server bundles the WCAG catalogue from src/lib/standards, so the build
# stage copies both `mcp/` (source only) and `src/lib/standards/`. Copying
# explicit paths avoids dragging a local mcp/node_modules into the image.

FROM node:20-slim AS build
WORKDIR /app

COPY mcp/package.json ./mcp/package.json
RUN cd mcp && npm install --no-fund --no-audit

COPY tsconfig.json ./tsconfig.json
COPY src/lib/standards ./src/lib/standards
COPY mcp/tsconfig.json ./mcp/tsconfig.json
COPY mcp/src ./mcp/src
RUN cd mcp && npm run build

FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/mcp/package.json ./package.json
COPY --from=build /app/mcp/node_modules ./node_modules
COPY --from=build /app/mcp/dist ./dist

ENTRYPOINT ["node", "dist/server.js"]
