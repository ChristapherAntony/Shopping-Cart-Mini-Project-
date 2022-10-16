var mongoClient = require('mongodb').MongoClient  // import-mongoClient 

const state={    // creating an object for database state==null
    db:null
}

// function for connecting data base..................
module.exports.connect = function (done) {    
    const url = 'mongodb://localhost:27017'  //mdb default url assigned to -url
    const dbname = 'shopping'                //shopping name

    mongoClient.connect(url,(err,data)=>{    // connection creation
        if(err) return done(err)             // if error return err 
        state.db=data.db(dbname)            //if not error assign data base to state.db object
        done()
    })
    
}
// to get data base ......................
module.exports.get=function(){
    return state.db             // return connected db through 'state.db' 
}