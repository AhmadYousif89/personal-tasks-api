# Personal Task API

## Description

This API was developed using [NestJs](https://github.com/nestjs/nest) framework.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

- running migrations without docker if you have postgress installed on your machine

```bash
# DATABASE_URL connection string example
$ DATABASE_URL=postgresql://[username]:[password]@localhost:5432/[db name]?schema=public

# prisma migration
$ npm run prisma:migrate
```

- running migrations with docker:
- please consider mapping your postgres port in DATABASE_URL connection string in the .env file to [ 5434:5432 ] to match with the docker-compose.yml file

```bash
# DATABASE_URL connection string example
$ DATABASE_URL=postgresql://[username]:[password]@localhost:5434/[db-name]?schema=public

# docker compose
$ npm run docker:restart

# prisma migration
$ npm run prisma:migrate
```

## Test

- first create .env.test file and adjust the postgres port to match with the one in docker-compose.yml - [ 5435:5432 ]

```bash
# DATABASE_URL connection string example
$ DATABASE_URL=postgresql://[username]:[password]@localhost:5435/[db-name]?schema=public

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
