!#/data/data/com.termux/files/usr/bin/sh
# cd backend
# trap ' ' SIGINT
# cargo run
# cd ..
cd backend
trap ' ' SIGINT
env PROJECT_ROOT=~/nofw/backend cargo run
cd ..
