//
const line = function(){
  console.log('-------------------------------')
}

const print = console.log


//////////////////////
const server = require('http').createServer();

const io = require('socket.io')(server, {
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

server.listen(3001);

//
const db = require("mongodb")
const dbLink = "mongodb://localhost:27017/test"
var MongoClient = db.MongoClient
//

function handler(req, res){
    fs.readFile(__dirname + '/index.html',
        function (err, data){
            if(err){
                res.writeHead(500);
                return res.end('Error loading index.html');
            } 
            res.writeHead(200);
            res.end(data);
        }
    )

    let userConnected = false
    io.on('connection',
        function (socket) {
            if(!userConnected){
                console.log('user connected');
                userConnected = true
            }
            socket.on(
                'requesting category',
                function(data){
                    console.log('looking for category: '+ data)
                    MongoClient.connect(
                        dbLink,
                        function(oof,client){
                            if(oof){print(oof)}
                            let category = data
                            let mediaType = 'video'//data[1]
                            let returns = []
                            if(client != undefined){  
                                let Db = client.db('test')
                                print("''''''''''") 
                                let foundIter = function(doc){
                                    print('~~~~~')
                                    print(category)
                                    print('-----')
                                    print(doc.name)
                                    print(doc.categories)
                                    print('_____')            
                                    if('categories' in doc && doc.categories.includes(category)){
                                        returns.push(doc)
                                        print(':::::'+doc.name)
                                    }
                                }
                                print('************')
                                Db.collection(mediaType).find().forEach(foundIter)
                                print(`""""""""""""""`)
                                print('#####'+returns)
                                socket.emit('giving stuff', returns)
                            }                     
                            else{print('client is undefined')}   
                        },
                        {useNewUrlParser:true}
                    )        
                }
            )
            socket.on(
                'requesting search',
                function(data){
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
                }
            )  
        }
    )
}

