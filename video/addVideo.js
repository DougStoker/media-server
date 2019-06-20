//
const db = require("mongodb")
const dbLink = "mongodb://localhost:27017/test"
const MongoClient = db.MongoClient
//

let dat = MongoClient.connect(
    dbLink,
    function(err,client){
       
        if(/*db != undefined*/true){
            for(let mediaItem of db.collection(mediaType)){
                if(searchQuery in mediaItem.title){
                    returns.push(mediaItem)
                }
            }
        }
        return returns               
    },
    {useNewUrlParser:true}
)