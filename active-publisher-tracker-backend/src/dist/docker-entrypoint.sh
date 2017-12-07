#!/bin/bash

dockerize -template APPNAME/config.yml:APPNAME/config.yml
/APPNAME/bin/APPNAME server /APPNAME/config.yml
