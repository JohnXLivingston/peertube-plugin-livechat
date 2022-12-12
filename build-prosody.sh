#!/bin/bash

set -euo pipefail
set -x

rootdir="$(pwd)"
prosody_build_dir="$rootdir/build/prosody"
prosody_destination_dir="$rootdir/dist/server/prosody"

if [[ ! -d "$prosody_build_dir" ]]; then
  mkdir -p "$prosody_build_dir"
fi

cd "$prosody_build_dir"

# if [ -f "$prosody_build_dir/livechat-prosody-x86_64.AppImage" ] && [ -f "$prosody_build_dir/livechat-prosody-aarch64.AppImage" ]; then
if [ -f "$prosody_build_dir/livechat-prosody-x86_64.AppImage" ]; then
  echo "Prosody images already built."
else
  echo "Prosody images must be build..."

  # Prerequisite: you must have python3-venv installed on your system
  if [[ ! -d "venv" ]]; then
    echo "Creating the python venv..."
    python3 -m venv venv
  fi

  echo "Activating the python venv..."
  source venv/bin/activate

  echo "Installing appimage-builder..."
  pip3 install appimage-builder

  echo "Copying appimage source files..."
  cp "$rootdir/prosody/appimage_x86_64.yml" "$prosody_build_dir/appimage_x86_64.yml"
  # cp "$rootdir/prosody/appimage_aarch64.yml" "$prosody_build_dir/appimage_aarch64.yml"
  cp "$rootdir/prosody/launcher.lua" "$prosody_build_dir/launcher.lua"

  echo "Building Prosody x86_64..."
  appimage-builder --recipe "$prosody_build_dir/appimage_x86_64.yml"

  # echo "Cleaning build folders before building aarch64..."
  # rm -rf "$prosody_build_dir/AppDir"
  # rm -rf "$prosody_build_dir/appimage-build"

  # echo "Building Prosody aarch64..."
  # appimage-builder --recipe "$prosody_build_dir/appimage_aarch64.yml"

  # For some obscur reason, if we keep AppDir and appimage-build folders,
  # and if we try to install the plugin using the Peertube CLI,
  # the installation fails because there are some subfolders that are right protected.
  # To avoid that, we clean them:
  echo "Cleaning build folders..."
  rm -rf "$prosody_build_dir/AppDir"
  rm -rf "$prosody_build_dir/appimage-build"
fi

echo "Copying Prosody dist files..."
mkdir -p "$prosody_destination_dir" && cp $prosody_build_dir/livechat-prosody-x86_64.AppImage "$prosody_destination_dir/"
# mkdir -p "$prosody_destination_dir" && cp $prosody_build_dir/livechat-prosody-aarch64.AppImage "$prosody_destination_dir/"

echo "Prosody AppImages OK."

exit 0
