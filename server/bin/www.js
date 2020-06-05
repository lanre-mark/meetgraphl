#!/usr/bin/env node

const socketworks = require('../socketworks/node');
const grafikInteractions = require('../socketworks/appinteractions');
var debug = require('debug')(`${process.env.APP_NAME}:server`);

grafikInteractions(socketworks);
