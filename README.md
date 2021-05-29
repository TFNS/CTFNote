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

Then, visit 127.0.0.1 and create your first account, which will automatically be provided with admin privileges.

### nginx

An example configuration for `nginx` on the host looks like this:

```
server {
        server_name ctfnote.my.domain;

        listen 443 ssl;
        listen [::]:443 ssl;

        root /var/www/html;
        index index.html;

        location / {
                proxy_pass http://127.0.0.1:80/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $http_connection;
                proxy_set_header Host $http_host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                add_header Pragma "no-cache";
        }
}
```

## Privileges

We use a cascade privilege system. That means ADMIN users have all the rights MANAGER users have and MANAGER have all the rights MEMBER users have and so on.

- ADMIN: Can create and manage CTFs, as well as managing the instance ( managing users and configuration of the platform ).
- MANAGER: Can edit CTFs information and invite guests into a specific CTFs.
- MEMBER: A member represents a standard CTF player from your team, can access all CTFs of the platform by default
- GUEST: no privileges: can only view CTFs when invited; this is used for irregular guests ( ponctually invited user ). GUESTs are allowed to create and edit tasks, but not the CTF information.

## Security

cf. [SECURITY.md](./SECURITY.md)

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
$ yarn
$ yarn dev:migrate # Will run the migration on the database
$ yarn dev
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
