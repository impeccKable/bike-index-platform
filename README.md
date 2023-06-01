# Bike Index Platform
Spring/Summer 2023 Capstone

Created by:
- Bruce Truong
- Cheng Lin
- Cristian Salazar
- Emerson Peters
- Matt Istvan

## Description

## Setup/Installation Requirements

## Setup/Installation
https://nodejs.org/en/download
https://pnpm.io/installation

### Frontend
`cd frontend`
`npm i`
`pnpm run dev`

### Backend
For Windows (run in powershell):
`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted`
`npm i`
`npm start`

## Known Bugs

## Support and contact details

## Technologies Used

## License

## Original Creation
### Frontend
https://expressjs.com/en/starter/installing.html

(Yes to chocolatey (and run script))
`npm init`
`npm install express`
`npm install -g pnpm`
`pnpm create vite`
`cd frontend`
`pnpm install express`
```
√ Project name: ... frontend
√ Select a framework: » React
√ Select a variant: » TypeScript + SWC
```
`pnpm install react-router-dom`
### Backend
`npm init @eslint/config`
```
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · esm
√ Which framework does your project use? · react
√ Does your project use TypeScript? · Yes
√ Where does your code run? · browser, node
√ What format do you want your config file to be in? · JSON
√ Would you like to install them now? · Yes
√ Which package manager do you want to use? · pnpm
```
### EC2 setup
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

