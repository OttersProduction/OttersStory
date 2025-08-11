# Build stage
FROM golang:1.22-alpine AS builder

# Set working directory
WORKDIR /app

# Install necessary build tools
RUN apk add --no-cache git gcc musl-dev

# Copy go mod files first for better caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application with explicit error checking
RUN echo "=== BUILDING DISCORD BOT ===" && \
    echo "Current directory: $(pwd)" && \
    echo "Files in current directory:" && \
    ls -la && \
    echo "Building with CGO..." && \
    CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -v -o discord-bot . && \
    echo "Build completed successfully!" && \
    echo "Binary details:" && \
    ls -la discord-bot && \
    file discord-bot && \
    echo "Binary size: $(du -h discord-bot | cut -f1)"

# Final stage
FROM alpine:latest

# Add ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/discord-bot ./

# Verify and set permissions
RUN echo "=== VERIFYING BINARY COPY ===" && \
    ls -la discord-bot && \
    chmod +x discord-bot && \
    echo "Binary is executable: $(file discord-bot)"

# Copy CSV data files
RUN mkdir -p ./data
COPY internal/ai/data/*.csv ./data/

# Create necessary files
RUN touch .env && touch database.db

# Create entrypoint script
RUN printf '#!/bin/sh\n\
set -e\n\
\n\
echo "=== STARTING DISCORD BOT ==="\n\
echo "Current directory: $(pwd)"\n\
echo "Files in current directory:"\n\
ls -la\n\
\n\
if [ -f "/run/secrets/discord_token" ]; then\n\
    echo "DISCORD_TOKEN=$(cat /run/secrets/discord_token)" > .env\n\
    echo "Discord token loaded from secrets"\n\
else\n\
    echo "No discord token secret found, using existing .env file"\n\
fi\n\
\n\
if [ -f "/run/secrets/openai_key" ]; then\n\
    echo "OPENAI_API_KEY=$(cat /run/secrets/openai_key)" >> .env\n\
    echo "OpenAI API key loaded from secrets"\n\
else\n\
    echo "No OpenAI API key secret found, using existing .env file"\n\
fi\n\
\n\
echo "Final binary check:"\n\
ls -la discord-bot\n\
\n\
echo "Executing discord-bot..."\n\
exec "$@"\n' > /entrypoint.sh \
    && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["./discord-bot"]
