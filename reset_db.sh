#!/bin/zsh
# Exit on first error
set -e

#rm db.sqlite3 || :
dropdb prajna || :
createdb prajna
python backend/manage.py migrate
#python backend/manage.py make_sample_data