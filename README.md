<p align="center">
  <img width="100" src="./front/public/favicon.png">
</p>

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

## Privileges

We use a cascade privilege system. That means ADMIN users have all the rights MANAGER users have and MANAGER have all the rights MEMBER users have and so on.
| Role | Privileges |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| USER_GUEST (default) | This is used for irregular guests (ponctually invited user).<br> Can only view CTFs when invited.<br> Guests cannot invite other guests. |
| USER_MEMBER | A member represents a standard CTF player from your team.<br>Can play all CTFs and invite guests. |
| USER_MANAGER | Can create and edit CTFs |
| USER_ADMIN | Can edit users and settings


## Development

The development server includes a simple HTTP proxy allowing the frontend to access the local graphql API (cf [quasar.conf.js](front/quasar.conf.js)).
Hot reloading is configured on both components as well.

First of all, run the following command to run the required services **hedgedoc** and **postgresql**:

### Start hedgedoc and postgresql

```shell
$ docker-compose -f docker-compose.dev.yml up -d
```

### Start the API

```shell
$ cd api/
$ yarn install
$ yarn start
```

### Start the quasar app

```shell
$ cd front/
$ yarn
$ yarn dev
```

You can now access the application/api through the following endpoints:

| Endpoint                           | Description                                                     |
| :--------------------------------- | :-------------------------------------------------------------- |
| [](http://127.0.0.1:5000)          | The Web UI                                                      |
| [](http://127.0.0.1:3000/graphiql) | The Graphql UI allowing to run the graphql queries/mutation/etc |

## Authors

[BitK](https://twitter.com/bitk_)
[SakiiR](https://twitter.com/sakiirsecurity/)
