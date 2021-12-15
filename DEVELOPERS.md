# Developer Guide

## Deployment

* Heroku for the backend
    * Since we are using an monorepo, we need to set some things up
    * Setup some configs in Heroku environment variables
      * Set `PROJECT_PATH` in the dashboard to /backend
      * Set `DEBUG`
      * Set `ALLOWED_HOSTS`
      * Set `SECRET_KEY`
    * Add buildpacks
      * Python
      * Node
    * Add the postgres addon (since this is a monorepo and heroku will not
    detect that it is a django project)
      * `heroku addons:create heroku-postgresql:hobby-dev`

## Local development

* Provision postgres DB
  * Follow instructions to setup postgres local dev on mac
    * [macOS postgres installation](https://www.robinwieruch.de/postgres-sql-macos-setup)
  * Run
    * `createuser prajna -s -P` # set password to `prajna`
  * Then setup the role in postgres
    * `psql postgres`
    * `CREATE ROLE prajna superuser;` # create the role
    * `ALTER ROLE prajna WITH LOGIN;` # allow the role to login
    * `\q`
  * Verify this setup by running the `./reset_db.sh` script
