#!/bin/sh
if [ ! -d protobuf ]; then
  mkdir -p protobuf
fi
cd protobuf
if [ ! -d protobuf-2.6.1 ]; then
  curl -O http://archive.ubuntu.com/ubuntu/pool/main/p/protobuf/protobuf_2.6.1.orig.tar.gz
  curl -O http://archive.ubuntu.com/ubuntu/pool/main/p/protobuf/protobuf_2.6.1-1.3.dsc
  curl -O http://archive.ubuntu.com/ubuntu/pool/main/p/protobuf/protobuf_2.6.1-1.3.debian.tar.xz
  dpkg-source -x protobuf_2.6.1-1.3.dsc
fi
cd protobuf-2.6.1
./configure && make -j4 && make install -j4
