#!/usr/bin/env bash

set -euo pipefail

output_dir="${1:-public}"

zola build --output-dir "$output_dir"

find "$output_dir" -type f ! -path "$output_dir/precache.json" -printf '/%P\0' \
  | sort -z \
  | jq -Rs '
      split("\u0000")
      | map(select(length > 0))
      | . as $files
      | ($files + [
          $files[]
          | select(endswith("/index.html"))
          | sub("index.html$"; "")
        ])
      | unique
    ' > "$output_dir/precache.json"

build_hash="$({
  find "$output_dir" -type f ! -path "$output_dir/precache.json" -print0 \
    | sort -z \
    | xargs -0 sha256sum
  sha256sum "$output_dir/precache.json"
} | sha256sum | cut -c1-12)"

sed -i \
  "s/const CACHE_NAME = \"desk-build\";/const CACHE_NAME = \"desk-$build_hash\";/" \
  "$output_dir/sw.js"
