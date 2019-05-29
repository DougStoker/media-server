import React, { Component } from 'react';

import './App.css';
import searchIcon from './search.svg'

import VideoPlayer from './vidPlayer.js'

import io from 'socket.io-client';

//████████████████████████████████████████████████
//// address settings

const VID_PORT = 3002
const GUIDE_PORT = 3001
//const APP_PORT = 3000
const SERVE_ADDR = 'localhost'


//████████████████████████████████████████████████

 
const socket = io(`${SERVE_ADDR}:${GUIDE_PORT}`,{agent: false,transport:['WebSocket']});

//████████████████████████████████████████████████


class App extends Component {
    
    constructor(props){
        super(props)
        this.state = {group:[],mediaType:'video',category:'all',search:"",playing:0,source:''}    ////playing// 0: none,   1: video,   2: music,   3: game
        
        socket.on('giving stuff',this.recieveStuff.bind(this))
        socket.on('giving one thing',this.recieveOne)
        socket.on('done',this.forceUpdate.bind(this))
        
        this.requestStuff('all',0)
        //socket.on('poke',this.requestStuff.bind(this)())       
    }   

    update=()=>{
        this.forceUpdate()
        console.log("got 'done'")
    }

    play =(source)=>{
        console.log('source',source)
        this.setState({playing:1,source:source})
    }
       
    searchCallback=(searchfor,strsearch)=>{
        this.requestStuff.bind(this)(searchfor,strsearch)
    }
    
    requestStuff(searchfor,strsearch){
        this.setState.bind(this)({group:[]})
        console.log('asking for stuff')
        if (strsearch/*this.state.search*/){
            socket.emit('requesting search',/*this.state.search*/searchfor,this.state.mediaType)
        }
        else{
            socket.emit('requesting category',searchfor/*this.state.category*/,this.state.mediaType)
        }
    }
    
    recieveStuff(data){
        console.log(`got: ${data}`)
        this.setState.bind(this)({group:data})        
    }

    recieveOne=(data)=>{
        console.log(`got a: ${data}`)
        //this.setState({group:this.state.group.push(data)})   
        this.state.group.push(data)
        this.update()
    }
    
  
  render() {
    if(this.state.playing){
        //console.log(this.state.source)
        return(
            <VideoPlayerFrame source={this.state.source} parent={this}/>
        )
    }
    return (
      <div className="App">
        <MainBar/>
        <FilterBar parent={this}/>
        <ScrollyWindowThing parent={this}/>
      </div>
    );
  }
}

class MainBar extends Component {
    constructor(props){
        super(props)
        this.state = {children:[[],[]],hideLastRow:1}
    }
    
    hideLast(){
        //this.state.hideLastRow = 1
        this.setState.bind(this)({hideLastRow:1})
        for(let child of this.state.children[1]){
            child.gray.bind(child)()            
        }
        this.forceUpdate()
    }
    
    showLast(){
        //this.state.hideLastRow = 0
        this.setState.bind(this)({hideLastRow:0})
        for(let child of this.state.children[1]){
            child.unGray.bind(child)()            
        }
        this.forceUpdate()
    }
    
    
    
    addChild(thing,row){
        this.state.children[row].push(thing)
        
    }
    
    turnChildrenOff(row){
        for(let child of this.state.children[row]){
            child.turnOff.bind(child)()
            child.gray.bind(child)() 
            
        }
    }
    
    render(){
        let gg = "true"
        let lastRow = /* this.state.hideLastRow ?*/ ( <div>
                <MainButton gray={gg} name="Movies" parent={this} row="1"></MainButton>
                <MainButton gray={gg} classname="buttonGray" name="Games" parent={this} row="1"></MainButton>
                <MainButton gray={gg} classname="buttonGray" name="Music" parent={this} row="1"></MainButton>
            </div>
        ) 
        
        //console.log(`hideLastRow ${this.state.hideLastRow}`)
        return(
            <div className="mainBar">
                <div>
                    <MainButton gray="false" name="Your Stuff" parent={this} row="0"></MainButton>
                    <MainButton gray="false" name="Browse" parent={this} row="0"></MainButton>
                </div>
                {lastRow}    
                
            </div>
        )
    }
}

class MainButton extends Component{
    constructor(props){
        super(props)
        props.parent.addChild.bind(props.parent)(this,props.row)
        this.state = {active:0,name:props.name,gray:props.gray}
        
    }
    
    turnOn(){
        this.setState({active:1})
    }
    
    turnOff(){
        this.setState({active:0})
    }
    
    gray(){
        this.setState({gray:true})
        this.forceUpdate()
    }
    
    unGray(){
        this.setState({gray:false})
        this.forceUpdate()
    }
    
