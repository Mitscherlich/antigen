FROM ubuntu:xenial

# copy work essentials
COPY . /opt/antigen
WORKDIR /opt/antigen

# change apt mirror and install build-essentials
RUN apt-get update && apt-get install -fy --no-install-recommends git curl cmake build-essential dpkg-dev ca-certificates && \
  apt-get install -fy --no-install-recommends libopenblas-dev libprotobuf-dev libssl-dev libgnutls28-dev libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev && \
  apt-get install -fy --no-install-recommends python-dev python-numpy libjpeg-dev libpng-dev libtiff-dev libjasper-dev

# install node.js and yarn
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
  apt-get install -fy --no-install-recommends nodejs && \
  curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && apt-get install -fy --no-install-recommends yarn

# install google protobuf and opencv
RUN ./scripts/install-protobuf.sh && ./scripts/install-opencv.sh

# install dependencies and generate static html
RUN yarn install --pure-lockfile && yarn build

EXPOSE 3000

ENTRYPOINT [ "./scripts/entrypoint.sh" ]
