# CTFNote

## Welcome

CTFNote is a collaborative tool aiming to help CTF teams to organise their work.

![main-page](./screenshots/main-page.png)

![main-dark](./screenshots/main-dark.png)

![info](./screenshots/info.png)

![tasks](./screenshots/tasks.png)

![task](./screenshots/task.png)

## Installation

Use the provided docker configuration to deploy the project:

```shell
$ docker-compose up -d
```

Then, visit 127.0.0.1 and create your first account, which will automatically be provided with admin privileges

You can optionally edit the API configuration file depending on your needs:

[API Configuration File](./api/src/config/globals.ts)

## Privileges

* ADMIN_ALL: can create CTFs, tasks, edit users/the config. 
* EDIT_CTF: can create and modify CTF information; you should grant this right to
  your captain
* CTF_ALL: can join every CTF; you should grant this right to your team members.
* no privileges: can only view CTFs when invited; this is used for irregular guests.

CTF guests are allowed to create and edit tasks, but not the CTF information. 

## Development

The development server includes a simple HTTP proxy allowing the frontend to access the local API (cf [quasar.conf.js](front/quasar.conf.js)).
Hot reloading is configured on both components as well.

### Setup and launch the frontend

```shell
$ cd front/
$ yarn install
$ yarn start
```

### Setup and launch the API

```shell
$ cd api/
$ yarn install
$ yarn start
$ MD_PROVIDER=https://ur-codimd-instance-full-url yarn start
```

## Authors

[BitK](https://twitter.com/bitk_)
[SakiiR](https://twitter.com/sakiirsecurity/)

