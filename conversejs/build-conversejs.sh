#!/bin/bash

set -euo pipefail
set -x

rootdir="$(pwd)"
src_dir="$rootdir/conversejs"
converse_src_dir="$rootdir/vendor/converse.js"
converse_build_dir="$rootdir/build/converse.js"
converse_destination_dir="$rootdir/dist/client/conversejs"

if [[ ! -d $src_dir ]]; then
  echo "$0 must be called from the plugin livechat root dir."
  exit 1
fi

if [[ ! -d "$converse_src_dir" ]]; then
  echo "ConverseJS sources are not here. Please be sure to have all the submodules downloaded ('git pull --recurse-submodules')."
  exit 1
fi

if cmp -s "$converse_src_dir/package.json" "$converse_build_dir/package.json"; then
  echo "ConverseJS files are already up to date in the build directory."
else
  echo "ConverseJS files are not up to date in the build directory, copying them..."
  rm -rf "$converse_build_dir"
  mkdir -p "$converse_build_dir"
  cp -R $converse_src_dir/* "$converse_build_dir"
fi

echo "Removing existing custom files..."
rm -rf "$converse_build_dir/custom/"

echo "Adding the custom files..."
cp -r "$src_dir/custom/" "$converse_build_dir/custom/"
mv "$converse_build_dir/custom/webpack.livechat.js" "$converse_build_dir/"

if [[ ! -d "$converse_build_dir/node_modules" ]]; then
  echo "Missing node_modules directory, seems we have to call the makefile..."
  cd "$converse_build_dir"
  make node_modules src/*
  cd $rootdir
fi

echo "Building ConverseJS..."
cd "$converse_build_dir"
npx webpack --config webpack.livechat.js
cd $rootdir

echo "Copying ConverseJS dist files..."
mkdir -p "$converse_destination_dir" && cp -r $converse_build_dir/dist/* "$converse_destination_dir/"

echo "ConverseJS OK."

exit 0
