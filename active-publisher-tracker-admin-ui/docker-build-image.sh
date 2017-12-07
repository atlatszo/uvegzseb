#!/bin/bash

DOCKER_IMAGE_NAME=docker.precognox.com/active-publisher-tracker/active-publisher-tracker-admin-frontend

if [ $# -eq 0 ]; then
  echo "current version: $(release-versioning)"
  TAG=$(release-versioning)
else
  echo "using tag: $1"
  TAG=$1
fi

yarn install
npm run build && docker build -t $DOCKER_IMAGE_NAME:$TAG .

