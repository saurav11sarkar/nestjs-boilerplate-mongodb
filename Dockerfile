# syntax=docker/dockerfile:1

# ============================================================
# Production Dockerfile for NestJS
# ============================================================
# Ei file ta multi-stage build use kore:
# 1. deps: sob npm package install kore
# 2. builder: TypeScript build kore dist folder banay
# 3. production-deps: only production dependencies rakhe
# 4. production: final lightweight image run kore
#
# Local build:
# docker build -t nestjs-boilerplate-mongodb:local .
#
# Run:
# docker run --env-file .env -p 5000:5000 nestjs-boilerplate-mongodb:local
# ============================================================

FROM node:20-alpine AS base

# App container-er working directory
WORKDIR /usr/src/app

# CI=true dile npm/Nest non-interactive mode-e thake
ENV CI=true

# ============================================================
# Stage 1: Install all dependencies
# ============================================================
FROM base AS deps

# package-lock.json use kore deterministic install
COPY package*.json ./
RUN npm ci

# ============================================================
# Stage 2: Build TypeScript app
# ============================================================
FROM deps AS builder

COPY . .
RUN npm run build

# ============================================================
# Stage 3: Install only production dependencies
# ============================================================
FROM base AS production-deps

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ============================================================
# Stage 4: Final production runtime image
# ============================================================
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Default production env. Actual values .env / compose / VPS theke ashbe.
ENV NODE_ENV=production
ENV PORT=5000

# Final image-e only production node_modules + compiled dist thakbe
COPY --from=production-deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Security best practice: root user diye app run kora hobe na
RUN addgroup -S nestjs -g 1001 \
  && adduser -S nestjs -u 1001 -G nestjs

USER nestjs

# App port. .env-e PORT change korle compose ports-o update korte hobe.
EXPOSE 5000

# Docker healthcheck: root endpoint hit kore app alive kina check kore
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 5000)).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Production command
CMD ["node", "dist/main.js"]
