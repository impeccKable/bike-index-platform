#!/bin/bash

nohup ./backups.sh >> backups.out 2>&1 &

# nohup --- no hang up to keep process running
# >> --- redirect but don't overwrite
# 2 --- stderr
# 1 --- stdout
# &1 --- the place where stdout is going
# 2>&1 --- redirects stderr to where stdout is going
# & --- run the command in the background
