#!/bin/sh

# download models if not exist
if [ ! -d models ]; then
  ./script/fetch-models.sh
fi

# let's start
yarn start
