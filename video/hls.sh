#!/bin/bash

# $1 first argument; it will be the file I want
# $2 is the output directory, if it is supplied

DIR="."

if [ -d "$2" ]; then
   DIR=`pwd`
   cd "$2"
fi


ffmpeg -i "$DIR/$1"  \
-acodec copy \
-vcodec copy \
-start_number 0 \
-hls_time 10 \
-hls_list_size 0  \
-f hls index.m3u8