//
const line = function(){
  console.log('-------------------------------')
}

const print = console.log
print('...')

//////////////////////
const server = require('http').createServer();

const socketCfg = {
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
}

const io = require('socket.io')(server,socketCfg)

server.listen(3001);

//
const db = require("mongodb")
const dbLink = "mongodb://localhost:27017/test"
const MongoClient = db.MongoClient
//



function handler(req, res){
    let func0 = function (err, data){
        if(err){
            res.writeHead(500);
            return res.end('Error loading index.html');
        } 
        res.writeHead(200);
        res.end(data);
    }
    fs.readFile(__dirname + '/index.html',func0)
}

let userConnected = false
const onConnectFunc = function(socket){
    if(!userConnected){
        console.log('user connected');
        userConnected = true
    }
    socket.on('requesting category',function(data){
        console.log('looking for category: '+ data)
        let databaseFunc = function(oof,client){
            print('db connected.')
            if(oof){print(oof)}
            let category = data
            let mediaType = 'video'//data[1]
            let returns = []
            if(client != undefined){  
                let Db = client.db('test')
                print("''''''''''") 
                let foundIter = function(doc){
                    //print(category)
                    print('document:')
                    print(' --- name: '+ doc.name)
                    print(' --- categories: '+ doc.categories)           
                    if('categories' in doc && doc.categories.includes(category)){
                        //returns.push(doc)
                        print(':::::found '+doc.name)
                        socket.emit('giving one thing',doc)
                    }
                }
                let docs = Db.collection(mediaType).find({})
                print(`|${docs}|`)
                /* let aaa =  */docs.forEach(foundIter).then(socket.emit('done'))
                //.then((i)=>{return i}).then((i)=>{print(`<${aaa}>`)})
                //print(`[${aaa}]`)
                //print('returns:'+returns)
                //let docs = Db.collection(mediaType).find().toArray().then(returningFunc)
            }                     
            else{print('client is undefined')}   
        }
        MongoClient.connect(dbLink,{useNewUrlParser:true},databaseFunc)     
    })
    socket.on('requesting search',function(data){
        console.log('search'+data)
        let dat = MongoClient.connect(
            dbLink,
            function(err,client){
                let searchQuery = data[0]
                let mediaType = data[1]
                let returns = []
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
        socket.emit('giving stuff', dat)
    })
}






io.on('connection',onConnectFunc)

print('.')

