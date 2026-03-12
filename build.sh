#!/usr/bin/env bash
# Build extension ZIPs for all browser stores
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
DIST="$DIR/dist"
rm -rf "$DIST"
mkdir -p "$DIST"

FILES="manifest.json content.js background.js popup.html popup.js icons/"

echo "Building extension packages..."

# Build using tar + node (zip may not be installed)
cd "$DIR"
if command -v zip &>/dev/null; then
  zip -r "$DIST/copy-as-markdown.zip" $FILES -x "*.git*"
elif command -v python3 &>/dev/null; then
  python3 -c "
import zipfile, glob, os
os.chdir('$DIR')
with zipfile.ZipFile('$DIST/copy-as-markdown.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for f in ['manifest.json', 'content.js', 'background.js', 'popup.html', 'popup.js']:
        z.write(f)
    for f in glob.glob('icons/*'):
        z.write(f)
"
else
  echo "ERROR: Need zip or python3 to build"
  exit 1
fi
echo "  -> dist/copy-as-markdown.zip (Chrome + Edge + Firefox)"

echo ""
echo "All packages built in dist/"
ls -la "$DIST"/*.zip
