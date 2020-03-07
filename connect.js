const sqlite3 = require('sqlite3').verbose();

db = new sqlite3.Database('./images.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the database.');
});

db.each("SELECT * FROM images;", function(err, row) {                                                                                                                                    
    console.log(row);
});

module.exports.createTable = function(query){
    db.run(query,function(err){
        if(err){
            console.log(err.message);
            return;
        }

        console.log("table created");
    });
}

module.exports.close = function(){
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

module.exports.fetchAll = function(sql,callback){
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        
        callback(rows)
    });
}

module.exports.get = function(sql,callback){
    db.get(sql, [], (err,row) => {
        if (err) {
            throw err;
        }

        if(callback){
            callback(row);
        }
    });
}

module.exports.insert = function(item,callback){
    let query = 'INSERT INTO images(name,size,type,path)values("' + 
        item.name + '", "' + 
        item.size + '", "' + 
        item.type + '", "' +
        item.path + '")';
    
    db.run(query,function(err){
        if(err){
            console.log(err.message);
            return;
        }
        if(callback){
            callback(this.lastID,item);
        }
        
        console.log("element inserted successfully");
    });
}

module.exports.delete = function(id){
    let query = 'DELETE FROM images WHERE id = "' + id + '";';
    db.run(query,function(err){
        if(err){
            console.log(err.message);
            return;
        }

        console.log("Element deleted successfully");
    })

}