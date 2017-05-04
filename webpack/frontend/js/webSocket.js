import React, { Component } from 'react'
import { render } from 'react-dom'
import socketCreater from 'socket.io-client'

import '../css/index.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: {},
      list: [],
      name: '',
      text: '',
    };

    this.message = this.message.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }
  componentDidMount() {
    this.create();
  }
  create() {
    const socket = socketCreater('http://192.168.13.132:3000');

    this.setState({
      socket,
    }, this.login);
  }
  login() {

  }

  logout() {

  }
  message() {
    const { socket, name, message } = this.state;

    if(!message) {
      return null;
    }

    socket.on('message', (list) => {
      this.setState({list})
    })

    socket.emit('message', {
      name: name || message,
      message,
    })

    this.setState({
      name: name || message,
      message: '',
    });
  }
  onChange(e) {
    this.setState({
      message: e.target.value || '',
    });
  }

  onEnter(e) {
    e.which === 13 && this.message()
  }

  render() {
    const { list, message } = this.state;
    return (
      <div className="container">
        <div className="list">
          { list.map((item, index) => {
            return (
              <div className="item" key={index}>{item.name}:&nbsp;{item.message}</div>
            )
          }) }
        </div>

        <input className="input" placeholder="第一句话作为你的名字" type="text" onChange={this.onChange} onKeyDown={this.onEnter} value={message}/>
        <div onClick={this.message} className="btn">发送</div>
      </div>
    )
  }
}

class Test extends Component{
  render() {
    return (
      <div style={{backgroundImage: 'url(https://www.baidu.com/img/bd_logo1.png)'}}></div>
    );
  }
}

render(
  <Test />,
  document.getElementById('app')
)
