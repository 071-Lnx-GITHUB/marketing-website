#!/bin/bash

# Check git config push default for safety.
pushdefault=$(git config push.default || echo '')
if [ "$pushdefault" != "current" ]; then
  echo "WARNING: Your git config's push.default is not set to current branch.\
  \nTo fix this, please run: git config --global push.default current && git config --local --unset push.default"
fi

# Check git pull behavior for cleanliness.
pullrebase=$(git config pull.rebase || echo '')
pullff=$(git config pull.ff || echo '')
gitversion=$(git --version)
if [ "$pullrebase" == "true" ]; then
  : # No warning.
elif [ "$pullff" == "only" ] && [[ $gitversion =~ git\ version\ 2\.* ]]; then
  : # No warning; this person probably keeps a clean git history.
else
  echo "WARNING: Your git config's pull.rebase is not set to true.\
  \nTo fix this, please run: git config --global --bool pull.rebase true && git config --local --unset pull.rebase"
fi
