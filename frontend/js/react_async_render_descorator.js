import React, { Component} from 'react'
import { render } from 'react-dom'

//Is the componentWillMount function  a mistake to put state-change here or will it be a problem for sever-rendering?
let delayByRedefine = func => Target => {
  let proto = Target.prototype
  let { componentDidMount, componentWillMount, render } = proto
  
  proto.componentWillMount = function(){
    componentWillMount && componentWillMount.bind(this)()

    this.state = this.state || {}
  }
  
  proto.componentDidMount = function(){
    componentDidMount && componentDidMount.bind(this)()

    func((status = true, data) => {
      this.delayShowCallback(status, data)
    })
  }

  proto.delayShowCallback = function(status, data = {}){
    this.setState({
      delayShow: status,
      data
    })
  }

  proto.renderData = function(){
    return this.state.data
  }

  proto.render = function() {
    return this.state.delayShow ? render.bind(this)() : null
  }
}

//Is this a good way to make it? I think this way create too many useless component, is it correct?
let delayByCreateComponent = func => Target => {
  Target.prototype.renderData = function(){
    return this.props.data || {}
  }

  class Res extends Component{
    constructor(props){
      super(props)
      this.state = {};
    }
    componentDidMount(){
      func((status = true, data) => {
        this.delayShowCallback(status, data)
      })
    }
    delayShowCallback(status, data = {}){
      this.setState({
        delayShow: status,
        data
      })
    }
    render(){
      return this.state.delayShow ? <Target data={this.state.data} {...this.props}/> : null
    }
  }

  return Res;
}


// render after cb()
@delayByCreateComponent(cb => {
  setTimeout(() => {
    cb(true, [1, 2, 3])
  }, 1000)
})
class App extends Component {
  constructor(props) {
    super(props);
  }

  render(){

    // Is this a correct way to get data to render? I doubt it.
    let data = this.renderData && this.renderData() 

    return(
      <div>
        App
        <div>{data.map((item, index) => <div key={index}>{item}</div>)}</div>
      </div>
    )
  }
}

render(
  <App test='test'/>,
  document.getElementById('app')
)
