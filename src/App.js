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
    }  
    
    lookatCategory =(event)=> {
        this.setState({category:event})
        this.forceUpdate()
        this.requestStuff()
    }

    changeMediaType = (newMediaType) =>{
        if(/*newMediaType in ["video","game","music"]*/true){
            this.setState({mediaType: newMediaType})
            this.forceUpdate()
            this.requestStuff(newMediaType,false)//.bind(this)()
        }
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
    
    requestStuff =(searchfor,strsearch)=> {
        this.setState.bind(this)({group:[]})
        console.log('asking for stuff')
        if (strsearch/*this.state.search*/){
            socket.emit('requesting search',/*this.state.search*/searchfor,this.state.mediaType)
            console.log(111111)
        }
        else{
            console.log(2222222)
            socket.emit('requesting category',searchfor/*this.state.category*/,this.state.mediaType)
        }
    }
    
    recieveStuff(data){
        console.log(`got: ${data}`)
        this.setState.bind(this)({group:data})        
    }

    recieveOne=(data)=>{
        console.log(`got a: ${data}`) 
        this.state.group.push(data)
        this.update()
    }
    
  
  render() {
    if(this.state.playing){
        document.body.style.backgroundColor = "#444444";
        return(
            <VideoPlayerFrame source={this.state.source} parent={this} />
        )
    }
    else{
        document.body.style.backgroundColor = "white";
    }
    return (
      <div className="App">
        <MainBar parent ={this}/>
        <FilterBar parent={this}/>
        <ScrollyWindowThing parent={this}/>
      </div>
    );
  }
}

class MainBar extends Component {
    constructor(props){
        super(props)
        this.state = {children:[[],[]],}
    }

    addChild(thing,row){
        this.state.children[row].push(thing)   
    }
    
    turnChildrenOff(row){
        for(let child of this.state.children[row]){
            child.turnOff()
        }
    }
    render(){
        return(
            <div className="mainBar"><div>
                    <MainButton active='1' name="Movies" mtype="video" parent={this} grandparent={this.props.parent} changeMediaType={this.props.parent.changeMediaType} row="1"></MainButton>
                    <MainButton name="Games" mtype="game" parent={this} grandparent={this.props.parent} changeMediaType={this.props.parent.changeMediaType} row="1"></MainButton>
                     <MainButton name="Music" mtype="music" parent={this} grandparent={this.props.parent} changeMediaType={this.props.parent.changeMediaType} row="1"></MainButton>
                </div></div>
        )
    }
}

class MainButton extends Component{
    constructor(props){
        super(props)
        props.parent.addChild.bind(props.parent)(this,props.row)
        this.state = {active:("active" in props? props.active: 0),name:props.name,mediaType:props.mtype}
        
    }
    
    turnOn = () => {
        this.setState({active:1})
    }
    
    turnOff = () => {
        this.setState({active:0})
    }

    click = () => {
        if(this.state.mediaType !== undefined){
            this.props.changeMediaType(this.state.mediaType)
        }
        if( ! this.state.active){           
            this.props.parent.turnChildrenOff.bind(this.props.parent)(this.props.row)           
            this.turnOn.bind(this)()
        }
    }
    render(){
        return(
            <button className={(this.state.active?"buttonPressed":"mainButton")} onClick={this.click}>
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
                <span></span>                  
                <select id='selectBox' onChange={this.props.parent.lookatCategory}>                      
                    <option value="allCategories">all categories</option>
                    <option value="action">action</option>
                    <option value="adventure">adventure</option>
                    <option value="comedy">comedy</option>                 
                </select> 
                <span></span>
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
        this.state.title = (/*'title' in props*/ props.title !== undefined) ? props.title :((props.name !== undefined) ? props.name :  'unknown')
        this.state.description = ('description' in props) ? props.description : 'unknown'
        this.state.vidlength = ('vidlength' in props) ? props.vidlength : 'unknown'
        this.state.image = ('image' in props) ? props.image: 'image'
        this.state.key = ('title' in props) ? props.title : 'unknown'
  
        this.state.filename = ('source' in props)? props.source+'/index.m3u8' : "charlie/index.m3u8"                 //"charlie.mp4"
        this.state.url = `http://${SERVE_ADDR}:${VID_PORT}/video/${this.state.filename}`
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

    toggleBookmark = () => {
        //this.props.parent
        this.setstate({bookmarked:(this.state.bookmarked?false:true)})
    }
    
    render(){
        if(this.state.expanded){
            //<button className='play' onclick={this.toggleBookmark}>{this.state.bookmarked ? "bookmark:▣ ": "bookmark:◻︎ "}</button>
            return(
                <div>
                    <div className='shade' onClick={this.contract}></div>
                    <div className='tileExpand'>
                        <button onClick={this.contract} className='x'>✕</button>
                        <button className='play' onClick={this.play}>Play ▶︎</button>
                        <img height="256" src={this.state.image} alt='⊠'/>
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
              src: this.props.source,
              type: 'application/x-mpegURL'
            }],
            html5:{
                hls: {
                    withCredentials: false
                  }
            }
          }
        //console.log(this.props.source)

    }
    render(){
        return <VideoPlayer { ...this.state.videoJsOptions } />
    }
}

export default App;
