#!/bin/bash

set -euo pipefail

po4afile="support/documentation/po/po4a.conf"

function getLangs() {
  grep -P '\[Languages.\w+\]' support/documentation/config.toml | sed -E 's/^.*\.(\w+)\].*$/\1/' | grep -v en
}

function generatePo4aConf() {
  echo "    creating $po4afile file."
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
  echo "" >> $po4afile

  # Markdown related options:
  echo -n '[po4a_alias:markdown] text  ' >> $po4afile
  echo -n 'opt:"--option markdown" ' >> $po4afile
  # keys from the «Front Matter» section to translate:
  echo -n 'opt:"--option yfm_keys=title,description" ' >> $po4afile
  # dont wrap lines:
  echo -n 'opt:"--option neverwrap" ' >> $po4afile
  # handling hugo directive (when full line). For example: {{% notice tip %}}, {{% children %}}, ... :
  echo -n 'opt:"--option breaks='^\{\{%.*%\}\}$'" ' >> $po4afile
  echo -n 'opt:"--addendum-charset=UTF-8" ' >> $po4afile
  echo -n 'opt:"--localized-charset=UTF-8" ' >> $po4afile
  echo -n 'opt:"--master-charset=UTF-8" ' >> $po4afile
  # generate translation even if incomplete:
  echo -n 'opt:"--keep=0" ' >> $po4afile
  echo "" >> $po4afile
  echo "" >> $po4afile

  # We must now list all english files to translate:
  find support/documentation/content/en/ -name '*.md' | while read source_file; do
    echo -n '[type: markdown] ' >> $po4afile
    echo -n $source_file >> $po4afile
    echo -n " " >> $po4afile
    target_file=$(echo "$source_file" | sed -E "s/\/content\/en\//\/content\/translation\/\$lang\//")
    echo -n '$lang:'$target_file >> $po4afile
    echo "" >> $po4afile
  done
}

function runPo4a() {
  echo "Running po4a..."
  po4a $po4afile
}

generatePo4aConf
runPo4a