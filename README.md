<div align=right>
<!-- make browser happy :) -->

:us: [:cn:](README.zh-CN.md)

</div>

# Antigen

This is my bachelor graduation design project, a face recognition service based on [SeetaFaceEngine](https://github.com/seetaface/SeetaFaceEngine). I also provided the public RESTful API. [Check this out!](https://api.mitscherlich.me/antigen)

## Quick Start

Clone this project via `git`:

```sh
$ git clone https://github.com/Mitscherlich/antigen.git
```

To run this project locally, you need a pc with ubuntu os installed and at least 2GB memory for [OpenCV](https://github.com/opencv/opencv) compiling. If you haven't installed opencv yet, I also provide a [script](scripts/install-opencv.sh) to compile an optimized version.

Then, you need [Node.js](https://nodejs.org) to run this project. Though `apt` manager provides a package `nodejs` for ubuntu but I suggest [`nvm`](https://github.com/nvm-sh/nvm) for installation.

Since [`npm`](https://www.npmjs.com) sometimes generate a wrong dependencies tree, although it is the default package manager came with node.js but [`yarn`](https://yarnpkg.com) is suggested for this project.

### Setup MongoDB

This project uses [MongoDB](https://www.mongodb.com/) to store user data. You can setup a mongo server instance following their [official reference](https://docs.mongodb.com/guides/server/install/) or using [docker](https://www.docker.com/).

To setup a mongo instance with docker, follow this commands below:

```sh
# pull `mongo` docker image
$ docker pull mongo
$ docker run -d --name mongo-srv \
# expose mongo default listening port
> -p 27017:27017
# persistence mongo data
> -v ~/db:/data/db
> mongo
```

If you want to enable user authorization, pass `-e MONGO_INITDB_ROOT_USERNAME=<name>` and `-e MONGO_INITDB_ROOT_PASSWORD=<password>` to `docker run` command and replace `mongo` with `mongo --auth`.

### Install dependencies

SeetaFaceEngine requires opencv and openblas. Since `libopencv-dev` not provides the latest version, I suggestion install opencv from it source.

First, you need some system dependencies for compilation:

```sh
$ sudo apt-get update
$ sudo apt-get install -fy cmake build-essential dpkg-dev
$ sudo apt-get install -fy libopenblas-dev libprotobuf-dev libssl-dev libgnutls28-dev libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
# not require if you don't need opencv-python
$ sudo apt-get install -fy python-dev python-numpy libjpeg-dev libpng-dev libtiff-dev libjasper-dev
```

Then you can use the installation script [`install-opencv.sh`](scripts/install-opencv.sh) to install an optimized version, or compile a full-function opencv following this commands:

```sh
$ mkdir build && cd build
$ cmake -DWITH_QT=ON -DWITH_OPENGL=ON -DFORCE_VTK=ON -DWITH_TBB=ON -DWITH_GDAL=ON -DWITH_XINE=ON -DBUILD_EXAMPLES=ON -DENABLE_PRECOMPILED_HEADERS=OFF ..
$ make -j<jobs> && sudo make install
```

> Jobs usually equals you machine's cpu cores amount times 1.5

### Download SeetaFaceEngine models

Downloads models from [here](https://drive.google.com/open?id=1qViCjBksqe6fvSHKBJpUoNpTyO8HAA2j) or [Baidu Disk](https://pan.baidu.com/s/1HJj8PEnv3SOu6ZxVpAHPXg) for mainland users.

### Start dev server

You can start this project in development mode by this command:

```sh
$ yarn dev
```

This uses [`parcel`](https://parceljs.org) bundler and [`nodemon`](https://github.com/remy/nodemon) for auto restart.

### Start prod server

Before you start this project in production mode, you have to build static files:

```sh
$ yarn build
```

Then you can start the server:

```sh
$ yarn start
```

## API reference

See [docs/API-reference.md](docs/API-reference.md) for more details.

## Common options

This project also accepts some common options by passing environment variables:

- **HOST** `String` - The IP address this project will listen. Default is _127.0.0.1_.
- **PORT** `String` or `Number` - The port this project will listen. Default is _3000_.
- **BASE_URL** `String` - The prefix of router and WebSocket, Default is _'/'_.
- **DB_URL** `String` - MongoDB server url. Default is _127.0.0.1_.
- **DB_PORT** `String` or `Number` - MongoDB server listeing port. Default is _27017_.
- **DB_USER** `String` - MongoDB user name. Default is _''_.
- **DB_PSK** `String` - MongoDB user password. Default is _''_.

## Docker setup

This project also provides a `docker-compose.yml` for docker setup. Install [docker-compose](https://docs.docker.com/compose/) and execute:

```sh
$ docker-compose up -d
```

Then visit http://localhost:3000 in your browser.

That's it! Have your self :)

## License

[MIT](LICENSE)
