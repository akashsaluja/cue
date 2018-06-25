var Datastore = require('nedb')
export const db = new Datastore({ filename: './database/cue.db' });
db.loadDatabase(function (err: any) {    // Callback is optional
    // Now commands will be executed
});

// TODO: add logic to create directory if not already created