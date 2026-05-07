#!/bin/bash
# Batch generate AVIF + WebP variants for all in-use images.
# Idempotent: skips files that already have variants.

set -e
cd /home/claude/balance-physio

count_jpg=0
count_avif=0
count_webp=0
count_skip=0

# Process JPG/JPEG sources -> generate AVIF + WebP siblings
gen_avif_webp() {
  local src="$1"
  local base="${src%.*}"
  local avif="${base}.avif"
  local webp="${base}.webp"

  count_jpg=$((count_jpg+1))

  if [ ! -f "$avif" ]; then
    avifenc --speed 8 --min 25 --max 40 -j 2 -y 420 "$src" "$avif" >/dev/null 2>&1
    count_avif=$((count_avif+1))
  fi

  if [ ! -f "$webp" ]; then
    convert "$src" -quality 75 -define webp:method=4 "$webp" 2>/dev/null
    count_webp=$((count_webp+1))
  fi
}

# Process WebP-only sources -> generate AVIF + JPG fallback
gen_avif_jpg_from_webp() {
  local src="$1"
  local base="${src%.*}"
  local avif="${base}.avif"
  local jpg="${base}.jpg"

  if [ ! -f "$avif" ]; then
    # avifenc accepts webp via libheif/decoder
    convert "$src" -quality 95 /tmp/_webp_to_png_$$.png 2>/dev/null
    avifenc --speed 8 --min 25 --max 40 -j 2 -y 420 /tmp/_webp_to_png_$$.png "$avif" >/dev/null 2>&1
    rm -f /tmp/_webp_to_png_$$.png
    count_avif=$((count_avif+1))
  fi

  if [ ! -f "$jpg" ]; then
    convert "$src" -quality 82 -strip "$jpg" 2>/dev/null
    count_webp=$((count_webp+1))
  fi
}

export -f gen_avif_webp gen_avif_jpg_from_webp

# Find all JPG/JPEG and process
echo "Phase 1: JPG/JPEG -> AVIF + WebP variants..."
find public -type f \( -name '*.jpg' -o -name '*.jpeg' -o -name '*.JPG' \) | while read f; do
  gen_avif_webp "$f"
done
echo "  done."

echo ""
echo "Phase 2: WebP-only sources (no matching JPG) -> AVIF + JPG fallback..."
find public -type f -name '*.webp' | while read f; do
  base="${f%.*}"
  if [ ! -f "${base}.jpg" ] && [ ! -f "${base}.jpeg" ]; then
    gen_avif_jpg_from_webp "$f"
  fi
done
echo "  done."

echo ""
echo "Final counts:"
echo "  JPG sources (existing): $(find public -type f \( -name '*.jpg' -o -name '*.jpeg' \) | wc -l)"
echo "  WebP variants total:    $(find public -type f -name '*.webp' | wc -l)"
echo "  AVIF variants total:    $(find public -type f -name '*.avif' | wc -l)"
