# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Install necessary packages
RUN apk add --no-cache sqlite ffmpeg

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create database directory and files
RUN mkdir -p ./data
RUN touch database.db

# Create entrypoint script
RUN printf '#!/bin/sh\n\
set -e\n\
\n\
echo "Starting Discord bot..."\n\
\n\
if [ -f "/run/secrets/discord_token" ]; then\n\
    echo "DISCORD_TOKEN=$(cat /run/secrets/discord_token)" > .env\n\
else\n\
    echo "No discord token secret found, using existing .env file"\n\
fi\n\
\n\
if [ -f "/run/secrets/openai_key" ]; then\n\
    echo "OPENAI_API_KEY=$(cat /run/secrets/openai_key)" >> .env\n\
else\n\
    echo "No OpenAI API key secret found, using existing .env file"\n\
fi\n\
\n\
echo "Starting TypeScript Discord bot..."\n\
exec "$@"\n' > /entrypoint.sh \
    && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "start"]
