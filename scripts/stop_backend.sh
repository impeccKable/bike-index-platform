#!/bin/bash
pkill -f "node ./dist/app.js"

# Kills the running process with command line
# match "node ./dist/app.js"
#
# pkill --- send signal to process based on their name or attritubes
# -f --- option for matching anything after this flag
