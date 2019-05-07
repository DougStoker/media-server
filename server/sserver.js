const express = require("express")
const path = require("path")
const db = require("mongodb")
const port = 3001
const app = express()
var allowedOrigins = "domain_1:* domain_2:*";
var http = require('http').Server(app)
var io = require('socket.io',{origins:allowedOrigins})(http)//.listen(3001) 
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const DB = "mongodb://localhost:27017/mediaDB"
app.use('/', express.static('node_modules'));
http.listen(8080)

var mclient = db.MongoClient

console.log("> server starting...")

// app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname + '../src/index.js')))
    
/* app.get('(/socket.io/*)', function(req, res) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    
}); */

io.on('connection', function(socket){
    console.log('a user connected');
  
    socket.on('requesting category',function(data){
      console.log('category'+data)
      let dat = mclient.connect(DB, function(err,db){
          let category = data[0]
          let mediaType = data[1]
          let returns = {}
          for(let mediaItem of db.collection(mediaType)){
              if(mediaItem.category == category){
                  returns.push(mediaItem)
              }
          }
          return returns               
      })
      socket.emit('giving stuff', dat)
  })
  
  socket.on('requesting search',function(data){
      console.log('search'+data)
      let dat = mclient.connect(DB, function(err,db){
          let searchQuery = data[0]
          let mediaType = data[1]
          let returns = {}
          for(let mediaItem of db.collection(mediaType)){
              if(searchQuery in mediaItem.title){
                  returns.push(mediaItem)
              }
          }
          return returns               
      })
      socket.emit('giving stuff', dat)
  })
  
  });




mclient.connect(DB,  { useNewUrlParser: true },function(err,db){
        console.log("> db client connected.")
})


