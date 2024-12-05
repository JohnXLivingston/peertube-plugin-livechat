#!/bin/bash

# SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
#
# SPDX-License-Identifier: AGPL-3.0-only

NO_CONVERSEJS_LOC=""
if [ "$1" = "no-loc" ]; then
  echo "We won't generate ConverseJS localization files!"
  NO_CONVERSEJS_LOC="1"
fi

set -euo pipefail
set -x

# Set CONVERSE_VERSION and CONVERSE_REPO to select which repo and tag/commit/branch use.
# Defaults values:
CONVERSE_VERSION="v11.0.0"
CONVERSE_REPO="https://github.com/conversejs/converse.js.git"
# You can eventually set CONVERSE_COMMIT to a specific commit ID, if you want to apply some patches.
# 2024-09-17: using Converse upstream (v11 WIP).
CONVERSE_COMMIT="07dc6f4f5da5890b02a46a8a2f2d0498649786bc"
# 2024-12-03: using Converse upstream (v11 WIP).
CONVERSE_COMMIT="8f32df723e3aa392db02326dc6a3279c9497b6fb"

# It is possible to use another repository, if we want some customization that are not upstream (yet):
# CONVERSE_VERSION="livechat"
# # CONVERSE_COMMIT="4402fcc3fc60f6c9334f86528c33a0b463371d12"
# CONVERSE_REPO="https://github.com/JohnXLivingston/converse.js"
# CONVERSE_COMMIT="xxxx"

# 2024-09-03: include badges short label and quick fix for sendMessage button
CONVERSE_REPO="https://github.com/JohnXLivingston/converse.js"
CONVERSE_VERSION="livechat-12.0.1"
CONVERSE_COMMIT=""
# 2024-12-05: fix emojis (don't want some upstream feature, but want this fix)
# CONVERSE_COMMIT="366a718f16e96c88c6d768722f1525801a2f0c4d"

rootdir="$(pwd)"
src_dir="$rootdir/conversejs"
converse_src_dir="$rootdir/vendor/conversejs-$CONVERSE_VERSION"
if [ -n "$CONVERSE_COMMIT" ]; then
  converse_src_dir="$converse_src_dir-$CONVERSE_COMMIT"
fi
converse_build_dir="$rootdir/build/conversejs"
converse_destination_dir="$rootdir/dist/client/conversejs"
converse_emoji_destination="$rootdir/dist/converse-emoji.json"

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
# overriding original index.js file:
mv "$converse_build_dir/custom/index.js" "$converse_build_dir/src/"
cp "$src_dir/loc.keys.js" "$converse_build_dir/"

echo "Patching i18n files to add custom labels..."
/bin/env node conversejs/build-conversejs-patch-i18n.js

if [[ ! -d "$converse_build_dir/node_modules" ]]; then
  echo "Missing node_modules directory, seems we have to call the makefile..."
  cd "$converse_build_dir"
  make node_modules src/*
  cd $rootdir
fi

echo "Building ConverseJS..."
cd "$converse_build_dir"

if [ "$NO_CONVERSEJS_LOC" = "1" ]; then
  echo "Building without ConverseJS localization files!"
  # shortcut to build more quickly for dev purpose (see npm run build:converjs-no-loc)
  npx webpack --config webpack.livechat.js
else
  # Note: following lines are from the ConverseJS Makefile (see "make dist" code), where we just replace the "npm run build" with our webpack.livechat.js.
  #   Ideally this should just be `npm run build`.
  #   The additional steps are necessary to properly generate JSON chunk files
  #   from the .po files. The nodeps config uses preset-env with IE11.
  #   Somehow this is necessary.
  npm run nodeps
  TMPD=$(mktemp -d)
  mv dist/locales $TMPD && npx webpack --config webpack.livechat.js && mv $TMPD/locales/*-po.js dist/locales/ && rm -rf $TMPD
  rm dist/converse-no-dependencies.js dist/converse-no-dependencies.js.map
fi

cd $rootdir

echo "Copying ConverseJS dist files..."
mkdir -p "$converse_destination_dir" && cp -r $converse_build_dir/dist/* "$converse_destination_dir/"

echo "Copying ConverseJS original emoji.json file..." # this is needed for some backend code.
cp "$converse_build_dir/src/headless/plugins/emoji/emoji.json" "$converse_emoji_destination"

echo "ConverseJS OK."

exit 0
