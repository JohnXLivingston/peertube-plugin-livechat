#!/bin/bash

set -euo pipefail

function getLangs() {
  grep -P '\[Languages.\w+\]' support/documentation/config.toml | sed -E 's/^.*\.(\w+)\].*$/\1/' | grep -v en
}

function createMissingFile() {
  source_file=$1
  wanted_file=$2
  echo "    creating $wanted_file from $source_file"
  # getting everything between +++ and +++:
  sed -n '/\+\+\+/,/\+\+\+/p' "$source_file" > "$wanted_file"
  # Adding the warning notice:
  echo "
{{% notice warning %}}
This page is not yet translated in your language, please refer to the english version. You can switch to it by using the language selector in the left menu.
{{% /notice %}}" >> "$wanted_file"
}

find support/documentation/content -name '*.en.md' | while read source_file; do
  echo "File $source_file:"
  getLangs | while read lang; do
    wanted_file=$(echo "$source_file" | sed -E "s/.en.md\$/.$lang.md/")
    if test -f $wanted_file; then
      echo "  File $wanted_file OK"
    else
      createMissingFile "$source_file" "$wanted_file"
    fi
  done
done
