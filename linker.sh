#!/usr/bin/sh
ignore="
"
filelist=$(ls frontend/src)

for a in $ignore; do
#	echo $a
	filelist=$(echo $filelist | eval sed 's/$a//')
done

# echo $filelist

rm -f backend/linkFiles/*
mkdir backend/linkFiles
for file in $filelist; do
	ln -s ~/nofw/frontend/src/$file backend/linkFiles/$file
done
