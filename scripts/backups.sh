#!/bin/bash

# I tried to get crontab working, but I don't know where crond is (in order to start the service)

backups_dir="../db_backups"

while true; do
	DB_HOST="54.172.42.84"
	DB_PORT="5432"
	DB_DATABASE="bike_index"
	DB_USER="$(grep -E '^DB_USER=' ../backend/.env | sed -r 's/^DB_USER=(.*)$/\1/g')"
	DB_PASSWORD="$(grep -E '^DB_PASSWORD=' ../backend/.env | sed -r 's/^DB_PASSWORD=(.*)$/\1/g')"

	echo "${DB_HOST}:${DB_PORT}:${DB_DATABASE}:${DB_USER}:${DB_PASSWORD}" > ~/.pgpass
	chmod 0600 ~/.pgpass

	pg_dump | gzip > "${backups_dir}/bike_index_db_$(date +%Y-%m-%d_%H-%M-%S).sql.gz"

	sleep 3000000 # sleep for ~34 days
done


