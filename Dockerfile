# DEPS
FROM --platform=linux/amd64 node:20-slim AS deps
WORKDIR /app

COPY prisma ./

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* bun.lockb* ./

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm i; \
    elif [ -f bun.lockb ]; then npm install -g bun && bun install; \
    else echo "Lockfile not found." && exit 1; \
    fi


# BUILDER
FROM --platform=linux/amd64 node:20-bullseye-slim AS builder
ARG DATABASE_URL
ARG GCS_BUCKET_NAME
ARG GCP_SA_KEY
ARG NEXT_PUBLIC_CLIENTVAR
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Set environment variables
ENV DATABASE_URL=${DATABASE_URL}
ENV GCS_BUCKET_NAME=${GCS_BUCKET_NAME}
ENV GCP_SA_KEY=${GCP_SA_KEY}

# Run Prisma migrations
RUN npm install -g prisma && prisma migrate deploy

RUN \
    if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
    elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
    elif [ -f bun.lockb ]; then npm install -g bun && SKIP_ENV_VALIDATION=1 bun run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

# RUNNER
FROM --platform=linux/amd64 gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy the GCP service account key from the builder stage
COPY --from=builder /app/gcp-service-account-key.json ./gcp-service-account-key.json

EXPOSE 3000
ENV PORT 3000

CMD ["server.js"]