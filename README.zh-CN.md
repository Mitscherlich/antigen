<div align=right>
<!-- make browser happy :) -->

[:us:](README.md) :cn:

</div>

# Antigen

这是我的本科毕业设计作品，一个基于 [SeetaFaceEngine](https://github.com/seetaface/SeetaFaceEngine) 的人脸识别系统。本项目提供了公共 RESTful API 接口以供使用。[DEMO 地址!](https://api.mitscherlich.me/antigen)

## 快速开始

通过 `git` 克隆本项目：

```sh
$ git clone https://github.com/Mitscherlich/antigen.git
```

若您想要在本地运行此项目，您需要一台安装了 Ubuntu 操作系统的个人计算机和至少 2GB 内存（用于 [OpenCV](https://github.com/opencv/opencv) 编译）。如果您还没有安装 OpenCV，我还提供了一个用于安装精简版 OpenCV 的[安装脚本](scripts/install-opencv.sh)。

接着，你需要安装 [Node.js](https://nodejs.org) 来运行此项目。尽管 `apt` 包含了一个名为 `nodejs` 的包，但我建议使用 [`nvm`](https://github.com/nvm-sh/nvm) 来安装 Node.js。安装过程详见 `nvm` 文档。

> 由于 [`npm`](https://www.npmjs.com) 在某些情况下会生成错误的依赖树，本项目推荐使用 [`yarn`](https://yarnpkg.com)。

### 安装 MongoDB

本项目使用 [MongoDB](https://www.mongodb.com/) 数据库来存储用户数据。你可以参照他们的[官方文档](https://docs.mongodb.com/guides/server/install/)来安装，或者参考下面的命令使用 [docker](https://www.docker.com/) 进行安装：

```sh
# pull `mongo` docker image
$ docker pull mongo
$ docker run -d --name mongo-srv \
# 暴露 mongod 监听端口
> -p 27017:27017
# 持久化数据
> -v ~/db:/data/db
> mongo
```

> 向容器传递环境变量 `MONGO_INITDB_ROOT_USERNAME` 和 `MONGO_INITDB_ROOT_PASSWORD` 来启用安全登录，这对于一台具有公网 IP 的计算机来说很重要。

### 安装依赖

SeetaFaceEngine 依赖于 OpenCV 和 Openblas。但 `libopencv-dev` 并不总是最新的，所以我推荐从源码编译安装 OpenCV。

首先，安装编译依赖：

```sh
$ sudo apt-get update
$ sudo apt-get install -fy cmake build-essential dpkg-dev
$ sudo apt-get install -fy libopenblas-dev libprotobuf-dev libssl-dev libgnutls28-dev libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
# 如果你不需要 opencv-python 则不需要下面这部分
$ sudo apt-get install -fy python-dev python-numpy libjpeg-dev libpng-dev libtiff-dev libjasper-dev
```

接着，你可以使用[安装脚本](scripts/install-opencv.sh)来安装精简版 OpenCV，或者参考下面的命令安装一个完整版 OpenCV：

```sh
$ mkdir build && cd build
$ cmake -DWITH_QT=ON -DWITH_OPENGL=ON -DFORCE_VTK=ON -DWITH_TBB=ON -DWITH_GDAL=ON -DWITH_XINE=ON -DBUILD_EXAMPLES=ON -DENABLE_PRECOMPILED_HEADERS=OFF ..
$ make -j<jobs> && sudo make install
```

> `jobs = cpu cores * 1.5`

### 获取 SeetaFaceEngine 模型

你可以从[这里](https://drive.google.com/open?id=1qViCjBksqe6fvSHKBJpUoNpTyO8HAA2j)下载到 SeetaFaceEngine 的模型，国内用户可以从[百度云盘](https://pan.baidu.com/s/1HJj8PEnv3SOu6ZxVpAHPXg)下载.

### 调试环境运行

使用以下命令启动调试服务器：

```sh
$ yarn dev
```

### 生产环境运行

开始之前，您需要先生成静态文件：

```sh
$ yarn build
```

使用以下命令生产服务器：

```sh
$ yarn start
```

## API 参考

详见 [docs/API-reference.md](docs/zh-CN/API-reference.md)。

## 公共选项

本项目接受以环境变量的形式配置公共选项：

- **HOST** `String` - 要监听的地址。默认是 _127.0.0.1_.
- **PORT** `String` 或 `Number` - 要监听的端口。默认是 _3000_.
- **BASE_URL** `String` - 路由和 WebSocket 子路径。默认是 _'/'_.
- **DB_URL** `String` - MongoDB 服务器地址。默认是 _127.0.0.1_.
- **DB_PORT** `String` or `Number` - MongoDB server 端口。默认是 _27017_.
- **DB_USER** `String` - MongoDB 用户名。默认为空。
- **DB_PSK** `String` - MongoDB 密码。默认为空。

## Docker 部署

本项目提供了 `docker-compose.yml` 以方便 docker 部署。安装 [docker-compose](https://docs.docker.com/compose/)，接着运行：

```sh
$ docker-compose up -d
```

在你的浏览器中访问 http://localhost:3000 即可。

就是这样！:)

## 许可证

[MIT](LICENSE)
