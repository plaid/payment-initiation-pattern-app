envfile := ./.env

.PHONY: help install start stop sql init-db clear-db

# help target adapted from https://gist.github.com/prwhite/8168133#gistcomment-2278355
TARGET_MAX_CHAR_NUM=20

## Show help
help:
	@echo ''
	@echo 'Usage:'
	@echo '  make <target>'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z_0-9-]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  %-$(TARGET_MAX_CHAR_NUM)s %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

## Install dependencies
install:
	cd server && npm install
	cd client && npm install

## Start the server and client
start: $(envfile) init-db
	@echo ""
	@echo "Starting server and client..."
	@echo "  Server: http://localhost:5001"
	@echo "  Client: http://localhost:3002"
	@echo ""
	@trap 'kill 0' INT TERM; \
	 (cd server && npm start) & \
	 (cd client && npm start) & \
	 wait

## Stop the server and client
stop:
	@echo "Stopping server and client..."
	-@lsof -ti :5001 | xargs kill 2>/dev/null || true
	-@lsof -ti :3002 | xargs kill 2>/dev/null || true
	@echo "Stopped."

## Start an interactive psql session
sql:
	psql -U postgres -h localhost -p 5432 -d plaid_payment_initiation

## Initialize the database (runs on first start)
init-db:
	@psql -U postgres -h localhost -p 5432 -c 'CREATE DATABASE plaid_payment_initiation' 2>/dev/null; \
	psql -U postgres -h localhost -p 5432 -d plaid_payment_initiation -tc \
	  "SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users'" \
	  | grep -q 1 \
	  || (echo "Initializing database..." && \
	      psql -U postgres -h localhost -p 5432 -d plaid_payment_initiation -f database/init/create.sql && \
	      echo "Database initialized.")

## Drop and recreate all tables
clear-db:
	@echo "Clearing database..."
	psql -U postgres -h localhost -p 5432 -c 'DROP DATABASE IF EXISTS plaid_payment_initiation'
	psql -U postgres -h localhost -p 5432 -c 'CREATE DATABASE plaid_payment_initiation'
	psql -U postgres -h localhost -p 5432 -d plaid_payment_initiation -f database/init/create.sql
	@echo "Database cleared and reinitialized."

$(envfile):
	@echo "Error: .env file does not exist! Copy .env.template to .env and fill in your Plaid keys."
	@exit 1
