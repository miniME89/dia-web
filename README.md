### Install

## Prerequisites

The following sofware components are needed to setup the development environment:

 - [node](http://nodejs.org/)
 - [npm](https://www.npmjs.com/)
 - [grunt](http://gruntjs.com/)
 - [bower](http://bower.io/)

### Install

    sudo apt-get install nodejs
    sudo apt-get install npm
    sudo npm install -g grunt-cli
    sudo npm install -g bower

It may be necessary to install the legacy package of node with the following command.

    sudo apt-get install nodejs-legacy

## Development

### Setup

Run the following commands to load the required dependencies.

    npm install
    bower install

### Grunt

The following grunt tasks are available.

 - grunt **dev**: This is the main task which should be used during development. The task will start a webserver and watch any changes on the files.
