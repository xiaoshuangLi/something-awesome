import React, { Component } from 'react';
import { TweenMax, TimelineMax } from 'gsap';
import classnames from 'classnames';

import Filter from './filter_inline.svg';
import Ed from 'img/ed.jpeg';
import Ed2 from 'img/ed_2.jpg';
import DarkSouls from 'img/dark_souls.jpg';
import DarkSouls2 from 'img/dark_souls_2.jpg';
import FightClub from 'img/fight_club.jpg';
import FightClub2 from 'img/fight_club_2.jpeg';

import { getEles, logSpeech } from 'js/common';

const data = [
  { name: 'Ed Sheeran', img: [ Ed, Ed2 ] ,content: 'Ed Sheeran, 又称黄老板，一位英国歌手。' },
  { name: 'Fight Club', img: [FightClub, FightClub2] ,content: 'Fight Club, 一部根据同名小说改编的电影。' },
  { name: 'Dark Souls', img: [DarkSouls, DarkSouls2] ,content: 'Dark Souls, 一个不一样的RPG游戏。' },
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


    const speech = [
      '水滴效果菜单',
      { type: 'desc', txt: 'svg 滤镜 + gsap实现流畅动画。' },
      'svg个人理解可以分为三个部分来学习，画图，动画，滤镜。这次主要介绍滤镜这方面的功能。',
      '首先介绍一下示例，这是一个简单的菜单，点击每个菜单，会显示不同的内容。',
      '这个示例的麻烦的地方有两个，一个动画的实现, 另一个就是这种黏糊糊的效果, 也就是本示例的重点svg滤镜。',
      '让我们看下代码。首先看一下svg的定义。',
      'line',
      '这样就实现了这种黏糊糊的效果。以上只是svg滤镜里面的三种，还有其他十几种滤镜可以使用，以后有机会再向大家一一介绍。',
      '很遗憾的是，这种效果在移动端并不理想。估计等个四五年，我就可以抛弃svg和html，直接用canvas实现编写页面。',
      '大家还有什么疑问吗？',
      'line',
      '没有其他的疑问话，以上就是本次分享的全部内容。不能说给大家在实际开发里带来多少有用的干货，但是希望能给大家在编写页面的时候带来一写不一样的思路，写出一些自己会很享受的页面',
      '如果耽误了大家吃饭的时间，我表示非常的开心，靠，好饿。',
    ];

    logSpeech(speech);
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

    const imgs = detail.img.map((src, i) => {
      return (
        <div className="img" key={i} style={{backgroundImage: `url(${ src })`}} />
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
            { imgs }
            <div className="title"> { detail.content } </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
