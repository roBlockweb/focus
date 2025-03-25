#\!/bin/bash

# Create square icons with text "FF" for FocusFlow
# Using ImageMagick's convert utility (if available)

create_icon() {
  local size=$1
  convert -size ${size}x${size} xc:darkblue -fill white -gravity center -pointsize $((size/2)) -font Arial -annotate 0 "FF" "icon${size}.png"
  echo "Created icon${size}.png"
}

# Check if ImageMagick is installed
if command -v convert >/dev/null 2>&1; then
  create_icon 16
  create_icon 48
  create_icon 128
  echo "All icons created successfully."
else
  echo "ImageMagick not found. Creating placeholder files instead."
  touch icon16.png icon48.png icon128.png
  echo "Created placeholder icon files."
fi
