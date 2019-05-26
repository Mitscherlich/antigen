#!/bin/sh
MODEL_URL="https://share.mitscherlich.cn/"

verify_models() {
  echo "TODO"
}

download_models() {
  echo "TODO"
}

if [[ ! -f models/SeetaFaceDetector2.0.ats ]] || [[ ! -f SeetaFaceRecognizer2.0.ats ]] || [[ ! -f SeetaPointDetector2.0.pts5.ats ]]; then
  download_models
fi

verify_models ; CHECK=$?

if [ ! $CHECK -eq 0 ]; then
  echo "Models fetch broken!"
  exit -1
fi

echo "Model fetched success!"
exit 0
