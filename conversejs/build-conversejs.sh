#!/bin/bash

set -euo pipefail
set -x

rootdir="$(pwd)"
src_dir="$rootdir/conversejs"
converse_src_dir="$rootdir/vendor/converse.js"
converse_build_dir="$rootdir/build/converse.js"
converse_destination_dir="$rootdir/dist/client/conversejs"

if [[ ! -d $src_dir ]]; then
  echo "$0 must be called from the plugin livechat root dir.\n"
  exit 1
fi

if [[ ! -d "$converse_src_dir" ]]; then
  echo "ConverseJS sources are not here. Please be sure to have all the submodules downloaded ('git pull --recurse-submodules').\n"
  exit 1
fi

if cmp -s "$converse_src_dir/package.json" "$converse_build_dir/package.json"; then
  echo "ConverseJS files are already up to date in the build directory.\n"
else
  echo "ConverseJS files are not up to date in the build directory, copying them...\n"
  rm -rf "$converse_build_dir"
  mkdir -p "$converse_build_dir"
  cp -R $converse_src_dir/* "$converse_build_dir"
fi

echo "Building ConverseJS"
cd "$converse_build_dir"
make dist
cd $rootdir

echo "Copying ConverseJS dist files...\n"
mkdir -p "$converse_destination_dir" && cp -r $converse_build_dir/dist/* "$converse_destination_dir/"

echo "ConverseJS OK.\n"

exit 0
