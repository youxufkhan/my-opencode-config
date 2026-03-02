FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /test

# Default command
CMD ["/bin/bash"]