    click(){
        //console.log(this.props.parent.state.hideLastRow)
        //console.log(`button on row ${this.props.row}`)
        if(this.state.active){
            this.turnOff.bind(this)()
            // eslint-disable-next-line
            if(this.props.row == 0){
                //console.log('row 0,')
                this.props.parent.turnChildrenOff.bind(this.props.parent)(1)
                this.props.parent.hideLast.bind(this.props.parent)()
            }
        }
        else{
            // eslint-disable-next-line
            if(this.props.row == 0){
                this.props.parent.showLast.bind(this.props.parent)()
            }
            
            this.props.parent.turnChildrenOff.bind(this.props.parent)(this.props.row)
            
            this.turnOn.bind(this)()
        }
    }
    render(){
        return(
            <button className={this.state.gray?"buttonGray":(this.state.active?"buttonPressed":"mainButton")} onClick={this.click.bind(this)}>
                {this.state.name}
            </button>
        )
    }
}

class FilterBar extends Component{
    constructor(props){
        super(props)
        this.props = props
    }
    searchCallback=()=>{
        
        this.props.parent.searchCallback(this.input.value)
    }
    render(){
        return(
            <div className='filterBar'>
                        <span> </span>
                    
                        <select id='selectBox'>
                        
                            <option value="allCategories">all categories</option>
                            <option value="action">action</option>
                            <option value="adventure">adventure</option>
                            <option value="comedy">comedy</option>
                     
                        </select> 
                        
                    
                        <span> </span>
                
               
                    <input type='text' defaultValue='search' id='searchBox' ref={(input) => this.input = input}/>
                    
                    <button id='searchButton' onClick={this.searchCallback}>
                        <img src={searchIcon} className="searchIcon" alt="?"/>
                    </button>
                    
                   
                
            </div>
        )
    }
}

class ScrollyWindowThing extends Component{
     constructor(props){
        super(props)
        this.state = {}
    } 
    play =(source)=>{
        this.props.parent.play(source)
    }
    render(){
        let tiles = []
        let group = this.props.parent.state.group
        if(+!!group){
            for (let movie of group){
                tiles.push(
                    <MovieTile name={movie.name} description={movie.description} title={movie.title} 
                        vidlength={movie.vidlength} image={movie.image} parent={this}/>
                
                )
            }
        }

        
        
        return(
            <div className='mediaList'>
                {tiles}
            </div>
        )
        
    }
}




class MovieTile extends Component{
    constructor(props){
        super(props)
        this.props = props
        this.state = {}
        this.state.title = ('name' in props) ? props.name : 'unknown'
        this.state.description = ('description' in props) ? props.description : 'unknown'
        this.state.vidlength = ('vidlength' in props) ? props.vidlength : 'unknown'
        this.state.image = ('image' in props) ? props.image: 'image'
        this.state.key = ('title' in props) ? props.title : 'unknown'
        //this.state.source = /*('source in props') ? props.source :*/ `localhost:3002/charlie.mp4`
        this.state.filename = ('source' in props)? props.source : "charlie/index.m3u8"                 //"charlie.mp4"
        this.state.url = `https://${SERVE_ADDR}:${VID_PORT}/${this.state.filename}`
        this.state.expanded = false
        this.parent = this.props.parent
    }

    expand =()=> {
        this.setState({expanded: true})
    }

    contract =()=> {
        this.setState({expanded: false})
    }

    play =()=>{
        console.log(':::::',this.state.source)
        this.parent.play/*.bind(this.parent)*/(this.state.url)
    }
    
    render(){
        if(this.state.expanded){
            return(
                <div>
                    <div className='shade' onClick={this.contract}></div>
                    <div className='tileExpand'>
                        <button onClick={this.contract} className='x'>✕</button>
                        <button className='play' onClick={this.play}>Play ▶︎</button>
                        <img src={this.state.image} alt='⊠'/>
                        <h3>{this.state.title}</h3>
                        <small>{this.state.vidlength}</small><br></br>
                        <p>{this.state.description}</p>
                    </div>
                </div>
                )
        }

        

        //<!--<button>⋮</button>-->


        return(
        <div className='tile' onClick={this.expand}>
            <img src={this.state.image} alt='⊠'/>
            <h3>{this.state.title}</h3>
            
            <small>{this.state.vidlength}</small><br></br>
            <p>{this.state.description}</p>
        </div>
        )
    }   
}


class VideoPlayerFrame extends Component{
    constructor(props){
        super(props)
        this.state = {
            image : props.image,

        }
        this.state.videoJsOptions = {
            autoplay: false,
            controls: true,
            sources: [{
              src: this.props.source/*'/path/to/video.mp4'*/,
              type: 'application/x-mpegURL'
            }]
          }
        //console.log(this.props.source)

    }
    render(){
        return <VideoPlayer { ...this.state.videoJsOptions } />
        /*(
            <div>
                <video controls preload='auto' width='640' height='264'
                poster={this.props.image} data-setup='{}'>
                    <source src={this.props.source} type='video/mp4'></source>
                </video>
            </div>

        )*/
    }
}

export default App;
