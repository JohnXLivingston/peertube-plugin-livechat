#!/bin/bash

set -euo pipefail
set -x

# Set CONVERSE_VERSION and CONVERSE_REPO to select which repo and tag/commit/branch use.
# Defaults values:
CONVERSE_VERSION="v10.1.6"
CONVERSE_REPO="https://github.com/conversejs/converse.js.git"
# You can eventually set CONVERSE_COMMIT to a specific commit ID, if you want to apply some patches.
CONVERSE_COMMIT=""

# 2014-01-16: we are using a custom version, to wait for some PR to be apply upstream.
# This version includes following changes:
# - #converse.js/3300: Adding the maxWait option for `debouncedPruneHistory`
# - #converse.js/3302: debounce MUC sidebar rendering
# - Fix: refresh the MUC sidebar when participants collection is sorted
# - Fix: MUC occupant list does not sort itself on nicknames or roles changes
# This version already includes following changes that will not be merged in ConverseJS upstream:
# - Don't load vCards for all room occupants when the right menu is closed
# - Changing the default avatar, for something very light (to mitigate blinking effect when vCards are loaded)
# - Custom settings livechat_load_all_vcards for the readonly mode
# - Adding "users" icon in the menu toggle button
CONVERSE_COMMIT="a99abdfb91c00daa6c4bacbbc31b47ab6762704f"
CONVERSE_REPO="https://github.com/JohnXLivingston/converse.js"

rootdir="$(pwd)"
src_dir="$rootdir/conversejs"
converse_src_dir="$rootdir/vendor/conversejs-$CONVERSE_VERSION"
if [ -n "$CONVERSE_COMMIT" ]; then
  converse_src_dir="$converse_src_dir-$CONVERSE_COMMIT"
fi
converse_build_dir="$rootdir/build/conversejs"
converse_destination_dir="$rootdir/dist/client/conversejs"

if [[ ! -d $src_dir ]]; then
  echo "$0 must be called from the plugin livechat root dir."
  exit 1
fi

if [[ ! -d "$converse_src_dir" ]]; then
  if [ -n "$CONVERSE_COMMIT" ]; then
    echo "Fetching ConverseJS commit $CONVERSE_COMMIT."
    mkdir -p $converse_src_dir
    cd $converse_src_dir
    git init
    git remote add origin $CONVERSE_REPO
    git fetch --depth 1 origin $CONVERSE_COMMIT
    git checkout $CONVERSE_COMMIT
    # In order to be able to test if $converse_build_dir is up to date, we add the commit id in a file:
    cd -
    echo "$CONVERSE_COMMIT" > "$converse_src_dir/current"
  else
    echo "Shallow cloning ConverseJS."
    git clone --depth=1 --branch $CONVERSE_VERSION $CONVERSE_REPO $converse_src_dir
    echo "$CONVERSE_VERSION" > "$converse_src_dir/current"
  fi
  rm -rf "$converse_build_dir"
fi

if cmp -s "$converse_src_dir/package.json" "$converse_build_dir/package.json" && cmp -s "$converse_src_dir/current" "$converse_build_dir/current"; then
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
