#!/usr/bin/env node

const socketworks = require('../socketworks/node');
const grafikParticipants = require('../socketworks/manageparticipants');
const grafikInteractions = require('../socketworks/appinteractions');
var debug = require('debug')(`${process.env.APP_NAME}:server`);

grafikParticipants(socketworks);
grafikInteractions(socketworks);
