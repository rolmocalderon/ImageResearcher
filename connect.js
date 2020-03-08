const sqlite3 = require('sqlite3').verbose();

db = new sqlite3.Database('./images.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the database.');
});

/*db.each("SELECT * FROM images;", function(err, row) {                                                                                                                                    
    console.log(row);
});*/

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

var fetchAll = function(sql,callback){
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        
        callback(rows)
    });
}

var get = function(sql,callback){
    db.get(sql, [], (err,row) => {
        if (err) {
            throw err;
        }

        if(callback){
            callback(row);
        }
    });
}

function checkTags(imageId, tags){
    tags = ['1','2','3','vale-por-','free-phone-calls'];
    let query = 'SELECT name FROM tags;';
    db.all(query, [], (err, rows) => {
        if (err) {
            throw err;
        }
        
        rows = rows.map(row => { return row.name; });
        tags = tags.filter(function(item) {
            return !rows.includes(item); 
        });

        if(tags.length > 0){
            tags.forEach(tag => {
                insertTag(imageId,tag);
            });
        }
    });
}

var insertTag = function(imageId,tagName,callback){
    let query = 'INSERT INTO tags(name)values("' + tagName + '")';

    db.run(query,function(err){
        if(err){
            console.log(err.message);
            return;
        }

        asociateTag(this.lastID,imageId);
    });
}

function asociateTag(tagId,imageId){
    let query = 'INSERT INTO tagged(tagId,imageId)values("' + tagId +'","' + imageId +'")';

    db.run(query,function(err){
        if(err){
            console.log(err.message);
            return;
        }
        console.log("Tag associated;");
    });
}

var insert = function(item,callback,tags){
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
            checkTags(this.lastID,tags);
            callback(this.lastID,item);
        }
        
        console.log("element inserted successfully");
    });
}

var remove = function(id){
    let query = 'DELETE FROM images WHERE id = "' + id + '";';
    db.run(query,function(err){
        if(err){
            console.log(err.message);
            return;
        }

        console.log("Element deleted successfully");
    })

}

module.exports.get = get;
module.exports.fetchAll = fetchAll;
module.exports.insert = insert;
module.exports.delete = remove;
module.exports.insertTag = insertTag;