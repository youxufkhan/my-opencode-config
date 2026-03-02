#!/bin/bash
# E2E Test Runner for my-opencode CLI

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🧪 Running my-opencode E2E Tests"
echo "=================================="

# Build the project first
echo "📦 Building project..."
cd "$PROJECT_ROOT"
npm run build

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker to run E2E tests."
    exit 1
fi

# Build Docker image
echo "🐳 Building Docker test image..."
docker build -t my-opencode-test -f "$PROJECT_ROOT/tests/e2e/Dockerfile" "$PROJECT_ROOT"

# Run tests in Docker
echo "🚀 Running tests in Docker..."
docker run --rm -it \
    -v "$PROJECT_ROOT:/app" \
    -w /app \
    my-opencode-test \
    bash -c "
        cd /app
        npm install
        npm run build
        echo '✅ Build test passed'
        
        # Test config utilities
        node -e \"
            const { mergeConfigs } = require('./dist/utils/config');
            const result = mergeConfigs({a: 1, b: 2}, {b: 3, c: 4});
            if (result.a === 1 && result.b === 3 && result.c === 4) {
                console.log('✅ Config merge test passed');
            } else {
                console.log('❌ Config merge test failed');
                process.exit(1);
            }
        \"
        
        # Test model fetching
        node -e \"
            const { getGeminiModels } = require('./dist/commands/models');
            const models = getGeminiModels();
            const hasRecommended = models.some(m => m.isRecommended);
            if (hasRecommended) {
                console.log('✅ Model test passed');
            } else {
                console.log('❌ Model test failed');
                process.exit(1);
            }
        \"
        
        # Test plugin config
        node -e \"
            const { getRequiredPlugins, mergePluginConfig } = require('./dist/commands/plugins');
            const required = getRequiredPlugins();
            const merged = mergePluginConfig(['some-plugin'], required);
            if (merged.length >= required.length) {
                console.log('✅ Plugin test passed');
            } else {
                console.log('❌ Plugin test failed');
                process.exit(1);
            }
        \"
        
        echo ''
        echo '🎉 All tests passed!'
    "

echo ""
echo "✅ E2E tests completed successfully!"
