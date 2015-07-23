#!/bin/bash

# Check if dependencies have changed after pull/merge and install if so.
echo "Checking if dependencies are up to date..."

cd ../../
packagefilename='package.json'
packagemd5=`md5 -q $packagefilename`

installedpackagefilename='package.installed'
installedpackagemd5=''
if [ -f $installedpackagefilename ]; then
    installedpackagemd5=`cat $installedpackagefilename`
fi

if [ "$packagemd5" == "$installedpackagemd5" ]; then
  echo 'package.json dependencies are up to date.'
else
  echo 'package.json dependencies are out of date. Running `npm install`.'
  echo "  package.json:       $packagemd5"
  echo "  package.installed:  $installedpackagemd5"
  echo "$packagemd5" > $installedpackagefilename

  npm install
fi

# bowerfilename='bower.json'
# bowermd5=`md5 -q $bowerfilename`

# installedbowerfilename='bower.installed'
# installedbowermd5=''
# if [ -f $installedbowerfilename ]; then
#     installedbowermd5=`cat $installedbowerfilename`
# fi

# if [ "$bowermd5" == "$installedbowermd5" ]; then
#   echo 'bower.json dependencies are up to date.'
# else
#   echo 'bower.json dependencies are out of date. Running `bower install`.'
#   echo "  bower.json:       $bowermd5"
#   echo "  bower.installed:  $installedbowermd5"
#   echo "$bowermd5" > $installedbowerfilename

#   bower install
# fi
