#!/bin/bash
# deploy-gh-pages.sh
# Builds and deploys the Gatsby site + all Storybooks to GitHub Pages
#
# Output structure:
#   /spark-design-system/          ← Gatsby docs
#   /spark-design-system/react/    ← React Storybook
#   /spark-design-system/angular/  ← Angular Storybook
#   /spark-design-system/html/     ← HTML Storybook

set -e

# Use Node 18 if available (required for old storybook dependencies)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 2>/dev/null || true

export NODE_OPTIONS=--openssl-legacy-provider

PREFIX="/spark-design-system"
BUILD_DIR="./gh-pages-build"

echo "🚀 Building for GitHub Pages..."

# Clean build directory
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR$PREFIX

# ── Build Gatsby site ──────────────────────────────────────────────────────────
echo ""
echo "📚 Building Gatsby documentation site..."
npm run build
cp -r public/* $BUILD_DIR$PREFIX/
cp -r storybook-assets $BUILD_DIR$PREFIX/

# ── Try to build Storybooks ────────────────────────────────────────────────────
for SUBPROJECT in react angular html; do
  echo ""
  echo "📖 Building $SUBPROJECT Storybook..."

  cd $SUBPROJECT

  # Install if needed
  if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    if ! npm install 2>/dev/null; then
      echo "   ⚠️  npm install failed for $SUBPROJECT, skipping..."
      cd ..
      continue
    fi
  fi

  # Try to build storybook
  if NODE_OPTIONS=--openssl-legacy-provider npm run build-storybook 2>/dev/null; then
    mkdir -p ../$BUILD_DIR$PREFIX/$SUBPROJECT
    cp -r storybook-static/* ../$BUILD_DIR$PREFIX/$SUBPROJECT/

    # Inject <base href> into HTML files for GitHub Pages
    echo "   Injecting <base href> for subdirectory deployment..."
    for htmlfile in ../$BUILD_DIR$PREFIX/$SUBPROJECT/*.html; do
      if [ -f "$htmlfile" ]; then
        sed -i.bak "s|<head>|<head><base href=\"${PREFIX}/${SUBPROJECT}/\">|" "$htmlfile" 2>/dev/null || \
        sed -i '' "s|<head>|<head><base href=\"${PREFIX}/${SUBPROJECT}/\">|" "$htmlfile"
        rm -f "${htmlfile}.bak"
      fi
    done
  else
    echo "   ⚠️  Storybook build failed for $SUBPROJECT"
  fi

  cd ..
done

# ── Deploy ─────────────────────────────────────────────────────────────────────
echo ""
echo "📤 Deploying to gh-pages..."
npx gh-pages -d $BUILD_DIR --dotfiles

# Cleanup
rm -rf $BUILD_DIR

echo ""
echo "✅ Done! Site deployed to GitHub Pages."
echo "   Gatsby:    robcopeland.me${PREFIX}/"

# Check if storybooks were built
if [ -d "$BUILD_DIR$PREFIX/react" ] 2>/dev/null; then
  echo "   React:     robcopeland.me${PREFIX}/react/"
  echo "   Angular:   robcopeland.me${PREFIX}/angular/"
  echo "   HTML:      robcopeland.me${PREFIX}/html/"
fi
