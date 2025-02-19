# Build stage
FROM golang:1.22-alpine AS builder

# Set working directory
WORKDIR /app

# Install necessary build tools
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o discord-bot

# Final stage
FROM alpine:latest

# Add ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/discord-bot .

# Create entrypoint script using printf to ensure proper line endings
RUN printf '#!/bin/sh\nif [ -f "/run/secrets/discord_token" ]; then\n    echo "DISCORD_TOKEN=$(cat /run/secrets/discord_token)" > .env\nfi\n\nexec "$@"\n' > /entrypoint.sh \
    && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["./discord-bot"]
