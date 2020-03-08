const connection = require('./connect');

//connection.dropTable('DROP TABLE IF EXISTS images');
connection.createTable('CREATE TABLE IF NOT EXISTS images(' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'name text NOT NULL, ' +
    'size text NOT NULL, ' +
    'type text NOT NULL, ' +
    'path text NOT NULL' +
');');

connection.createTable('CREATE TABLE IF NOT EXISTS tags(id INTEGER PRIMARY KEY AUTOINCREMENT, name text NOT NULL)');
connection.createTable('CREATE TABLE IF NOT EXISTS tagged(tagId INTEGER, imageId INTEGER)');