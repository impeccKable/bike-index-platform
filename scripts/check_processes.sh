#!/bin/bash

# [a] -> won't include the grep process but will still match the string
# ' ' after node is to exclude some other processes
ps aux | grep "[n]ode "
ps aux | grep "[b]ackups.sh"
