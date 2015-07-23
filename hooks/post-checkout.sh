#!/bin/bash

source ~/.nvm/nvm.sh

# git hook to run a command after `git pull` if a specified file was changed
changed_files="$(git diff-tree -r --name-only --no-commit-id HEAD@{1} HEAD)"

check_run() {
  echo "$changed_files" | grep --quiet "$1" && eval "$2"
}

check_run package.json "npm install"
check_run bower.json "bower install"
