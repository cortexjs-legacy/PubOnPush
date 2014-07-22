#!/usr/bin/sh

repo=$1
tag=$2
tempDir=$3

echo "repo: $repo"
echo "tag: $tag"
echo "tempDir: $tempDir"

rm -rf $tempDir
git clone "https://github.com/$repo.git" $tempDir
cd $tempDir
git checkout "tags/$tag"
cortex publish
rm -rf $tempDir
