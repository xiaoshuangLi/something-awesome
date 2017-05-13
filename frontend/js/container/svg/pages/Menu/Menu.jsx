import React, { Component } from 'react';
import { TweenMax, TimelineMax } from 'gsap';
import classnames from 'classnames';

import Filter from './filter_inline.svg';
import Ed from 'img/ed.jpeg';
import DarkSouls from 'img/dark_souls.jpg';
import FightClub from 'img/fight_club.jpg';

import { getEles } from 'js/common';

const data = [
  { name: 'Ed Sheeran', img: Ed ,content: 'Ed Sheeran, 又称黄老板，一位英国歌手。' },
  { name: 'Fight Club', img: FightClub ,content: 'Fight Club, 一部根据同名小说改编的电影。' },
  { name: 'Dark Souls', img: DarkSouls ,content: 'Dark Souls, 一个不一样的RPG游戏。' },
];

const _createLine = (list = []) => {
  const Line = new TimelineMax();
  list.map(item => {
    Line.add(item);
  });

  return Line;
}

const padding = 10;
const width = 100;
const height = 40;
const distance = 20;
const itemMargin = 20;
const r = height/2;

const fullWidth = document.body.offsetHeight - padding * 2;

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };

    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    let list = [
      TweenMax.fromTo('#menus', 0.5, { opacity: 0 },  { opacity: 1 }),
    ];

    const items = [].slice.call(getEles('.item'));
    const { length } = items;

    items.forEach((item, i) => {
      if (i === length) {
        return null;
      }
      const eles = items.slice(i + 1, length);
      const ani = TweenMax.to(eles, 0.1, {
        delay: 0.2,
        css: {
          transform: (index, target) => {
            return `translate(0, ${(itemMargin + height) * (i + 1) }px)`
          },
        },
      });

      list.push(ani);
    });

    list = list.concat([
      TweenMax.to('#content', 0.4, {
        delay: 0.2,
        css: {
          opacity: 1,
          transform: `translate(${width + padding + distance}px, ${padding}px)`,
        }
      }),
      TweenMax.to('#content .bg', 0.8, {
        css: {
          transform: `scale(${ Math.ceil(fullWidth/r)})`,
        }
      }),
      TweenMax.staggerTo('#content *:not(.bg)', 0.6, {
        opacity: 1,
      }, 0.4),
    ]);

    const Line = _createLine(list);
    Line.play();
  }

  componentDidUpdate() {
    const { index = 0 } = this.state;
    const list = [
      TweenMax.to('#content', 0, {
        css: {
          transform: `translate(${width + padding - height}px, ${padding + index * (height + itemMargin) }px)`,
        }
      }),
      TweenMax.to('#content', 0.4, {
        css: {
          opacity: 1,
          transform: `translate(${width + padding + distance}px, ${padding}px)`,
        }
      }),
      TweenMax.to('#content .bg', 0.8, {
        css: {
          transform: `scale(${ Math.ceil(fullWidth/r)})`,
        }
      }),
      TweenMax.staggerTo('#content *:not(.bg)', 0.6, {
        opacity: 1,
      }, 0.4),
    ];

    const Line = _createLine(list);
    Line.play();
  }

  onClick(index) {
    const list = [
      TweenMax.staggerTo('#content *:not(.bg)', 0.6, {
        opacity: 0,
      }, 0.4),
      TweenMax.to('#content .bg', 0.8, {
        css: {
          transform: `scale(1)`,
        }
      }),
      TweenMax.to('#content', 0.4, {
        css: {
          opacity: 1,
          transform: `translate(${width + padding - height}px, ${padding + this.state.index * (height + itemMargin) }px)`,
        }
      })
    ];

    const Line = _createLine(list);
    Line.play();
    Line.call(() => {
      this.setState({
        index,
      });
    })
  }

  render() {
    const { index = 0 } = this.state;
    const detail = data[index];

    const items = data.map((item, i) => {
      return (
        <div className="item" id={`item-${i}`} onClick={ () => { this.onClick(i) }  } data-before={item.name} key={i} />
      );
    });

    return (
      <div className="page-svg-menu-render">
        <Filter className="ng-hide" />
        <div className="menu-container"> 
          <div className="menus" id="menus">
            { items } 
          </div>

          <div className="content" id="content">
            <div className="bg"></div>
            <div className="img" style={{backgroundImage: `url(${ detail.img })`}} />
            <div className="title"> { detail.content } </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
