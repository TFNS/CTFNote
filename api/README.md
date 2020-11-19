# CTF Pad API

## Developpement

Start the local server

```
$ # Run a postgres instance
$ docker run -it -p 5432:5432 --rm -e POSTGRES_PASSWORD=ctfnote -e POSTGRES_USER=ctfnote -e POSTGRES_DB=ctfnote postgres
$ # Install dependencies
$ yarn install
$ # Start the application
$ MD_PROVIDER=https://ur-codimd-instance-full-url yarn start
```
