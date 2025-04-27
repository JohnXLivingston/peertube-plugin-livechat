#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
#
# SPDX-License-Identifier: AGPL-3.0-only

set -euo pipefail

po4afile="support/documentation/po/po4a.conf"
build_pot_in_folder="build/documentation/pot_in"
ignore_pattern='^#*\s*\{\{%\s*livechat_label[^\}]+\s*\}\}\s*$'

# Is po4a new enough?
function version_gt() { test "$(printf '%s\n' "$@" | sort -V | head -n 1)" != "$1"; }
required_version='0.69'
current_version=$(po4a --version | sed -En 's,po4a version ([0-9][0-9.]+[0-9]).*,\1,p')
if version_gt "$required_version" "$current_version"; then
    echo "ERROR: po4a v$required_version or higher required. Current version: $current_version"
    exit 1
fi

mkdir -p $build_pot_in_folder
mkdir -p "support/documentation/i18n/"

function getLangs() {
  grep -P '\[Languages\..+\]' support/documentation/config.toml | sed -E 's/^.*\.(.+)\].*$/\1/' | grep -v en
}

function generatePo4aConf() {
  echo "Creating $po4afile file..."
  echo "" > $po4afile

  # First, list all existing langs, from the config.toml file:
  echo -n "[po4a_langs] " >> $po4afile
  getLangs | while read lang; do
    echo -n "$lang " >> $po4afile
  done
  echo "" >> $po4afile

  # po4a_paths:
  echo "[po4a_paths] support/documentation/po/livechat.en.pot \$lang:support/documentation/po/livechat.\$lang.po" >> $po4afile

  # options:
  echo -n "[options] " >> $po4afile
  echo -n 'opt:"--addendum-charset=UTF-8" ' >> $po4afile
  echo -n 'opt:"--localized-charset=UTF-8" ' >> $po4afile
  echo -n 'opt:"--master-charset=UTF-8" ' >> $po4afile
  echo -n 'opt:"--master-language=en_US" ' >> $po4afile
  echo -n 'opt:"--msgmerge-opt=--no-wrap" ' >> $po4afile
  echo -n 'opt:"--porefs=file" ' >> $po4afile
  echo -n 'opt:"--wrap-po=newlines" ' >> $po4afile
  echo -n 'opt:"--package-name=peertube-plugin-livechat-documentation" ' >> $po4afile

  echo "" >> $po4afile

  # Markdown related options:
  echo -n '[po4a_alias:markdown] text  ' >> $po4afile
  echo -n 'opt:"--option markdown" ' >> $po4afile
  # keys from the «Front Matter» section to translate:
  echo -n 'opt:"--option yfm_keys=title,description" ' >> $po4afile
  # # dont wrap lines:
  # echo -n 'opt:"--option neverwrap" ' >> $po4afile

  # handling hugo directive (when full line). For example: {{% notice tip %}}, {{% children %}}, ...
  echo -n 'opt:"--option breaks=' >> $po4afile
  echo -n "'" >> $po4afile
  echo -n '^\{\{%.*%\}\}$' >> $po4afile
  echo -n "'" >> $po4afile
  echo -n '" ' >> $po4afile

  echo -n 'opt:"--addendum-charset=UTF-8" ' >> $po4afile
  echo -n 'opt:"--localized-charset=UTF-8" ' >> $po4afile
  echo -n 'opt:"--master-charset=UTF-8" ' >> $po4afile
  # generate translation even if incomplete:
  echo -n 'opt:"--keep=0" ' >> $po4afile
  echo "" >> $po4afile
  echo "" >> $po4afile

  # We must now list all english files to translate:
  find support/documentation/content/en/ -name '*.md' | sort | while read source_file; do
    target_file=$(echo "$source_file" | sed -E "s/\/content\/en\//\/content\/translations\/\$lang\//")

    echo -n '[type: markdown] ' >> $po4afile
    echo -n $source_file >> $po4afile
    echo -n " " >> $po4afile

    # Some files have strings to ignore. For example, when the whole line/title is using the livechat_label shortcode.
    # To do so, we will use the pot_in option (see https://po4a.org/man/man1/po4a.1.php).
    # We are generating a filtered file, that will be used.
    # There is also a special case:
    #   If the file Yaml Font Matter contains the livechatnotranslation option, we just copy the file.
    #   To do so, we use the pot_in option, by generating an empty file.
    pot_in_file=$(echo "$source_file" | sed -E 's/support\/documentation\/content\/en\//build\/documentation\/pot_in\//')
    pot_in_file_dir=$(dirname "$pot_in_file")
    use_pot_in=""
    if grep -q -P '^livechatnotranslation\s*:\s*true\s*$' "$source_file"; then
      echo "File $source_file must not be translated."
      mkdir -p "$pot_in_file_dir"
      echo "" > "$pot_in_file"

      echo -n "pot_in:$pot_in_file " >> $po4afile
    else
      if grep -q -P "$ignore_pattern" $source_file; then
        echo "File $source_file contains pattern to ignore, we must create a filtered pot_in file."
        mkdir -p "$pot_in_file_dir"
        grep -v -P "$ignore_pattern" $source_file > "$pot_in_file";

        echo -n "pot_in:$pot_in_file " >> $po4afile
      fi
    fi

    echo -n '$lang:'$target_file >> $po4afile
    echo "" >> $po4afile
  done
}

function runPo4a() {
  echo "Running po4a..."
  po4a $po4afile
}

function copyLivechatLanguages() {
  echo "Copying livechat yml languages files to the hugo directory..."
  find languages/ -name '*.yml' | while read file; do
    # We need to rename .yml to .yaml... don't ask, hugo stuff...
    new_filename=$(echo "$file" | sed -E "s/languages\/(.*)\.yml$/support\/documentation\/i18n\/\1.yaml/")
    cp $file $new_filename
  done
}

generatePo4aConf
copyLivechatLanguages
runPo4a