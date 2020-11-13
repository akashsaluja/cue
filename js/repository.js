var Datastore = require('nedb');
const dba = new Datastore({ filename: './database/cue.db' });
dba.loadDatabase(function (err) {    // Callback is optional
    // Now commands will be executed
    console.log("Loaded");
});
// dba.persistence.setAutocompactionInterval(5000);
module.exports.db = dba;

// TODO: add logic to create directory if not already created