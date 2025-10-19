# ---- base: build & runtime deps ----
FROM node:20 AS base

ENV DEBIAN_FRONTEND=noninteractive
# If you use Puppeteer, skip its chromium download (we install OS chromium)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
# Optional: tell Puppeteer where chromium lives (uncomment if needed)
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# System deps for Chromium & fonts (minimal, no recommends)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libgdk-pixbuf-2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    git \
 && rm -rf /var/lib/apt/lists/*

# Enable Yarn (v1) with Corepack
RUN corepack enable && corepack prepare yarn@1.22.19 --activate

WORKDIR /app

# ---- deps: install server & client deps with caching ----
FROM base AS deps

# Copy root manifests (avoid copying .env into image)
COPY package.json yarn.lock ./
# If server/ and client/ have their own manifests, copy them so Yarn can cache
COPY server/package.json server/
COPY client/package.json client/

# Install root deps if you have a root package.json (optional)
RUN yarn install

# Install server deps
WORKDIR /app/server
RUN yarn install

# Install client deps
WORKDIR /app/client
RUN yarn install

# ---- build: compile client, etc. ----
FROM deps AS build

# Copy full source now that deps are cached
WORKDIR /app
COPY . .

# Build client (adjust script name if different)
WORKDIR /app/client
RUN yarn build

# Optionally: if your server serves the client’s built assets, copy them where your server expects them.
# Example: put client build into /app/server/public
# RUN mkdir -p /app/server/public && cp -r dist/* /app/server/public/

# ---- runtime: minimal, non-root ----
FROM base AS runtime

ENV NODE_ENV=production

WORKDIR /app
# Copy only what we need to run
COPY --from=build /app/server /app/server
# If your server needs the built client assets:
# COPY --from=build /app/server/public /app/server/public
# Or if your server reads from /app/client/dist at runtime:
COPY --from=build /app/client/dist /app/client/dist

# Prune devDependencies to keep image small (optional if using separate prod lockfiles)
WORKDIR /app/server
RUN yarn install

# Ensure ownership and drop privileges
WORKDIR /app
RUN chown -R node:node /app
USER node

# Expose the port your server listens on (adjust if needed)
# EXPOSE 3000

# Start the server
CMD ["node", "server/app.js"]
