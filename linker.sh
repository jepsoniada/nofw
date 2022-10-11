#!/usr/bin/sh
ignore="
"
filelist=$(ls frontend/src)

for a in $ignore; do
#	echo $a
	filelist=$(echo $filelist | eval sed 's/$a//')
done

# echo $filelist

rm -f backend/static/*
mkdir backend/static
for file in $filelist; do
	ln -s ~/nofw/frontend/src/$file backend/static/$file
done
