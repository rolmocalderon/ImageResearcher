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

function checkTags(imageId, tags, callback){
    let query = 'SELECT * FROM tags;';
    db.all(query, [], (err, rows) => {
        if (err) {
            throw err;
        }
        
        let tagsName = rows.map(row => { return row.name; });
        let tagsNotIncluded = tags.filter(function(item) {
            return !tagsName.includes(item);
        });

        let tagsIncluded = rows.filter(function(item) {
            return tags.includes(item.name); 
        });

        if(tagsNotIncluded.length > 0){
            tagsNotIncluded.forEach(tag => {
                console.log("insertando tag...");
                insertTag(imageId,tag,callback);
            });
        }
        if(tagsIncluded.length > 0){
            console.log("asociando tag...");
            tagsIncluded.map(tag => asociateTag(tag.id,imageId,callback));
        }
    });
}

var insertTag = function(imageId,tagName,callback){
    let query = 'INSERT INTO tags(name) SELECT "' + tagName +'" ;';

    db.run(query,function(err){
        if(err){
            console.log(err.message);
            return;
        }
        console.log(this.lastID);
        asociateTag(this.lastID,imageId,callback);
    });
}

function asociateTag(tagId,imageId,callback){
    let query = 'INSERT INTO tagged(tagId,imageId)values("' + tagId +'","' + imageId +'")';
    
    db.run(query,function(err){
        if(err){
            console.log(err.message);
            return;
        }
        console.log("Tag associated;");

        if(callback){
            callback(imageId);
        }
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
module.exports.checkTags = checkTags;