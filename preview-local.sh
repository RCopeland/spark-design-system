#!/bin/bash
# preview-local.sh
# Builds and serves the Gatsby site locally (and storybooks if possible)
#
# Output structure:
#   http://localhost:8080/spark-design-system/          ← Gatsby docs
#   http://localhost:8080/spark-design-system/react/    ← React Storybook (if built)
#   http://localhost:8080/spark-design-system/angular/  ← Angular Storybook (if built)
#   http://localhost:8080/spark-design-system/html/     ← HTML Storybook (if built)

set -e

# Use Node 18 if available (required for old storybook dependencies)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 2>/dev/null || true

export NODE_OPTIONS=--openssl-legacy-provider

PREFIX="/spark-design-system"
PREVIEW_DIR="./preview"
PORT=${1:-8080}

echo "🔧 Building for local preview..."

# Clean preview directory
rm -rf $PREVIEW_DIR
mkdir -p $PREVIEW_DIR$PREFIX

# ── Build Gatsby site ──────────────────────────────────────────────────────────
echo ""
echo "📚 Building Gatsby documentation site..."
npm run build
cp -r public/* $PREVIEW_DIR$PREFIX/
cp -r storybook-assets $PREVIEW_DIR$PREFIX/

# ── Try to build Storybooks ────────────────────────────────────────────────────
BUILD_STORYBOOKS=true

for SUBPROJECT in react angular html; do
  echo ""
  echo "📖 Building $SUBPROJECT Storybook..."

  cd $SUBPROJECT

  # Install if needed
  if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    if ! npm install 2>/dev/null; then
      echo "   ⚠️  npm install failed for $SUBPROJECT, skipping..."
      BUILD_STORYBOOKS=false
      cd ..
      continue
    fi
  fi

  # Try to build storybook
  if npm run build-storybook 2>/dev/null; then
    mkdir -p ../$PREVIEW_DIR$PREFIX/$SUBPROJECT
    cp -r storybook-static/* ../$PREVIEW_DIR$PREFIX/$SUBPROJECT/
  else
    echo "   ⚠️  Storybook build failed for $SUBPROJECT (node-sass/Python issue)"
    echo "   To fix: install Python 2 or update node-sass to sass"
  fi

  cd ..
done

echo ""
echo "🌐 Starting local server..."
echo ""
echo "   Gatsby:  http://localhost:${PORT}${PREFIX}/"

if [ -d "$PREVIEW_DIR$PREFIX/react" ]; then
  echo "   React:   http://localhost:${PORT}${PREFIX}/react/"
fi
if [ -d "$PREVIEW_DIR$PREFIX/angular" ]; then
  echo "   Angular: http://localhost:${PORT}${PREFIX}/angular/"
fi
if [ -d "$PREVIEW_DIR$PREFIX/html" ]; then
  echo "   HTML:    http://localhost:${PORT}${PREFIX}/html/"
fi

echo ""
echo "   Press Ctrl+C to stop"
echo ""

# ── Serve ──────────────────────────────────────────────────────────────────────
npx serve $PREVIEW_DIR -l $PORT
