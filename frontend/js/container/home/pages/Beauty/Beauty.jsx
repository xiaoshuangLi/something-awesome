import React, { Component, PropTypes } from 'react';

const list = [
  {
    title: 'Sass',
    list: [
      {
        title: 'Wave',
        desc: 'loading页面',
        path: '/sass/Wave',
      },
      {
        title: 'Sun',
        desc: 'box-shadow尝试',
        path: '/sass/sun',
      },
      {
        title: 'Swiper',
        desc: '走马灯',
        path: '/sass/swiper',
      },
    ],
  },
];

class Beauty extends Component {

  constructor(props) {
    super(props);

    this.state = {
      list,
      control: false
    };
  }

  componentDidMount() {
    const { socket } = this.context;
    
    socket.off('go');
    socket.on('go', (path) => {
      const { control, list } = this.state;

      list.forEach(item => {
        item.list.forEach(res => {
          res.selected = path === res.path;
        })
      });

      this.setState({list});

      if(control) {
        return;
      }
      this.props.router.push(path);
    })
  }

  render() {
    const { control, list } = this.state;

    const items = (items = []) => {
      return items.map((item, i) => {
        return (
          <div onClick={() => { this.context.socket.emit('go', item.path) }} className={`item ${item.selected?'active':''}`} key={i} data-after={item.desc}>
            {item.title}
          </div>
        );
      });
    };

    const res = list.map((item, i) => {
      return (
        <div className="list" key={i}>
          <div className="title">{item.title}</div>
          {items(item.list)}
        </div>
      );
    });

    return (
      <div className="page-home-beauty-render">
        <div className={`control ${control?'active':''}`} onClick={() => {this.setState({control: !control})}}></div>
        {res}
      </div>
    );
  }
}

Beauty.contextTypes = {
  socket: PropTypes.object
};

export default Beauty;
