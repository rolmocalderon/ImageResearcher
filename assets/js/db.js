const fs = require('fs');

console.log(readDb());

function readDb(){
     let db = fs.readFile('db.json', (err, data) => {
        if (err) throw err;
        console.log(JSON.parse(data))
        return JSON.parse(data);
    });

    return db;
}