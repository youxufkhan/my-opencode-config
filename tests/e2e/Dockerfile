FROM alpine:latest

# Install dependencies
RUN apk add --no-cache nodejs npm git curl bash \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /test
COPY . /app

# Default command
CMD ["/bin/bash"]
