# Bike Index Platform
Spring/Summer 2023 Capstone

Created by:
- Bruce Truong
- Cheng Lin
- Cristian Salazar
- Emerson Peters
- Matt Istvan

## Description

This tool is a web-based interface to access and modify data regarding bike thieves. The core functionality is being able to create, edit, and search through the thief info. The info is mostly text-based, but it is also possible to attach auxillary files such as images and pdfs to each thief. Admin users also have the ability to import and export the text data via `.csv` files. The tool requires authentication through a login screen, and the accounts are created or verified by an admin through a user managment interface.

![Screenshot of the search page](/docs/screenshot.png "Screenshot of the search page")

## Technologies Used

The tool is made in [TypeScript](https://www.typescriptlang.org/) and uses [Node.js](https://nodejs.org/en/about) with [React Express](https://www.react.express/). It consists of a frontend and backend (which can later be used as an API if needed). It is currently hosted using [Amazon AWS](https://aws.amazon.com/) services, with an [EC2](https://aws.amazon.com/ec2/) server, [RDS](https://aws.amazon.com/rds/) database, and [S3](https://aws.amazon.com/s3/) bucket.

## License

[tbd]

# Installation

## EC2 pre-setup
sudo yum install git
sudo yum install npm
sudo yum install nmap
git clone https://github.com/impeccKable/bike-index-platform
npm i

sudo dnf install postgresql15
sudo dnf install postgresql15-server
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

sudo nano /var/lib/pgsql/data/pg_hba.conf
local   all             all                                     trust
host    all             all             127.0.0.1/32            md5
sudo nano /var/lib/pgsql/data/postgresql.conf
add line:
listen_addresses = '*'


## Setup

Install [Node.js](https://nodejs.org/en/download)

Install [Pnpm](https://pnpm.io/installation)

Install [Bike Index Platform](https://github.com/impeccKable/bike-index-platform):
```
git clone git@github.com:impeccKable/bike-index-platform
cd ./bike-index-platform/frontend; npm i
cd ../backend; npm i
```

(for Windows machines, you may need to run this in powershell):
```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
```

## To run locally:
```
cd frontend; pnpm run s
cd backend; npm run s
```

## To run on EC2:
```
./scripts/run_all.sh
```

# Backups

A backup script is making a monthly copy of the database into a `.sql` file that is compressed with `gzip`. If something were to happen, the database can be re-created by following these steps:

1. Create a new database using `schema.sql`
2. Unzip the backup file with `gunzip`
3. Re-populate the tables using the `.sql` backup file

This process will need some understanding of psql commands.
