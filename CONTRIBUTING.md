# CTFNote - Contribution Guide

When contributing to this repository, please first discuss the change you wish to make via issue with the collaborators of this repository before making a change.

## Git process

In order to push new code on this repository, you first have to create a new fork within your github workspace.

Once your fork is created (`https://github.com/<your_username>/CTFNote`), you can create a new branch starting with the associated issue number in the name and start working on it.

> If you start from scratch and no issues are associated with your changes, you can create a branch starting with '0-'.

```shell
$ git checkout -b <issue-number>-<branch-name>
```

Examples of branch name:

- `132-add-new-feature`
- `343-add-past-ctf-role`
- `13-fix-bug-in-password-reset`
- `37-leak-flag-to-TFNS`
- `0-contribution-guide`

Once you think the job is done, issue the pull request and target the **dev** branch of the official CTFNote repository.

You can also create the pull request before finishing the job but don't forget to add "WiP: " as a suffix in the title to let the collaborators know you are still working on the request.

## Deploying the dev version

### Prerequisites

- [Install docker](https://docs.docker.com/get-docker/)
- [Install yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

### Install the git hooks

Go at the root folder and install the dependencies and install the git hooks:

```shell
$ yarn
```

This should run the prepare script and install the linting pre-commit hooks:

```
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...
$ husky install
[##] 2/2husky - Git hooks installed
✨  Done in 0.40s.
```

### Start the third party containers

```shell
$ docker compose \
    -f docker-compose.dev.yml \
    up -d hedgedoc db adminer
```

### Start the API

```shell
$ cd api
api/ $ yarn # Install the dependencies
api/ $ yarn dev # Run the dev version (hot reloading included)
```

### Start the Front

```shell
$ cd front
front/ $ yarn # Install the dependencies
front/ $ yarn dev # Run the dev version (hot reloading included)
```

### Exposed endpoints

The following endpoint are exposed and can be used in the developpement environment

- [API](http://localhost:3000/)
- [GraphiQL](http://localhost:3000/graphiql)
- [Hedgedoc](http://localhost:3001/)
- [Quasar APP](http://localhost:8088/)
- [Adminer](http://localhost:3002/?pgsql=db&username=ctfnote&db=ctfnote)

## Review

To merge a pull request, two distinct reviews from two different collaborators are required.
