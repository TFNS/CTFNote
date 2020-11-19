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

Then visit 127.0.0.1 and create your first account, it will automatically be provided with admin privileges

Optionally you can modify the API configuration file depending on your needs:

[API Configuration File](./api/src/config/globals.ts)

## Privileges

* ADMIN_ALL: Full admin, can create ctf, tasks, edit users and the config. 
* EDIT_CTF: Allow to create and modify ctf information, you should give this right to you team leader.
* CTF_ALL: Allow the user to join every CTF, you should give this right to your team members.

* no privileges: can only view ctf when invited

CTF guests are allowed to create and edit tasks but not the ctf informations. 


## Developpement

The developpement servers include a simple HTTP proxy helping the front to access the local API (cf [quasar.conf.js](front/quasar.conf.js)).
Hot reloading if configured on both components as well.

### Start the front

```shell
$ cd front/
$ yarn install
$ yarn start
```

### Start the api

```shell
$ cd api/
$ yarn install
$ yarn start
$ MD_PROVIDER=https://ur-codimd-instance-full-url yarn start
```


## Authors


[BitK](https://twitter.com/bitk_)
[SakiiR](https://twitter.com/sakiirsecurity/)

