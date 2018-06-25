"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Datastore = require('nedb');
exports.db = new Datastore({ filename: './database/cue.db' });
exports.db.loadDatabase(function (err) {
    // Now commands will be executed
});
// TODO: add logic to create directory if not already created 
