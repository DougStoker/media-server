import React, { Component } from 'react';

import './App.css';
import searchIcon from './search.svg'

import io from 'socket.io-client';
 
const socket = io('localhost:3001',{agent: false,transport:['WebSocket']});


class App extends Component {
    
    constructor(props){
        super(props)
        this.state = {group:[],mediaType:'video',category:'all',search:""}    ////playing// 0: none,   1: video,   2: music,   3: game
        
        socket.on('giving stuff',this.recieveStuff.bind(this))
        
        this.requestStuff()
        //socket.on('poke',this.requestStuff.bind(this)())       
    }                               
    
    requestStuff(){
        console.log('asking for stuff')
        if (this.state.search){
            socket.emit('requesting search',this.state.search,this.state.mediaType)
        }
        else{
            socket.emit('requesting category',this.state.category,this.state.mediaType)
        }
    }
    
    recieveStuff(data){
        console.log(`got ${data}`)
        this.setState.bind(this)({group:data})        
    }
    
  
  render() {
    return (
      <div className="App">
        <MainBar/>
        <FilterBar/>
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
                
               
                    <input type='text' defaultValue='search' id='searchBox'/>
                    
                    <button id='searchButton'>
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
    render(){
        let tiles = []
        let group = this.props.parent.state.group
        if(+!!group){
            for (let movie of group){
                tiles.push(
                    <MovieTile name={movie.name} description={movie.description} title={movie.title} 
                        vidlength={movie.vidlength} image={movie.image} />
                
                )
            }
        }
        
        return(
            <div>
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
        this.state.title = ('title' in props) ? props.title : 'unknown'
        this.state.description = ('description' in props) ? props.description : 'unknown'
        this.state.vidlength = ('vidlength' in props) ? props.vidlength : 'unknown'
        this.state.image = ('image' in props) ? props.vidlength : 'image'
    }
    
    render(){
        return(
        <div>
            <img src={this.state.image} alt=''/>
            <h3>{this.state.title}</h3>
            <p>{this.state.vidlength}</p>
            <p>{this.state.description}</p>
        </div>
        )
    }   
}

export default App;
