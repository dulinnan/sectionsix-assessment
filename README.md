<!-- @format -->

# sectionsix-technical-test

## Overview

This is a simple Web API that serves two endpoints as instructed in the `Technical assessment (Timezone).pdf`:

-   `/`

    -   a simple root endpoint
    -   returns _"Server up"_ message in plain text with status code `200`

-   `/convert`
    -   a general information endpoint
    -   returns metadata as follows:
        -   a converted UTC time
        -   returns the distance between the last two measurements
    -   returns metadata in `application/json` format with status code `200`

This Web API has been set restricted to `GET` method only.

## Development

A simple MVC architecture is implemented in this Web API, with the `Model` part omitted, for there is no DB manipulation.

[Express](https://expressjs.com/) was chosen for rapid development.

A [dedicated logger](https://github.com/trentm/node-bunyan) is used for the potential logging service.

~~The [Swagger/OpenAPI standard](https://swagger.io/specification/) is also implemented in this Web API for validation purposes.~~ Did not implement swagger validation.

## Continuous integration

A CI pipeline has been set up in [Github Actions](https://github.com/dulinnan/sectionsix-assessment/blob/master/.github/workflows/) to automatically start the following actions on each successful commit pushed to the _master_
branch in this repo:

1. Install NodeJS with all necessary dependencies.
2. Run the unit test suite.
3. Build Docker image (see [Dockerfile](https://github.com/dulinnan/sectionsix-assessment/blob/master/docker/Dockerfile) for more details) that contains the app and encapsulates its dependencies
4. Run a container based on the built Docker image.
5. Validate the container/image by running a post-build validation [test](https://github.com/dulinnan/sectionsix-assessment/tree/master/docker/build_test).
6. The Docker image is tagged with git commit SHA and published to a [public DockerHub repo](https://hub.docker.com/repository/docker/adamdu/sectionsix-assessment), if all above steps have passed successfully.

## Testing

A suite of _unit tests_ can be found under [sectionsix-assessment/tests/](https://github.com/dulinnan/sectionsix-assessment/tree/master/tests).

Testing framework [mocha](https://mochajs.org) and [chai](https://www.chaijs.com/) are being used during
development and in the CI environment.

[JEST](https://jestjs.io/en/) was initially chosen for it is more powerful and needing no additional assertion library. However, there might be some potential memory leak issues which still remain open as listed in [#7287](https://github.com/facebook/jest/issues/7287) and [#7817](https://github.com/facebook/jest/issues/7817).

Additionally, the corresponding Docker image is being tested in the CI pipeline making sure that the image build is successful on each commit pushed to the _master_
branch in this repo.

## Deployment

### Installation and run locally

1. Global install `Yarn`
    > Assumed that NodeJS has been installed and configured properly.

```
$ npm install -g yarn
```

`Yarn` is preferred over the default `npm` in this project for it requires less privileges and causes less issues.

2. Install all required dependencies

```
$ cd ~/path/to/project
$ yarn
```

_Optional._ Run tests

```
$ yarn test
```

3. Start this Web API

```
$ yarn start
```

4. The Web API can accessed at http://localhost:8080/. You can also use [Postman](https://www.postman.com/) or any similar tool to test the endpoints


### Deploy as Docker container image.

Docker is a container based platform which ensures that you do not contaminate your host system.

#### Getting docker (for Linux, Mac & Windows)

Read [https://docs.docker.com/install/](https://docs.docker.com/install/)

#### Docker image

The Github Actions pipeline automatically publishes the docker image to a public DockerHub repo, on each git commit.

Download latest image:

```
$ docker pull adamdu/sectionsix-assessment:<latest-git-commit-sha>
```

> Note that Docker image's `latest` tag is not dynamic nor descriptive. Hence the `latest` is not used in this project.

To run a Docker container with the latest version of the Web API:

```
$ docker run -d -p 8080:8080 adamdu/sectionsix-assessment:<latest-git-commit-sha>
```

> All available tags are listed [here](https://hub.docker.com/repository/docker/adamdu/sectionsix-assessment/tags?page=1).

You will be able to access the API at http://localhost:8080/ after Docker successfully runs the container.


## What challenges did you encounter during the timestamp conversion? How did you resolve these?

I have my background in BSc of Geography, hence I tend to find the conversion of the geographical points rather easy. The challenging task might be how to change time zone to abbreviation especially with some timezones that don not have an abbreviation. I used `MomentJs` for most of the timezone conversions.


## Were there any details where you had to make assumptions or decide to implement imperfectly?

Yes. I made the assumptions that:
1. The lat and lng are always real. I did not check the legitimacy of the latitude and longitude.
2. The measurement was not taken exactly on the border of two timezones.
3. Measurements were recorded in desc order in the CSV file, that the first record is the latest one.



## Potential Improvement

0. Testing needs to be redone.
1. Migrate to [Koa](https://koajs.com/) from Express, for Koa is smaller and more robust.
2. Add Polyfill support as ES2016 is used in this project.
3. Docker base image (NodeJs 14.2) is huge and that leads to a gigantic image (Over 350MB!). A slim version should be considered.
4. Docker container exposing `8080` port can be a concern.
