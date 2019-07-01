const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
//
const db = require("mongodb")
const dbLink = "mongodb://localhost:27017/test"
const MongoClient = db.MongoClient
//


class Doc{
    constructor(){
        this.data = {}
    }
    write(key,value){
        this.data[key] = value
    }
    read(){
        return this.data
    }
}



let doc = new Doc()


readline.question('enter name of the video folder:',(folderName)=>{
    doc.write('source',folderName)
    readline.question('enter title of video:', (title)=>{
        doc.write('title',title)
        readline.question('enter name of thumbnail:',(thumb)=>{
            doc.write('image',thumb)
            readline.question('enter description of video:',(desc)=>{
                doc.write('description',desc)
                readline.question('enter length of video:',(length)=>{
                    doc.write('vidlength',length)
                    readline.question('enter genre of video:',(cat)=>{
                        doc.write('categories',[cat,'all'])
                        console.log(doc.read())
                        MongoClient.connect(
                            dbLink,
                            {useNewUrlParser:true},
                            function(oof,client){
                                if(oof){
                                    console.log(oof)
                                }    
                                else{
                                    let Db = client.db('test')
                                    Db.collection('video').insert(doc.read())
                        
                                    console.log(doc.read())
                        
                                    
                        
                        
                                    
                                }
                                           
                            }
                            
                        )
                    })
                })
            })
        })
    })
})









