#!/bin/bash
#
# Update the website with the current webapps
#
# Usage: ./updatesite.sh </path/to/site/root>

if [ "$#" != "1" ];
then
    echo "Usage: $0 </path/to/site/root>"
    exit 1
fi

# Simply update this list as new directories are added.
# $1 contains the path to the root of the website.

cp -r js $1/
cp -r relaxinghues $1/
cp -r cloudynight $1/
cp -r notetaker $1/

