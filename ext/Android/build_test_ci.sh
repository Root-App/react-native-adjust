#!/usr/bin/env bash
# - Build the ci testing JAR file by running the following Gradle tasks
#   - clean
#   - makeJar
# - Copy the JAR file to the root dir

# End script if one of the lines fails
# set -e

# Get the current directory (ext/android/)
SDK_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Traverse up to get to the root directory
SDK_DIR="$(dirname "$SDK_DIR")"
SDK_DIR="$(dirname "$SDK_DIR")"
BUILD_DIR=sdk/Adjust
JAR_IN_DIR=testlibrary/build/outputs
JAR_OUT_DIR=example_ci/android/app/libs

RED='\033[0;31m' # Red color
GREEN='\033[0;32m' # Green color
NC='\033[0m' # No Color

# cd to the called directory to be able to run the script from anywhere
cd $(dirname $0) 

cd $BUILD_DIR
echo -e "${GREEN}>>> Running Gradle tasks: clean makeJar ${NC}"
./gradlew clean :testlibrary:makeJar

echo -e "${GREEN}>>> Moving the ci testing jar from ${JAR_IN_DIR} to ${JAR_OUT_DIR} ${NC}"
mkdir ${SDK_DIR}/${JAR_OUT_DIR}
mv -v ${JAR_IN_DIR}/*.jar ${SDK_DIR}/${JAR_OUT_DIR}/adjust-testing.jar
