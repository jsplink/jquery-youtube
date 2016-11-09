#!/bin/bash
set -e

# Set default NPM_VERSION
if [ -z $NPM_VERSION ]; then NPM_VERSION=6.0.0 fi

# Setup virtualenv, nodeenv, and npm
if [ ! -f './virtualenv' ]; then
  virtualenv --setuptools virtualenv
  pip install nodeenv
  nodeenv -p --npm=${NPM_VERSION}
fi

# Install npm within the virtualenv and link so we benefit from PATH access
#   as well as node_modules being local.
npm install -g; npm link;

if [ ! -z $(selenium-standalone) ]; then
  selenium-standalone install
  # TODO: Make into a daemon
  # bash -c 'selenium-standalone start'
  # TODO: Clean up the daemon after tests are run within CI
fi

# TODO: Hook as much as possible (E2E)
if [ $(uname) -eq 'Darwin' ]; then
  curl -L https://sourceforge.net/projects/osxportableapps/files/Portable%20Firefox%20OS%20X/4.0.1%20r4.1/PortableFirefox_4.0.1_en-US-OSX_r4.1.dmg/download > firefox.dmg
  hdiutil attach firefox.dmg
  cd /Volumes/PortableFirefox_4.0.1_en-US-OSX_r4.0u/Portable\ Firefox\ OS\ X
  sudo cp -r Portable\ Firefox.app\ /usr/local/
  sudo ln -s /usr/local/Portable\ Firefox.app/Contents/MacOS/Portable\ Firefox /usr/local/bin/firefox
fi

