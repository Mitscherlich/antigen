#!/bin/sh
if [ ! -d opencv ]; then
  mkdir -p opencv
fi
cd opencv
if [ ! -f CMakeLists.txt ]; then
  git init && git remote add origin https://github.com/opencv/opencv.git
fi
git pull origin 3.4 --depth 1
if [ ! -d build ]; then
  mkdir -p build
fi
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr \
  -DBUILD_DOCS=off -DBUILD_FAT_JAVA_LIB=off -DBUILD_JASPER=on -DBUILD_OPENEXR=on -DBUILD_ZLIB=on \
  -DBUILD_TESTS=off -DBUILD_TIFF=on -DBUILD_JPEG=on -DBUILD_PNG=on -DBUILD_TIFF=on \
  -DBUILD_opencv_apps=off -DBUILD_opencv_calib3d=off -DBUILD_opencv_contrib=off \
  -DBUILD_opencv_dnn=off -DBUILD_opencv_features2d=off -DBUILD_opencv_flann=off \
  -DBUILD_opencv_gpu=off -DBUILD_opencv_java=off -DBUILD_opencv_legacy=off \
  -DBUILD_opencv_ml=off -DBUILD_opencv_nonfree=off -DBUILD_opencv_objdetect=off \
  -DBUILD_opencv_ocl=off -DBUILD_opencv_photo=off -DBUILD_opencv_python=off \
  -DBUILD_opencv_shape=off -DBUILD_opencv_stitching=off -DBUILD_opencv_superres=off \
  -DBUILD_opencv_ts=off -DBUILD_opencv_video=off -DBUILD_opencv_videoio=off \
  -DBUILD_opencv_videostab=off -DBUILD_opencv_world=off -DBUILD_opencv_lengcy=off \
  -DBUILD_opencv_java_bindings_generator=off -DBUILD_opencv_python_bindings_generator=off \
  -DWITH_1394=off -DWITH_EIGEN=off -DWITH_FFMPEG=off -DWITH_GIGEAPI=off -DWITH_GSTREAMER=off \
  -DWITH_GTK=off -DWITH_PVAPI=off -DWITH_V4L=off -DWITH_LIBV4L=off -DWITH_CUDA=off \
  -DWITH_CUFFT=off -DWITH_OPENCL=off -DWITH_OPENCLAMDBLAS=off -DWITH_OPENCLAMDFFT=off
make -j4 && make install -j4
