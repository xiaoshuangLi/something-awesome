import React, { Component } from 'react';
import { logSpeech } from 'js/common';

import Ed from './ed.jpeg';
import Cave from './cave.jpeg';
import Sky from './bluesky.jpeg';
import Fight from './fight.jpg';

class Swiper extends Component {
  constructor(props){
    super(props);

    this.state = {
      obj: {},
      list: [],
    };
  }

  componentDidMount() {
    const list = [
      {img:Ed, title: 'Ed sheeran'}, 
      {img:Cave, title: 'Cave'}, 
      {img:Fight, title: 'Fight Club'}
    ];

    const obj = list.reduce((a, b,i) => {
      // a[`data-img-${i}`] = b.img
      a[`data-title-${i}`] = b.title

      return a;
    }, {})

    const speech = [
      '走马灯/swiper页面',
      { type: 'desc', txt: 'box-shadow + background' },
      '继续说明下这个页面，这是一个走马灯，也就是大家熟知的swiper组件。左上角是图片的标题，右下角是走马灯滚动的位置，这些都是会随着图片的滚动而变化。',
      { type: 'desc', txt: '需不需要一些时间欣赏一下，过会，我又要问一个比较尴尬的问题。' },
      '好吧，还是一样的问题。',
      '这个页面最少需要几个标签来实现？',
      { type: 'desc', txt: '嘿嘿嘿。。。' },
      'line',
      '答案还是一个。实现的思路和前两个示例还是一样不过需要用到其他两个css的属性，content, background. ',
      '首先一个标签我们有三个元素可以用，便签本身（以下简称:div），before，after。这里div我们用做显示图片，before显示图片标题，after显示滚动位置。',
      '在看sass代码之前，我们要看看这个标签，为了实现效果，要对标签做一下处理。',
      '下面介绍一下background和content这两个属性',
      'line',
      '这里用到的sass功能我就不一一赘述，但是绝对只是冰山一角，希望大家可以前去挖掘。',
      '推荐一个sass的方法库math-sass https://www.npmjs.com/package/mathsass',
      '里面实现了很多基本的数学计算，比如三角函数，指数计算等等。',
      '没有问题的话，sass使用的示例就说完了，开始svg滤镜的示例。',
    ];

    logSpeech(speech);

    this.setState({obj, list})

  }

  render() {

    return (
      <div className={`page-home-swiper-render num-${this.state.list.length}`} {...this.state.obj}  /> 
    );
  }
}

export default Swiper;
