#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
#
# SPDX-License-Identifier: AGPL-3.0-only

set -euo pipefail
# set -x

# This script download the Prosody AppImage from the https://github.com/JohnXLivingston/prosody-appimage project.

repo_base_url='https://github.com/JohnXLivingston/prosody-appimage/releases/download'
wanted_release='v0.12.4-3'

x86_64_filename='prosody-x86_64.AppImage'
x86_64_sha256sum='83a583ac7036387514bed17afab257dab4161ccdd0ab7453818c78b51f830357'
aarch64_filename='prosody-aarch64.AppImage'
aarch64_sha256sum='7b7e6bf30d4498fc99a40022232c3065707ee4f4df24dc17947b007621634304'

download_dir="$(pwd)/vendor/prosody-appimage"
dist_dir="$(pwd)/dist/server/prosody"

mkdir -p $download_dir
cd $download_dir

function check_sha256() {
  echo "Testing if file exists, and have correct checksums"
  if [ ! -f $x86_64_filename ]; then
    echo "File $x86_64_filename does not exists"
    return 1
  fi
  if echo "$x86_64_sha256sum $x86_64_filename" | sha256sum --check; then
    echo "File $x86_64_filename has the correct hashsum."
  else
    echo "File $x86_64_filename has not the correct hashsum."
    return 1
  fi

  if [ ! -f $aarch64_filename ]; then
    echo "File $aarch64_filename does not exists"
    return 1
  fi
  if echo "$aarch64_sha256sum $aarch64_filename" | sha256sum --check; then
    echo "File $aarch64_filename has the correct hashsum."
  else
    echo "File $aarch64_filename has not the correct hashsum."
    return 1
  fi
  return 0
}

if check_sha256; then
  echo "Files are present in $download_dir"
else
  echo "Missing or incorrect Prosody AppImage files, downloading"
  rm -f $x86_64_filename
  rm -f $aarch64_filename
  wget "$repo_base_url/$wanted_release/$x86_64_filename"
  wget "$repo_base_url/$wanted_release/$aarch64_filename"

  echo "Checking that newly downloaded files are correct"
  if check_sha256; then
    echo "Yep, they are correct"
  else
    echo "Can't correctly download Prosody AppImage files"
    exit 1
  fi
fi

echo "Copying Prosody AppImage files in the dist folder"
mkdir -p "$dist_dir" && cp $x86_64_filename "$dist_dir/livechat-prosody-x86_64.AppImage"
mkdir -p "$dist_dir" && cp $aarch64_filename "$dist_dir/livechat-prosody-aarch64.AppImage"
echo "Chmod+x for the AppImages in the dist dir"
chmod u+x "$dist_dir/livechat-prosody-x86_64.AppImage"
chmod u+x "$dist_dir/livechat-prosody-aarch64.AppImage"

exit 0
