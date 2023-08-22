#!/bin/bash

(cd ../backend && npm install) > backend.out 2>&1
nohup npm --prefix ../backend start >> backend.out 2>&1 &

# nohup --- no hang up to keep process running
# --prefix --- specify what directory the command should be run
# > backend.out --- redirects the stdout and rename it from nohop.out to backend.out
# >> --- redirect but don't overwrite
# 2 --- stderr
# 1 --- stdout
# &1 --- the place where stdout is going
# 2>&1 --- redirects stderr to where stdout is going
# & --- run the command in the background
