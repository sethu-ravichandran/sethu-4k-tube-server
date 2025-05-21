#!/usr/bin/env bash
set -o errexit

echo "Downloading yt-dlp binary..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp
chmod +x yt-dlp

mkdir -p bin
mv yt-dlp bin/yt-dlp
chmod +x bin/yt-dlp

echo "yt-dlp binary downloaded and moved to bin/ directory."
